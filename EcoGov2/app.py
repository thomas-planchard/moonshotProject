"""
Receipt Data Extraction API

This FastAPI application provides endpoints for extracting structured data from
various types of receipts and tickets (train tickets, plane tickets, fuel receipts, etc.).

The API accepts uploaded files, processes them based on the specified category,
and returns structured data about the transaction.
"""

from fastapi import FastAPI, UploadFile, HTTPException, Form, Query, Request, Depends
from typing import List, Optional
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from utils.receipt_data import ReceiptData, Category
from features.match_train_station import match_train_station
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume
import io
from functools import lru_cache
from pathlib import Path
import pandas as pd
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
from scrapAI import get_travel_info_from_pdf


app = FastAPI(
    title="Receipt Data Extraction API",
    description="API for extracting data from receipts and tickets",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount templates directory
templates = Jinja2Templates(directory="templates")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Add trusted host middleware
app.add_middleware(
    TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "example.com", "*"]
)

@app.get("/", response_class=HTMLResponse)
async def home(request: Request): 
    """Render the home page with the upload form."""
    return templates.TemplateResponse("index.html", {"request": request})


# Mapping of categories to processing functions
category_function_mapping = {
    "avions": match_airport,
    "trains": match_train_station,
    "essence": match_fuel_volume,
}


@app.post("/extract-data", response_model=ReceiptData)
@limiter.limit("10/minute")
async def extract_data(
    request: Request,
    file: UploadFile,
    category: Category = Form(...),
    countries: Optional[List[str]] = Form(None),
    use_ai: bool = Form(False)
):
    """
    Extract data from uploaded receipts or tickets.
    
    Parameters:
    - file: The uploaded file (PDF, JPG, JPEG, or PNG)
    - category: The type of receipt (trains, avions, essence, peages)
    - countries: Optional list of country codes to filter results (default: ["FR"])
    - use_ai: Optional flag to use AI-based processing
    
    Returns:
    - ReceiptData: Structured data extracted from the receipt
    
    Raises:
    - 400: Bad request (invalid file format, missing data)
    - 500: Server error during processing
    """
    # Validate file exists
    if not file:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Validate file size (e.g., limit to 10MB)
    max_size = 10 * 1024 * 1024  # 10MB
    file_size = 0
    chunk_size = 1024
    while True:
        chunk = await file.read(chunk_size)
        if not chunk:
            break
        file_size += len(chunk)
        if file_size > max_size:
            await file.seek(0)  # Reset file pointer
            raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Reset file pointer after checking size
    await file.seek(0)
    
    # Validate countries format if provided
    if countries:
        if not all(isinstance(country, str) and len(country) == 2 for country in countries):
            raise HTTPException(
                status_code=400, 
                detail="Countries must be provided as ISO 2-letter codes (e.g., 'FR', 'US')"
            )
    
    # Check file extension
    file_extension = file.filename.split(".")[-1].lower()
    allowed_extensions = ["pdf", "jpg", "jpeg", "png"]
    
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file_extension}. Allowed formats: {', '.join(allowed_extensions)}"
        )
    
    # Also check content type
    content_type = file.content_type
    allowed_content_types = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png"
    ]
    
    if content_type not in allowed_content_types:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported content type: {content_type}"
        )

    try:
        # Read file content once
        file_content = await file.read()
        file_object = io.BytesIO(file_content)
        # If AI mode requested, use scrapAI for extraction
        if use_ai:
            # Persist to temp file for AI processing
            suffix = f".{file_extension}"
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(file_content)
                tmp_path = tmp.name
            try:
                result = get_travel_info_from_pdf(tmp_path, model_name="mistral", doc_type=category.value)
            finally:
                try:
                    os.remove(tmp_path)
                except OSError:
                    pass
            return result
        
        # Call the correct function based on the category
        processing_function = category_function_mapping.get(category.value)
        if not processing_function:
            raise HTTPException(status_code=400, detail=f"Unknown category: {category}")
            
        # Pass the file object and other parameters
        if category.value in ["trains", "avions"]:
            result = processing_function(file_object, countries=countries or ["FR"])
        else:
            result = processing_function(file_object, file_extension)
            
        return result
    except ValueError as e:
        # For validation errors (bad input data)
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        # For missing files or resources
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        # For permission issues
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        # Log the full exception for debugging
        import traceback
        print(f"Error processing file: {str(e)}")
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


# Then create cached functions for loading data
@lru_cache(maxsize=1)
def get_train_stations_data():
    """Load and cache train stations data"""
    current_dir = Path(__file__).parent
    csv_path = current_dir / "Data" / "train_stations.csv"
    return pd.read_csv(csv_path)

@lru_cache(maxsize=1)
def get_airports_data():
    """Load and cache airports data"""
    current_dir = Path(__file__).parent
    csv_path = current_dir / "Data" / "airport.csv"
    return pd.read_csv(csv_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
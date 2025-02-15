from fastapi import FastAPI, UploadFile, HTTPException, Form, Query, Request
from typing import List, Optional
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from utils.receipt_data import ReceiptData, Category
from features.match_train_station import match_train_station
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume
 

app = FastAPI()

# Mount templates directory
templates = Jinja2Templates(directory="templates")

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):  # Add Request type hint
    return templates.TemplateResponse("index.html", {"request": request})


# Mapping of categories to processing functions
category_function_mapping = {
    "avions": match_airport,
    "trains": match_train_station,
    "essence": match_fuel_volume,
}


@app.post("/extract-data", response_model=ReceiptData)
async def extract_data(
    file: UploadFile,
    category: Category = Form(...)  ,  # Required category parameter
    countries: Optional[List[str]] = Form(None)  # Optional countries parameter
):
    print("countries", countries)
    allowed_extensions = ["pdf", "jpg", "jpeg", "png"]

    # Check file extension
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file_extension}. Allowed formats: {', '.join(allowed_extensions)}"
        )

    try:
        # Call the correct function based on the category
        processing_function = category_function_mapping.get(category.value)
        if not processing_function:
            raise HTTPException(status_code=400, detail=f"Unknown category: {category}")

        # Pass countries only for the relevant categories
        if category.value in ["trains", "avions"]:
            result = processing_function(file.file, countries=countries or ["FR"])
        else:
            result = processing_function(file.file, file_extension)

        # Create the response data
        response_data = result

        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
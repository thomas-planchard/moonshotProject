from fastapi import FastAPI, UploadFile, HTTPException, Form, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from enum import Enum
from typing import Optional
import pdfplumber
from PIL import Image
import io

app = FastAPI()

class Category(str, Enum):
    avion = "avions"
    peage = "peages"
    essence = "essence"
    train = "trains"


class ReceiptData2(BaseModel):
    category: str
    name_of_trip: str
    type_of_transport: str
    step_of_production: str
    are_kilometers_known: bool
    number_of_kilometers: Optional[float] = None
    departure: Optional[str] = None  
    arrival: Optional[str] = None    
    number_of_trips: int


class ReceiptData(BaseModel):
    category:               str
    extracted_text:         str


@app.post("/extract-data", response_model=ReceiptData)
async def extract_data(
    file: UploadFile,
    category: Category = Form(...)  
):
    allowed_extensions = ["pdf", "jpg", "jpeg", "png"]

    # Check file extension
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format: {file_extension}. Allowed formats: {', '.join(allowed_extensions)}"
        )

    try:
        # Handle PDF files
        if file_extension == "pdf":
            extracted_text = extract_text_from_pdf(file.file)
        else:
            # Handle image files (use OCR)
            extracted_text = extract_text_from_image(file.file)

        return ReceiptData(category=category, extracted_text=extracted_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


def extract_text_from_pdf(pdf_file) -> str:
    """
    Extract text from a PDF file using pdfplumber.
    """
    try:
        with pdfplumber.open(pdf_file) as pdf:
            text = "".join([page.extract_text() or "" for page in pdf.pages])
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")


def extract_text_from_image(image_file) -> str:
    """
    Extract text from an image file using OCR (Tesseract).
    """
    from pytesseract import image_to_string
    try:
        image = Image.open(io.BytesIO(image_file.read()))
        text = image_to_string(image, lang="fra")
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from image: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
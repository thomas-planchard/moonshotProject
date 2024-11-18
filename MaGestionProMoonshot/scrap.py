from fastapi import FastAPI, UploadFile, HTTPException
from pydantic import BaseModel
import pdfplumber
from typing import Optional

app = FastAPI()



class ReceiptData(BaseModel):
    category: str
    name_of_trip: str
    type_of_transport: str
    step_of_production: str
    are_kilometers_known: bool
    number_of_kilometers: Optional[float] = None
    departure: Optional[str] = None  # Make this optional
    arrival: Optional[str] = None    # Make this optional
    number_of_trips: int

@app.post("/extract-data", response_model=ReceiptData)
async def extract_data(file: UploadFile):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Invalid file format. Only PDFs are accepted.")

    try:
        # Extract text from the PDF
        with pdfplumber.open(file.file) as pdf:
            text = "".join([page.extract_text() for page in pdf.pages])

        # Parse the data from the text (to be implemented)
        data = parse_pdf_text(text)

        # Validate against the schema
        extracted_data = ReceiptData(**data)
        return extracted_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

def parse_pdf_text(text: str) -> dict:
    # Implement parsing logic here
    # Match against expected fields, regex patterns, etc.
    # Return data as a dictionary
    return {
        "category": "Road Transport",
        "name_of_trip": "Example Trip",
        "type_of_transport": "Taxi",
        "step_of_production": "Shooting",
        "are_kilometers_known": True,
        "number_of_kilometers": 100,
        "departure": None,
        "arrival": None,
        "number_of_trips": 1
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
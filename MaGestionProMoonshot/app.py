from fastapi import FastAPI, UploadFile, HTTPException, Form
from fastapi.responses import JSONResponse
from utils.receipt_data import ReceiptData, Category
from features.match_train_station import match_train_station
from features.match_peage import match_peage
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume

app = FastAPI()


# Mapping of categories to processing functions
category_function_mapping = {
    "avions": match_airport,
    "trains": match_train_station,
    "essence": match_fuel_volume,
    "peages": match_peage,
}


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
        # Call the correct function based on the category
        processing_function = category_function_mapping.get(category.value)
        if not processing_function:
            raise HTTPException(status_code=400, detail=f"Unknown category: {category}")

        result = processing_function(file.file)

        # Create the response data
        response_data = ReceiptData(
            category=category,
            **result  # Use the processed result to populate the fields dynamically
        )

        return response_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
import re
from utils.receipt_data import ReceiptData
from utils.files_reader import extract_text_from_pdf, extract_text_from_image


def match_fuel_volume(file, file_extension):
    """
    Extract the numeric value associated with 'litre' or 'volume' in the given file.

    Args:
    - text (str): The input text to search in.

    Returns:
    - ReceiptData: An object containing the formatted receipt data.
    """
    # Check the file extension
    if file_extension == "pdf":
        # Extract text from PDF
        text = extract_text_from_pdf(file)
    else:
        # Extract text from image
        text = extract_text_from_image(file)

    if not text:
        raise ValueError("No text could be extracted from the file.")


    # Define regex to capture a number associated with 'litre' or 'volume' (before or after)
    pattern = r"(?:(\d+(?:[.,]\d+)?)\s*(?:litre|volume)|(?:litre|volume)\s*(\d+(?:[.,]\d+)?))"
    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        # Extract the first matching group (number)
        value = match.group(1) or match.group(2)
        try:
            # Replace comma with dot and convert to float
            return ReceiptData(
                category='essence',
                name_of_trip='fuel',
                are_kilometers_known=True,
                number_of_kilometers=float(value.replace(",", ".")),
                departure=None,
                arrival=None,
                number_of_trips=1
            )
        except ValueError:
            return None
    return None




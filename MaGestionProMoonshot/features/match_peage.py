import re
from utils.receipt_data import ReceiptData
from utils.files_reader import extract_text_from_pdf, extract_text_from_image


def match_peage(file, file_extension):
    """
    Extract the values after 'Sortie:' and 'Entrée:' in the given text and return them as ReceiptData.
    
    Args:
    - file: The uploaded file object (PDF or image).
    - file_extension (str): The extension of the uploaded file ("pdf" or other).
    
    Returns:
    - ReceiptData: An object containing the formatted receipt data.
    """
    # Extract text based on file extension
    if file_extension == "pdf":
        text = extract_text_from_pdf(file)
    else:
        text = extract_text_from_image(file)

    if not text:
        raise ValueError("No text could be extracted from the file.")

    # Define regex patterns for 'Sortie' and 'Entrée'
    sortie_pattern = r"Sortie:\s*([\w\s]+)"
    entree_pattern = r"Entrée:\s*(\w+)"

    # Search for matches
    sortie_match = re.search(sortie_pattern, text, re.IGNORECASE)
    entree_match = re.search(entree_pattern, text, re.IGNORECASE)

    # Extract the values
    sortie = sortie_match.group(1).strip() if sortie_match else None
    entree = entree_match.group(1).strip() if entree_match else None

    # If both values are None, raise an error
    if not sortie and not entree:
        raise ValueError("No valid 'Sortie' or 'Entrée' data found in the file.")

    # Construct the name of the trip
    name_of_trip = f"{entree} to {sortie}" if entree and sortie else None

    # Return the results as a ReceiptData object
    return ReceiptData(
        category="peages",
        name_of_trip=name_of_trip,
        type_of_transport=None,  # Not applicable for peage
        are_kilometers_known=False,
        departure=entree,
        arrival=sortie,
        number_of_trips=1
    )
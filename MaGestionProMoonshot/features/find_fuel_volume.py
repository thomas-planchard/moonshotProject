import re

def extract_volume_value(text):
    """
    Extract the numeric value associated with 'litre' or 'volume' in the given text.

    Args:
    - text (str): The input text to search in.

    Returns:
    - float: The extracted volume value if found, otherwise None.
    """
    # Define regex to capture a number associated with 'litre' or 'volume' (before or after)
    pattern = r"(?:(\d+(?:[.,]\d+)?)\s*(?:litre|volume)|(?:litre|volume)\s*(\d+(?:[.,]\d+)?))"
    match = re.search(pattern, text, re.IGNORECASE)

    if match:
        # Extract the first matching group (number)
        value = match.group(1) or match.group(2)
        try:
            # Replace comma with dot and convert to float
            return float(value.replace(",", "."))
        except ValueError:
            return None
    return None
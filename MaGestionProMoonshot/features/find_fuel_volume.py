import re 



def extract_volume_value(text):
    """
    Extract the numeric value before the words 'litre' or 'volume' in the given text.
    
    Args:
    - text (str): The input text to search in.
    
    Returns:
    - float: The extracted volume value if found, otherwise None.
    """
    # Define regex to capture a number before 'litre' or 'volume'
    pattern = r"(\d+(?:[.,]\d+)?)\s*(?:litre|volume)"
    match = re.search(pattern, text, re.IGNORECASE)
    
    if match:
        # Convert the matched number to float and return
        value = match.group(1).replace(",", ".")  # Replace comma with dot for float conversion
        return float(value)
    return None




import unicodedata

def normalize_text(text):
    """
    Normalize text to remove accents and make it lowercase.
    
    This function is useful for standardizing text by:
    - Removing diacritical marks (e.g., accents) from characters.
    - Converting all text to lowercase for case-insensitive comparisons.
    - Handling non-string inputs gracefully by converting them to strings.

    Args:
        text (any): The input to normalize. Can be a string or any other type.

    Returns:
        str: The normalized, accent-free, lowercase string.
    """
    # Check if the input is not a string
    if not isinstance(text, str):
        # Convert non-string input to a string (e.g., numbers or other objects)
        text = str(text) if text is not None else ""
    
    # Normalize the text using Unicode Normalization Form KD (NFKD)
    # This separates characters from their diacritical marks (e.g., é becomes e + ́)
    normalized_text = unicodedata.normalize("NFKD", text)
    
    # Encode the normalized text to ASCII, ignoring characters that cannot be encoded
    # This removes diacritical marks entirely
    ascii_text = normalized_text.encode("ASCII", "ignore")
    
    # Decode the ASCII bytes back into a UTF-8 string and convert to lowercase
    return ascii_text.decode("utf-8").lower()
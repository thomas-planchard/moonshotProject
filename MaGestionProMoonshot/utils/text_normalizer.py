import unicodedata


def normalize_text(text):
    """
    Normalize text to remove accents and make it lowercase.
    Handles non-string inputs gracefully by converting them to strings.
    """
    if not isinstance(text, str):  # Check if the input is not a string
        text = str(text) if text is not None else ""
    return unicodedata.normalize("NFKD", text).encode("ASCII", "ignore").decode("utf-8").lower()


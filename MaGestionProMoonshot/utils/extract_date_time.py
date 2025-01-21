import re  # Import regular expressions module for pattern matching.

def extract_time(text, include_date=True, include_time=True):
    """
    Extracts date and/or time patterns from a given text.

    Args:
        text (str): The input text from which to extract dates and times.
        include_date (bool, optional): If True, extracts date patterns from the text. Defaults to True.
        include_time (bool, optional): If True, extracts time patterns from the text. Defaults to True.

    Returns:
        tuple: A tuple containing two lists:
            - date_matches: A list of tuples for date matches, where each tuple contains
                            (matched_string, start_index, end_index). Empty if `include_date` is False.
            - time_matches: A list of tuples for time matches, where each tuple contains
                            (matched_string, start_index, end_index). Empty if `include_time` is False.
    """

    # Matches formats like "12/25/2023", "12-25-2023", or "25 December 2023".
    date_pattern = r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s\w+\s\d{4})\b"

    # Matches formats like "14h30" or "2h45".
    time_pattern = r"\b\d{1,2}h\d{2}\b"

    date_matches = []
    time_matches = []

    # If date extraction is enabled, find all matches for the date pattern in the text.
    if include_date:
        # Use re.finditer to get both the match string and its start and end indices.
        date_matches = [(m.group(), m.start(), m.end()) for m in re.finditer(date_pattern, text)]

    # If time extraction is enabled, find all matches for the time pattern in the text.
    if include_time:
        # Similar to date extraction, use re.finditer for detailed match information.
        time_matches = [(m.group(), m.start(), m.end()) for m in re.finditer(time_pattern, text)]

    # Return the results as a tuple: (date_matches, time_matches).
    return date_matches, time_matches
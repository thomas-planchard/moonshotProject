def extract_time(text, include_date=True, include_time=True):
    import re
    date_pattern = r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s\w+\s\d{4})\b"
    time_pattern = r"\b\d{1,2}h\d{2}\b"

    date_matches = []
    time_matches = []

    if include_date:
        date_matches = [(m.group(), m.start(), m.end()) for m in re.finditer(date_pattern, text)]
    if include_time:
        time_matches = [(m.group(), m.start(), m.end()) for m in re.finditer(time_pattern, text)]

    return date_matches, time_matches
def remove_similar_matches(matches):
    """
    Remove duplicates or overlapping matches, keeping only the most specific ones.
    Also ensures only one instance of each unique city is retained.
    
    Args:
    - matches: List of tuples (station_name, start, end).
    
    Returns:
    - Filtered list of matches with the most specific entries retained.
    """
    # Sort matches by their start position and length of the name in descending order
    matches = sorted(matches, key=lambda x: (x[1], -len(x[0])))

    filtered_matches = []
    seen_names = set()
    
    for current in matches:
        station, start, end = current

        # Ensure unique city names are kept, based on first occurrence
        if station not in seen_names:
            # Check if the current match overlaps with any already included match
            if not any(
                start >= filtered[1] and end <= filtered[2] or  # Fully subsumed
                (start <= filtered[2] and end >= filtered[1])  # Overlapping
                for filtered in filtered_matches
            ):
                filtered_matches.append(current)
                seen_names.add(station)

    return filtered_matches

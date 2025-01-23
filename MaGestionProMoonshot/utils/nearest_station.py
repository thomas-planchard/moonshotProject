
def find_nearest_stations(matches, reference_position):

    """
    Find the two stations closest to the reference position.

    Args:
        matches (list of tuples): A list of tuples where each tuple contains:
                                  - station (str): The station name.
                                  - start (int or float): The start position of the station.
                                  - end (int or float): The end position of the station.
        reference_position (int or float): The reference position to calculate distances from.

    Returns:
        list of tuples: A list containing up to two tuples, each representing the station and its start
                        and end positions, ordered by proximity to the reference position.
    """

    # Validate input
    if not matches:
        raise ValueError("No matches provided.")
    if reference_position is None or not isinstance(reference_position, (int, float)):
        raise ValueError("Invalid reference position. Must be an integer or float.")
    for match in matches:
        if not isinstance(match, tuple) or len(match) < 3:
            raise ValueError(f"Invalid match format: {match}. Expected a tuple (station, start, end).")

    # Calculate distances from the reference position
    matches_with_distances = [(station, start, end, abs(start - reference_position)) for station, start, end in matches]

    # Sort by distance and return the two closest matches
    sorted_matches = sorted(matches_with_distances, key=lambda x: x[3])
    return [match[:3] for match in sorted_matches[:2]]




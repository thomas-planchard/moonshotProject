
def find_nearest_stations(matches, reference_position):
    """
    Find the two stations closest to the reference position.
    """
    # Calculate distances from the reference position
    matches_with_distances = [(station, start, end, abs(start - reference_position)) for station, start, end in matches]

    # Sort by distance and return the two closest matches
    sorted_matches = sorted(matches_with_distances, key=lambda x: x[3])
    return [match[:3] for match in sorted_matches[:2]]




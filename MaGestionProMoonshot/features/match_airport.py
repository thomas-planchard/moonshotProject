import pandas as pd
from utils.find_matching_with_positions import find_matching_entities_with_positions
from utils.extract_date_time import extract_time
from utils.nearest_station import find_nearest_stations
from utils.files_reader import extract_text_from_pdf
from utils.remove_similar_matches import remove_similar_matches

# Load CSV with station data
csv_path = "../Data/airport.csv"
airport_df = pd.read_csv(csv_path)




def match_airport(pdf_path, countries=["FR"]):
    """
    Process a PDF to extract departure and arrival cities based on station data.
    Also finds dates/times and selects stations nearest to them.
    """
    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)

    if not pdf_text:
        print("No text found in PDF.")
        return {"stations": [None, None], "dates": [], "times": []}

    # Find all dates and times in the text
    date_matches = extract_time(pdf_text, include_time = False)

    # Find all matching stations and their positions
    airport_matches = find_matching_entities_with_positions(pdf_text, countries, airport_df, "iso_country", "municipality")
    print("Station Matches with Positions:", airport_matches)
    airport_matches = remove_similar_matches(airport_matches)
    print("Station Matches with Positions:", airport_matches)

    if not date_matches:
        print("No dates or times found. Returning the first two station matches.")
        return {"stations": [station[0] for station in airport_matches[:2]], "dates": date_matches}

    # Determine the reference position (prefer time over date)
    if date_matches:
        reference_position = date_matches[0][1]  # Use the position of the first time match
        print("Using time match as reference:", date_matches[0])
    else:
        # If no matches are found, fall back to default behavior
        return {"stations": [station[0] for station in airport_matches[:2]], "dates": date_matches}

    # Find the two stations nearest to the reference position
    nearest_stations = find_nearest_stations(airport_matches, reference_position)

    # Return results
    return nearest_stations



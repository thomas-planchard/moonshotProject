import pandas as pd
from utils.find_matching_with_positions import find_matching_entities_with_positions
from utils.extract_date_time import find_dates_and_times
from utils.nearest_station import find_nearest_stations
from utils.files_reader import extract_text_from_pdf
from utils.remove_similar_matches import remove_similar_matches


# Load CSV with station data
csv_path = "Data/train_stations.csv"
station_df = pd.read_csv(csv_path)



def process_pdf_with_dates(pdf_path, countries=["FR"]):
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
    date_matches, time_matches = find_dates_and_times(pdf_text)

    # Find all matching stations and their positions
    station_matches = find_matching_entities_with_positions(pdf_text, countries, station_df, "country", "name_norm")
    print("Station Matches with Positions:", station_matches)
    station_matches = remove_similar_matches(station_matches)
    print("Station Matches with Positions:", station_matches)

    if not date_matches and not time_matches:
        print("No dates or times found. Returning the first two station matches.")
        return {"stations": [station[0] for station in station_matches[:2]], "dates": date_matches, "times": time_matches}

    # Determine the reference position (prefer time over date)
    if time_matches:
        reference_position = time_matches[0][1]  # Use the position of the first time match
        print("Using time match as reference:", time_matches[0])
    elif date_matches:
        reference_position = date_matches[0][1]  # Use the position of the first date match
        print("Using date match as reference:", date_matches[0])
    else:
        # If no matches are found, fall back to default behavior
        return {"stations": [station[0] for station in station_matches[:2]], "dates": date_matches, "times": time_matches}

    # Find the two stations nearest to the reference position
    nearest_stations = find_nearest_stations(station_matches, reference_position)

    # Return results
    return nearest_stations[0][0], nearest_stations[1][0]



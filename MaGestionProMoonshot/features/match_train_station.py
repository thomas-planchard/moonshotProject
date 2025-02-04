import pandas as pd
from pathlib import Path
from utils.find_matching_with_positions import find_matching_entities_with_positions
from utils.extract_date_time import extract_time
from utils.nearest_station import find_nearest_stations
from utils.files_reader import extract_text_from_pdf
from utils.remove_similar_matches import remove_similar_matches
from utils.receipt_data import ReceiptData



def match_train_station(pdf_path, countries=["FR"]):
    """
    Process a PDF to extract departure and arrival cities based on station data.
    Also finds dates/times and selects stations nearest to them.

    Args:
        pdf_path (str): The path to the PDF file.
        countries (list of str): List of country codes to filter station matches. Default is ["FR"].

    Returns:
        ReceiptData: An object containing the formatted receipt data.
    """

    # Get the directory of the current script
    current_dir = Path(__file__).parent.parent

    # Construct the dynamic path to the CSV file
    csv_path = current_dir / "Data" / "train_stations.csv"

    # Load CSV with station data
    station_df = pd.read_csv(csv_path)

    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)

    if not pdf_text:
        raise ValueError("No text found in PDF. Ensure the file contains readable content.")

    # Find all dates and times in the text
    date_matches, time_matches = extract_time(pdf_text)

    # Find all matching stations and their positions
    station_matches = find_matching_entities_with_positions(pdf_text, station_df, "country", "name_norm", countries)
    station_matches = remove_similar_matches(station_matches)

    if not date_matches and not time_matches:
       raise ValueError("No stations found in the text. Ensure the text includes valid station names.")

    # Determine the reference position (prefer time over date)
    if time_matches:
        reference_position = time_matches[0][1]  # Use the position of the first time match
    elif date_matches:
        reference_position = date_matches[0][1]  # Use the position of the first date match
    else:
        reference_position = None
        
    # Find the two stations nearest to the reference position
    nearest_stations = find_nearest_stations(station_matches, reference_position) if reference_position else station_matches[:2]


    # Extract departure and arrival stations
    departure_station = nearest_stations[0][0] if nearest_stations else None
    arrival_station = nearest_stations[1][0] if len(nearest_stations) > 1 else None

    if not departure_station or not arrival_station:
        raise ValueError("Unable to determine both departure and arrival stations.")

     # Construct the name of the trip
    name_of_trip = f"{departure_station} to {arrival_station}"

    return ReceiptData(
        category='trains',
        name_of_trip=name_of_trip,
        are_kilometers_known=False,
        departure=departure_station,
        arrival=arrival_station,
        number_of_trips=1
    )



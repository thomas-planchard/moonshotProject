import pandas as pd
from pathlib import Path
from utils.find_matching_with_positions import find_matching_entities_with_positions
from utils.extract_date_time import extract_time
from utils.nearest_station import find_nearest_stations
from utils.files_reader import extract_text_from_pdf
from utils.remove_similar_matches import remove_similar_matches



def match_airport(pdf_path, countries=["FR"]):
    """
    Process a PDF to extract departure and arrival cities based on airport data.
    Also finds dates and selects airports nearest to them.

    Args:
        pdf_path (str): The path to the PDF file.
        countries (list of str): List of country codes to filter airport matches. Default is ["FR"].

    Returns:
        tuple: A tuple containing the names of the two nearest airports
               (departure, arrival), or [None, None] if no airports are found.
    """

    # Get the directory of the current script
    current_dir = Path(__file__).parent.parent

    # Construct the dynamic path to the CSV file
    csv_path = current_dir / "Data" / "airport.csv"

    # Load CSV with station data
    airport_df = pd.read_csv(csv_path)
    
    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)

    if not pdf_text:
        return [None, None]

    # Find all dates and times in the text
    date_matches, time_matches = extract_time(pdf_text, include_time = False)
    # Find all matching stations and their positions
    airport_matches = find_matching_entities_with_positions(pdf_text, countries, airport_df, "iso_country", "municipality")
    airport_matches = remove_similar_matches(airport_matches)


    # Determine the reference position (prefer time over date)
    if date_matches:
        reference_position = date_matches[0][1]  # Use the position of the first time match
    else:
        # If no matches are found, fall back to default behavior
        return [station[0] for station in airport_matches[:2]]

    # Find the two stations nearest to the reference position
    nearest_stations = find_nearest_stations(airport_matches, reference_position)

    # Return results
    return nearest_stations[0][0], nearest_stations[1][0]




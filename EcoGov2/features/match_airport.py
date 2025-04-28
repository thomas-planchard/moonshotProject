import pandas as pd
from pathlib import Path
from utils.find_matching_with_positions import find_matching_entities_with_positions
from utils.extract_date_time import extract_time
from utils.nearest_station import find_nearest_stations
from utils.files_reader import extract_text_from_pdf
from utils.remove_similar_matches import remove_similar_matches
from utils.receipt_data import ReceiptData

# Import the cache function if available, otherwise create a local version
try:
    from app import get_airports_data
except ImportError:
    # Local cache for when running outside the main app context
    from functools import lru_cache
    
    @lru_cache(maxsize=1)
    def get_airports_data():
        """Load and cache airport data"""
        current_dir = Path(__file__).parent.parent
        csv_path = current_dir / "Data" / "airport.csv"
        return pd.read_csv(csv_path)


def match_airport(pdf_path, countries=["FR"]):
    """
    Process a PDF to extract departure and arrival cities based on airport data.
    Also finds dates/times and selects airports nearest to them.

    Args:
        pdf_path (str or file-like): The path to the PDF file or a file-like object.
        countries (list of str): List of country codes to filter airport matches. Default is ["FR"].

    Returns:
        ReceiptData: An object containing the formatted receipt data.
    """
    # Load CSV with airport data using the cached function
    airport_df = get_airports_data()

    # Extract text from PDF
    pdf_text = extract_text_from_pdf(pdf_path)

    if not pdf_text:
        raise ValueError("No text found in PDF. Ensure the file contains readable content.")

    # Find all dates and times in the text
    date_matches, time_matches = extract_time(pdf_text)

    # Find all matching airports and their positions
    airport_matches = find_matching_entities_with_positions(pdf_text, airport_df, "iso_country", "municipality", countries)
    airport_matches = remove_similar_matches(airport_matches)

    if not airport_matches:
        raise ValueError("No airports found in the text. Ensure the text includes valid airport names.")

    # Determine the reference position (prefer time over date)
    if time_matches:
        reference_position = time_matches[0][1]  # Use the position of the first time match
    elif date_matches:
        reference_position = date_matches[0][1]  # Use the position of the first date match
    else:
        reference_position = None

    # Find the two airports nearest to the reference position
    nearest_airports = find_nearest_stations(airport_matches, reference_position) if reference_position else airport_matches[:2]

    # Extract departure and arrival airports
    departure_airport = nearest_airports[0][0] if nearest_airports else None
    arrival_airport = nearest_airports[1][0] if len(nearest_airports) > 1 else None

    if not departure_airport or not arrival_airport:
        raise ValueError("Unable to determine both departure and arrival airports.")


    # Return results as a ReceiptData object
    return ReceiptData(
        category='avions',
        departure=departure_airport,
        arrival=arrival_airport,
    )
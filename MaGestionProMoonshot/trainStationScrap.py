import pdfplumber
import pandas as pd
import unicodedata
import re


# Load CSV with station data
csv_path = "Data/train_stations.csv"
station_df = pd.read_csv(csv_path)


def normalize_text(text):
    """
    Normalize text to remove accents and make it lowercase.
    """
    return unicodedata.normalize("NFKD", text).encode("ASCII", "ignore").decode("utf-8").lower()


def extract_text_from_pdf(pdf_file_path):
    """
    Extract text from a PDF file.
    """
    try:
        with pdfplumber.open(pdf_file_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
    except Exception as e:
        print(f"Error reading PDF: {str(e)}")
        return ""


def find_matching_stations_with_positions(pdf_text, countries):
    """
    Find matching train stations in the provided text based on the CSV and country filter.
    Returns station names along with their positions in the text.
    """
    # Normalize the PDF text
    normalized_text = normalize_text(pdf_text)

    # Filter station data for the selected countries
    filtered_stations = station_df[station_df['country'].isin(countries)]

    # Find matches with positions
    matches = []
    for station in filtered_stations['name_norm']:
        normalized_station = normalize_text(station)
        # Use \b for word boundaries to ensure exact match
        pattern = rf"\b{re.escape(normalized_station)}\b"
        for match in re.finditer(pattern, normalized_text):
            matches.append((station, match.start(), match.end()))

    return matches


def find_dates_and_times(text):
    """
    Find dates and times in the text using regex and return their positions.
    """
    # Define regex patterns for dates and times
    date_pattern = r"\b(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{1,2}\s\w+\s\d{4})\b"
    time_pattern = r"\b\d{1,2}h\d{2}\b"

    # Find all matches for dates and times
    date_matches = [(m.group(), m.start(), m.end()) for m in re.finditer(date_pattern, text)]
    time_matches = [(m.group(), m.start(), m.end()) for m in re.finditer(time_pattern, text)]

    return date_matches, time_matches


def find_nearest_stations(matches, reference_position):
    """
    Find the two stations closest to the reference position.
    """
    # Calculate distances from the reference position
    matches_with_distances = [(station, start, end, abs(start - reference_position)) for station, start, end in matches]

    # Sort by distance and return the two closest matches
    sorted_matches = sorted(matches_with_distances, key=lambda x: x[3])
    print ("Sorted Matches:", sorted_matches)
    return [match[:3] for match in sorted_matches[:2]]


def remove_similar_matches(matches):
    """
    Remove duplicates or similar matches, keeping only the most specific ones.
    Args:
    - matches: List of tuples (station, start, end, distance).
    
    Returns:
    - Filtered list of matches with the most specific entries retained.
    """
    # Sort matches by the length of the station name in descending order
    # Longer names are likely to be more specific
    matches = sorted(matches, key=lambda x: (x[3], -len(x[0])))

    filtered_matches = []
    for current in matches:
        station, start, end, _ = current
        # Check if the current station overlaps with any already filtered station
        if not any(
            start >= filtered[1] and end <= filtered[2] for filtered in filtered_matches
        ):
            filtered_matches.append(current)

    return filtered_matches


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
    print("Dates Found:", date_matches)
    print("Times Found:", time_matches)

    # Find all matching stations and their positions
    station_matches = find_matching_stations_with_positions(pdf_text, countries)
    print("Station Matches with Positions:", station_matches)

    if not date_matches:
        print("No dates found. Returning the first two station matches.")
        return {"stations": [station[0] for station in station_matches[:2]], "dates": date_matches, "times": time_matches}

    # Use the first date as the reference point
    reference_position = time_matches[0][1]

    # Find the two stations nearest to the date
    nearest_stations = find_nearest_stations(station_matches, reference_position)
    print("Nearest Stations:", nearest_stations)

    

    # Return results
    return {
        "stations": [station[0] for station in nearest_stations],
    }


# Example Usage
if __name__ == "__main__":
    # Specify the PDF path and countries to match stations
    pdf_path = "NDF/Trains/01-Billet train.pdf"
    result = process_pdf_with_dates(pdf_path, countries=["FR"])
    print("\nResult:", result)
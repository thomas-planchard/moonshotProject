import re
from text_normalizer import normalize_text

def find_matching_entities_with_positions(pdf_text, countries, data, country_column, name_column):
    """
    Find matching entities (e.g., train stations or airports) in the provided text based on the dataset and country filter.
    Returns entity names along with their positions in the text.

    Args:
        pdf_text (str): Text to search for matches.
        countries (list): List of countries to filter by.
        data (pd.DataFrame): Dataset containing entity information.
        country_column (str): Column name in the dataset for country filtering.
        name_column (str): Column name in the dataset for entity names.

    Returns:
        list: A list of tuples containing the entity name and its start and end positions in the text.
    """
    # Normalize the PDF text
    normalized_text = normalize_text(pdf_text)

    # Filter the dataset for the selected countries
    filtered_data = data[data[country_column].isin(countries)]

    # Find matches with positions
    matches = []
    for entity_name in filtered_data[name_column]:
        normalized_entity = normalize_text(entity_name)
        # Use \b for word boundaries to ensure exact match
        pattern = rf"\b{re.escape(normalized_entity)}\b"
        for match in re.finditer(pattern, normalized_text):
            matches.append((entity_name, match.start(), match.end()))

    return matches





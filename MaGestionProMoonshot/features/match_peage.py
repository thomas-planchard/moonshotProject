import re 

def match_peage(text):
    """
    Extract the values after 'Sortie:' and 'Entrée:' in the given text.
    
    Args:
    - text (str): The input text to search in.
    
    Returns:
    - dict: A dictionary with 'sortie' and 'entree' keys and their corresponding values.
    """
    # Define regex patterns for 'Sortie' and 'Entrée'
    sortie_pattern = r"Sortie:\s*([\w\s]+)"
    entree_pattern = r"Entrée:\s*(\w+)"
    
    # Search for matches
    sortie_match = re.search(sortie_pattern, text, re.IGNORECASE)
    entree_match = re.search(entree_pattern, text, re.IGNORECASE)
    
    # Extract and return the values
    result = {
        "sortie": sortie_match.group(1).strip() if sortie_match else None,
        "entree": entree_match.group(1).strip() if entree_match else None
    }
    return result



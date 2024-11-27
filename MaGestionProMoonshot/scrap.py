import pdfplumber
import re

def inspect_pdf_structure(pdf_file_path):
    """
    Inspect the structure of a PDF to identify distinct areas or parts.
    """
    try:
        with pdfplumber.open(pdf_file_path) as pdf:
            for page_number, page in enumerate(pdf.pages):
                print(f"--- Page {page_number + 1} ---")
                
                # Extract and display table data if available
                text = page.extract_text_lines()
                tables = page.extract_tables()
                print (text)
                if tables:
                    print(f"  Tables found on Page {page_number + 1}:")
                    for table in tables:
                        for row in table:
                            print(f"    {row}")
                else:
                    print(f"  No tables found on Page {page_number + 1}.")
                return text
            
    except Exception as e:
        print(f"Error inspecting PDF structure: {str(e)}")

# Test the function with a sample PDF



def extract_cities(text: str) -> dict:
    """
    Extract departure and arrival cities from the ticket text.
    """
    result = {
        "departure_city": None,
        "arrival_city": None,
    }

    # Regex for time and city
    time_city_pattern = r"(\d{1,2}h\d{2}) ([\w\-éèàç]+(?: [\w\-éèàç]+)*)"
    matches = re.findall(time_city_pattern, text)

    # Extract departure and arrival if matches are found
    if matches:
        result["departure_city"] = matches[0][1]  # First match is the departure city
        result["arrival_city"] = matches[-1][1]  # Last match is the arrival city

    # Additional check for directional patterns like "PARIS > CANNES"
    direction_pattern = r"([\w\-éèàç]+) > ([\w\-éèàç]+)"
    directional_match = re.search(direction_pattern, text)
    if directional_match:
        result["departure_city"] = directional_match.group(1)
        result["arrival_city"] = directional_match.group(2)

    return result

output = extract_cities(inspect_pdf_structure("NDF/Trains/Train Paris Cannes.pdf"))
print(output)

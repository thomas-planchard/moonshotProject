import pdfplumber
import re

depart = ''
arrivee = ''

# Open the PDF file
with pdfplumber.open('test.pdf') as pdf:
    # Loop through each page
    for page_number, page in enumerate(pdf.pages):
        # Extract text from the page
        text = page.extract_text()
# Define patterns to match the required data
time_pattern = re.compile(r'\b\d{2}h\d{2}\b')
depart_pattern = re.compile(r'DE :\s*(.*)')
arrivee_pattern = re.compile(r'À :\s*(.*)')
date_pattern = re.compile(r'Aller le \d{2}/\d{2}/\d{4}')

# Search for the patterns in the text
departure_hour_match = time_pattern.search(text)
depart_match = depart_pattern.search(text)
arrivee_match = arrivee_pattern.search(text)
date_match = date_pattern.search(text)

# Print the extracted data
if departure_hour_match:
    departure_hour = departure_hour_match.group()
    print(f"Departure hour: {departure_hour}")
else:
    print("No departure hour found.")

if depart_match:
    depart = depart_match.group(1)
    print(f"Depart: {depart}")
else:
    print("No departure location found.")

if arrivee_match:
    arrivee = arrivee_match.group(1)
    print(f"Arrivee: {arrivee}")
else:
    print("No arrival location found.")

if date_match:
    aller_date = date_match.group()
    aller_date = aller_date.replace('Aller le ', '')
    print(f"Aller date: {aller_date}")
else:
    print("No 'Aller le' date found.")
    



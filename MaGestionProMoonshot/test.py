import pdfplumber
import requests
import re
from datetime import datetime


# Function to extract trips (aller and retour) from the PDF content
def extract_trip_info(text):
    clients = []  # To store client trip information
    client_pattern = re.compile(r'Voyageur \d+ : ([A-Z\s]+)')  # Pattern to extract client name
    trip_pattern = re.compile(r'Aller (\d{2}/\d{2}/\d{4}) à (\d{2}:\d{2}:\d{2})')  # Pattern to extract trip details

    lines = text.split('\n')
    current_client = None
    for line in lines:
        # Look for client name
        client_match = client_pattern.search(line)
        if client_match:
            current_client = {
                'name': client_match.group(1),
                'aller': None,
                'retour': None
            }
            clients.append(current_client)

        # Look for trip details (aller)
        trip_match = trip_pattern.search(line)
        if trip_match and current_client:
            trip_date = trip_match.group(1)
            trip_time = trip_match.group(2)
            if not current_client['aller']:
                # Save aller (outbound) trip
                current_client['aller'] = {'date': trip_date, 'time': trip_time, 'depart': 'GIEN', 'arrivee': 'PARIS BERCY'}
            else:
                # Save retour (return) trip
                current_client['retour'] = {'date': trip_date, 'time': trip_time, 'depart': 'PARIS BERCY', 'arrivee': 'GIEN'}

    return clients

# Function to convert date and time to SNCF API format (YYYYMMDDTHHMMSS)
def format_datetime(date_str, time_str):
    datetime_obj = datetime.strptime(f"{date_str} {time_str}", "%d/%m/%Y %H:%M:%S")
    return datetime_obj.strftime("%Y%m%dT%H%M%S")

# Open the PDF file and extract the text
with pdfplumber.open('facture.pdf') as pdf:
    full_text = ""
    full_text= pdf.pages[1].extract_text()

        
# Extract trip details from the PDF
clients_trips = extract_trip_info(full_text)

# Process each client's trips and fetch journey details using the SNCF API
for client in clients_trips:
    print(f"Client: {client['name']}")
    
    # Handle aller (outbound) trip
    if client['aller']:
        aller = client['aller']
        datetime_str = format_datetime(aller['date'], aller['time'])
        
        if admin_code_depart and admin_code_arrivee:
            print(f"Aller - From: {aller['depart']} to {aller['arrivee']} at {datetime_str}")
            # Prepare params and send request for the aller trip
            params = {
                "from": admin_code_depart,
                "to": admin_code_arrivee,
                "datetime": datetime_str,
            }
            headers = {'Authorization': api_key}
            response = requests.get(url_journeys, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                print("Aller Trip Details:", data)
            else:
                print(f"Error fetching aller journey: {response.status_code} - {response.text}")

    # Handle retour (return) trip
    if client['retour']:
        retour = client['retour']
        datetime_str = format_datetime(retour['date'], retour['time'])
        admin_code_depart = fetch_admin_code(retour['depart'])
        admin_code_arrivee = fetch_admin_code(retour['arrivee'])
        
        if admin_code_depart and admin_code_arrivee:
            print(f"Retour - From: {retour['depart']} to {retour['arrivee']} at {datetime_str}")
            # Prepare params and send request for the retour trip
            params = {
                "from": admin_code_depart,
                "to": admin_code_arrivee,
                "datetime": datetime_str,
            }
            headers = {'Authorization': api_key}
            response = requests.get(url_journeys, headers=headers, params=params)
            if response.status_code == 200:
                data = response.json()
                print("Retour Trip Details:", data)
            else:
                print(f"Error fetching retour journey: {response.status_code} - {response.text}")
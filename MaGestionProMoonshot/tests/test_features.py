import pytest
from features.match_train_station import match_train_station
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume
from pathlib import Path
from utils.receipt_data import ReceiptData

# Define test cases for train station matching
train_station_cases = [
    ("NDF/Trains/01-Billet train.pdf", ["FR"], ("Paris", "Aix-en-Provence")),
    ("NDF/Trains/02-Billet train.pdf", ["FR"], ("Paris", "Aix-en-Provence")),
    ("NDF/Trains/03-Billet train.pdf", ["FR"], ("Paris", "Cannes")),
    ("NDF/Trains/04-Billet train.pdf", ["FR"], ("Cannes", "Paris")),
]

# Define test cases for airport matching
airport_cases = [
    ("NDF/Avions/1. Billet AVION.pdf", ["FR", "IT"], ("Paris", "Rome")),
    ("NDF/Avions/2. Billet AVION.pdf", ["FR"], ("Paris", "Marseille")),
    ("NDF/Avions/3. Billet AVION.pdf", ["FR"], ("Paris", "Marseille")),
]

# Define test cases for fuel volume matching; expected fuel value in float.
fuel_volume_cases = [
    ("NDF/Essence/01-Essence.jpeg", 38.67),
]

@pytest.mark.parametrize("file_path, countries, expected", train_station_cases)
def test_match_train_station(file_path, countries, expected):
    result: ReceiptData = match_train_station(file_path, countries=countries)
    # Assert that the departure and arrival values match the expected tuple
    assert (result.departure, result.arrival) == expected

@pytest.mark.parametrize("file_path, countries, expected", airport_cases)
def test_match_airport(file_path, countries, expected):
    result: ReceiptData = match_airport(file_path, countries=countries)
    # Assert that the departure and arrival values match the expected tuple
    assert (result.departure, result.arrival) == expected

@pytest.mark.parametrize("file_path, expected", fuel_volume_cases)
def test_match_fuel_volume(file_path, expected):
    # Open the file in binary mode and pass the file object along with the proper extension.
    with open(file_path, "rb") as f:
        result: ReceiptData = match_fuel_volume(f, "jpeg")
        # Use pytest.approx for floating point comparisons
        assert result.number_of_kilometers == pytest.approx(expected, rel=1e-2)
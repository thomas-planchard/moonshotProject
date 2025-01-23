from features.match_train_station import match_train_station
from features.match_peage import match_peage
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume
from utils.files_reader import extract_text_from_image
from pathlib import Path

# Test cases for different functions
test_cases = [
    {
        "function": "match_train_station",
        "file_path": "NDF/Trains/01-Billet train.pdf",
        "countries": ["FR"],
        "expected_result": ("Paris", "Aix-en-Provence"),
    },
    {
        "function": "match_train_station",
        "file_path": "NDF/Trains/02-Billet train.pdf",
        "countries": ["FR"],
        "expected_result": ("Paris", "Aix-en-Provence"),
    },
    {
        "function": "match_train_station",
        "file_path": "NDF/Trains/03-Billet train.pdf",
        "countries": ["FR"],
        "expected_result": ("Paris", "Cannes"),
    },
    {
        "function": "match_train_station",
        "file_path": "NDF/Trains/04-Billet train.pdf",
        "countries": ["FR"],
        "expected_result": ("Cannes", "Paris"),
    },
    {
        "function": "match_peage",
        "file_path": "NDF/Péages/01-Peage.jpeg",
        "expected_result": ("Montesson", "Paris"),  
    },
    {
        "function": "match_airport",
        "file_path": "NDF/Avions/1. Billet AVION.pdf",
        "countries": ["FR", "IT"],
        "expected_result": ("Paris", "Rome"),
    },
    {
        "function": "match_airport",
        "file_path": "NDF/Avions/2. Billet AVION.pdf",
        "countries": ["FR"],
        "expected_result": ("Paris", "Marseille"),
    },
    {
        "function": "match_airport",
        "file_path": "NDF/Avions/3. Billet AVION.pdf",
        "countries": ["FR"],
        "expected_result": ("Paris", "Marseille"),
    },
    {
        "function": "match_fuel_volume",
        "file_path": "NDF/Essence/01-Essence.jpeg",
        "expected_result": 38.67, 
    },
]

# Initialize counters for tests
total_tests = 0
successful_tests = 0

# Run tests
for case in test_cases:
    function_name = case["function"]
    file_path = case["file_path"]
    expected_result = case["expected_result"]
    countries = case.get("countries")  

    print(f"\nTesting {function_name} with file: {file_path}")
    total_tests += 1

    try:
        # Call the appropriate function
        if function_name == "match_train_station":
            result = match_train_station(file_path, countries=countries)
        elif function_name == "match_peage":
            text = extract_text_from_image(file_path)
            result = match_peage(text)
        elif function_name == "match_airport":
            result = match_airport(file_path, countries=countries)
        elif function_name == "match_fuel_volume":
            text = extract_text_from_image(file_path)
            result = match_fuel_volume(text)
        else:
            print("Unknown function. Skipping test.")
            continue

        # Assert the result matches the expectation
        assert result == expected_result, f"Test failed! Expected: {expected_result}, Got: {result}"
        print(f"Test passed! Result: {result}")
        successful_tests += 1

    except Exception as e:
        print(f"Test failed for {file_path}. Error: {e}")

# Calculate success percentage
success_rate = (successful_tests / total_tests) * 100 if total_tests > 0 else 0
print(f"\nTest Summary: {successful_tests}/{total_tests} tests passed.")
print(f"Success Rate: {success_rate:.2f}%")
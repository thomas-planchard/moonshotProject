from features.match_train_station import match_train_station
from features.match_peage import match_peage
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume
from utils.files_reader import extract_text_from_image
from pathlib import Path





# Testing function
def test_functions(folder_path):
    """
    Test all the provided functions dynamically based on file type and name.

    Args:
        folder_path (str or Path): Path to the folder containing test files.
    """
    folder_path = Path(folder_path)

    # Loop through all files in the folder
    for file_path in folder_path.glob("*"):
        print(f"\nTesting file: {file_path.name}")

        try:
            if "Train" in file_path.name and file_path.suffix == ".pdf":
                # Match train stations from PDFs
                result = match_train_station(file_path, countries=["FR"])
                print("  match_train_station Result:", result)

            elif "Péage" in file_path.name and file_path.suffix in [".jpeg", ".jpg", ".png"]:
                # Extract text from image and match peage
                text = extract_text_from_image(file_path)
                result = match_peage(text)
                print("  match_peage Result:", result)

            elif "Avion" in file_path.name and file_path.suffix == ".pdf":
                # Match airports from PDFs
                result = match_airport(file_path, countries=["FR", "IT"])
                print("  match_airport Result:", result)

            elif "Essence" in file_path.name and file_path.suffix in [".jpeg", ".jpg", ".png"]:
                # Extract text from image and extract volume value
                text = extract_text_from_image(file_path)
                result = extract_volume_value(text)
                print("  extract_volume_value Result:", result)

            else:
                print("  No matching function for this file.")

        except Exception as e:
            print(f"  Error testing file {file_path.name}: {e}")

# Specify the folder containing test files
test_folder = "../NDF"

# Run the test function
test_functions(test_folder)
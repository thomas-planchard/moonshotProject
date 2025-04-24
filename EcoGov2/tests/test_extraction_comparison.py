import time
import pytest
from pathlib import Path
from features.scrapAI import get_travel_info_from_pdf
from features.match_train_station import match_train_station
from features.match_airport import match_airport
from features.match_fuel_volume import match_fuel_volume
import io
import json
from enum import Enum
from pydantic import BaseModel

# Load test cases from JSON file
def load_test_cases():
    with open("NDF/test.json", "r") as f:
        return json.load(f)

TEST_CASES = load_test_cases()

CATEGORY_FUNCTIONS = {
    "trains": match_train_station,
    "avions": match_airport,
    "essence": match_fuel_volume,
}

results = []

def to_serializable(obj):
    if isinstance(obj, BaseModel):
        return obj.dict()
    if isinstance(obj, Enum):
        return obj.value
    if isinstance(obj, (list, tuple)):
        return [to_serializable(i) for i in obj]
    if isinstance(obj, dict):
        return {k: to_serializable(v) for k, v in obj.items()}
    return obj

@pytest.fixture(scope="session", autouse=True)
def write_results_to_json(request):
    yield
    output_path = "NDF/test_output.json"
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)

@pytest.mark.parametrize("case", TEST_CASES)
def test_extraction_comparison(case):
    file_path = Path(case["file"])
    category = case["category"]
    expected = case["expected"]
    
    # Read file content
    with open(file_path, "rb") as f:
        file_bytes = f.read()
    file_obj = io.BytesIO(file_bytes)
    
    # --- AI Extraction ---
    start_ai = time.time()
    ai_result = get_travel_info_from_pdf(str(file_path), model_name="mistral:7b", doc_type=category)
    ai_time = time.time() - start_ai
    
    # --- Regular Extraction ---
    file_obj.seek(0)
    start_reg = time.time()
    if category in ["trains", "avions"]:
        reg_result = CATEGORY_FUNCTIONS[category](file_obj, countries=["FR"])
    else:
        reg_result = CATEGORY_FUNCTIONS[category](file_obj, file_path.suffix[1:])
    reg_time = time.time() - start_reg
    
    # --- Accuracy (exact match) ---
    ai_acc = int(ai_result == expected)
    reg_acc = int(reg_result == expected)
    
    # Collect result
    results.append({
        "file": str(file_path),
        "category": category,
        "expected": to_serializable(expected),
        "ai_result": to_serializable(ai_result),
        "reg_result": to_serializable(reg_result),
        "ai_time": ai_time,
        "reg_time": reg_time,
        "ai_acc": ai_acc,
        "reg_acc": reg_acc
    })
    
    print(f"\nFile: {file_path}")
    print(f"AI:    Time={ai_time:.2f}s, Accuracy={ai_acc}, Result={ai_result}")
    print(f"REG:   Time={reg_time:.2f}s, Accuracy={reg_acc}, Result={reg_result}")
    
    # Optionally, assert exact match
    # assert ai_acc == 1, f"AI extraction does not match expected for {file_path}"
    # assert reg_acc == 1, f"Regular extraction does not match expected for {file_path}"

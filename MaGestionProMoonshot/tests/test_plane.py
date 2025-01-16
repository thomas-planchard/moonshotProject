import pytest
from MaGestionProMoonshot.plane import process_pdf_with_dates

def test_process_pdf_with_dates():
    """
    Test the `process_pdf_with_dates` function with various tickets.
    """
    test_cases = [
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Avions/1. Billet AVION.pdf",
            "countries": ["FR", "IT"],
            "expected_result": ("Paris", "Rome")
        },
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Avions/2. Billet AVION.pdf",
            "countries": ["FR"],
            "expected_result": ("Paris", "Marseille")
        },
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Avions/3. Billet AVION.pdf",
            "countries": ["FR"],
            "expected_result": ("Paris", "Marseille")
        }
    ]

    for case in test_cases:
        result = process_pdf_with_dates(case["pdf_path"], case["countries"])
        assert result == case["expected_result"], f"Failed for {case['pdf_path']}"
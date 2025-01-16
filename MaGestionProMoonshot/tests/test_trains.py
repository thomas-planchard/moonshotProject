import pytest
from MaGestionProMoonshot.trainStationScrap import process_pdf_with_dates

def test_process_pdf_with_dates():
    """
    Test the `process_pdf_with_dates` function with various tickets.
    """
    test_cases = [
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Trains/01-Billet train.pdf",
            "countries": ["FR"],
            "expected_result": ("Paris Gare de Lyon", "Aix-en-Provence TGV")
        },
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Trains/02-Billet train.pdf",
            "countries": ["FR"],
            "expected_result": ("Paris", "Lyon")
        },
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Trains/Train Cannes.pdf",
            "countries": ["FR"],
            "expected_result": ("Paris", "Cannes")
        },
        {
            "pdf_path": "MaGestionProMoonshot/NDF/Trains/Train Paris Cannes.pdf",
            "countries": ["FR"],
            "expected_result": ("Cannes", "Paris")
        }
    ]

    for case in test_cases:
        result = process_pdf_with_dates(case["pdf_path"], case["countries"])
        assert result == case["expected_result"], f"Failed for {case['pdf_path']}"
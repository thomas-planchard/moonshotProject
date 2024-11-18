import pytest
from fastapi.testclient import TestClient
from scrap import app 

client = TestClient(app)

@pytest.fixture
def sample_pdf(tmp_path):
    """
    Create a sample PDF file for testing.
    """
    from fpdf import FPDF

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt="Category: Road Transport", ln=True, align="C")
    pdf.cell(200, 10, txt="Name of Trip: Example Trip", ln=True, align="C")
    pdf.cell(200, 10, txt="Type of Transport: Taxi", ln=True, align="C")
    pdf.output(tmp_path / "sample.pdf")
    return tmp_path / "sample.pdf"

def test_extract_data_valid_pdf(sample_pdf):
    """
    Test extracting data from a valid PDF.
    """
    with open(sample_pdf, "rb") as pdf_file:
        response = client.post(
            "/extract-data",
            files={"file": ("sample.pdf", pdf_file, "application/pdf")},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["category"] == "Road Transport"
    assert data["name_of_trip"] == "Example Trip"
    assert data["type_of_transport"] == "Taxi"
    assert data["step_of_production"] == "Shooting"
    assert data["are_kilometers_known"] is True
    assert data["number_of_kilometers"] == 100
    assert data["number_of_trips"] == 1

def test_extract_data_invalid_file_format():
    """
    Test uploading a non-PDF file.
    """
    response = client.post(
        "/extract-data",
        files={"file": ("test.txt", b"This is not a PDF", "text/plain")},
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid file format. Only PDFs are accepted."

def test_extract_data_missing_file():
    """
    Test the endpoint when no file is provided.
    """
    response = client.post("/extract-data", files={})
    assert response.status_code == 422  # Unprocessable Entity for missing file

def test_extract_data_invalid_pdf():
    """
    Test uploading a PDF that cannot be processed.
    """
    invalid_pdf_content = b"%PDF-1.4\n%Invalid PDF Content"
    response = client.post(
        "/extract-data",
        files={"file": ("corrupt.pdf", invalid_pdf_content, "application/pdf")},
    )
    assert response.status_code == 500
    assert "Error processing file" in response.json()["detail"]
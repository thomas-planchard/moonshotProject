import io
from PIL import Image
from pytesseract import image_to_string
import pdfplumber


def extract_text_from_image(image_file):
    """
    Extract text from an image file using OCR (Tesseract).
    """
    try:
        with open(image_file, "rb") as f:
            image = Image.open(io.BytesIO(f.read()))
        text = image_to_string(image, lang="fra")
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from image: {str(e)}")
    


def extract_text_from_pdf(pdf_file_path):
    """
    Extract text from a PDF file.
    """
    try:
        with pdfplumber.open(pdf_file_path) as pdf:
            text = ""
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
            return text
    except Exception as e:
        print(f"Error reading PDF: {str(e)}")
        return ""


# Example Usage
if __name__ == "__main__":
    # Specify the PDF path and countries to match stations
    pdf_path = "../NDF/Essence/TotalEssence.jpeg"
    result = extract_text_from_image(pdf_path)
    print("\nResult:", result)
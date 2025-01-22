import pdfplumber
from PIL import Image
from pytesseract import image_to_string
import io


def extract_text_from_pdf(pdf_file):
    """
    Extract text from a PDF file using pdfplumber.
    
    Args:
        pdf_file (str): Path to the PDF file.
    
    Returns:
        str: Extracted text from the PDF.
    """
    try:
        with pdfplumber.open(pdf_file) as pdf:
            text = "".join([page.extract_text() or "" for page in pdf.pages])
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from PDF: {str(e)}")



def extract_text_from_image(image_file: str, lang: str = "fra"):
    """
    Extract text from an image file using OCR (Tesseract).
    
    Args:
        image_file (str): Path to the image file.
        lang (str): Language code for OCR (default is "eng").
    
    Returns:
        str: Extracted text from the image.
    """
    try:
        with open(image_file, "rb") as f:
            image = Image.open(io.BytesIO(f.read()))
        text = image_to_string(image, lang=lang)
        return text.strip()
    except Exception as e:
        raise Exception(f"Error extracting text from image: {str(e)}")
    

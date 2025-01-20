import io
from PIL import Image
from pytesseract import image_to_string
import pdfplumber
import re 


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
    


def extract_sortie_entree_values(text):
    """
    Extract the values after 'Sortie:' and 'Entrée:' in the given text.
    
    Args:
    - text (str): The input text to search in.
    
    Returns:
    - dict: A dictionary with 'sortie' and 'entree' keys and their corresponding values.
    """
    # Define regex patterns for 'Sortie' and 'Entrée'
    sortie_pattern = r"Sortie:\s*([\w\s]+)"
    entree_pattern = r"Entrée:\s*(\w+)"
    
    # Search for matches
    sortie_match = re.search(sortie_pattern, text, re.IGNORECASE)
    entree_match = re.search(entree_pattern, text, re.IGNORECASE)
    
    # Extract and return the values
    result = {
        "sortie": sortie_match.group(1).strip() if sortie_match else None,
        "entree": entree_match.group(1).strip() if entree_match else None
    }
    return result



# Example Usage   
if __name__ == "__main__":              
    # Specify the PDF path and countries to match stations
    pdf_path = "../NDF/Péages/3 Péage.jpeg"
    txt = extract_text_from_image(pdf_path)
    result = extract_sortie_entree_values(txt)
    print("\nResult:", result)
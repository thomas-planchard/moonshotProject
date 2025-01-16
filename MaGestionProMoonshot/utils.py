import pdfplumber


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

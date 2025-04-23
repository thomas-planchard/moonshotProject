import requests
import json
import pdfplumber
import os
import io
from utils.files_reader import extract_text_from_pdf, extract_text_from_image

def query_ollama_ai(model_name, pdf_text):
    """
    Query the locally installed Ollama AI model to extract travel information.
    
    Args:
        model_name (str): Name of the Ollama model to use
        pdf_text (str): Text content extracted from the PDF
        
    Returns:
        dict: Extracted travel information (departure and arrival details)
    """
    # Ollama API endpoint (default is localhost:11434)
    api_url = "http://localhost:11434/api/generate"
    
    # Craft a prompt that asks the AI to extract specific travel information
    prompt = f"""
    Extract the following information from this travel document:
    1. Departure location (only the city)
    2. Arrival location (only the city )
    
    Format your response as JSON with keys: 'departure_location','arrival_location', 
    
    Here's the document text:
    {pdf_text}
    """
    
    # Prepare the request payload
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        # Make the request to Ollama
        response = requests.post(api_url, json=payload)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Parse the response
        result = response.json()
        
        # Try to extract JSON from the AI's response
        if 'response' in result:
            ai_text = result['response']
            try:
                # Find JSON in the response
                json_start = ai_text.find('{')
                json_end = ai_text.rfind('}') + 1
                if json_start != -1 and json_end != -1:
                    json_str = ai_text[json_start:json_end]
                    return json.loads(json_str)
                else:
                    # If no JSON formatting, try to parse the whole response
                    return json.loads(ai_text)
            except json.JSONDecodeError:
                # If direct parsing fails, we'll extract key information manually
                travel_info = {
                    'departure_location': extract_info(ai_text, 'departure location'),
                    'arrival_location': extract_info(ai_text, 'arrival location'),
                }
                return travel_info
        
        return {"error": "Unable to extract travel information"}
    
    except Exception as e:
        print(f"Error querying Ollama AI: {e}")
        return {"error": str(e)}

def query_ollama_fuel_receipt(model_name, pdf_text):
    """
    Query the locally installed Ollama AI model to extract fuel receipt information.
    
    Args:
        model_name (str): Name of the Ollama model to use
        pdf_text (str): Text content extracted from the PDF
        
    Returns:
        dict: Extracted fuel information (liters and fuel type)
    """
    # Ollama API endpoint (default is localhost:11434)
    api_url = "http://localhost:11434/api/generate"
    
    # Craft a prompt that asks the AI to extract fuel information
    prompt = f"""
    Extract the following information from this fuel receipt:
    1. Number of liters of fuel
    2. Type of fuel (e.g., Diesel, SP95, SP98, E10, etc.)
    
    Format your response as JSON with keys: 'liters', 'fuel_type'
    
    Here's the document text:
    {pdf_text}
    """
    
    # Prepare the request payload
    payload = {
        "model": model_name,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        # Make the request to Ollama
        response = requests.post(api_url, json=payload)
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Parse the response
        result = response.json()
        
        # Try to extract JSON from the AI's response
        if 'response' in result:
            ai_text = result['response']
            try:
                # Find JSON in the response
                json_start = ai_text.find('{')
                json_end = ai_text.rfind('}') + 1
                if json_start != -1 and json_end != -1:
                    json_str = ai_text[json_start:json_end]
                    return json.loads(json_str)
                else:
                    # If no JSON formatting, try to parse the whole response
                    return json.loads(ai_text)
            except json.JSONDecodeError:
                # If direct parsing fails, we'll extract key information manually
                fuel_info = {
                    'liters': extract_info(ai_text, 'liters'),
                    'fuel_type': extract_info(ai_text, 'fuel type'),
                }
                return fuel_info
        
        return {"error": "Unable to extract fuel information"}
    
    except Exception as e:
        print(f"Error querying Ollama AI: {e}")
        return {"error": str(e)}

def extract_info(text, info_type):
    """Helper function to extract specific information from AI text response"""
    lines = text.split('\n')
    for line in lines:
        if info_type.lower() in line.lower():
            # Try to extract the value after a colon or similar separator
            if ':' in line:
                return line.split(':', 1)[1].strip()
            # Fallback to returning the whole line
            return line.strip()
    return None

def get_file_extension(file_path):
    """Get the file extension from a file path."""
    _, extension = os.path.splitext(file_path)
    return extension.lower()

def get_text_from_document(file_path):
    """
    Extract text from a document based on its file extension.
    Supports PDFs and common image formats.
    
    Args:
        file_path (str): Path to the document file
        
    Returns:
        str: Extracted text from the document
    """
    extension = get_file_extension(file_path)
    
    # Process based on file type
    if extension in ['.pdf']:
        return extract_text_from_pdf(file_path)
    elif extension in ['.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.gif']:
        return extract_text_from_image(file_path)
    else:
        raise ValueError(f"Unsupported file format: {extension}")

def get_travel_info_from_pdf(file_path, model_name="mistral", doc_type="travel"):
    """
    Main function to extract information from a document using Ollama AI.
    Supports both PDFs and images.
    
    Args:
        file_path (str): Path to the document file
        model_name (str): Name of the Ollama model to use
        doc_type (str): Type of document ('travel' or 'fuel')
        
    Returns:
        dict: Extracted information based on document type
    """
    # Extract text from document (PDF or image)
    try:
        document_text = get_text_from_document(file_path)
        if not document_text:
            return {"error": "Failed to extract text from document"}
    except Exception as e:
        return {"error": f"Error processing document: {str(e)}"}
    
    # Query Ollama AI to extract information based on document type
    if doc_type.lower() == "fuel":
        return query_ollama_fuel_receipt(model_name, document_text)
    else:
        # Default to travel document processing
        return query_ollama_ai(model_name, document_text)

# Example usage
if __name__ == "__main__":
    # Examples with different file types
    travel_pdf = "NDF/Avions/3. Billet AVION.pdf"
    fuel_receipt_img = "NDF/Essence/01-Essence.jpeg"
    
    # Process a PDF travel document
    # travel_result = get_travel_info_from_pdf(travel_pdf, doc_type="travel")
    # print("Travel Information (from PDF):")
    # print(json.dumps(travel_result, indent=2))
    
    # Process an image fuel receipt
    fuel_result = get_travel_info_from_pdf(fuel_receipt_img, doc_type="fuel")
    print("\nFuel Information (from Image):")
    print(json.dumps(fuel_result, indent=2))

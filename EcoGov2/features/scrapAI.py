import requests
import json
from pypdf import PdfReader
import os
import io
from utils.files_reader import extract_text_from_pdf, extract_text_from_image


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


def query_ollama_trip_ticket(model_name, pdf_text):
    """
    Query the locally installed Ollama AI model to extract trip (flight or train) information.
    """
    api_url = "http://localhost:11434/api/generate"
    prompt = """
        You are a strict extractor  
        Return a JSON object with exactly two fields:\n"
        '  "departure": <the departure location, or null>,\n'
        '  "arrival": <the arrival location, or null>\n'
        "If you can’t find one of them, set it to null. No extra keys."

        Here are examples:

        Invoice:
        ---
        “Ticket Confirmation  
        Passenger: Jane Doe  
        Trip: Flight AA123  
        From: Los Angeles (LAX)  
        To: New York (JFK)  
        Date: 2025-05-10”  
        Answer:
        ```json
        {"departure":"Los Angeles","arrival":"New York"}
        ---
        Here is the document text:
        """ + pdf_text

    payload = {"model": model_name, "prompt": prompt, "stream": False}
    response = requests.post(api_url, json=payload)
    response.raise_for_status()
    result = response.json()
    ai_text = result.get('response', '')
    try:
        json_start = ai_text.find('{')
        json_end = ai_text.rfind('}') + 1
        if json_start != -1 and json_end != -1:
            return json.loads(ai_text[json_start:json_end])
        return json.loads(ai_text)
    except json.JSONDecodeError:
        return {
            'departure': extract_info(ai_text, 'departure'),
            'arrival': extract_info(ai_text, 'arrival'),
        }

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
        doc_type (str): Type of document ('travel', 'fuel', 'train', or 'plane')
                
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
    
    # Query based on document type
    low = doc_type.lower()
    if low in ["fuel", "essence"]:
        result = query_ollama_fuel_receipt(model_name, document_text)
    elif low in ["trains", "train", "avions", "plane", "flight"]:
        result = query_ollama_trip_ticket(model_name, document_text)
    # Attach document type as category
    result["category"] = low
    return result

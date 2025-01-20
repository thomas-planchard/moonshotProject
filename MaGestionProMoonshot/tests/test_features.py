# Example Usage
if __name__ == "__main__":
    # Specify the PDF path and countries to match stations
    pdf_path = "NDF/Trains/Train Paris Cannes.pdf"
    result = process_pdf_with_dates(pdf_path, countries=["FR"])
    print("\nResult:", result)



# Example Usage   
if __name__ == "__main__":              
    # Specify the PDF path and countries to match stations
    pdf_path = "../NDF/Péages/3 Péage.jpeg"
    txt = extract_text_from_image(pdf_path)
    result = extract_sortie_entree_values(txt)
    print("\nResult:", result)   


# Example Usage
if __name__ == "__main__":
    # Specify the PDF path and countries to match stations
    pdf_path = "../NDF/Avions/3. Billet AVION.pdf"
    result = process_pdf_with_dates(pdf_path, countries=["FR", "IT"])
    print("\nResult:", result)


# Example Usage
if __name__ == "__main__":              
    # Specify the PDF path and countries to match stations
    pdf_path = "../NDF/Essence/TotalEssence.jpeg"
    txt = extract_text_from_image(pdf_path)
    result = extract_volume_value(txt)
    print("\nResult:", result)
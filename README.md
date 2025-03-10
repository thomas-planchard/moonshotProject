
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<div align="center">
   <img src="EcoGo/assets/icon.png" alt="Logo" width="100" height="100">
  <h1 align="center">EcoGo API</h1>
  <p align="center">
    A lightweight API to extract receipt data (from train, plane, and fuel tickets) and format it for carbon emissions calculation.
  </p>
</div>

## About the Project

This project is derived from EcoGo mobile app that tracked carbon emissions from daily activities. EcoGo API is designed to process receipts or tickets (in PDF, JPG, or PNG formats) to extract structured data—such as departure and arrival locations, dates, and fuel amounts—needed for calculating CO₂ emissions. The goal is to streamline data integration for carbon clap.

## Key Features

- **Multi-category Support:** Extracts data for trains, planes, and fuel receipts.
- **Flexible Input Formats:** Supports PDF, JPG, and PNG files.
- **Structured JSON Responses:** Returns formatted data compatible with the Carbon Clap calculator.
- **Error Handling:** Uses standard HTTP status codes and error messages.

## Built With

* [![FastAPI][FastAPI-shield]][FastAPI-shield]
* [![Python][Python-shield]][Python-shield]
* [![Tesseract][Tesseract-shield]][Tesseract-shield]
* [![Mistral][mistral-shield]][mistral-shield]


## API Documentation

### Base URL

`https://example-api.com/api/v1`

### Endpoints

#### POST `/extract`

Extracts structured data from a receipt or ticket.

### Request Parameters

| Parameter | Type    | Required  | Description                                                            |
|-----------|---------|-----------|------------------------------------------------------------------------|
| file      | File    | Yes       | Receipt file to process (PDF, JPG, or PNG).                            |
| category  | String  | Yes       | Receipt category (e.g., `trains`, `planes`, `fuel`).                   |
| countries | List    | Optional  | List of country codes to filter results (e.g., `["FR","IT"]`).              |

### Example Requests and Responses

#### Request Example

```bash
curl -X POST https://example-api.com/api/v1/extract \
  -F "file=@/path/to/receipt.pdf" \
  -F "category=trains" \
  -F "countries[]=FR"

```

**Successful Response (Trains)**
```bash
{
  "category": "trains",
  "name_of_trip": "Paris to Lyon",
  "type_of_transport": null,
  "are_kilometers_known": false,
  "departure": "Paris",
  "arrival": "Lyon",
  "number_of_trips": 1
}
```

**Successful Response (Fuel)**

```bash
{
  "category": "fuel",
  "name_of_trip": "fuel",
  "type_of_transport": null,
  "are_kilometers_known": false,
  "number_of_kilometers": 32.0,
  "departure": null,
  "arrival": null,
  "number_of_trips": 1
}
```

**Error Response**

```bash
{
  "detail": "Error processing the file: No valid departure or arrival information found."
}
```

**Getting Started**

To run the API locally:

1.	Clone the repository:

```bash
git clone https://github.com/yourusername/carbon-clap-api.git
cd carbon-clap-api
```

2.	Install dependencies:

```pip install -r requirements.txt```


3.	Run the API server:

```uvicorn main:app --reload```


## License

EcoGo is a proprietary software developed by Thomas Planchard. All rights reserved. Unauthorized use, distribution, or reproduction is strictly prohibited.

## Contact

For general inquiries or partnership opportunities, you can reach me at thomas.planchard@algosup.com.




<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/thomas-planchard/moonshotProject.svg?style=for-the-badge
[contributors-url]: https://github.com/thomas-planchard/moonshotProject/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/thomas-planchard/moonshotProject.svg?style=for-the-badge
[forks-url]: https://github.com/thomas-planchard/moonshotProject/network/members
[stars-shield]: https://img.shields.io/github/stars/thomas-planchard/moonshotProject.svg?style=for-the-badge
[stars-url]: https://github.com/thomas-planchard/moonshotProject/stargazers
[issues-shield]: https://img.shields.io/github/issues/thomas-planchard/moonshotProject.svg?style=for-the-badge
[issues-url]: https://github.com/thomas-planchard/moonshotProject/issues
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: www.linkedin.com/in/thomas-planchard-461782221
[FastAPI-shield]: https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi
[Python-shield]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Tesseract-shield]: https://img.shields.io/badge/Tesseract-292929?style=for-the-badge&logo=tesseract&logoColor=white
[mistral-shield]: https://img.shields.io/badge/Mistral-FF5733?style=for-the-badge&logo=mistral&logoColor=white
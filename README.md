<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
   <img src="EcoGo/assets/icon.png" alt="Logo" width="100" height="100">
  <h1 align="center">Moonshot Project: EcoGo & EcoGo API</h1>
  <p align="center">
    A combined mobile application and lightweight API for tracking carbon emissions from transportation and fuel receipts.
  </p>
</div>

## About

This repository contains two main components:

1. **EcoGo Mobile App** – A React Native/Expo application built with TypeScript for tracking your carbon footprint in real time.
2. **EcoGo API** – A FastAPI/Python service that extracts and processes receipt or ticket data (train, plane, fuel) into structured JSON for carbon emission calculations.

## Project Structure

```
/carbon-clap-api    # FastAPI backend
/EcoGo              # React Native mobile app
```

## Built With

- **EcoGo API**
  
  [![FastAPI][FastAPI-shield]][FastAPI-url]  
  [![Python][Python-shield]][Python-url]  
  [![Tesseract OCR][Tesseract-shield]][Tesseract-url]  
  [![Mistral LLM][Mistral-shield]][Mistral-url]

- **EcoGo App**
  
  [![React Native][RN-shield]][RN-url]  
  [![TypeScript][TS-shield]][TS-url]  
  [![Expo][Expo-shield]][Expo-url]

## Getting Started

### Prerequisites

- Python 3.8+
- pip
- Node.js & npm
- Expo CLI (`npm install -g expo-cli`)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thomas-planchard/moonshotProject.git
   cd moonshotProject
   ```

2. Set up the API:
   ```bash
   cd carbon-clap-api
   pip install -r requirements.txt
   python3 app.py  # Runs the FastAPI server on http://localhost:8000
   ```

3. Set up the Mobile App:
   ```bash
   cd ../EcoGo
   npm install
    npx expo run:ios          # Launches Expo on iOS 
   ```

4. Configure the App to use the local API:
   - Open `EcoGo/FirebaseConfig.ts` or environment settings and set the base URL to `http://localhost:8000`.

## Running the App

- Use Expo Go on your iOS or Android device or an emulator.
- Scan the QR code shown in the terminal or Expo dev tools.

## Testing the API

You can test the extraction endpoint with curl or Postman:

```bash
curl -X POST http://localhost:8000/extract \
  -F "file=@/path/to/receipt.jpg" \
  -F "category=trains" \
  -F "countries[]=FR"
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

EcoGo is proprietary software developed by Thomas Planchard. All rights reserved.

## Contact

For questions or partnerships, reach out at thomas.planchard@algosup.com

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
[FastAPI-url]: https://fastapi.tiangolo.com/
[Python-shield]: https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white
[Python-url]: https://python.org/
[Tesseract-shield]: https://img.shields.io/badge/Tesseract-292929?style=for-the-badge&logo=tesseract&logoColor=white
[Tesseract-url]: https://github.com/tesseract-ocr/tesseract
[Mistral-shield]: https://img.shields.io/badge/Mistral-FF5733?style=for-the-badge&logo=mistral&logoColor=white
[Mistral-url]: https://github.com/mistralai/mistral
[RN-shield]: https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react&logoColor=black
[RN-url]: https://reactnative.dev/
[TS-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://typescriptlang.org/
[Expo-shield]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo
[Expo-url]: https://expo.dev/



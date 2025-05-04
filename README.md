<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
   <img src="EcoGo/assets/icon.png" alt="Logo" width="100" height="100">
  <h1 align="center">EcoGo Corporate</h1>
  <p align="center">
    A comprehensive web platform for businesses to track, manage, and reduce their carbon footprint
  </p>
</div>

## About EcoGo Corporate

EcoGo Corporate is a robust web application built to help businesses measure, monitor, and minimize their carbon emissions from business travel and operations. 

**Key Functions:**
- Centralized carbon tracking dashboard for individuals and departments
- Upload and intelligent analysis of travel and fuel invoices for CO2 calculation
- Trip management system with sharing capabilities across team members
- Department-wide analytics for managers to identify areas for improvement
- Manual carbon entry system for activities without digital records

The platform offers companies a complete solution to understand their environmental impact, make data-driven decisions, and work towards sustainability goals with transparent carbon accounting.

## Project Features

### Dashboard & Analytics
- Interactive data visualizations of carbon emissions by type and time period
- Monthly trend analysis to identify patterns and progress
- Personal and departmental carbon footprint comparisons

### Trip Management
- Create and track business trips with comprehensive details
- Share trips with collaborators within the organization
- Associate multiple invoices and emissions sources to each trip

### Invoice Processing
- Automatic carbon footprint calculation from uploaded invoices
- Support for fuel receipts, plane tickets, and train travel documents
- Historical record of all processed documents

### Department Management
- Manager views for monitoring team-wide carbon metrics
- Identify top emission sources and contributors within departments
- Track departmental sustainability goals and progress

### User Management
- Role-based access control (employee vs. manager)
- Department organization structure
- Personal carbon tracking and history

## Built With

[![React][React-shield]][React-url]  
[![TypeScript][TS-shield]][TS-url]  
[![Tailwind CSS][Tailwind-shield]][Tailwind-url]  
[![Firebase][Firebase-shield]][Firebase-url]  
[![Vite][Vite-shield]][Vite-url]  


## Getting Started

### Prerequisites

- Node.js & npm
- Firebase account (for authentication and database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thomas-planchard/moonshotProject.git
   cd moonshotProject/EcoGoV2WebUi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with necessary environment variables:
   ```
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready to be deployed to your hosting provider of choice.

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
[linkedin-url]: https://www.linkedin.com/in/thomas-planchard-461782221
[React-shield]: https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black
[React-url]: https://reactjs.org/
[TS-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TS-url]: https://typescriptlang.org/
[Tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Firebase-shield]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[Firebase-url]: https://firebase.google.com/
[Vite-shield]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Recharts-shield]: https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=recharts&logoColor=white
[Recharts-url]: https://recharts.org/



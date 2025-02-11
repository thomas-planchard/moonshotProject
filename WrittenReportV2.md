# Project Coordination and Product Development Documentation

**Project Title:**  
Integration of Sustainable Solutions in Film Production

**Partners:**  
- **magestion.pro** – A company dedicated to helping movie producers calculate and manage their carbon footprint.  
- **Moonshot Project (User)** – An initiative exploring innovative methods to simplify carbon emission calculations and enhance sustainability in film production.

---

## 1. Introduction

This document provides an evolving overview of the project’s progress—from initial discussions to technical development and further stakeholder engagements. It captures the collaborative efforts between the Moonshot Project team and magestion.pro, including the initial meetings, ideas for product improvements, academic validation, API development, and technical discussions. The report is designed to align project outcomes with both industry practices and academic requirements for the master degree.

---

## 2. Meeting 1: Initial Contact with Founder

**Date:** October 17, 2024  
**Attendees:**  
- User (Moonshot Project)  
- Marguerite Blank (Founder, magestion.pro)

### Agenda
- Introductions of both parties.
- Presentation of the Moonshot Project.
- Overview of magestion.pro’s activities and strategic roadmap.

### Summary of Discussion
- **Company Mission:**  
  Marguerite Blank presented magestion.pro’s mission focused on assisting movie producers in calculating their carbon footprint and managing related carbon expenses.
- **Future Alignment:**  
  The discussion explored synergies between magestion.pro’s future plans and the Moonshot Project’s innovative approach. Key challenges were identified, and both parties recognized opportunities to enhance the product offering.

### Follow-Up Actions
- A second meeting was scheduled with magestion.pro’s Product Manager on October 29, 2024.
- The Moonshot Project team was tasked with generating ideas to further refine and enhance the product offering.

---

## 3. Ideas for Product Improvement

Based on the initial meeting discussions, several product improvement ideas were proposed to simplify data integration, improve sustainability metrics, and streamline carbon emissions calculations for film projects.

### 3.1 Simplified Data Integration (SNCF Train Ticket Example)
- **Objective:**  
  Streamline the user’s data entry process for transportation and logistics expenses.
- **Proposal:**  
  Develop a feature that retrieves CO₂ emissions data directly from an SNCF train ticket via an API. This would enable users to compare emissions from a train journey with those from a car trip along the same route.
- **Next Steps:**  
  Provide a detailed explanation of this integration during the upcoming meeting.

### 3.2 Location “Eco-Score” System
- **Objective:**  
  Assess and compare the environmental impact of potential filming locations.
- **Proposal:**  
  Create a tool that assigns an eco-score based on factors such as distance, available transportation options, and local infrastructure, recommending the most eco-friendly locations.

### 3.3 Equipment Emissions Analysis
- **Objective:**  
  Evaluate the environmental impact of various filming equipment.
- **Proposal:**  
  Develop an analysis system that compares the CO₂ emissions of equipment (e.g., lighting, cameras, sound systems) and suggests greener alternatives, accompanied by comprehensive emission reports.

### 3.4 Real-Time Carbon Dashboard
- **Objective:**  
  Monitor and manage the carbon emissions of a film project in real time.
- **Proposal:**  
  Create a dashboard, similar to a financial tracker, that displays real-time carbon emissions and alerts users when emissions exceed preset thresholds.

### 3.5 Promoting Virtual Collaboration
- **Objective:**  
  Reduce travel-related emissions through enhanced virtual collaboration.
- **Proposal:**  
  Encourage the use of platforms such as Zoom and Teams during pre-production and post-production, with a tool to quantify CO₂ savings from remote meetings (while accounting for the digital platform’s own emissions).

### 3.6 Total Project Emission Calculation with Compensation Options
- **Objective:**  
  Provide comprehensive insight into a project’s total carbon footprint.
- **Proposal:**  
  Develop a system that calculates total project emissions and suggests compensation strategies (e.g., tree planting or renewable energy investments) to offset unavoidable emissions.

### 3.7 Supplier Ranking Based on Sustainability
- **Objective:**  
  Prioritize and select suppliers based on sustainable practices.
- **Proposal:**  
  Create a ranking system that evaluates suppliers (such as those providing special effects, transport, or costumes) based on their carbon footprints, highlighting environmentally friendly options.

---

## 4. Meeting 2: Discussion on Potential Solutions

**Date:** October 31, 2024  
**Attendees:**  
- User (Moonshot Project)  
- Marguerite Blank (Founder, magestion.pro)

### Agenda
- Review of the proposed product improvement ideas.
- Detailed discussion on potential solutions and overall project direction.
- Planning of subsequent steps and documentation needs.

### Summary of Discussion
- **Attendance Note:**  
  The meeting proceeded without the Product Manager due to an internal issue.
- **Key Discussion Points:**  
  - Various product enhancement strategies were evaluated.
  - A consensus was reached to focus on developing a feature that automates data collection from receipts. The scraped data would be processed via Carbon Clap, a carbon calculator, to simplify the carbon footprint calculation process.
- **Implications:**  
  This approach is expected to streamline data entry and improve the precision of emission calculations, supporting the project’s sustainability goals.

### Follow-Up Actions
- Schedule a meeting with Franck Jeannin to ensure the project’s alignment with final degree requirements.
- Prepare comprehensive documentation detailing the project’s feasibility, technical specifications, anticipated challenges, and academic alignment.

---

## 5. Validation Meeting with School Director

**Date:** Approximately one week after the October 31, 2024 meeting  
**Attendee:**  
- Frank Jeannin – Director, [Name of School]

### Discussion Points
- **Alignment with Academic Objectives:**  
  The meeting’s primary goal was to verify that the product idea—discussed with Marguerite—meets the academic requirements for the master degree.
- **Outcome:**  
  Frank Jeannin reviewed the proposed concept and confirmed its alignment with academic objectives, providing a green light for further development.

---

## 6. API Development Phase (November–December 2024)

During November and December, the project entered its technical development phase with a focus on API construction. Key activities during this period included:

- **Data Integration:**  
  Collaboration with magestion.pro to obtain relevant datasets supporting the API’s functionality.
- **API Build-Out:**  
  The API was developed in accordance with the roadmap outlined during Meeting 2, aiming to automate the extraction and processing of data from various tickets (e.g., train and fuel tickets) for accurate carbon emissions calculation.

---

## 7. Third Meeting with magestion.pro

**Date:** February 4, 2025  
**Attendees:**  
- User (Moonshot Project)  
- Marguerite Blank (Founder, magestion.pro)  
- Product Manager (magestion.pro)

### Agenda
- Presentation and demonstration of the API prototype.
- Discussion of challenges encountered in the current version.
- Exploration of future improvement opportunities.

### Key Discussion Points

#### 7.1 Technical Challenges
- **Incomplete CSV Dependency:**  
  - **Issue:** The API initially relied on a CSV file to determine train ticket arrival and destination points. However, the CSV was incomplete for several train stations, affecting data accuracy.  
  - **Action:** Update and expand the CSV dataset for better coverage.
  
- **Data for “Peace Station”:**  
  - **Issue:** A comprehensive dataset for “peace station” (or similar toll/related stations) is lacking, making integration into the API nearly impossible.  
  - **Action:** Conduct further research and sourcing to acquire or develop the necessary data.
  
- **Limited File Provision:**  
  - **Issue:** The limited number of files provided by magestion.pro restricted the number of tests.  
  - **Action:** Future testing may require additional data sources or an expanded dataset from the company.

#### 7.2 Future Improvements
- **Integration of AI Technologies:**  
  - **Proposal:** Explore AI models (such as ChatGPT or Mistral) to optimize data processing prompts and enhance API functionality. A cost–benefit analysis will assess the feasibility of an economical solution.
  
- **Fuel Ticket Enhancement:**  
  - **Proposal:** Modify the API to extract and identify the type of fuel from fuel tickets—a critical detail for accurate carbon footprint calculations.
  
- **Next Meeting Objectives:**  
  A follow-up meeting is planned for the end of February to:
  - Review findings related to the proposed future improvements.
  - Discuss the overall future direction of the project based on technical feedback and identified challenges.

---

## 8. Conclusion and Next Steps

The project has made significant strides since the initial meetings:

- **Academic Endorsement:**  
  The concept has been validated by Frank Jeannin, confirming its alignment with the master degree requirements.

- **API Progress:**  
  Intensive work during November and December has resulted in an API prototype that, despite facing data integration challenges, has paved the way for technical enhancements.

- **Future Directions:**  
  Discussions in the February meeting identified key areas for enhancement, including:
  - Data completeness and sourcing improvements.
  - Potential integration of AI for prompt optimization.
  - Additional feature requests (e.g., fuel type extraction).

### Next Steps
- Follow up with the scheduled meeting at the end of February to review future improvement findings and discuss the project’s direction.
- Continue refining the API based on technical feedback and expanded datasets.
- Prepare detailed documentation on technical specifications, anticipated challenges, and alignment with academic standards for further review.

This documentation serves as a dynamic record of our collaborative progress and provides a clear roadmap for advancing toward a sustainable, technically robust solution for carbon footprint management in film production.
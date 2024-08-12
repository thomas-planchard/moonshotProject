<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">Technical Specification</h1>
  <p align="center">
    <strong>EcoGo</strong>
    <br />
  </p>
</div>


## 1. Introduction

### 1.1. Audience

This document is primarily intended for:

- Software developer: to understand the user and technical requirements, and to guide decision-making and planning. Help them understand risks and challenges, customer requirements, additional technical requirements and choices made.

Secondary audiences:

- Program manager: to validate against the functional specification and the client's expectations.

- QA: to assist in preparing the Test Plan and to use it for validating issues.

- Project manager: to help identify risks and dependencies

### 1.2. Overview

EcoGo is a mobile application designed to help individuals track and reduce their carbon dioxide (CO2) emissions from everyday activities, particularly focusing on transportation. The app aims to provide users with real-time data on their emissions and incentivize eco-friendly behaviors through gamification and rewards.


### 1.3. Glossary

| Term              | Definition                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Firebase          | A mobile and web application development platform developed by Firebase, Inc. in 2011, then acquired by Google in 2014. |


### 1.4. Objectives 

**Carbon Footprint Tracking**
Users can track their carbon emissions from various transportation modes, including walking, cycling, public transport, and driving.

**Real-time Emission Calculation**
The app calculates carbon emissions in real-time based on GPS data, distance traveled, and transportation mode.

**GPS Navigation and Transportation Mode Selection**
Users can utilize GPS within the app to select a destination, choose their preferred mode of transportation, and receive guided directions to reach their destination.

**Graphical Representation**
Users can visualize their carbon footprint over time through interactive graphs, providing insights into their environmental impact.

As mentioned in the [functional specification](../Functional/FunctionalSpecification.md), the following features will be implemented in a future version of the app as they are not considered essential for the initial release:

-	Gamification: EcoGo will make carbon footprint tracking playful by rewarding users with virtual coins when they reduce their emissions, but this feature will be deferred to a later version.
- In-App Store: The ability for users to redeem coins for discounts and offers on eco-friendly products, carpooling services, and public transportation.
- Multi-language Support: EcoGo will initially support English, with plans to add additional languages in future releases.


### 1.5. Scope

This document will detail all technical aspects of the project, including technical decisions such as the architecture of the app and the technologies used. It will not cover design aspects or user experience considerations, as those decisions are addressed in the functional specification. Additionally, all test strategies and quality assurance details will be included in the separate test plan.

## 2. Requirements

### 2.1. Functional Requirements

**Carbon Footprint Tracking:** 
- Implement a background system that continuously runs within the app to detect the user’s transportation mode, even when the app is not actively in use.
- Develop a tracking mechanism that records the time and distance traveled by the user in various transportation modes, including walking, cycling, public transport, and driving.

**Real-Time Emission Calculation:**
- Create an algorithm that calculates the carbon footprint in real-time. The calculation should be based on the user’s speed and selected transportation mode, ensuring accurate emission data.
- The algorithm should dynamically adjust its calculations based on the detected transportation mode and GPS data.

**GPS Navigation and Transportation Mode Selection:**
- Integrate a navigation system using the Google Maps API, allowing users to select a destination and receive guided directions.
- Provide functionality for users to choose their preferred mode of transportation and display real-time navigation and emission data accordingly.
- Implement detailed and guided navigation, offering step-by-step directions and real-time updates throughout the journey.
-	Develop a system to mimic user movement, allowing for simulated navigation and testing of transportation modes and emission calculations.

**User Interface and Core Application Features:**
- Develop the front-end components of the app, including:
  - **Sign-Up/Sign-In**: User registration and authentication.
  - **Home**: Dashboard displaying carbon footprint stats and relevant user information.
  - **GPS**: Interface for navigation and transportation mode selection.
  - **Store**: (Future version) In-app store for redeeming rewards.
  - **Settings**: User account management, including modifying personal information and preferences.
  - **Profile**: User profile displaying cumulative statistics and achievements.

**Account Management:**
- Implement a system for user account creation, login, and logout.
- Provide features for modifying personal information, such as name, email, password, profile picture, and car information.

**Database Management:**
- Design and manage a database with two primary collections:
  - **User Collection**: Stores user-specific information, including account details and settings.
  - **User Data Collection**: Records data related to users' cars, transportation modes, and carbon emissions.

### Non-Functional Requirements

**Performance:**
- Ensure that the app runs efficiently in the background, with minimal impact on device performance and battery life.
- Maintain a responsive user interface that provides real-time updates without noticeable delay.

**Security:**
- Implement secure user authentication and data storage practices.
- Ensure all data in transit and at rest is encrypted, adhering to best practices for user privacy and security.

**Usability:**
- Design the app to be intuitive and easy to navigate, ensuring that users can effortlessly access all features and functionalities.
- Provide a seamless user experience with clear visual cues and feedback.

### User Stories

1. **As a user, I want to automatically track my transportation activities without manually starting the app, so I can accurately monitor my carbon emissions.**
2. **As a user, I want to receive real-time updates on my carbon footprint while navigating to a destination, so I can make environmentally conscious travel decisions.**
3. **As a user, I want to create an account and manage my personal information within the app, so I can securely use all features and update my profile as needed.**
4. **As a user, I want to see a detailed summary of my transportation habits and carbon emissions over time, so I can assess my environmental impact.**
5. **As a user, I want to select my preferred transportation mode and receive directions via the app, so I can efficiently reach my destination while minimizing my carbon footprint.**



6. Requirements

	•	Functional Requirements: Detailed list of features and functionalities the app must have.
	•	Non-Functional Requirements: Performance, security, usability, and other criteria the app must meet.
	•	User Stories: Scenarios depicting how users will interact with the app.

7. System Architecture

	•	High-Level Architecture: Overview of the system’s architecture, including diagrams.
	•	Component Description: Detailed description of each major component and its responsibilities.
	•	Data Flow: How data moves through the system.

8. Technical Stack

	•	Front-End Technologies: Frameworks, libraries, and tools for the client side.
	•	Back-End Technologies: Server-side technologies, frameworks, and tools.
	•	Database: Type of database, schemas, and any relevant details.
	•	APIs: Internal and external APIs the app will interact with.

9. Detailed Design

	•	User Interface Design: Wireframes, mockups, or UI design details.
	•	Database Design: ER diagrams, table structures, and relationships.
	•	API Specifications: Endpoints, request/response formats, and authentication methods.

10. Implementation Plan

	•	Development Strategy: Agile, Scrum, or other methodologies to be used.
	•	Milestones and Phases: Breakdown of the project into phases with timelines.
	•	Task Allocation: Who will be responsible for what tasks.

11. Testing Strategy

	•	Unit Testing: How individual components will be tested.
	•	Integration Testing: Ensuring components work together.
	•	System Testing: Full system tests before release.
	•	User Acceptance Testing (UAT): Validation by end users.

12. Deployment Plan

	•	Environment Setup: Description of development, staging, and production environments.
	•	Deployment Strategy: Steps and processes for deploying the app.
	•	Rollback Plan: Steps to revert to a previous state in case of issues.

13. Maintenance and Support

	•	Post-Launch Support: How issues will be handled post-launch.
	•	Maintenance Plan: Regular updates, bug fixes, and improvements.

14. Appendices

	•	Glossary: Definitions of terms and acronyms used.
	•	References: Any documents, tools, or resources referenced.

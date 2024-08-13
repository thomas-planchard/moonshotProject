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
  - **User Collection**: Stores user-specific information, including account details.
  - **User Data Collection**: Records data related to users' cars, transportation modes, and carbon emissions.

### 2.2. Non-Functional Requirements

**Performance:**
- The app will utilize background operations and continuous location updates, which are battery-intensive features. The goal is to optimize battery usage and performance to align with industry standards of similar apps like Google Maps or Waze, ensuring that battery consumption remains within a comparable range of approximately 10% relative to those apps.

- In terms of responsiveness, the app will adhere to the following benchmarks as outlined by Robert B. Miller in 1968:
  - **0.1 seconds**: The system should respond within 0.1 seconds to give the user the impression of an instant reaction, with no need for additional feedback.
  - **1 second**: The system should maintain fluidity, with any delays between 0.1 and 1 second being noticeable but not disruptive to the user experience.
  - **10 seconds**: The system should ensure that any operation taking up to 10 seconds provides progress feedback to keep the user engaged. Beyond this threshold, the user may lose focus and shift to other tasks.

**Security:**
- Implement secure user authentication using Google’s Firebase service, which provides built-in protection. Ensure that at no point within the app are Firebase credentials exposed, to protect against potential vulnerabilities.

**Usability:**
- The app will adhere to the design outlined in the functional specification, which has been specifically crafted to keep users engaged and facilitate smooth workflow.

### 2.3. User Stories

1. **As a user, I want to automatically track my transportation activities without manually starting the app, so I can accurately monitor my carbon emissions.**
2. **As a user, I want to receive real-time updates on my carbon footprint while navigating to a destination, so I can make environmentally conscious travel decisions.**
3. **As a user, I want to create an account and manage my personal information within the app, so I can securely use all features and update my profile as needed.**
4. **As a user, I want to see a detailed summary of my transportation habits and carbon emissions over time, so I can assess my environmental impact.**
5. **As a user, I want to select my preferred transportation mode and receive directions via the app, so I can efficiently reach my destination while minimizing my carbon footprint.**


## 3. Technical Stack

### 3.1. Front-End Technologies

The project will be developed using **React Native**. React Native offers several advantages, including:

- **Cross-Platform Development**: Write once, and run on both iOS and Android platforms, significantly reducing development time and effort.
- **Performance**: Near-native performance by using native components directly, which is crucial for mobile applications.
- **Large Ecosystem and Community Support**: Access to a wide range of libraries and tools, along with an active community for support.

**Comparison with Flutter**:
- **React Native** uses JavaScript or TypeScript, which many developers are already familiar with, while **Flutter** uses Dart, a language that may require a learning curve for developers.
- **React Native** allows the use of native components and modules, whereas **Flutter** uses its own rendering engine, which can result in larger app sizes.
- **React Native** benefits from integration with a larger ecosystem of JavaScript libraries, while **Flutter** provides more customizable UI components and smoother animations.

The app will be co-developed using the **Expo** framework, which offers additional advantages:

- **Simplified Development**: Expo provides a set of tools and services that simplify the development process, a fast refresh feature, and built-in support for common features like push notifications and camera access.
- **No Need for Native Code**: With Expo, developers can build and deploy applications without writing native code, which speeds up the development process.
- **Seamless Integration with React Native**: Expo works seamlessly with React Native, allowing developers to start with Expo and "eject" to plain React Native if more customization is needed.

**TypeScript vs. JavaScript**:
- **JavaScript** is a dynamically typed language, meaning that type-checking is done at runtime, which can lead to runtime errors if not carefully managed.
- **TypeScript** is a statically typed superset of JavaScript that allows developers to define types explicitly. This reduces bugs by catching type errors at compile time, improves code readability, and provides better tooling support, such as autocompletion and refactoring.

Given these benefits, **TypeScript** was chosen for the project to ensure a more robust and maintainable codebase.

### Back-End Technologies

The back-end will be managed using **Firestore Database** and **Firestore Storage**:

- **Firestore Database** will store all user-related data. It is a NoSQL database that offers real-time data synchronization and scalability, making it ideal for mobile applications.
- **Firestore Storage** will handle the storage of user profile images. Profile images are not stored directly in the Firestore Database due to its limitations in handling large binary data. Instead, image URLs will be stored in the database, with the actual image files stored in Firestore Storage.

**Database Structure**:
- **Users Collection**:
  - **Document ID**: The user’s ID.
  - **Fields**: `email`, `profileImageUrl`, `userId`, `username`.

- **UserData Collection**:
  - **Document ID**: The same as the user’s ID.
  - **Fields**: `carSize`, `carType`, `totalCarbonFootprint`, `vehicleConsumption`, `userId`.
  
![Database Structure](./Img/databaseStructure.png)

### APIs

The choice to use Google Maps APIs is based on several key factors. Firstly, they are well-documented, which significantly streamlines development and reduces potential issues. Being provided by Google, ensures the assurance of long-term support and stability, minimizing the risk of sudden deprecation. Additionally, Google Maps APIs are highly efficient and reliable, making them an ideal choice for location-based services. Lastly, Google offers a $300 credit for these services, which is particularly beneficial for a school project without revenue, allowing for extensive testing and development without incurring costs.

The app will communicate with these Google Maps APIs:

- **Google Maps Place API**
- **Google Maps Directions v2 API**
- **Google Maps SDK for iOS**

Their usage will be described in detail in their respective section.


1. System Architecture

	•	High-Level Architecture: Overview of the system’s architecture, including diagrams.
	•	Component Description: Detailed description of each major component and its responsibilities.
	•	Data Flow: How data moves through the system.


8. Detailed Design

	•	User Interface Design: Wireframes, mockups, or UI design details.
	•	Database Design: ER diagrams, table structures, and relationships.
	•	API Specifications: Endpoints, request/response formats, and authentication methods.

9.  Implementation Plan

	•	Development Strategy: Agile, Scrum, or other methodologies to be used.
	•	Milestones and Phases: Breakdown of the project into phases with timelines.
	•	Task Allocation: Who will be responsible for what tasks.


10. Deployment Plan

	•	Environment Setup: Description of development, staging, and production environments.
	•	Deployment Strategy: Steps and processes for deploying the app.
	•	Rollback Plan: Steps to revert to a previous state in case of issues.

11. Maintenance and Support

	•	Post-Launch Support: How issues will be handled post-launch.
	•	Maintenance Plan: Regular updates, bug fixes, and improvements.


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">Technical Specification</h1>
  <p align="center">
    <strong>EcoGo</strong>
    <br />
  </p>
</div>


## I. Audience 

This document is primarily intended for:

- Software developer: to understand the user and technical requirements, and to guide decision-making and planning. Help them understand risks and challenges, customer requirements, additional technical requirements and choices made.

Secondary audiences:

- Program manager: to validate against the functional specification and the client's expectations.

- QA: to assist in preparing the Test Plan and to use it for validating issues.

- Project manager: to help identify risks and dependencies

## II. Overview

EcoGo is a mobile application designed to help individuals track and reduce their carbon dioxide (CO2) emissions from everyday activities, particularly focusing on transportation. The app aims to provide users with real-time data on their emissions and incentivize eco-friendly behaviors through gamification and rewards.


## III. Glossary

| Term              | Definition                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Firebase          | A mobile and web application development platform developed by Firebase, Inc. in 2011, then acquired by Google in 2014. |


## IV. Requirements 

**Carbon Footprint Tracking**
Implement a system to track carbon emissions from various transportation modes, including walking, cycling, public transport, and driving.

**Real-time Emission Calculation**
Implement a system to calculate carbon emissions in real-time based on GPS data, distance traveled, and transportation mode.

**GPS Navigation and Transportation Mode Selection**
Users can utilize GPS within the app to select a destination, choose their preferred mode of transportation, and receive guided directions to reach their destination.

**Graphical Representation**
Users can visualize their carbon footprint over time through interactive graphs, providing insights into their environmental impact.

**Gamification**
EcoGo gamifies the carbon footprint tracking experience by rewarding users with virtual coins for reducing their emissions. Coins can be used to unlock rewards in the in-app store.

**In-App Store**
The app features an in-app store where users can redeem coins for discounts and offers on eco-friendly products, carpooling services, and public transportation.

**Multi-language Support**
The app should be available in both English and French.

## 2. **Architecture and System Overview**

- **Platform:** The application will be developed using React Native, allowing for cross-platform compatibility across iOS and Android devices. TypeScript will be used to ensure type safety and enhance code quality.
- **Backend Services:** Firebase will serve as the backend, providing authentication, database, and hosting services. Firestore, a NoSQL database, will be utilized for storing user data and activity logs.
- **APIs and Integrations:**
  - **Location Services:** Utilize native GPS and accelerometer APIs for activity tracking and transportation mode detection.
  - **Social Media Integration:** Allow for sharing achievements on social platforms through respective APIs.
  - **Third-Party Eco-Friendly Stores:** Integration with eco-responsible brands and services will require developing partnerships and APIs for offer retrieval and coin redemption.

## 3. **Functional Requirements**

- **User Authentication:** Implement secure login/logout functionality using Firebase Authentication. Support for email and password-based authentication will be prioritized.
- **Activity Tracking:** Leverage device GPS and accelerometer to detect and record user transportation activities. Include manual entry options for users to input transportation modes and distances.
- **Carbon Emission Calculation:** Develop algorithms based on transportation mode and distance to calculate and display real-time CO2 emissions. Incorporate different factors for various transportation modes, including cars (gasoline, electric), public transit, biking, and walking.
- **Rewards System:** Design a system to award coins based on eco-friendly transportation choices. Implement a backend logic to manage coin allocation, redemption, and tracking of user achievements.
- **EcoGo Store:** Create a marketplace within the app for users to redeem coins for offers from eco-conscious brands. Requires backend support for offer management and user redemption processes.
- **Social Sharing:** Implement functionality for users to share their eco-friendly achievements on social media platforms directly from the app.

## 4. **Non-Functional Requirements**

- **Performance:** Ensure responsiveness and smooth operation across all supported devices. Target a consistent frame rate of 60 FPS for fluid animations and transitions.
- **Scalability:** Design the backend to handle an increasing number of users and data volume. Employ cloud functions and scalable database solutions to manage load effectively.
- **Security:** Adhere to best practices for data encryption, secure authentication, and privacy compliance. Regularly update security measures to protect user data.
- **Compliance:** Ensure the app meets GDPR and other relevant privacy regulations. Implement features allowing users to manage their data, including access, correction, and deletion.

## 5. **Technical Challenges and Risks**

- **Data Accuracy:** Ensuring the precision of GPS and accelerometer data for activity tracking. Mitigation involves implementing calibration techniques and allowing user corrections.
- **User Engagement:** Maintaining user interest over time. Strategies include regular feature updates, personalized content, and community challenges.
- **Partner Integration:** Dependence on third-party brands for the EcoGo store offers. Establish multiple partnerships to diversify offers and reduce risk.

## 6. **Development and Deployment Plan**

- **Milestones:**
  1. Setup development environment and tooling.
  2. Implement user authentication and profile management.
  3. Develop activity tracking and carbon emission calculation logic.
  4. Design and implement the rewards system and EcoGo store.
  5. Integrate social sharing functionality.
  6. Conduct extensive testing across platforms.
  7. Deploy beta version for user feedback.
  8. Release final version and continue iterative development based on user feedback.

- **Testing Strategy:** Employ unit, integration, and UI tests throughout development. Use automated testing tools and conduct beta testing with real users to ensure functionality and usability.

- **Deployment:** Utilize CI/CD pipelines for automated testing and deployment. Plan for staged releases, starting with a beta version to gather user feedback before the full launch.

## 7. **Maintenance and Support**

- **Update Policy:** Regularly release updates for bug fixes, performance enhancements, and new features based on user feedback and market trends.
- **Support Channels:** Establish a support system through email, in-app feedback, and social media to address user concerns and gather suggestions.


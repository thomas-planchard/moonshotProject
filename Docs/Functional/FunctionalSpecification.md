<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">Functional Specification</h1>
  <p align="center">
    <strong>EcoGo</strong>
    <br />
  
  </p>
</div>


## 1. Executive Summary

This document specifies the functional requirements of EcoGo, a mobile application designed to empower individuals to track and reduce their carbon dioxide (CO2) emissions through everyday activities. By integrating real-time tracking, gamification, and rewards, EcoGo encourages environmentally responsible behaviors.

## 2. Background

The development of EcoGo is driven by the global need for actionable steps towards environmental sustainability. It aims to provide users with real-time data on their emissions, offering a tangible way to measure and reduce their carbon footprint. The development is also motivated by the creation of a project that can be used as a final project for the school.


## 3. Stakeholders
| Role | Description |
|----|----|
| **Project Owner** | Thomas Planchard developing EcoGo as a final project for obtaining a diploma. Responsible for all aspects of the project.|
| **Developers** | Thomas Planchard is responsible for developing the entire source code. |
| **Users** | Individuals who download and use the EcoGo application. |


## 1.2 Scope

 EcoGo is designed to cater to people who are environmentally conscious and seek actionable insights into reducing their carbon footprint. The application leverages real-time data tracking, gamification elements, and a reward system to foster sustainable behaviors among its users.

### Objectives:
- **Carbon Footprint Tracking:** To provide users with accurate, real-time tracking of their CO2 emissions based on their transportation modes, utilizing GPS and accelerometer data.
  
- **User Engagement through Gamification:** To incorporate gamification elements such as earning coins, setting personal goals, and completing challenges to increase user engagement and promote sustained usage of the app.
  
- **Eco-Friendly Store System:** To develop a store system where users can spend virtual coins within the app, redeeming them for discounts and offers from eco-responsible brands and services, thereby incentivizing users to make greener choices.
  
- **Suggestions:** To offer user suggestions on reducing their carbon footprint through their transportation choices, for instance by suggesting carpooling or public transportation options.
  
- **Community and Social Engagement:** To integrate social sharing features that allow users to share their achievements and progress in reducing carbon emissions.

## Target Audience:

EcoGo targets tech-savvy individuals who extensively use their smartphones
for daily activities and are committed to environmental sustainability.
This audience actively seeks mobile solutions to monitor and reduce their 
carbon footprint and values intuitive, seamless app experiences. They are 
motivated by rewards that align with their eco-friendly lifestyle choices 
and are accustomed to integrating new apps into their daily routines. This 
group primarily includes young adults to middle-aged users who are 
environmentally aware and looking for ways to contribute to sustainability 
efforts through technology.

## Exclusions:
- The initial release of EcoGo will focus exclusively on iOS devices, with 
  plans for Android and other platforms considered for future updates. The main reason for that is to develop the app as fast as possible and to be able to present it as a final project for the school.

- The scope will initially concentrate on tracking emissions from 
  one or two primary transportation modes, such as driving and cycling, 

- The application will not support store and social network sharing in its 
  initial version; these features are considered superficial for the first version.

## 4. Functional Requirements

### 4.1 User Roles and Permissions

- **User:** Can create an account, log in, track emissions, view statistics, earn and spend coins, and receive offers.

![User Roles and Permissions](../pictures/userAllow.png)

### 4.2 Features and Functionality

#### 4.2.1 Account Creation and Management
- Users can create an account using their email address, setting up a password and profile information (name, surname, picture).
![Account Creation and Management](../pictures/accountDiagram.png)

#### 4.2.2 Dashboard
- Presents current carbon footprint statistics, steps, calories burned, and coins earned.
- Displays offers based on user activity and location, promoting eco-friendly alternatives. Those offers will be in partnership with eco-responsible brands and regional services. The user will be able to see the offers only if he is in the region where the offer is available. Nevertheless, this feature will be simulated in the first version of the app.

- The dashboard will be the first screen that the user will see when he opens the app.

![Dashboard](../pictures/dashboardDiagram.png)

#### 4.2.3 Activity Tracking

Activity Tracking is a core feature of the application, serving as the primary data source for CO2 emission calculations. Two choices will be submitted to the user: automatic detection and manual entry.

- **Automatic Detection:** By granting the app access to the device's GPS and accelerometer, the app can automatically detect and track the user's movement. This feature allows the app to intelligently infer the mode of transportation used and calculate the distance traveled. Automatic tracking is crucial for users who prefer the app to passively monitor their travel and calculate emissions without manual input.

- **Manual Entry:** Users also have the option to manually enter their transportation mode and trip duration. This functionality caters to users who may prefer or need to input their travel details directly, offering flexibility and ensuring that all users can accurately track their carbon footprint regardless of their preference for automatic detection.

Upon detecting a trip, the application generates a pop-up notification the next time the user opens the app. This notification confirms the details of the trip, such as duration (e.g., 20 minutes), distance traveled (e.g., 20 km), and the estimated CO2 emissions (e.g., 30 kg CO2). The user is prompted to confirm these details, ensuring accurate tracking and fostering awareness of their carbon footprint with each trip. 

![Activity Tracking](../pictures/activityDiagram.png)
#### 4.2.4 Emission Calculation
- Calculates real-time CO2 emissions based on transportation mode and distance.
- Offers graphical representation of emissions over time (daily, weekly, monthly, yearly).

#### 4.2.5 Rewards System
- Users earn coins for reducing their carbon footprint, which can be spent in the EcoGo store.

#### 4.2.6 EcoGo Store
- Features eco-responsible brands and restaurant offers.
- Allows redemption of coins for discounts and vouchers.

#### 4.2.7 Social Sharing
- Enables users to share achievements and purchases on social media.

### 4.3 Use Cases

The primary use case involves tracking carbon emissions, earning rewards, and utilizing the in-app store, as detailed in the provided use case scenarios.

## 5. Non-Functional Requirements

### 5.1 Performance
- The application should be responsive and efficient in tracking activities and calculating emissions in real-time.

### 5.2 Security
- User data protection is crucial, employing secure authentication and data storage practices.

### 5.3 Scalability
- Designed to accommodate an increasing number of users and data volume.

### 5.4 Usability
- The app should be user-friendly, with intuitive navigation and accessible information.

## 6. Preliminary Design
- The main app design and user interfaces have been conceptualized, focusing on simplicity and user engagement.

## 7. Technical Requirements

- **Development Platform:** The application will be developed using React Native and TypeScript, utilizing the Expo framework. This choice supports cross-platform compatibility and streamlines development.
- **Backend Services:** Firebase will be used for authentication and data storage, offering scalability and security.

### 2.2 Risks and Assumptions


| Name | Risk | Mitigation Strategy |
| --- | --- | --- |
| **1. User Engagement Risk** | Users may not find the application interesting or may not actively use it. | Implement a captivating gamification strategy with rewards and challenges. Regularly update content to keep users engaged. |
| **2. Store Offers Interest Risk** | Users might not be interested in the offers provided by eco-friendly stores. | Conduct market research to align offers with user preferences. Regularly update and diversify store offerings. |
| **3. Utility Perception Risk** | Users may not perceive the utility of tracking their carbon footprint. | Educate users on the environmental impact of transportation choices. Clearly communicate the benefits of carbon footprint reduction. |
| **4. User Adoption Risk** | Users might not adopt the application for daily use. | Offer an intuitive and user-friendly interface. Provide incentives for daily tracking and participation in challenges. |
| **5. Lack of Similar Applications Risk** | The absence of similar applications might indicate a lack of market demand. | Conduct thorough market analysis to identify potential competitors or gaps in the market. Highlight the unique aspects of EcoGo. |



#### Assumptions

| Assumptions | Validation |
| --- | --- |
| **1. Interest in Eco-Friendly Offers:** Users are interested in eco-friendly offers and discounts. | Monitor user engagement with store offerings and conduct surveys to understand preferences. |
| **2. User Awareness:** Users are not fully aware of their carbon footprint and its impact. | Track user engagement with educational content. Monitor changes in behavior and carbon footprint reduction. |
| **3. Effectiveness of Gamification:** Gamifying the application will enhance user engagement. | Track user participation in challenges and observe trends in app usage. |
| **4. Market Gap:** There is a gap in the market for a user-centric carbon footprint tracking application. | Analyze user reviews, feedback, and adoption rates compared to any potential competitors that may emerge. |
| **5. React Native Suitability:** React Native is a suitable framework for developing the application. | Conduct a thorough analysis of React Native's capabilities and limitations. |
| **6. User Privacy:** Users are concerned about their privacy and data collection. | Implement privacy controls and ensure GDPR compliance. |
| **7. Effectiveness of Social Sharing:** Users will be interested in sharing their achievements on social media. | Monitor user engagement with social sharing features. Conduct surveys to understand preferences. |


## 8. Milestones and Timeline

- **Functional Specification Completion:** [Specify Date]
- **Technical Specification Completion:** [Specify Date]
- **Test Plan Development:** [Specify Date]
- **Minimum Viable Product (MVP) Launch:** June 2024

## 9. Appendices

- Detailed design mockups and wireframes.
  
| Term | Definition |
|----|----|
|CO2 (Carbon Dioxide)| A greenhouse gas emitted through fossil fuel consumption and other activities, contributing to global warming.|
|GPS (Global Positioning System)|A satellite-based navigation system used to determine the device's precise location.
|UI (User Interface)| The graphical layout of an application.
|MVP (Minimum Viable Product)| The version of a product with just enough features to be usable by early customers.

<!-- //## 5. Competitors and Differentiators

### 5.1 Competing Solutions
- No direct competitors identified in the individual carbon footprint tracking and gamification space.

### 5.2 Unique Selling Proposition
- Gamified approach to individual carbon footprint reduction.
- Integration of eco-friendly offers for a holistic approach.

## 6. Compatibility

### 6.1 Platform Compatibility
- Initial release on iOS, followed by Android.

### 6.2 Language Support
- English and French language support.

## 7. Development Tools and Technologies

### 7.1 Technology Stack
<!-- - React Native for cross-platform development.
- GPS and accelerometer integration.

### 7.2 Development Phases
1. Visual/UX Design.
2. Algorithm Development.

## 8. Business Model -->

<!-- ### 8.1 Revenue Model
- Stores pay for placement in the application.

### 8.2 Monetization Strategy
- Revenue generated through store partnerships.

## 9. Risk Management

### 9.1 Identified Risks
1. User disinterest.
2. Lack of interest in store offers.

### 9.2 Mitigation Strategies
1. Continuous UX/UI improvement based on user feedback.
2. Diverse and appealing store offers based on user preferences.

## 10. Timeline

### 10.1 Development Phases Timeline
1. Visual/UX Design: 1 month.
2. Algorithm Development: 2 months.
3. Store Integration: 1 month.
4. Social Aspect Implementation: 1 month. --> -->
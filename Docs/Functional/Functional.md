# EcoGo Functional Specification
- [EcoGo Functional Specification](#ecogo-functional-specification)
  - [1. Project Overview](#1-project-overview)
    - [1.1 Objectives](#11-objectives)
    - [1.2 Use Cases](#12-use-cases)
      - [1.2.1 Actors:](#121-actors)
      - [1.2.2 Preconditions:](#122-preconditions)
      - [1.2.3 Main Flow:](#123-main-flow)
      - [1.2.4 Postconditions:](#124-postconditions)
    - [1.3 Personas](#13-personas)
  - [2. Scope](#2-scope)
    - [2.1 Main Features](#21-main-features)
    - [2.2 Risks and Assumptions](#22-risks-and-assumptions)
      - [Assumptions](#assumptions)
  - [3. Requirements](#3-requirements)
    - [3.1 Functional Requirements](#31-functional-requirements)
      - [3.1.1 User Authentication](#311-user-authentication)
      - [3.1.2 Dashboard](#312-dashboard)
      - [3.1.3 Activity Tracking](#313-activity-tracking)
      - [3.1.4 Carpooling Offers](#314-carpooling-offers)
      - [3.1.5 Store Offers](#315-store-offers)
      - [3.1.6 GPS](#316-gps)
    - [3.2 Non-Functional Requirements](#32-non-functional-requirements)
  - [4. Deliverables](#4-deliverables)
    - [4.1 Application Development](#41-application-development)
    - [4.2 Store Development](#42-store-development)
    - [4.3 Social Aspect Development](#43-social-aspect-development)
  - [5. Competitors and Differentiators](#5-competitors-and-differentiators)
    - [5.1 Competing Solutions](#51-competing-solutions)
    - [5.2 Unique Selling Proposition](#52-unique-selling-proposition)
  - [6. Compatibility](#6-compatibility)
    - [6.1 Platform Compatibility](#61-platform-compatibility)
    - [6.2 Language Support](#62-language-support)
  - [7. Development Tools and Technologies](#7-development-tools-and-technologies)
    - [7.1 Technology Stack](#71-technology-stack)
    - [7.2 Development Phases](#72-development-phases)
  - [8. Business Model](#8-business-model)
    - [8.1 Revenue Model](#81-revenue-model)
    - [8.2 Monetization Strategy](#82-monetization-strategy)
  - [9. Risk Management](#9-risk-management)
    - [9.1 Identified Risks](#91-identified-risks)
    - [9.2 Mitigation Strategies](#92-mitigation-strategies)
  - [10. Timeline](#10-timeline)
    - [10.1 Development Phases Timeline](#101-development-phases-timeline)
    - [10.2 Milestones](#102-milestones)

## 1. Project Overview

### 1.1 Objectives
The primary objective of EcoGo is to provide users with a gamified carbon footprint tracking application. Users can monitor their emissions, get offers for eco-friendly transportation, and earn rewards for reducing their carbon footprint.

### 1.2 Use Cases

The following use case illustrates the primary functionality of the EcoGo application.

#### 1.2.1 Actors:
- **User:** The individual using the EcoGo application.

#### 1.2.2 Preconditions:
- The EcoGo application is installed on the user's iOS device.
- The user has created an account and logged into the application.
- The GPS and accelerometer permissions are granted.

#### 1.2.3 Main Flow:

1. **Open the Application:**
   - The user opens the EcoGo application on their iOS device.

2. **Dashboard Overview:**
   - The user is presented with the dashboard, featuring:
     - Current carbon footprint statistics.
     - Gamification elements like earned coins and achievements.
     - Current step and calorie statistics.
     - Activity tracking like walking, cycling, or driving.
     - Offers from carpooling services, or public transportation providers.

3. **Initiate Tracking:**
   - The user initiates the carbon footprint tracking feature.
   - GPS and accelerometer data are utilized to track the user's movement and calculate carbon emissions.

4. **Select Transportation Mode:**
   - The user selects the mode of transportation (e.g., walking, cycling, public transport, carpooling) for their current activity.

5. **Real-time Emission Calculation:**
   - The application calculates real-time carbon emissions based on the selected transportation mode and distance traveled.
   - The user can view the immediate impact of their choices on the environment.

6. **Steps and Calories Tracking:**
   - Simultaneously, the app tracks the number of steps and estimates calories burned during the activity.

7. **Graphical Representation:**
   - The user can view graphical representations of their carbon footprint changes and health-related data over days, weeks, or months.

8. **Receive Offers:**
   - Based on their tracked activities and reduced carbon footprint, the user receives notifications and offers from eco-friendly stores, carpooling services, or public transportation providers.

9. **Gamification Rewards:**
   - The user earns virtual coins due to the decrease in their carbon footprint.
   - Achieving milestones or completing challenges results in gamification rewards.

10. **Visit the EcoGo Store:**
    - The user explores the in-app store using earned coins.
    - They can redeem coins for offers such as discounts on eco-friendly products, carpooling vouchers, or public transportation passes.

11. **Social Sharing:**
    - The user has the option to share their achievements, and challenges, or store purchases on social media directly from the app.
    - This encourages a social aspect and spreads awareness among friends and family.

#### 1.2.4 Postconditions:
- The user has successfully tracked their carbon footprint for a specific activity.
- Real-time emission data, steps, and calorie information are stored for historical tracking.
- The user has earned coins, explored offers in the store, and potentially made eco-friendly choices based on the application's suggestions.

This use case illustrates how EcoGo provides a comprehensive and gamified experience for users to actively track, understand, and reduce their carbon footprint while gaining tangible rewards and contributing to environmental sustainability.

### 1.3 Personas


**1. Environmental Enthusiast Emily**
   - **Background:**
     - Age: 28
     - Occupation: Environmental Scientist
     - Lifestyle: Active, eco-conscious, enjoys outdoor activities.
   - **Motivations:**
     - Passionate about minimizing her carbon footprint.
     - Enjoys challenges and competitions.
   - **Goals with EcoGo:**
     - Use the app to actively monitor and reduce her carbon footprint.
     - Participate in gamified challenges to earn rewards.
     - Share achievements with friends for added motivation.

**2. Eco-Curious Chris**
   - **Background:**
     - Age: 35
     - Occupation: IT Professional
     - Lifestyle: Tech-savvy, interested in sustainability.
   - **Motivations:**
     - Wants to understand the personal impact on the environment.
     - Open to adopting eco-friendly habits.
   - **Goals with EcoGo:**
     - Track and analyze personal carbon footprint.
     - Use gamification as a motivational tool to make sustainable choices.
     - Explore offers in the store for practical, sustainable living.

**3. Savvy Shopper Sam**
   - **Background:**
     - Age: 25
     - Occupation: Marketing Specialist
     - Lifestyle: Urban, enjoys shopping, values convenience.
   - **Motivations:**
     - Interested in sustainability but seeks practical benefits.
     - Enjoys shopping for eco-friendly products.
   - **Goals with EcoGo:**
     - Monitor carbon footprint effortlessly using the app.
     - Earn rewards to use in the store for practical eco-friendly purchases.
     - Share achievements selectively on social platforms.

**4. Commuter Carla**
   - **Background:**
     - Age: 30
     - Occupation: Sales Representative
     - Lifestyle: Commutes daily, values time and efficiency.
   - **Motivations:**
     - Seeks solutions to reduce emissions during daily commutes.
     - Open to exploring alternative transportation options.
   - **Goals with EcoGo:**
     - Utilize GPS tracking to understand and optimize daily commutes.
     - Receive offers for eco-friendly transportation.
     - Engage with the social aspect to stay motivated.

**5. Family-Focused Fred**
   - **Background:**
     - Age: 40
     - Occupation: Parent and Small Business Owner
     - Lifestyle: Family-oriented, concerned about the future.
   - **Motivations:**
     - Wants to set a sustainable example for the family.
     - Values practical and family-friendly eco-options.
   - **Goals with EcoGo:**
     - Monitor family's overall carbon footprint.
     - Encourage family members to make sustainable choices.
     - Explore family-oriented offers in the store.


## 2. Scope

### 2.1 Main Features

1. **Carbon Footprint Tracking**

Implementation Details:
   - **GPS Integration:**
     - Utilize React Native's Geolocation API for real-time location tracking.
     - Implement background location updates for accurate tracking during trips.
   - **Algorithm for Emission Calculation:**
     - Use environmental data and travel mode to calculate carbon emissions.
     - Integrate emission factors for different transportation modes.
     - Develop an algorithm to provide real-time carbon footprint updates.

---

2. **Gamified Experience**

Implementation Details:
   - **User Profiles:**
     - Implement user profiles to store individual achievements and stats.
     - Utilize local storage or a lightweight backend for profile data.
   - **Achievement System:**
     - Develop a system of achievements for carbon footprint milestones.
     - Create badges and rewards to motivate users.
   - **Challenges:**
     - Design interactive challenges related to carbon reduction.
     - Implement a tracking mechanism for challenge completion.

---

3. **Store with Eco-friendly Offers**

Implementation Details:
   - **Integration with Businesses:**
     - Establish partnerships with eco-friendly stores and transportation services.
     - Integrate their offers into the app's store section.
   - **In-App Currency System:**
     - Implement a virtual currency system (coins) for users to earn.
     - Users can redeem coins for discounts or freebies in partnered stores.

---

4. **Fitness Tracking (Steps and Calories)**

Implementation Details:
   - **Accelerometer Integration:**
     - Use the phone's accelerometer for step tracking.
     - Calculate calories burned based on steps and user profile data.
   - **HealthKit/Google Fit Integration:**
     - Connect with HealthKit (iOS) and Google Fit (Android) for health data.
     - Ensure seamless integration to provide comprehensive fitness stats.

---

5. **Social Sharing**

Implementation Details:
   - **Social Media APIs:**
     - Integrate social media APIs for sharing achievements.
     - Allow users to share their carbon footprint stats on platforms like Facebook or Twitter.
   - **Privacy Controls:**
     - Implement privacy settings for users to control the extent of shared data.
     - Ensure GDPR and user privacy compliance.

---

6. **Language and Platform Support**

Implementation Details:
   - **Internationalization (i18n):**
     - Implement multi-language support for English and French.
     - Use React Native's i18n libraries for seamless language switching.
   - **Cross-Platform Development:**
     - Develop the app initially for iOS using React Native.
     - Ensure compatibility for later expansion to Android.

---

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


## 3. Requirements

### 3.1 Functional Requirements

#### 3.1.1 User Authentication
1. **Login:**
   - Users can log in to the application using their email and password.
   - Users can log in to the application using their Facebook or Google accounts.
    - Users can log in to the application using their Apple ID (iOS only).

2. **Registration:**
    - Users can register for the application using their email and password.
    - Users can register for the application using their Facebook or Google accounts.
    - Users can register for the application using their Apple ID (iOS only).

3. **Forgot Password:**
   - Users can reset their password using their email address.

#### 3.1.2 Dashboard 

1. **Carbon Footprint Tracking:**
   - Users can track their carbon footprint in real-time.

2. **Calories Burned Tracking:**
   - Users can track their calories burned in real-time.
   - Estimates for calories burned during physical activities are provided.

3. **Steps Tracking:** 
   - Users can track their steps in real-time.
   - Users can track their distance traveled in real-time.

4. **Coins Tracking:**
   - Users can track their coins earned in real-time.

#### 3.1.3 Activity Tracking

1. **Transportation Tracking:**
   - Users can track their transportation choices.
   - Users can set their default transportation mode.
   - User can set their transportation mode for each trip.

#### 3.1.4 Carpooling Offers 

1. **Carpooling Offers:**
   - Users can view carpooling offers from partnered services.
   - Users can view carpooling offers from their daily commute.

#### 3.1.5 Store Offers

1. **Store Offers:**
   - Users can view eco-friendly store offers from partnered stores.
   - Users can view store offers based on their location.
   - Users can view store offers based on their preferences.

2. **Store Offer Redemption:**
   - Users can redeem coins for discounts or freebies in partnered stores.

#### 3.1.6 GPS 

1. **Map View:**
   - Users can view their current location on a map.
   - Users can view their current location on a map with a route overlay.

2. **Route Tracking:**
   - Users can track their route in real-time.

### 3.2 Non-Functional Requirements
1. **Performance:**
   - Smooth real-time GPS tracking.
   - Responsive UI for seamless user experience.

2. **Scalability:**
   - Ability to handle a growing user base.

3. **Security:**
   - User data encryption.
   - Secure authentication.

## 4. Deliverables

### 4.1 Application Development
- Prototype with visual/UX design.
- Fully functional EcoGo application.

### 4.2 Store Development
- Integration of eco-friendly store offers.

### 4.3 Social Aspect Development
- Implementation of achievement sharing.
- Friends and family leaderboard.

## 5. Competitors and Differentiators

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
- React Native for cross-platform development.
- GPS and accelerometer integration.

### 7.2 Development Phases
1. Visual/UX Design.
2. Algorithm Development.

## 8. Business Model

### 8.1 Revenue Model
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
4. Social Aspect Implementation: 1 month.

### 10.2 Milestones
- Prototype Completion.
- Application Launch.
- Social Aspect Integration.
- Store Integration.


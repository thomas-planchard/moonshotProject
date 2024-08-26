<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">Technical Specification</h1>
  <p align="center">
    <strong>EcoGo</strong>
    <br />
  </p>
</div>

<details>

- [1. Introduction](#1-introduction)
  - [1.1. Audience](#11-audience)
  - [1.2. Overview](#12-overview)
  - [1.3. Glossary](#13-glossary)
  - [1.4. Objectives](#14-objectives)
  - [1.5. Scope](#15-scope)
  - [1.6. Potential Technical Risks and Challenges](#16-potential-technical-risks-and-challenges)
- [2. Requirements](#2-requirements)
  - [2.1. Functional Requirements](#21-functional-requirements)
  - [2.2. Non-Functional Requirements](#22-non-functional-requirements)
  - [2.3. User Stories](#23-user-stories)
- [3. Technical Stack](#3-technical-stack)
  - [3.1. Front-End Technologies](#31-front-end-technologies)
  - [3.2. Back-End Technologies](#32-back-end-technologies)
  - [3.3 APIs](#33-apis)
- [4. System Architecture](#4-system-architecture)
  - [4.1. File Structure](#41-file-structure)
  - [4.2. File and Directory Purposes](#42-file-and-directory-purposes)
  - [4.3. Step-by-Step Project Setup and Development](#43-step-by-step-project-setup-and-development)
    - [4.3.1 Create the Project](#431-create-the-project)
    - [4.3.2. Install npm and Set Up TypeScript](#432-install-npm-and-set-up-typescript)
    - [4.3.3. Front End](#433-front-end)
    - [4.3.4. Common Setup Issues and Debugging](#434-common-setup-issues-and-debugging)
    - [4.3.5. Authentication and User Management](#435-authentication-and-user-management)
      - [➭ Authentication Context (`AuthContext.tsx`)](#-authentication-context-authcontexttsx)
      - [➭ Sign-In Page (`SignIn.tsx`)](#-sign-in-page-signintsx)
      - [➭ Sign-Up Component (`SignUp.tsx`)](#-sign-up-component-signuptsx)
    - [4.3.6. GPS Navigation and Transportation Mode Selection](#436-gps-navigation-and-transportation-mode-selection)
      - [➭ Install `react-native-maps`](#-install-react-native-maps)
      - [➭ Google Maps API Setup](#-google-maps-api-setup)
      - [➭Display the Map](#display-the-map)
      - [➭ Fetch User Location](#-fetch-user-location)
      - [➭ Get Destination Input](#-get-destination-input)
      - [➭ Route Calculation](#-route-calculation)
      - [➭ Polyline](#-polyline)
      - [➭ Transportation Mode Choice](#-transportation-mode-choice)
      - [➭ Step-by-Step Navigation](#-step-by-step-navigation)
      - [➭ Simulating User Navigation](#-simulating-user-navigation)
    - [4.3.6. Determining The Mode Of Transportation](#436-determining-the-mode-of-transportation)
    - [4.3.7. Carbon Footprint Calculation](#437-carbon-footprint-calculation)
      - [➭ Define Constants](#-define-constants)
    - [➭ Function](#-function)
    - [➭ Usage of the Function](#-usage-of-the-function)
    - [➭ Usage In The Navigation](#-usage-in-the-navigation)
  - [5. Implementation Plan](#5-implementation-plan)
    - [5.1. Development Strategy](#51-development-strategy)
    - [5.2. Milestones and Phases](#52-milestones-and-phases)

</details>


## 1. Introduction

### 1.1. Audience

This document is primarily intended for:

- Software developer: to understand the user and technical requirements, and to guide decision-making and planning. Help them understand risks and challenges, customer requirements, additional technical requirements and choices made.

Secondary audiences:

- Program manager: to validate against the functional specification and the client's expectations.

- QA: to assist in preparing the Test Plan and to use it for validating issues.

- Project manager: to help identify risks and dependencies

### 1.2. Overview

EcoGo is a native mobile application designed exclusively for iOS, aimed at helping individuals track and reduce their carbon dioxide (CO2) emissions from everyday activities, with a particular focus on transportation. The app provides users with real-time data on their emissions and incentivizes eco-friendly behaviors through gamification and rewards.


### 1.3. Glossary

| Term              | Definition                                                                 |
|-------------------|----------------------------------------------------------------------------|
| Firebase          | A mobile and web application development platform developed by Firebase, Inc. in 2011, then acquired by Google in 2014. |
| AuthContext       | A context provider in React that manages authentification state and user data. |
| Backend           | The server-side part of an application that handles data processing, storage, and business logic, usually invisible to users. |
| Frontend          | The client-side part of an application that users interact with, including the user interface and user experience. |
| CI/CD (Continuous Integration/ Continuous Deployment) | A set of practices for automating the integration and deployment of code changes to ensure software is continuously tested and delivered. |
| Decoded Polyline  | A sequence of latitude and longitude coordinates representing a route on a map, encoded to minimize size and decoded for rendering  |
| Loading Spinner   | A UI element that indicates a process is ongoing, often used to show that the application is working or waiting for data. |
| GPS (Global Positioning System) | A satellite-based navigation system that provides location and time information in all weather conditions, anywhere on or near the Earth. |
| Carbon Footprint  | The total amount of greenhouse gases emitted directly or indirectly by human activities, usually expressed in equivalent tons of carbon dioxide (CO2). |


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

### 1.6. Potential Technical Risks and Challenges

1. **Real-Time Data Accuracy**:
   - The accuracy of real-time CO2 emission calculations heavily relies on the precision of GPS data and the correct detection of the user's transportation mode. Inaccurate or delayed data could lead to incorrect emission estimates.

2. **Battery Consumption**:
   - Continuous use of GPS for real-time tracking and updates can significantly impact battery life. This could lead to a poor user experience, especially during long journeys. Optimizing the app to balance data accuracy with battery efficiency is critical.

3. **GPS Signal Availability**:
   - GPS signal strength can be inconsistent, particularly in urban areas with tall buildings, underground locations, or remote regions. This variability could lead to gaps in data, impacting the accuracy of emission tracking and navigation services.

4. **Internet Connectivity**:
   - The app requires a stable internet connection to communicate with APIs for fetching route data, calculating emissions, and updating the user interface. Poor connectivity could hinder the app’s performance, leading to delays or failure in providing real-time updates.

5. **API Limitations and Costs**:
   - Relying on external APIs (e.g., Google Maps API) introduces dependencies on their availability, limits, and potential costs. Exceeding API request limits or experiencing service outages could impact the app's functionality.

6. **User Privacy Concerns**:
   - Continuous tracking of user location and transportation habits could raise privacy concerns. Ensuring that user data is securely handled and providing clear information about data usage is essential to maintain user trust.


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
  - **0.1 seconds**: For all UI elements, such as pop-ups or button clicks, the system should respond within 0.1 seconds to give the user the impression of an instant reaction. At this speed, there is no need for additional feedback as the interaction feels immediate.
  - **1 second**: For actions like changing pages within the app, the system should maintain fluidity. While delays between 0.1 and 1 second may be noticeable, they should not disrupt the user experience.
  - **10 seconds**: For operations that involve downloading, such as fetching a map or uploading a new profile picture, the system should provide progress feedback if the operation takes up to 10 seconds. This helps keep the user engaged, as delays beyond this threshold may cause the user to lose focus and shift to other tasks.

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

### 3.2. Back-End Technologies

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

**Future Growth and Scalability**:

The database structure is designed to handle future growth by separating user data into two collections: `Users` and `UserData`. This separation allows for scalability and flexibility in managing user information. As the app grows, additional fields can be added to these collections to accommodate new features and data requirements, it can also be adapted with indexing strategies to handle large-scale data queries.

**Security and Data Protection**:

- **Authentication**: User authentication will be handled using Firebase Authentication, which provides secure sign-in methods and integrates with other Firebase services.
- **Data Encryption**: Firebase services automatically encrypt data in transit and at rest, ensuring that user data is protected.
- **Access Control**: Firebase Security Rules will be implemented to control access to data and ensure that only authorized users can read or write data.
- **Secure API Keys**: API keys and other sensitive information will be stored securely using environment variables and managed through Firebase security rules.


### 3.3 APIs

The choice to use Google Maps APIs is based on several key factors. Firstly, they are well-documented, which significantly streamlines development and reduces potential issues. Being provided by Google, ensures the assurance of long-term support and stability, minimizing the risk of sudden deprecation. Additionally, Google Maps APIs are highly efficient and reliable, making them an ideal choice for location-based services. Lastly, Google offers a $300 credit for these services, which is particularly beneficial for a school project without revenue, allowing for extensive testing and development without incurring costs.

The app will communicate with these Google Maps APIs:

- **Google Maps Place API**
- **Google Maps Directions v2 API**
- **Google Maps SDK for iOS**

Their usage will be described in detail in their respective section.

**APIs usage/limitations**:

- During the development process, we will monitor the usage of Google API with the help of the Google Cloud console, we will also set up alerts to notify us when we are reaching the limit of the free tier, in case we exceed it we will just use a new account to continue the development till the first one is reset.
- To handle errors or service outages, we will implement a retry mechanism in case of a failed request, we will also display a message to the user in case of a service outage, and we will also monitor the Google status page to be aware of any service outage.



## 4. System Architecture


### 4.1. File Structure

```bash
├── .env
├── .gitignore
├── .watchmanconfig
├── FirebaseConfig.ts
├── app.json
├── babel.config.js
├── global.css
├── metro.config.js
├── package-lock.json
├── package.json
├── tailwind.config.js
├── tsconfig.json
│
├── app/
│   ├── SignIn.tsx
│   ├── SignUp.tsx
│   ├── index.tsx
│   ├── (tabs)/
│   │   ├── Challenges.tsx
│   │   ├── Gps.tsx
│   │   ├── Profile.tsx
│   │   ├── Store.tsx
│   │   └── home/
│   │       └── index.tsx
│   └── screens/
│       ├── InfoUser.tsx
│
├── assets/
│   ├── icon.png
│   ├── animation/
│   ├── icons/
│   └── images/
│
├── components/
│   ├── index.ts
│   ├── common/
│   ├── home/
│   ├── map/
│   ├── profil/
│   └── screens/infoUser/
│   ├── store/
│
├── constants/
│   ├── data.ts
│   ├── icons.ts
│   ├── index.ts
│   └── theme.ts
│
├── context/
│   └── AuthContext.tsx
│
├── ios/
│
└── utils/
    ├── CalculateCarbonFootprint.ts
    ├── MapUtils.ts
    ├── UploadImageToFirebase.ts
    └── UploadModal.tsx
```

### 4.2. File and Directory Purposes

- **`.env`**: This file contains will contain the API key. It will be used to store sensitive information and environment variables securely.

- **`.gitignore`**: Specifies files and directories that should be ignored by Git.

- **`FirebaseConfig.ts`**: Contains the configuration and initialization code for connecting the app to Firebase services, such as authentication and database.

- **`app.json`**: This file holds metadata about the app, including the name, version, and platform-specific settings for React Native.

- **`babel.config.js`**: Configuration file for Babel, a JavaScript compiler that transpiles modern JavaScript syntax for compatibility with older environments.

- **`global.css`**: A global stylesheet that applies base styles across the entire application.

- **`metro.config.js`**: Configuration for Metro, the JavaScript bundler used by React Native.

- **`package-lock.json`**: Automatically generated file that locks the versions of installed dependencies, ensuring consistent installs across different environments.

- **`package.json`**: Contains metadata about the project, including dependencies, scripts, and configurations. It is the core file for managing the Node.js project.

- **`tailwind.config.js`**: Configuration for Tailwind CSS. This file customizes the design system used in the app.

- **`tsconfig.json`**: Configuration file for TypeScript, specifying compiler options and settings that affect the type-checking behavior.

- **`app/`**: 
  - **Pages**: Houses the main pages of the app, and the various tabs under `(tabs)/`. Non-tab pages like `SignIn.tsx` are accessible without authentication, while tab pages are behind the authentication check.
  - **`screens/`**: Stores additional screen components, which are used within the app’s navigation flow.

- **`assets/`**: 
  - **Static Assets**: Contains images, icons, and animations that the app uses to provide visual content.

- **`components/`**: 
  - **Reusable Components**: Contains common, home, map, profile, and store components. Each subfolder organizes components by their usage within different parts of the app, making it easier to maintain and reuse code.

- **`constants/`**: 
  - **App-Wide Constants**: Stores data that should remain consistent across the app, like icon paths (`icons.ts`), theme settings (`theme.ts`), and other standard data (`data.ts`, `index.ts`).

- **`context/`**: 
  - **Authentication State**: Contains the `AuthContext.tsx`, which manages the authentication state.

- **`ios/`**: 
  - **iOS-Specific Files**: Includes files necessary for building and running the app on iOS devices.

- **`utils/`**: 
  - **Utility Functions**: Houses utility functions and helper modules that provide reusable logic and operations used throughout the app.


### 4.3. Step-by-Step Project Setup and Development

#### 4.3.1 Create the Project

To start developing the app, the first step is to create a new project using Expo.
**How to Create an Expo Project**:

1. **Install Expo CLI**: If you haven't already installed Expo CLI, you can do so by running the following command in your terminal:
   ```bash
   npm install -g expo-cli
   ```

2. **Create a New Project**: Once Expo CLI is installed, you can create a new project by running:
   ```bash
   expo init EcoGo
   ```
   During this process, you'll be prompted to choose a template. Select the "blank (TypeScript)" template to start with a basic setup that includes TypeScript support.

3. **Navigate to the Project Directory**:
   ```bash
   cd EcoGo
   ```

#### 4.3.2. Install npm and Set Up TypeScript

**Install npm**:

npm (Node Package Manager) will be used to manage dependencies for the project. It is installed automatically when you install Node.js. If you need to install npm separately, you can do so by following the instructions on the [official npm website](https://www.npmjs.com/get-npm).

To verify if npm is installed, run:
```
npm -v
```

if you need to update npm to the latest version, you can do so by running:
```
npm install -g npm
```

**Configure typescript**

After creating the project with the "blank (TypeScript)" template you'll find a 'tsconfig.json' file in your project root. Customize it to suit your project's need. Here's what we are going to use in our project:

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ],
      "@firebase/auth": ["./node_modules/@firebase/auth/dist/index.rn.d.ts"]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
,   "context/authContext.tsx"  ]
}
```

This configuration ensures that TypeScript is properly set up to work with React Native and Expo.

**Install Required Dependencies:**

Before starting development, make sure to install the necessary dependencies. Here are some you absolutely need

```bash
npm install @react-navigation/native @react-navigation/stack
npm install @reduxjs/toolkit react-redux
npm install react-native-maps
```


#### 4.3.3. Front End

The front-end development of the app will be the most time-consuming part of the project. It involves creating all the pages and components as per the design specifications provided in the functional requirements.

**Important Code Principles**:

- **Folder Naming**: Folder names should be in **lowercase**.
- **Page and Component Naming**: Page and component names should follow the **PascalCase** convention (e.g., `SignIn.tsx`, `SignUp.tsx`).
- **Function Naming**: Function names should use **camelCase** (e.g., `handleLogin`).
- **Constant Naming**: Constants should be named using **UPPERCASE** (e.g., `API_KEY`).

**Developing Pages**:

Each page in the `app` folder should be developed according to the design. For example, the pages within the `(tabs)` folder are protected by the `AuthContext` and should contain the necessary components. Here is an example of how a page should be structured:

```typescript
import React from 'react';
import { View, ScrollView } from 'react-native';
import Dashboard from '../components/home/dashboard/Dashboard';
import Activities from '../components/home/activities/Activities';
import Recommendation from '../components/home/recommendation/Recommendation';

export default function Home() {
  return (
    <View>
      <ScrollView>
        <Dashboard />
        <Activities />
        <Recommendation />
      </ScrollView>
    </View>
  );
}
```

**Breakdown**:

- The `Dashboard`, `Activities`, and `Recommendation` components are each responsible for a section of the screen and should be developed in isolation with their respective directories.
- Ensure each component has its corresponding stylesheet (e.g., `Dashboard.style.ts`) for better modularity and separation of concerns.

**Styling components**:

- Use a centralized theme where possible, and avoid inline styles for better maintainability. Each component should have its own stylesheet file to keep styles modular and reusable.

#### 4.3.4. Common Setup Issues and Debugging

Common Setup Issues and Debugging:

- Expo Not Starting: If Expo fails to start, try clearing the cache with:

``` bash
expo start -c
```

- TypeScript Errors: Ensure that your tsconfig.json is properly set up and matches the project structure. If you encounter type errors, double-check your import paths and module resolutions.
- Dependency Issues: If you encounter issues with dependencies, try reinstalling them or clearing npm's cache:

```bash
npm cache clean --force
npm install
```


#### 4.3.5. Authentication and User Management

The authentication and user management system in the app relies on Firebase services to handle user sign-up, sign-in, and data management. The following components are involved in this process:


##### ➭ Authentication Context (`AuthContext.tsx`)

`AuthContext` serves as the central point for managing user authentication and profile data. It interacts with Firebase services to handle user sign-up, sign-in, and session management. Additionally, it provides methods for updating user data and managing the authentication state across the app.


**Functions and Their Purpose**

1. **`login(email: string, password: string)`**:
   - **Purpose**: Authenticates a user using their email and password.
   - **Implementation**: Uses Firebase's `signInWithEmailAndPassword` function to log the user in. Upon successful login, it updates the global authentication state. Handles errors such as invalid email, user not found, and incorrect password.

2. **`logout()`**:
   - **Purpose**: Logs the user out of the app.
   - **Implementation**: Uses Firebase's `signOut` function to end the user's session. The global authentication state is reset.
  
3. **`register(email: string, password: string, username: string, image: any, userData: any)`**:
   - **Purpose**: Registers a new user and sets up their profile in the database.
   - **Implementation**: 
     - Creates a new user with Firebase Authentication using `createUserWithEmailAndPassword`.
     - Uploads the user's profile image to Firebase Storage and retrieves the image URL.
     - Stores the user’s profile data in the `users` collection and additional data (like car type and size) in the `userData` collection in Firestore.
     - Manages errors such as invalid email format or an email already in use.

4. **`updateUser(newUserData: Partial<User>)`**:
   - **Purpose**: Updates the current user's profile information in Firestore.
   - **Implementation**: 
     - Modifies the relevant fields in both `users` and `userData` collections based on the input provided.
     - Ensures the global state is updated to reflect the latest changes.


5. **`updateUserData(userId: string)`**:
   - **Purpose**: Fetches and updates the user’s data from Firestore after authentication.
   - **Implementation**: 
     - Retrieves documents from the `users` and `userData` collections using `getDoc`.
     - Updates the global state with the retrieved user data.


6. **`onAuthStateChanged`**:
   - **Purpose**: Listens for changes in the user’s authentication state.
   - **Implementation**: 
     - Automatically updates the app’s state when the user signs in or out, ensuring the correct data is loaded or cleared as needed.
     - This function is set up in the `useEffect` hook to monitor authentication state changes and update the `AuthContext` accordingly.

**Error Handling**

**Login Errors**

- **Invalid Email**:
  - If the email format provided by the user is incorrect, the `login` function catches this error, which is returned by Firebase as `auth/invalid-email`. The user is then alerted with the message: `"Invalid email format. Please check your email and try again."`

- **User Not Found**:
  - If the email entered by the user does not correspond to any registered account, Firebase returns an `auth/user-not-found` error. The application will display the following message: `"No account found with this email. Please check your email or sign up for a new account."`

- **Wrong Password**:
  - If the password entered is incorrect, Firebase returns an `auth/wrong-password` error. The user is informed with this message: `"Incorrect password. Please try again or reset your password if you've forgotten it."`

**Registration Errors**

- **Invalid Email**:
  - During the registration process, if the email format is incorrect, the `register` function captures this `auth/invalid-email` error. The user is notified with the message: `"Invalid email format. Please enter a valid email address."`

- **Email Already in Use**:
  - If the email provided during registration is already associated with an existing account, Firebase triggers an `auth/email-already-in-use` error. The application will return this message to the user: `"This email is already in use. Please use a different email or sign in to your existing account."`

**Data Retrieval and Update Errors**

- **Data Retrieval**:
  - If there is an issue retrieving user data from Firestore (e.g., due to network issues or missing documents), the `updateUserData` function will log the error and notify the user with a generic message such as: `"Error fetching your data. Please check your connection and try again."`

- **Data Update**:
  - When updating user data in Firestore, if an error occurs (e.g., permission issues or network errors), the `updateUser` function logs the error and provides feedback to the user. The message could be: `"Failed to update your profile. Please try again later."`
  - If the issue is related to a specific field (e.g., a required field is missing), the error handling will inform the user specifically: `"Failed to update your profile. Please ensure all required fields are filled correctly."`

**Data Flow**

- **User Authentication**:
  - When a user logs in or registers, Firebase Authentication creates or validates the user's credentials. If successful, a session token is generated, and the app uses this token to manage the user's session.
  - The user's data is then fetched from Firestore, updating the `AuthContext` state with the user’s profile and additional data.

- **Data Storage**:
  - **Profile Image**: Uploaded to Firebase Storage and the URL is stored in the `users` collection.
  - **User Data**: Stored in two Firestore collections:
    - `users`: Contains basic user information such as username, email, and profile image URL.
    - `userData`: Stores additional information like car type, car size, consumption, and carbon footprint emission.

- **Session Management**:
  - The `onAuthStateChanged` function ensures that the app's state reflects the current authentication status. When the user logs out, the session is terminated, and the user data is cleared from the app's state.

- **Firebase Operations**:
  - **Sign In**: `signInWithEmailAndPassword` is used for authenticating users.
  - **Sign Up**: `createUserWithEmailAndPassword` is used for creating new users, followed by Firestore operations to store additional profile data.
  - **User Data Update**: `updateDoc` is used to modify user documents in Firestore, while `setDoc` is used for initial document creation.
  - **Profile Image Handling**: Images are uploaded using Firebase Storage APIs, and their URLs are retrieved and stored in Firestore.


![Authentication Context](./Img/authContextFlow.png)

##### ➭ Sign-In Page (`SignIn.tsx`)

**Key Parts**

1. **State Management**
   - **Purpose**: useState allows the component to track changes and trigger a re-render when this state changes. This is useful in our case for updating the UI dynamically, such as showing a loading spinner while the login process is in progress and hiding it once the process is complete.
   - **`loading`**: We need to implement state management to handle the loading state, which will indicate when the login process is in progress.

2. **References**
   - **Purpose**: useRef allows to store and update values without causing the component to re-render. Unlike useState, which triggers a re-render every time the state changes, useRef provides a mutable reference that persists across renders without affecting the UI. This is particularly useful for storing the current values of the email and password fields, which do not need to trigger a re-render of the component every time the user types.
   - **`email`**: Stores the email entered by the user.
   - **`password`**: Stores the password entered by the user.

3. **`handleLogin()` Function**
   - **Purpose**: Handles the login process when the user attempts to sign in.
   - **Implementation Steps**:
     1. Check if both the email and password fields are filled. If not, display an alert message: `"Error: Please fill all the fields"`.
     2. Indicate that the login process is ongoing.
     2. Calls the `login` function from `AuthContext`, passing the email and password.
     3. If the login fails, display an alert with the error message returned from the `login` function (e.g., `"Sign In Error: Invalid email or password"`).

4. **Input Fields**
   - **Email Input**:
     - Captures the user's email address and updates the ref value.
   - **Password Input**:
     - Captures the user's password and updates the ref value.

5. **Sign In Button**
   - **Purpose**: Triggers the `handleLogin` function when pressed.
   - **Loading State**: Displays a loading spinner if `loading` is `true`, otherwise shows the "Sign in" button.

**Data Management**

- **Email and Password Handling**:
  - The email and password are stored.
  - Upon pressing the sign-in button, these values are passed to the `login` function in the `AuthContext`.

- **Login Function**:
  - The `login` function in `AuthContext` interacts with Firebase Authentication to validate the provided credentials. It returns a response indicating success or failure.
  - Based on the response, the `SignIn` component provides feedback to the user, either transitioning to the next screen (on success) or displaying an error message.

- **Error Handling**:
  - The component handles missing input fields by displaying an alert. If Firebase returns an error during the login attempt, it is caught and displayed to the user.


![SignIn Flow](./Img/signInFlow.png)


##### ➭ Sign-Up Component (`SignUp.tsx`)

  1. **State Management**
     Use local state management to handle registration progress, image selection, car details input, and password validation.

  2. **References for Input Fields**
    Use ref hooks to store the user's email, password, confirm password, and username.


 **Function Implementations**

  - **`handleRegister()`:**
    - **Purpose**: To handle the user registration process.
    - **Implementation Steps**:
      1. Validate that all required fields are filled. If any are missing, show an error alert.
      2. Check if the password and confirm password fields match. If not exit the function.
      3. Show the loading indicator.
      4. Construct the `userData` object, including car type, car size, and consumption (if the car is not electric).
      5. Call the `register` function from the authentication context, passing the necessary parameters.
      6. Handle the response from the `register` function. If registration fails, show an alert with the error message.

**Data Flow**

1. **Input Data Collection:**
   - The email, password, confirm password, and username fields collect data via `useRef`. The car type, car size, and consumption fields, as well as the profile image, are managed via `useState`.

2. **Registration Process:**
   - When the user clicks the "Sign Up" button, the `handleRegister` function validates the input, manages the state during the process (loading indicator), and interacts with the authentication context to register the user in Firebase.

3. **User Feedback:**
   - Error handling and feedback are provided via alerts and UI updates, such as showing error messages or hiding the loading indicator upon completion.

![SignUp Flow](./Img/signUpFlow.png)


#### 4.3.6. GPS Navigation and Transportation Mode Selection

The navigation system is one of the most complex tasks in the application. Below are the steps required to build this system:

##### ➭ Install `react-native-maps`
   - Install `react-native-maps` to use Google Maps within the app. Follow the installation guide [here](https://github.com/react-native-maps/react-native-maps/blob/master/docs/installation.md).

##### ➭ Google Maps API Setup
   - **Create a Billing Account**: Set up a billing account with Google Cloud to receive the $300 free credit.
   - **Generate Google Maps API Key**: Enable the following APIs on the generated API key:
     - **Google Maps Place API**
     - **Google Maps Directions v2 API**
     - **Google Maps SDK for iOS**

##### ➭Display the Map
   - **Map Initialization**: Use the `MapView` component from `react-native-maps` to display Google Maps within the app. Ensure to set the `provider` prop to `PROVIDER_GOOGLE` to use Google Maps instead of Apple Maps.

##### ➭ Fetch User Location

The app will first request the user’s permission to access their location using the `expo-location` library. Once permission is granted, it will retrieve the user's current location using `Location.getCurrentPositionAsync` from the `expo-location` library. After obtaining the location, the app will display a marker on the map that corresponds to the user's current position.

![Fetch User Location](./Img/fetchLocation.png)

##### ➭ Get Destination Input

The app will utilize the **Google Maps Places API** to provide autocomplete suggestions based on user input and to fetch detailed information about selected places. When the user inputs a destination, the app will send a request to the Google Maps Places API to retrieve suggestions. The response from the API will look like this: 
```json
{
  "predictions": [
    {
      "description": "Eiffel Tower, Paris, France",
      "structured_formatting": {
        "main_text": "Eiffel Tower",
        "secondary_text": "Paris, France"
      },
      "place_id": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
      "terms": [
        { "value": "Eiffel Tower" },
        { "value": "Paris" },
        { "value": "France" }
      ],
      "types": ["tourist_attraction", "point_of_interest", "establishment"]
    },
    {
      "description": "Eiffel Tower Restaurant, Las Vegas, NV, USA",
      "structured_formatting": {
        "main_text": "Eiffel Tower Restaurant",
        "secondary_text": "Las Vegas, NV, USA"
      },
      "place_id": "ChIJ7bDDEQnEyIAR7_Cf-Lw1GhQ",
      "terms": [
        { "value": "Eiffel Tower Restaurant" },
        { "value": "Las Vegas" },
        { "value": "NV" },
        { "value": "USA" }
      ],
      "types": ["restaurant", "food", "point_of_interest", "establishment"]
    }
  ],
  "status": "OK"
}
```

Once the user selects a destination, another request will be sent to the Places API to fetch detailed information, including the latitude and longitude of the selected place. The response will contain the following data:
```json
{
  "result": {
    "address_components": [
      {
        "long_name": "Eiffel Tower",
        "short_name": "Eiffel Tower",
        "types": ["premise"]
      },
      {
        "long_name": "Champ de Mars",
        "short_name": "Champ de Mars",
        "types": ["route"]
      },
      {
        "long_name": "7th arrondissement",
        "short_name": "7th arrondissement",
        "types": ["sublocality_level_1", "sublocality", "political"]
      },
      {
        "long_name": "Paris",
        "short_name": "Paris",
        "types": ["locality", "political"]
      },
      {
        "long_name": "Île-de-France",
        "short_name": "IDF",
        "types": ["administrative_area_level_1", "political"]
      },
      {
        "long_name": "France",
        "short_name": "FR",
        "types": ["country", "political"]
      },
      {
        "long_name": "75007",
        "short_name": "75007",
        "types": ["postal_code"]
      }
    ],
    "formatted_address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    "geometry": {
      "location": {
        "lat": 48.8583701,
        "lng": 2.2944813
      },
      "viewport": {
        "northeast": {
          "lat": 48.8597190802915,
          "lng": 2.295830280291502
        },
        "southwest": {
          "lat": 48.8570211197085,
          "lng": 2.293132319708498
        }
      }
    },
    "place_id": "ChIJLU7jZClu5kcR4PcOOO6p3I0",
    "types": ["tourist_attraction", "point_of_interest", "establishment"]
  },
  "status": "OK"
}
```

 This geolocation data will be crucial for calculating routes in the next part.

**Key Functionalities**

1. **Fetching Place Suggestions**
   - **`fetchSuggestions` Function**:
     - **Purpose**: Fetches place suggestions from the Google Maps Places Autocomplete API based on user input.
     - **How It Works**:
       1. The user begins typing a destination in the search input field.
       2. The app sends a request to the Google Maps Places API, including the user's current location and input text.
       3. The API returns a list of place suggestions, which are sorted to favor places within the user's current country.
       4. The sorted suggestions are stored and displayed in a list below the input field.


![Fetch Place Suggestions](./Img/inputLocation.png)

1. **Handling Place Selection**
   - **`handleSuggestionPress` Function**:
     - **Purpose**: Handles the event when a user selects a place from the suggestions list.
     - **How It Works**:
       1. The user selects a suggestion from the list.
       2. The app sends a request to the Google Maps Places Details API using the place_id of the selected suggestion.
       3. The API returns detailed information, including the latitude and longitude of the selected place.
       4. Once the destination is set, the app triggers the funtion to calculate the route (described in the next part).

![Handle Place Selection](./Img/suggestion.png)

3. **How the request are sent**
   - **Fetch Suggestions Request**:
     - **URL**: `https://maps.googleapis.com/maps/api/place/autocomplete/json`
     - **Parameters**: `input` (user input), `location` (user's current location), `key` (Google Maps API key).
   - **Fetch Details Request**:
     - **URL**: `https://maps.googleapis.com/maps/api/place/details/json`
     - **Parameters**: `place_id` (selected place ID), `key` (Google Maps API key).

4. **Sequence of Operations**
![Sequence diagram](./Img/sequenceDiagramDestination.png)

1. **Schema of how many requests are sent**

![Schema](./Img/requestSchema.png) 

##### ➭ Route Calculation

Once the destination is identified, the app needs to calculate the route between the user's current location and the destination. To achieve this, the latitude and longitude coordinates from both the user's location and the destination will be used. As specified in the functional requirements, the app must provide the user with options to choose between four transportation modes: DRIVE, WALK, TRANSIT, and BICYCLE.
Each time the user enters a destination, the app will need to make four API requests, one for each of the four transportation modes. The app will use the Google Maps Directions API to retrieve the route information.

Upon receiving the response from the API, the app must analyze the data. The typical structure of a response includes details like route distance, duration, and encoded polyline data that represents the route path. Here's an example of what a response might look like:

```json
{
  "routes": [
    {
      "legs": [
        {
          "distance": {
            "text": "12.3 km",
            "value": 12300
          },
          "duration": {
            "text": "15 mins",
            "value": 900
          },
          "steps": [
            {
              "travel_mode": "DRIVING",
              "start_location": {
                "lat": 37.7749295,
                "lng": -122.4194155
              },
              "end_location": {
                "lat": 37.7894068,
                "lng": -122.4109767
              },
              "polyline": {
                "points": "a~l~Fjk~uOwHJy@P"
              },
              "duration": {
                "value": 180,
                "text": "3 mins"
              },
              "distance": {
                "value": 1000,
                "text": "1.0 km"
              }
            }
            // additional steps...
          ]
        }
      ],
      "overview_polyline": {
        "points": "a~l~Fjk~uOwHJy@P"
      }
    }
  ]
}
```

In the response, the encoded polyline under `overview_polyline.points` needs to be decoded to draw the route on the map. The app will also store all the steps provided under the `legs` array to enable guided navigation for the user.


**Key Steps**

1. **Prepare Origin and Destination Objects**:
   - The function should begin by preparing the origin and destination objects. The origin is constructed using the user's current location, while the destination is constructed using the latitude and longitude coordinates derived from the user's input.
   

2. **Define Travel Modes**:
   - Then the function should calculate routes for the different travel modes. Each mode will be processed in a loop, where a separate request is made for each mode.


3. **Create API Request for Each Travel Mode**:
  For each travel mode, the function should construct a request body for the API request. The request body should include the following information:

  - `origin`: The starting location of the user.
  - `destination`: The target destination coordinates.
  - `travelMode`: One of the four modes (DRIVE, WALK, TRANSIT, BICYCLE).
  - `routeModifiers`: Options provided by Google to customize the route. In this case, all options (`avoidTolls`, `avoidHighways`, `avoidFerries`) are set to `false`, as we are not focusing on these details at this stage.
  - `computeAlternativeRoutes`: Set to `false` to focus on the primary route.
  - `languageCode`: Set to `'en-US'` since the app is currently focused on English.
  - `units`: Set to `'METRIC'` to receive distances in metric units.

  To optimize the API response and avoid unnecessary data, the function should also specify a `fieldMask`. This limits the response to only include the necessary information: `'routes.distanceMeters,routes.duration,routes.legs,routes.polyline.encodedPolyline'`.

  The request body would look like this:

  ```javascript
  const requestBody = {
    origin,
    destination: destinationObj,
    travelMode: mode,
    routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
    computeAlternativeRoutes: false,
    languageCode: 'en-US',
    units: 'METRIC',
  };
  ```

4. **Send API Request**:
   - The app constructs a POST request to the Google Maps Directions API using the built request body and the API key. To handle the multiple travel modes, all the requests are stored in an array. The array of requests is then executed using Promise.all, which sends all the requests simultaneously. This approach ensures that all route details for the different travel modes are retrieved efficiently.

   ```javascript
     `https://routes.googleapis.com/directions/v2:computeRoutes?key=${GOOGLE_MAPS_APIKEY}`,
     requestBody,
     {
       headers: {
         'X-Goog-FieldMask': fieldMask,
       },
     }
   ```

5. **Parse API Response**:
   - Upon receiving the response, the app will check if the response contains valid route data. If a valid route is found, it extracts key details such as the route's distance, duration, and encoded polyline.
   - The encoded polyline is decoded with a function into an array of coordinates representing the route(explanation below). Additionally, the app will also store the detailed steps of the route for later use in navigation.
   - This process will be repeated for all four travel modes. The results will be stored temporarily in the app, it will be helpful when presenting the user with the choice of transportation modes.

    **Decode Polyline**:

    The purpose is to convert a polyline string, which is an encoded sequence of latitude and longitude points, into an array of decoded points that represent a path on a map. It is a format returned by Google Maps APIs, where the route is provided in a compressed format to save space.

    **Initialization**: 
      - The function initializes an empty array to store the decoded coordinates.
      - It sets up variables to track the current position in a string, the total length of the string, and the current latitude and longitude values.

    **Decoding Loop**:
      - The function loops through the encoded string, processing each character to extract the latitude and longitude values.
      - For each coordinate (latitude or longitude), it decodes the characters by:
        - Adjusting each character by subtracting 63 (the offset used by Google to encode).
        - Accumulating the bits of the decoded value.
        - Handling continuation bits (characters with a value of 0x20 or higher) until the entire value is decoded.
      - It then applies ZigZag decoding to get the actual latitude or longitude difference and updates the current latitude or longitude.

    **Building Points Array**:
      - The decoded latitude and longitude are scaled back to their original values (dividing by 1e5) and stored in an array as objects with `latitude` and `longitude` properties.

    **Returning the Result**:
      - The function returns the array, which now contains the sequence of coordinates representing the polyline as a series of latitude and longitude pairs.

    ![Decode Polyline](./Img/decodePolyline.png)

6. **Handle Errors**:
   - If the API request fails or if the response does not contain a valid route, the function will handle this by adding a placeholder with 'Not available' for distance and duration.

7. **Store and Display Routes**:
   - After processing all travel modes, the app stores the route options and makes them available for the user to choose their preferred mode of transportation. The app also stores the detailed steps for all modes, allowing for guided navigation.

![Route Calculation](./Img/getRoute.png)

##### ➭ Polyline

The `<Polyline />` component is used to draw a line on the map that connects multiple geographic coordinates (latitude and longitude pairs). This component will be essential for visualizing the route between the user's current location and the destination. The polyline will represent the path that the user should follow to reach their destination. The component should be inserted inside the `<MapView />` component because it is responsible for rendering the route or path on the map. The `<MapView />` component provides the map itself, and the `<Polyline />` is used to draw the line that represents the route on this map. By placing the `<Polyline />` inside `<MapView />`, the polyline is correctly overlaid on the map at the specified coordinates.

The component has a few essential props that we need to set to define the appearance and shape of the polyline:

**Input Data**:

- **`coordinates`**: This prop expects an array of objects, where each object contains `latitude` and `longitude` properties. These coordinates define the points that the polyline will connect in order. The `coordinates` array is the most essential input, as it determines the shape and position of the polyline on the map. We get the coordinates from the API response that provides the route details.
  
  Example:
  ```javascript
  const routeCoords = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.78925, longitude: -122.4314 },
    { latitude: 37.79025, longitude: -122.4304 },
  ];
  ```

- **`strokeColor`**: This prop sets the color of the polyline. It takes a string representing a color value, for the app it will be this one `"blue"`, `"#FF0000"`.

- **`strokeWidth`**: This prop sets the thickness of the polyline. It takes a number that represents the width of the line in pixels. For the app, it will be set to `10`.


##### ➭ Transportation Mode Choice

At this stage, the application should have stored the polyline data and essential information for the four transportation modes: driving, walking, cycling, and transit. The next step is to allow the user to choose their preferred transportation mode through a user interface element called a **modal**.

**What is a Modal?**

A **modal** is a pop-up window or dialog that overlays the current screen content without navigating away from it. The modal will overlay the map and display the available transportation modes for the user to select.

**How It Works**
  The modal will be triggered when the user has decided his destination and validated it. It will appear on the screen, overlaying the map, while still allowing the map to be visible in the background. The modal will contain a list of transportation modes, each accompanied by an icon, duration, and distance.

**Key steps**

1. **Display the Modal:**
   - The modal will appear on the screen, overlaying the map. It is triggered when the user is ready to choose a transportation mode.
   - The modal contains a list of the four transportation modes, each with an icon, duration, and distance.
   - Use the `Modal` component from React Native to create the modal. Set it to slide in with transparency, ensuring it overlays the map without obstructing the background.

2. **Key Functions:**

   - **onSelectedMode**: Updates the selected transportation mode when the user taps on one of the options in the modal. This selection will immediately update the map to show the route corresponding to the selected mode.
   - **onConfirm**: Finalizes the user’s selection of the transportation mode. After the user confirms their choice, the modal closes, and the app transitions into the guided navigation phase.
 - 

3. **Rendering the Options:**

- The modal will use a `FlatList` component to render the available transportation options. Each option will include:
  - An icon that visually represents the mode of transport.
  - The duration and distance associated with the route for that mode.
  - An indicator that highlights the currently selected mode.
- When the user selects an option, the map will update to display the route corresponding to the chosen mode.
  
4. **Confirming the Choice:**

   - The modal includes a "Confirm" button that the user presses after selecting their preferred transportation mode. Upon confirmation, the selected mode is locked in, the modal closes, and the app transitions into the guided navigation phase.

![Transportation Mode Choice](./Img/transportationMode.png)


##### ➭ Step-by-Step Navigation

After the user selects a destination and confirms their mode of transportation, the trip to the destination begins, and the app will provide guided directions. The guided navigation relies on the steps stored during the route calculation. These steps contain detailed instructions for each segment of the journey, guiding the user through the route.
Each step in the navigation process includes detailed instructions. Here is an example of how the steps are structured:

```json
{
  "steps": [
    {
      "distanceMeters": 100,
      "staticDuration": "PT1M",
      "navigationInstruction": {
        "instructions": "Head north on Main St",
        "maneuver": "turn-left"
      },
      "endLocation": {
        "latLng": {
          "latitude": 37.7749,
          "longitude": -122.4194
        }
      }
    },
    {
      "distanceMeters": 200,
      "staticDuration": "PT2M",
      "navigationInstruction": {
        "instructions": "Turn right onto 1st St",
        "maneuver": "turn-right"
      },
      "endLocation": {
        "latLng": {
          "latitude": 37.7750,
          "longitude": -122.4195
        }
      }
    }
  ]
}
```

**Breakdown of the Step Structure**:

1. **distanceMeters**: The distance for this particular segment of the journey, measured in meters.
2. **staticDuration**: The estimated time to complete this segment, in ISO 8601 duration format.
3. **navigationInstruction**: This object contains the detailed directions for the step:
   - **instructions**: A string providing the textual directions for the user (e.g., "Turn left onto 1st St").
   - **maneuver**: Describes the type of movement required (e.g., "turn-left", "straight").
4. **endLocation**: The latitude and longitude coordinates marking the end of this step.


To guide the user during navigation, the app will display an instruction on the screen that includes three key pieces of information:
 - Turn Direction Icon: An icon indicating the direction the user needs to turn (e.g., left, right, straight).
 - Street Name: The name of the street or path where the user needs to turn or continue. This information is extracted from the navigation instructions provided by the step data.
 - Distance to Next Instruction: The distance in meters between the user’s current location and the next maneuver. This distance will update in real-time as the user moves.


In addition to the guided navigation instructions, the app will display a summary of the journey at the bottom of the screen. This summary includes:
 - The estimated total duration of the trip is calculated based on the selected mode of transportation and the route provided by the Google Maps API.
 - The distance left to travel is displayed in kilometers. This is dynamically updated as the user progresses along the route.
 - The estimated time left to reach the destination, which is also updated in real-time as the user moves closer to their destination.

**Key Components**:

1. **`getTurnDirection` Function:**
   - This function will interpret the `maneuver` property from the navigation instructions and return the corresponding icon that visually represents the action the user needs to take. Here is the list of possible maneuvers and their corresponding icons:
     - **turn_slight_left**: `arrow-top-left` (MaterialCommunityIcons)
     - **turn_sharp_left**: `arrow-bottom-left` (MaterialCommunityIcons)
     - **turn_slight_right**: `arrow-top-right` (MaterialCommunityIcons)
     - **turn_sharp_right**: `arrow-bottom-right` (MaterialCommunityIcons)
     - **uturn_left**: `arrow-u-down-left` (MaterialCommunityIcons)
     - **uturn_right**: `arrow-u-down-right` (MaterialCommunityIcons)
     - **straight / continue / name_change / depart / head**: `arrow-up` (MaterialCommunityIcons)
     - **merge**: `merge` (MaterialCommunityIcons)
     - **ramp_left**: `ramp-left` (MaterialIcons)
     - **ramp_right**: `ramp-right` (MaterialIcons)
     - **fork_left**: `fork-left` (MaterialIcons)
     - **fork_right**: `fork-right` (MaterialIcons)
     - **ferry**: `ferry` (MaterialCommunityIcons)
     - **roundabout_left**: `roundabout-left` (MaterialIcons)
     - **roundabout_right**: `roundabout-right` (MaterialIcons)
     - **turn_left**: `arrow-left-top` (MaterialCommunityIcons)
     - **turn_right**: `arrow-right-top` (MaterialCommunityIcons)
   - The function will use a switch statement to match the maneuver string (e.g., 'turn_left', 'turn_right') with an appropriate icon from the `MaterialIcons` or `MaterialCommunityIcons` libraries.
   - If the maneuver type is recognized, the function returns a TSX element representing the icon. If not, it returns `null`.

---

2. **`getStreetName` Function:**
   - This function will extract the street name or key destination from the instruction text using a regular expression.
   - The regex looks for keywords like "onto", "on", "towards", or "Continue onto" and captures the subsequent text, which is typically the street name or route.
   - If a match is found, the function returns the street name. Otherwise, it returns the full instruction.

---

3. **`updateInstructions(newLocation)` Function**
   
  This function will be responsible for updating the navigation instructions based on the user's current location. It continuously checks the user's position and compares it with the next step in the journey.

  **Data Managed:**
  - The user's current GPS coordinates.
  - Reference to the list of steps in the current route, containing all the navigation instructions.
  - The final destination coordinates.
  - The calculated distance between the user's current location and the end of the current navigation step.
  - A state setter function to update the distance to the next instruction.
  - A state setter function to update the current instruction displayed to the user.
  - State setters for updating remaining distance, time, and estimated arrival time.

  1. **Initial Checks**: 
    - The function starts by verifying if a destination is set and if there are any remaining steps in the route.
    - If either is missing, the function returns early, doing nothing further.

  2. **Current Step Data**:
    - The function retrieves the current step, which represents the next set of instructions the user needs to follow.
    - It then calculates the distance from the user's current location to the end location of the current step.

  3. **Distance Calculation**:
    - A function will be needed to calculate the distance between the user's current coordinates and the step's end coordinates.
    - If the user is within the defined threshold (10 meters), it considers the step completed and moves to the next step in the list by removing the completed step from the list.

  4. **Next Step Preparation**:
    - The function prepares the next instruction to be displayed by setting the distance to the next step and identifying the maneuver.
    - If the user has reached the final step, it sets the instruction to indicate that the user has arrived at their destination.

  5. **Update Display**:
    - Finally, the function updates the state with the new instructions and calls `updateRemainingDistanceAndDuration` to adjust the remaining travel data.

![update Instruction](./Img/updateInstruction.png)

---

4. **`updateRemainingDistanceAndDuration()`**

This function will recalculate the total remaining distance and duration to the destination. It helps the app provide the user with up-to-date information on how far they still need to travel and how long it will take.

**Data Managed:**
- A reference to the list of steps remaining in the current route.
- The total distance left to travel.
- The total time remaining to reach the destination.
- State setters for updating the UI with the latest distance, time, and arrival estimates.

1. **Initialization**:
   - The function initializes two variables, to handle the distance and the time.

2. **Iterate Over Remaining Steps**:
   - It loops through all remaining steps, accumulating the total distance and duration left to travel.
   - The distance is summed up in meters, and the duration is summed up in seconds.

3. **Convert and Format**:
   - The total remaining distance is converted from meters to kilometers (if necessary) and formatted as a string for display.
   - The total duration is converted from seconds to a formatted time string ("2h45").

4. **Calculate Arrival Time**:
   - The function calculates the estimated arrival time based on the current time plus the remaining duration.

5. **Update State**:
   - Finally, it updates the state with the calculated total distance, duration, and arrival time so that this information can be displayed to the user.

![update Remaining Distance](./Img/updateDistance.png)

##### ➭ Simulating User Navigation

The purpose of simulating the user’s trip within the app is to address the challenge posed by the inability to directly install the app on an iPhone during development. While Expo provides a solution that allows developers to run the project on an iPhone via the Expo Go application, this setup works like a server-client relationship. The server must be started on the computer, and the app runs on the iPhone. If the network connection between the devices is lost, the app will shut down, making it difficult to test features like a navigation system.

To overcome this challenge, simulating the user’s trip within the app provides a reliable method for testing and ensuring that the navigation system behaves correctly, even when an actual GPS signal or network connection isn’t available.

**How the Simulation Works**

The function `startRouteSimulation` will be central for this feature. It will be designed to simulate the user's journey along a predefined route, updating the user's location at regular intervals as if they were moving in real-time. This approach allows the navigation system to be tested in a controlled environment.

**Data Required**
- An array of coordinates representing the path of the selected route.
- A fixed value representing the simulated speed of the user in meters per second.

**Purpose**
- The function mimics the user's movement by calculating new locations along the route based on the provided speed.
- The function regularly updates the user's location and navigation instructions, allowing for real-time testing of the navigation feature.

**Function Overview**

1. **`startRouteSimulation`**:
   - **Input Data**:
     - The sequence of latitude and longitude points that define the route.
     - The user's simulated speed, in meters per second.
   - **Process**:
     - The function calculates the user’s new position along the route at regular intervals (every second).
     - It updates the location and recalculates the remaining distance and duration of the trip.
     - The `updateInstructions` function is called to update the turn-by-turn directions based on the new simulated location.
   - **Output**: The user’s location, navigation instructions, and trip summary are continuously updated as the simulation progresses.

![Simulate Navigation](./Img/mimicLocation.png)


#### 4.3.6. Determining The Mode Of Transportation

To calculate the carbon footprint of a user's journey, the app must first determine the mode of transportation being used. The app will utilize built-in sensors such as GPS, accelerometer, and gyroscope to detect the user's movement and infer the mode of transportation based on the data collected. Notably, these data are processed in real-time and are not stored in the database. The following steps outline how the app will handle transportation mode selection:

1. **Sensor Data Collection**:
   - The app will collect sensor data, including GPS location, accelerometer readings, and gyroscope data, to monitor the user's movement patterns.
   - GPS data provides location information, while the accelerometer and gyroscope data determine the user's speed, acceleration, and orientation.
   - To maintain efficiency, GPS data will be updated every 10 seconds, and accelerometer and gyroscope data will be sampled at a frequency of 50 Hz, balancing the need for accuracy with battery conservation.
   - The app will run these processes in the background, allowing it to continuously monitor transportation modes without requiring the user to keep the app active on the screen.
2. **Data Processing**:
   - The collected sensor data will be processed to identify patterns associated with different modes of transportation.
   - An algorithm will analyze the data to distinguish between walking, cycling, driving, and public transportation based on factors such as speed, acceleration, and movement patterns.
    ![Data Processing](./Img/detectionAlgorithm.png)
3. **Limitations and Considerations**:
   - The app will account for scenarios where multiple modes of transportation are detected within a single journey. However, only those modes where the distance traveled exceeds 100 meters will be considered. If the user switches between several transportation modes without reopening the app, they will be prompted to review and confirm these activities the next time they open the app.
   - The activity tracking data will be stored locally in the app’s cache until the user reopens the app. Upon reopening, the user will be prompted to review and confirm or dismiss the detected activities. Once the user has made their selection, the cache will be cleared to prevent the app from being overloaded with non-relevant information.
  
**Why Use GPS Alongside Accelerometer and Gyroscope?**

GPS data provides crucial location information, which can validate the inferences made from the accelerometer and gyroscope. By cross-referencing data from different sensors, the app can improve the accuracy of transportation mode detection. For instance, GPS can confirm that the user is moving at a speed consistent with driving when the accelerometer indicates high acceleration. Additionally, GPS can provide contextual data, such as proximity to road networks or transit routes, further enhancing mode detection accuracy.


#### 4.3.7. Carbon Footprint Calculation

In this section, we'll centralize the carbon footprint calculations to avoid redundant code across the app. The carbon footprint calculations will be encapsulated in a single function within a dedicated file, ensuring consistency and ease of maintenance. 

##### ➭ Define Constants

To avoid errors, it is better to define the constants that will be used in the formula. Specifically, the consumption rates for cars and the emissions factors for different modes of transportation should be clearly defined upfront.

```typescript
const TRANSPORTATION_EMISSIONS = {
  plane: 0.246,    // kg CO2 per km
  bus: 0.101,      // kg CO2 per km
  bicycle: 0.021,  // kg CO2 per km
  walk: 0,         // kg CO2 per km (assumed zero emissions)
  fuel: 2.31,      // kg CO2 per liter (for cars using gasoline)
  gazoil: 2.68,    // kg CO2 per liter (for cars using diesel)
  electric: 0.012, // kg CO2 per kWh
};

const CONSUMPTION_RATES = {
  fuel: 0.07,      // liters per km for gasoline cars
  gazoil: 0.06,    // liters per km for diesel cars
  electric: 0.139, // kWh per km for electric cars
};
```

#### ➭ Function
This function will take three parameters:

- `distance`: The distance traveled in kilometers.
- `transportation`: The mode of transportation used.
- `consumption`: Optional consumption rate for vehicles (e.g., fuel consumption per km).

The function will use these parameters to calculate the carbon footprint of the trip in kg CO2.

1. **Initialization**: 
   - `carbonFootprint` is initialized to 0. This variable will hold the final CO2 emissions value.

2. **Fuel or Diesel Cars**:
   - If the transportation mode is either 'fuel' (gasoline) or 'gazoil' (diesel), the formula first calculates the amount of fuel used over the given distance. 
   - The fuel used is computed by multiplying the `consumption` rate (liters per 100 km) by the `distance` and then dividing by 100 to adjust for the units. 
   - The carbon footprint is then calculated by multiplying the fuel used by the corresponding emissions factor from the `TRANSPORTATION_EMISSIONS` constant.

3. **Electric Vehicles**:
   - For electric vehicles, the formula calculates the electricity consumed either directly from a provided `consumption` rate or from a default rate stored in `CONSUMPTION_RATES`.
   - The electricity used is then multiplied by the emissions factor for electricity, yielding the carbon footprint.

4. **Other Transportation Modes**:
   - For all other modes of transportation, the carbon footprint is directly calculated by multiplying the distance by the relevant emissions factor from `TRANSPORTATION_EMISSIONS`. 

5. **Return Value**:
   - The function returns the calculated `carbonFootprint` value, representing the CO2 emissions for the given trip.


#### ➭ Usage of the Function

Once the file is created and the function is implemented, it can be imported and used across the app. 

**Example Use Case:**

In the activity detection feature, when the user reopens the app and confirms the detected activity, the app will calculate the carbon footprint based on the mode of transportation and the distance traveled. 

- **User Confirmation:** When the user confirms the activity details (e.g., mode and distance), the app calls the function with the corresponding parameters.
- **Data Storage:** The returned carbon footprint value is then saved in the database, associated with the user's profile.

#### ➭ Usage In The Navigation 

To ensure efficient performance during navigation, the app will calculate the carbon footprint at intervals of every 100 meters traveled. This approach avoids continuous calculations that could slow down the app. 

1. **Distance Tracking State**:
   - We will maintain a state variable, `distanceAccumulated`, which tracks the cumulative distance traveled since the last carbon footprint calculation.

2. **Distance Check**:
   - Every time the app updates the user's location, the distance traveled since the last update is added to `distanceAccumulated`.

3. **Carbon Footprint Calculation**:
   - When `distanceAccumulated` reaches or exceeds 100 meters, the app triggers the carbon footprint calculation for the selected mode of transportation.
   - The calculation is performed using the function for the carbon, which takes into account the 100 meters traveled and the user's chosen mode of transportation.
   - After calculating the carbon footprint, the app subtracts 100 meters from `distanceAccumulated`. Any remaining distance (if `distanceAccumulated` was more than 100 meters) is carried over to the next calculation cycle.

4. **Efficiency Consideration**:
   - This method ensures that the carbon footprint is calculated efficiently, minimizing the processing load on the app. It strikes a balance between accuracy and performance, ensuring that the app remains responsive during navigation while still providing timely updates on the user's carbon emissions.

![Carbon Footprint Calculation](./Img/footprintNavigation.png.png)

### 5. Implementation Plan

#### 5.1. Development Strategy

The project will be developed using the Agile methodology. Agile is a flexible and iterative approach that focuses on continuous improvement through small, manageable work increments known as sprints. This method allows for adaptability in response to changes in requirements or team availability. The key reason for choosing Agile is to accommodate the inconsistent work schedules of the team members, making it preferable to avoid rigid deadlines and objectives. However, it’s important to note that this flexibility could potentially lead to delays in the overall app production if not carefully managed.

#### 5.2. Milestones and Phases

![Milestones](./Img/timeline.png)


1.  Deployment Plan

	•	Environment Setup: Description of development, staging, and production environments.
	•	Deployment Strategy: Steps and processes for deploying the app.
	•	Rollback Plan: Steps to revert to a previous state in case of issues.

2.  Maintenance and Support

	•	Post-Launch Support: How issues will be handled post-launch.
	•	Maintenance Plan: Regular updates, bug fixes, and improvements.


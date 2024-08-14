<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">Technical Specification</h1>
  <p align="center">
    <strong>EcoGo</strong>
    <br />
  </p>
</div>

- [1. Introduction](#1-introduction)
  - [1.1. Audience](#11-audience)
  - [1.2. Overview](#12-overview)
  - [1.3. Glossary](#13-glossary)
  - [1.4. Objectives](#14-objectives)
  - [1.5. Scope](#15-scope)
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
    - [4.3.4 Authentication and User Management](#434-authentication-and-user-management)
      - [➭ Authentication Context (`AuthContext.tsx`)](#-authentication-context-authcontexttsx)
      - [➭ Sign-In Page (`SignIn.tsx`)](#-sign-in-page-signintsx)
      - [➭ Sign-Up Component (`SignUp.tsx`)](#-sign-up-component-signuptsx)



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

### 3.3 APIs

The choice to use Google Maps APIs is based on several key factors. Firstly, they are well-documented, which significantly streamlines development and reduces potential issues. Being provided by Google, ensures the assurance of long-term support and stability, minimizing the risk of sudden deprecation. Additionally, Google Maps APIs are highly efficient and reliable, making them an ideal choice for location-based services. Lastly, Google offers a $300 credit for these services, which is particularly beneficial for a school project without revenue, allowing for extensive testing and development without incurring costs.

The app will communicate with these Google Maps APIs:

- **Google Maps Place API**
- **Google Maps Directions v2 API**
- **Google Maps SDK for iOS**

Their usage will be described in detail in their respective section.


## 4. System Architecture


### 4.1. File Structure

```
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
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (tabs)/
│   │   ├── Challenges.tsx
│   │   ├── Gps.tsx
│   │   ├── Profile.tsx
│   │   ├── Store.tsx
│   │   ├── _layout.tsx
│   │   └── home/
│   │       ├── _layout.tsx
│   │       └── index.tsx
│   └── screens/
│       ├── InfoUser.tsx
│       ├── _layout.tsx
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
│   │   ├── CheckConnection.tsx
│   │   ├── CustomKeyboardView.tsx
│   │   ├── Loading.tsx
│   │   ├── LoadingMap.tsx
│   │   ├── ProfilImage.tsx
│   │   └── footer/
│   │       └── footer.style.ts
│   ├── home/
│   │   ├── activities/
│   │   │   ├── Activities.tsx
│   │   │   └── activities.style.ts
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx
│   │   │   └── dashboard.style.ts
│   │   └── recommendation/
│   │       ├── Recommendation.tsx
│   │       └── recommendation.style.ts
│   ├── home/whitebackground/
│   │   └── whitebackground.style.ts
│   ├── map/
│   │   ├── Map.tsx
│   │   ├── map.style.ts
│   │   ├── carbonFootprintContainer/
│   │   │   ├── CarbonFootprintDisplay.tsx
│   │   │   └── carbonfootprintcontainer.style.ts
│   │   ├── footer/
│   │   │   ├── FooterMap.tsx
│   │   │   └── footer.style.ts
│   │   ├── instructions/
│   │   │   ├── Instructions.tsx
│   │   │   └── instructions.style.ts
│   │   └── modalTransportationChoice/
│   │       ├── TransportationModal.tsx
│   │       └── transportationmodal.style.ts
│   ├── profil/
│   │   ├── friendsnumber/
│   │   │   ├── FriendsNumber.tsx
│   │   │   └── friendsnumber.style.ts
│   │   ├── graphique/
│   │   │   ├── Graphique.tsx
│   │   │   └── graphique.style.ts
│   │   ├── nameandprofile/
│   │   │   ├── NameAndProfile.tsx
│   │   │   └── nameandprofile.style.ts
│   │   └── totaldata/
│   │       ├── TotalData.tsx
│   │       └── totaldata.style.ts
│   └── screens/infoUser/
│       ├── infoUser.style.ts
│       ├── editProfileModal/
│       │   ├── EditProfileComponent.tsx
│       │   └── editProfile.style.ts
│       ├── personalInfo/
│       │   └── PersonalInfo.tsx
│       └── policies/
│           ├── Policies.tsx
│           └── policies.style.ts
│   ├── store/
│   │   ├── popularcategories/
│   │   │   ├── PopularCategories.tsx
│   │   │   └── popularcategories.style.ts
│   │   ├── sales/
│   │   │   ├── Sales.tsx
│   │   │   └── sales.style.ts
│   │   └── spotlight/
│   │       ├── Spotlight.tsx
│   │       └── spotlight.style.ts
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

//TODO: Add descriptions for each file and directory

- **`app/`**: Contains all the principal pages of the app. Pages outside of tabs (e.g., `SignIn.tsx`, `SignUp.tsx`) are accessible without authentication, while pages within the tabs (e.g., `Challenges.tsx`, `Gps.tsx`) are protected by the `AuthContext` and require the user to be logged in.

- **`assets/`**: Stores all the static assets used in the app, including images, icons, and animations. These are used to provide visual content within the app.

- **`constants/`**: Contains data that should remain constant throughout the app, such as paths to icons, theme settings, and standard data related to carbon emissions. These constants help ensure consistency across the app.

- **`context/`**: Contains the `AuthContext.tsx` file, which is responsible for managing the authentication state, including login and logout functionality. 

- **`ios/`**: Contains all the files related to building the iOS version of the app. This includes configuration files, project settings, and other necessary components for compiling the app for iOS devices.


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

In this example:

- The **Home** page is composed of multiple components (`Dashboard`, `Activities`, `Recommendation`).
- Each component should be developed in its respective folder inside the `components` directory.

#### 4.3.4 Authentication and User Management

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
   - **Purpose**: 	useRef allows to store and update values without causing the component to re-render. Unlike useState, which triggers a re-render every time the state changes, useRef provides a mutable reference that persists across renders without affecting the UI. This is particularly useful for storing the current values of the email and password fields, which do not need to trigger a re-render of the component every time the user types.
   - **`email`**: Stores the email entered by the user.
   - **`password`**: Stores the password entered by the user.

3. **`handleLogin()` Function**
   - **Purpose**: Handles the login process when the user attempts to sign in.
   - **Implementation Steps**:
     1. Checks if both the email and password fields are filled. If not, display an alert message: `"Error: Please fill all the fields"`.
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

1. System Architecture

	•	High-Level Architecture: Overview of the system’s architecture, including diagrams.
	•	Component Description: Detailed description of each major component and its responsibilities.
	•	Data Flow: How data moves through the system.


2.  Implementation Plan

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


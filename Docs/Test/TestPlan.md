<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">Test Plan</h1>
  <p align="center">
    <strong>EcoGo</strong>
    <br />
  
  </p>
</div>



## 1 Purpose of the Test Plan

The purpose of this test plan is to outline the testing strategy and approach of the app. 

## 2. Scope

- Application: EcoGo
- Platforms: iOS
- Technologies: React, React Native, Firebase, Google Maps API,
- Objective: Ensure the application is fully functional, user-friendly, and provides accurate CO2 consumption data across both platforms.

## 3. Objectives

- Validate the accuracy of the CO2 consumption calculations.
- Confirm the application meets performance, security, and usability standards.
- Verify seamless integration with third-party services and APIs.
- Identify and resolve any bugs or issues.

## 4. Test Items

- User authentication (Login, Register, Logout).
- User activity tracking and data input.
- CO2 consumption calculations logic and accuracy.
- UI/UX consistency and responsiveness.
- API integration and data retrieval.
- Notifications. 
- Data storage and retrieval.
- Security aspects (eg. data encryption, secure connections).
- Compatibility with various screen sizes and OS versions. 

## 5. Test Approach

### 5.1. Test Levels

- Unit Testing: Individual components and functions' logic.
- Integration Testing: Interaction between frontend and backend components.
- System Testing: End-to-end testing of the application on iOS.
- Acceptance Testing: Final testing before deployment to ensure the application meets all requirements.

### 5.3. Test Types

- Functional testing: Verify the application functions according to the requirements.
- UI/UX testing: Ensure the application is usable without any design flaws on any screen size.
- Performance testing: Evaluate the application's performance under various conditions such as low network speed or high traffic.
- Compatibility testing: Confirm the application works across different devices, screen sizes, and OS versions.
- Security testing: Identify and resolve any security vulnerabilities.
- Usability testing: Evaluate the application's ease of use and user satisfaction.
- Regression testing: Ensure new updates or features do not negatively affect existing functionality.

### 5.4. Beta Testing

- Beta testing will be conducted to gather feedback from real users before the final release.
- Beta testers will be selected from the target audience to provide valuable insights and suggestions.
- Feedback will be collected through surveys, interviews, and user testing sessions.
- Beta testing will help identify any issues or areas for improvement before the official launch.
- The goal is to get as much feedback as possible from iOS users to ensure a successful launch.

### 5.5.  Accessibility Testing
  
- Accessibility testing will be conducted to ensure the application is usable by all users, including those with disabilities.
- The application will be tested using screen readers, voice commands, and other assistive technologies.
- The goal is to ensure the application is accessible to all users and complies with accessibility standards such as WCAG 2.0. (Web Content Accessibility Guidelines)

## 6. Test Environment

### 6.1. Hardware

- Devices for testing:
  - iOS devices: iPhone 14 Pro, built-in MacOS emulator and Iphone 15 Pro Max.
  - Tablets: iPad Pro 2021.

### 6.2. Software

- Operating Systems:
  - iOS: iOS 14, iOS 15.
- Development Tools:
  - IDE: Visual Studio Code.
  - Emulators: Xcode.
- Testing Tools:
  - Jest (Unit Testing).
  - Detox (End-to-end Testing).
  - Appium (UI Testing).
  - Firebase Test Lab (Cloud Testing).
  - Postman (API Testing).
  - Jira (Bug Tracking).

### 6.3. ➭ Network Environment

- Network Speed:
  - 3G.
  - 4G.
  - 5G.
  - Edge.
  - Slow Wi-Fi(ADSL).
  - Fast Wi-Fi(Fiber).
  - No Network.
  - No Service.


## 7. Entry and Exit Criteria

### 7.1. Entry Criteria

- Development of features is complete.
- Unit tests passed. Consider 80% code coverage.
- Test environment is set up and stable.

### 7.2. Exit Criteria

- All critical and high-severity defects are resolved.
- Test coverage meets the required threshold.
- All acceptance test passed.
- User feedback is positive.
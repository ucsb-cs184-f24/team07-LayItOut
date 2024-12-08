# Team07 - Room Layout App

Our team is working toward creating a layout planner app that helps with visualizing a given room. The layout planner will help the user in planning out a design for a room given measurements, making sure it fits in the room as well as help visualize what the spacing of the room will look like after. This can be done through 2D rendering of objects using information given by the user.

# Team Members:
* Emily Thai @emilythai
  
* Hannah Shakouri @Hannahshakouri01
* Palvi Sabherwal @psabherwal
* Charlene Patenaude @charlene-patenaude
* Bella Ward @bella-ward
* Niyati Mummidivarapu @niyati-m
* Vaani Arora @vaaniarora

# Tech Stack:
* Framework: React Native
* Database: Firebase
* Deployment: Expo Go
* Authentication: Firebase OAuth 

# User Roles:
#### Registered User:
Users can create an account or log in via the home screen using their UCSB or personal email. Registered users can input room dimensions, save multiple room layouts, and fully customize their designs for future reference.

# Installation Instructions
1. Install the Expo Go app on your smartphone. Follow this link: https://expo.dev/go
2. Intall Xcode on your computer (this is for iOS simulator). Follow this link: https://developer.apple.com/xcode/
3. Install Node.js on your laptop/computer. Follow this link: https://nodejs.org/en/download/package-manager
4. Git clone our team's project repo. Run this command in your terminal: git clone https://github.com/ucsb-cs184-f24/team07-LayItOut.git
5. Once you have cloned our team's project repo, cd into the LayItOut folder.
6. Install the required npm dependencies. Run this command in your terminal: npm install
7. To build the app, run this command in your terminal: npx expo start.
8. To deploy it on Expo Go, scan the QR code that appears on your terminal. If you are facing issues with the QR code, follow this documentation: https://docs.expo.dev/eas-update/introduction/
9. To deploy it on iOS simulator, run this command in your terminal: i. Select iPhone 16 as your device.
11. LayItOut will load on your device and be ready to use. Enjoy our app!!

# Deployment
[Tagged Release](https://github.com/ucsb-cs184-f24/team07-LayItOut/releases/tag/v2.0.0)

# User Manual
**Get Started:** Welcome to LayItOut! Click on 'Get Started' to sign-in or login to our app.

**User Login:** For first-time users, enter your email, set a password, and then click on 'Create Account'. For preexisting users, enter your account information and then click on 'Log In'.

**Home Page:** After logging into our app, you will be directed to our app. Here you can 'Create a Room', 'View Previous Rooms', or 'Logout'. 

**Create Room:** Once you click on 'Create a Room', you will have the option to choose your desired room dimension ('Square', 'Default Rectangle', 'Custom Room'). Each room layout has a sidebar menu where you can drag and drop furniture pieces. After arranging the room to your desire, click on the camera icon on the bottom right corner to take a screenshot. 

**View Previous Rooms:** Once you click on 'View Previous Rooms', you can view your saved projects. 

**Logout:** Once you click on 'Logout', you will be logged out of your account and redirected to the Home Page.

For a more detailed manual: [Click Here](https://github.com/ucsb-cs184-f24/team07-LayItOut/blob/main/docs/MANUAL.md)

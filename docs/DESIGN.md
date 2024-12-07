# Design

## System Architecture Diagram
![design](https://github.com/user-attachments/assets/5f6d8e89-ff99-46e7-8e41-c0a1c4e94ad4)

## Significant Team Decisions
1. Choosing to do a 2D version of the original idea. With the variety of computers and phones, it was not feasible to create a Unity app
and so we chose React Native instead as it was compatible with all our devices.
   
2. Putting a tab bar at the bottom for ease of navigation between the different pages. We originally had back buttons, but then it seemed like a lot of unnecessary navigation for the user and so we implemented a tab bar.
   
3. Screenshots of the user's Room Layout. Originally, the idea was to allow the user to save a project and continue working, but storing all  that information especially with the movable objects was going to be quite complicated, so we instead decided to allow the user to take a      screenshot of their work and then have it so that they can view their previous room layouts in a separate page, accessible by the tab          navigation bar.
   
4. Having the room layouts horizontal. It seemed more space efficient and easier for the user to have the page where they are creating their room layout to be horizontal instead of vertical.
   
5. Showing the distance between the furniture and the four walls so that the user will be able to have more details when choosing where to place their furniture.

6. React defaults the origin of our furniture to the upper left corner and we tried to initialize the origin to be the center of furniture instead, but when rotating an image, react defaults it back to the upper left corner. Because of these issues, we decided to instead give the options of the furniture already rotated in the furniture drawer.

## User Experience (UX) considerations
1. **Welcome Page**: Shows a splash page of our theme and a _Get Started_ button that navigates the user to the Log In/Create Account page.

2. **Log In/Create Account**: Allows the user to either log in if they have already created an account, or create an account if they haven't   already. Both buttons will navigate the user to the homepage.

3. **Home Page**: User has an option to view their previous rooms or create a new room as well as log out. All navigation is accessible through the buttons as well as the navigation bar at the bottom.

5. **View Previous Rooms**: User can see their previously created room layouts. They can also select it and delete it if they would like. It features a tile layout of all their rooms, which will rearrange itself when a screenshot is taken and added.

6. **Create Room Page**: User is able to select what dimensions of a room they want. There are default square and rectangle options as well as a custom room option. When _Custom Room_ is pressed, a drop down appears where the user can input the dimensions of the room they want in feet.

7. **Default Square, Rectangle Rooms, and Custom Room**: The default square and rectangle room sizes are created and shown in the middle. The custom room size depends on what the user had entered on the previous page. On the left side, there is a furniture list that is scrollable and categorized by room type (e.g. Living Room, Kitchen, Bedroom, Bathroom, etc.). These furnitures are automatically proportionally sized to the room size. Clicking on it will allow the user to view that furniture in different rotations and choosing a rotation will make the furniture appear in the room. When the user drags the furniture around the room, lines will appear showing the distance in feet between the furniture and all four walls. This page also features a camera icon that when pressed, takes a screenshot of the room layout just created and stores it to be viewed in the View Previous Rooms page. Above that, there is another button to delete the furniture. Once clicked, a small x will appear on all the furniture items and when pressed, that furniture item will be deleted from the user's room layout. Displayed on the upper right hand side is the dimensions of the room in feet.

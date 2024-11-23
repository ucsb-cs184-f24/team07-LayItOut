# HW04: Implementation Contribution

### Starting Point
Due to working on the same branch, I am unable to provide a branch that shows what it looked like before, but because I only implemented this feature in one specific room, you can see what it looked like before when selecting Rectangle Room in the final result.

To describe the starting point, when dragging a furniture in the room layout, there is no display of the distance between the furniture being dragged and the walls of the room.
### Final Result Branch
https://github.com/ucsb-cs184-f24/team07-LayItOut/tree/FurnitureDist-et
### Overall Structure
In the branch, you can find the file I have edited at the file path `LayItOut/app/pages/SquareRoom.tsx`. In here, I made four separate lines by adding a way to get the coordinates of the furniture's x and y position as it's being dragged. I am then able to use these coordinates to determine each of the line's width and height and have it change when the furniture is being moved. Then, I made it so that the lines are displayed only when the furniture is being moved by the user.

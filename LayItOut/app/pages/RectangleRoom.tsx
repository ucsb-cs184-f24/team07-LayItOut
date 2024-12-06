import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder, ScrollView, ActivityIndicator } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { NavigationProp } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font'; 

// Direct imports for all furniture
import bathsink from '../../images/bathsink.png';
import bathtub from '../../images/bathtub3.png';
import bookshelf from '../../images/bookshelf_2.png';
import chair from '../../images/Chair.png';
import chair2 from '../../images/chair2.png';
import closet from '../../images/closet.png';
import consoleTable from '../../images/consule.png';
import countertop from '../../images/countertop.png';
import dining from '../../images/dining.png';
import door from '../../images/door.png';
import fireplace from '../../images/fireplace.png';
import fridge from '../../images/fridge.png';
import kitchenTable from '../../images/kitchen table.png';
import lamp from '../../images/lamp.png';
import officeChair from '../../images/office chair.png';
import oven from '../../images/oven.png';
import p from '../../images/p.png';
import queenbed from '../../images/queenbed.png';
import side1 from '../../images/side1.png';
import side2 from '../../images/side2.png';
import sidebed from '../../images/sidebed.png';
import sofa2 from '../../images/sofa2.png';
import sofa3 from '../../images/sofa3.png';
import stove from '../../images/stove.png';
import table from '../../images/table.png';
import table1 from '../../images/table1.png';
import table2 from '../../images/table2.png';
import table3 from '../../images/table3.png';
import toilet from '../../images/toilet.png';
import trashcan from '../../images/trashcan.png';
import wardrobe from '../../images/wardropbe.png';
import washingMachine from '../../images/washing machine.png';
import window from '../../images/window.png';
import sink from '../../images/sink.png';
import tv from '../../images/tv.png';

const scaleFactor = 27.27

// Furniture categories organization
const furnitureCategories = {
  'General': [
    { name: 'Door', image: door, dimensions:{width: 3, height: 3} },
    { name: 'Window', image: window, dimensions:{width: 3, height: .5} },
    { name: 'Closet', image: window, dimensions:{width: 5, height: .5} },
  ],
  'Living Room': [
    { name: 'Sofa (2-Seater)', image: sofa2, dimensions:{width: 4.5, height: 2.5} },
    { name: 'Sofa (3-Seater)', image: sofa3, dimensions:{width: 5.8, height: 2.5} },
    { name: 'Chair', image: chair, dimensions:{width: 2.5, height: 2.5} },
    { name: 'Side Table 1', image: side1, dimensions:{width: 1.5, height: 2} },
    { name: 'Side Table 2', image: side2, dimensions:{width: 1.5, height: 2} },
    { name: 'Bookshelf', image: bookshelf, dimensions:{width: 3, height: 5.5} },
    { name: 'Console Table', image: consoleTable, dimensions:{width: 3, height: 3} },
    { name: 'Fireplace', image: fireplace, dimensions:{width: 3, height: 2.5} },
    { name: 'Coffee Table', image: table1, dimensions:{width: 3, height: 1.5} },
    { name: 'Lamp', image: lamp, dimensions:{width: 2, height: 5} },
    { name: 'TV', image: tv, dimensions:{width: 5.2, height: 5} },
  ],
  'Bedroom': [
    { name: 'Queen Bed', image: queenbed, dimensions:{width: 5, height: 3.5} },
    { name: 'Bedside Table', image: sidebed, dimensions:{width: 2, height: 2} },
    { name: 'Wardrobe', image: wardrobe, dimensions:{width: 3.5, height: 6} },
    { name: 'Office Chair', image: officeChair, dimensions:{width: 1.7, height: 2} },
    { name: 'Desk', image: table, dimensions:{width: 5, height: 2.7} },
    { name: 'Plant', image: p, dimensions:{width: 1, height: 1} },
  ],
  'Kitchen': [
    { name: 'Refrigerator', image: fridge, dimensions:{width: 2.5, height: 5.5} },
    { name: 'Sink', image: sink, dimensions:{width: 2, height: 2.5} }, 
    { name: 'Kitchen Table', image: kitchenTable, dimensions:{width: 4.5, height: 2} },
    { name: 'Countertop', image: countertop, dimensions:{width: 4, height: 3} },
    { name: 'Oven', image: oven, dimensions:{width: 2.5, height: 3} },
    { name: 'Stove', image: stove, dimensions:{width: 2.5, height: 3} }, 
    { name: 'Dining Set', image: dining, dimensions:{width: 4.5, height: 2.5 } },
    { name: 'Dining Chair', image: chair2, dimensions:{width: 2, height: 2.3} },
    { name: 'Trash Can', image: trashcan, dimensions:{width: 2, height: 3 } }, 
  ],
  'Bathroom': [
    { name: 'Bathtub', image: bathtub, dimensions:{width: 5, height: 4} },
    { name: 'Sink', image: bathsink, dimensions:{width: 2, height: 2.5} },
    { name: 'Toilet', image: toilet, dimensions:{width: 2.5, height: 2.5} },
    { name: 'Washing Machine', image: washingMachine, dimensions:{width: 2.5, height: 3} }
  ]
};

// Draggable furniture component stays the same
const DraggableFurniture = ({ 
  image, 
  initialPosition,
  onTargetLinePositionChange, 
  onPositionChange, 
  onTargetLineHeightChange, 
  onDraggingChange, 
  onBottomLinePositionChange,
  onBottomFurnitureChange,
  onLeftLinePositionChange, 
  onLeftLineHeightChange,
  onRightLinePositionChange,
  onRightFurnitureChange, 
  dimensions, 
  onDelete, 
  id, 
  deleteMode
 }) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition);

  const roomWidth = 450; // Adjust if your room dimensions change
  const roomHeight = 300; // Adjust if your room dimensions change
  const scaledWidth = dimensions.width * scaleFactor
  const scaledHeight = dimensions.height * scaleFactor

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onDraggingChange(true); // Notify parent that dragging has started
      },
      onPanResponderMove: (evt, gestureState) => {
        const newX = positionRef.current.x + gestureState.dx * 0.5;
        const newY = positionRef.current.y + gestureState.dy * 0.5;

        const clampedX = Math.max(0, Math.min(roomWidth/2-5 - scaledWidth/2, newX));
        const clampedY = Math.max(0, Math.min(roomHeight/2-5 - scaledHeight/2, newY));

        setPosition({ x: clampedX, y: clampedY });

        onTargetLineHeightChange(clampedY*2);
        onTargetLinePositionChange(clampedX*2 + scaledWidth/2); // Update line position

        onLeftLineHeightChange(clampedY*2 + scaledHeight/2);
        onLeftLinePositionChange(clampedX*2);

        const clampedBottomLineY = Math.min(clampedY*2 + scaledHeight + 5, 300);
        onBottomLinePositionChange(clampedX*2 + scaledWidth/2, clampedBottomLineY);
        onBottomFurnitureChange(clampedY*2 + scaledHeight);

        const clampedRightLineX = Math.max(0, 450 - 5 - (clampedX*2 + scaledWidth));
        onRightLinePositionChange(clampedRightLineX, (clampedY*2 + scaledHeight/2));
        onRightFurnitureChange((clampedX*2 + scaledWidth));
      },
      onPanResponderRelease: (evt, gestureState) => {
        const newX = positionRef.current.x + gestureState.dx * 0.5;
        const newY = positionRef.current.y + gestureState.dy * 0.5;

        // Clamp the final positions to ensure the furniture stays within bounds
        const clampedX = Math.max(0, Math.min(roomWidth/2-5 - scaledWidth/2, newX));
        const clampedY = Math.max(0, Math.min(roomHeight/2-5 - scaledHeight/2, newY));

        positionRef.current = { x: clampedX, y: clampedY };
        setPosition({ x: clampedX, y: clampedY });
        onPositionChange({ x: clampedX, y: clampedY });
        
        // Hide the target line and text once the furniture is released
        onTargetLinePositionChange(null);
        onBottomLinePositionChange(null, null);
        onDraggingChange(false);
      },
    })
  ).current;

  return (
    <View style={[
      styles.furnitureInRoom, { 
        position: "absolute",
        left: position.x, 
        top: position.y,
        width: dimensions.width,
        height: dimensions.height,
      }]}
      {...panResponder.panHandlers}
      >
      <Image
        source={image}
        style={[styles.furnitureInRoom, { left: position.x, top: position.y, width: scaledWidth, height: scaledHeight }]}
        resizeMode='stretch'
        {...panResponder.panHandlers}
      />
      {deleteMode && (
        <TouchableOpacity 
          style={[styles.deleteButton, { left: position.x + scaledWidth - 15, top: position.y - 15 }]} 
          onPress={() => onDelete(id)}
        >
          <Ionicons name="close-circle-outline" size={25} color="red" style={{ fontWeight: 'bold'}}/>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Furniture sidebar component stays the same
const FurnitureSidebar = ({ addFurniture }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.title}>Furniture List</Text>
      <View style={styles.scrollViewContainer}>
        <ScrollView 
          style={[styles.scrollView, { transform: [{ scaleX: -1 }] }]}
          showsVerticalScrollIndicator={true}
          bounces={false}
          contentContainerStyle={styles.scrollViewContent}
          scrollIndicatorInsets={{ right: 1 }}
        >
          <View style={[styles.scrollViewInner, { transform: [{ scaleX: -1 }] }]}>
            {Object.entries(furnitureCategories).map(([category, items]) => (
              <View key={category} style={styles.categoryContainer}>
                <TouchableOpacity 
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={styles.categoryTitle}>{category}</Text>
                  <Text style={styles.expandIcon}>
                    {expandedCategory === category ? '−' : '+'}
                  </Text>
                </TouchableOpacity>

                {expandedCategory === category && items.map((item, index) => (
                  <TouchableOpacity 
                    key={`${category}-${index}`}
                    style={styles.furnitureItem} 
                    onPress={() => addFurniture(item.name, item.image, item.dimensions)}
                  >
                    <Image source={item.image} style={styles.furnitureImage} resizeMode="contain"/>
                    <Text style={styles.furnitureText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

// Main component
const RectangleRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const [targetLinePosition, setTargetLinePosition] = useState(null);
  const [targetLineHeight, setTargetLineHeight] = useState(null);
  const [bottomLinePosition, setBottomLinePosition] = useState(null);
  const [bottomLineHeight, setBottomLineHeight] = useState(null);
  const [bottomFurniture, setBottomFurniture] = useState(null);
  const [leftLinePosition, setLeftLinePosition] = useState(null);
  const [leftLineHeight, setLeftLineHeight] = useState(null);
  const [rightLinePosition, setRightLinePosition] = useState(null);
  const [rightLineHeight, setRightLineHeight] = useState(null);
  const [rightFurniture, setRightFurniture] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const viewShotRef = useRef(null);
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;
  const [isRed, setIsRed] = useState(false); // State to track the button color

  const toggleDeleteMode = () => {
    setIsRed((prevState) => !prevState); // Toggle the color state
  };

  const handleDelete = (id) => {
    setFurnitureItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  //Load custom font
  const [fontsLoaded] = useFonts({
    'LondrinaLight': require('../../assets/fonts/LondrinaSolidLight.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }


  const calculateDistanceText = (height) => {
    const feet = Math.floor(height / 50); // Convert height to feet (whole number part)
    const inches = ((height / 50) % 1) * 12; // Convert the fractional part to inches
    return `${feet} ft ${inches.toFixed(1)} in`;
  };
  
  const calculateBottomLineLength = (startX, endX) => {
    const length = Math.abs(endX - startX); // Horizontal length in pixels
    const feet = Math.floor(length / 50); // Convert length to feet (whole number part)
    const inches = ((length / 50) % 1) * 12; // Convert the fractional part to inches
    return `${feet} ft ${inches.toFixed(1)} in`;
  };

  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    };
    setOrientation();

    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync();
      };
      unlockOrientation();
    };
  }, []);

  const addFurniture = (name, image, dimensions) => {
    const newItem = { id: `${name}-${Date.now()}`, name, image, dimensions, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      return updatedItems;
    });
  };

  const takeScreenshot = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await captureRef(viewShotRef.current, {
          format: 'png',
          quality: 0.8,
        });

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(uri);
          
          const storage = getStorage();
          const storageRef = ref(storage, `users/${uid}/${Date.now()}.png`);

          const response = await fetch(uri);
          const blob = await response.blob();

          await uploadBytes(storageRef, blob);
          const downloadURL = await getDownloadURL(storageRef);

          const firestore = getFirestore();
          await addDoc(collection(firestore, 'screenshots'), {
            downloadURL: downloadURL,
            uid: uid,
            createdAt: new Date(),
          });

          alert('Screenshot saved successfully to Firebase and gallery!');
        } else {
          alert('Permission to access media library is required!');
        }
      } catch (error) {
        console.error("Error taking screenshot:", error);
        alert('Failed to save screenshot.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <FurnitureSidebar addFurniture={addFurniture} />
      <View style={styles.mainContent}>
        <Text style={[styles.dimensionText, styles.showDimension]}>H: 6 ft{"\n"}W: 6 ft</Text>
        {/* <Text style={[styles.dimensionText, styles.leftDimension]}>Height: 6 ft</Text> */}
        <View style={styles.room} ref={viewShotRef}>
          {/* Conditionally render the target line at a dynamic position */}
          {isDragging && targetLinePosition !== null && targetLinePosition > 0 && (
            <View
              style={[
                styles.targetLine,
                { left: targetLinePosition },
                { height: targetLineHeight },
              ]}
            />
          )}
          {bottomLinePosition !== null && (
            <View
              style={[
                styles.targetLine,
                { left: bottomLinePosition, top: bottomLineHeight },
              ]}
            />
          )}
          {isDragging && leftLinePosition !== null && leftLinePosition > 0 && (
            <View
              style={[
                styles.horizontalLine,
                { width: leftLinePosition },
                { top: leftLineHeight },
              ]}
            />
          )}
          {isDragging && rightLinePosition !== null && (
            <View
              style={[
                styles.horizontalLine,
                { left: rightLinePosition },
                { top: rightLineHeight },
              ]}
            />
          )}
          {isDragging && (
            <Text style={[styles.distanceText, { left: targetLinePosition + 5, top: targetLineHeight / 2 }]}>
              {calculateDistanceText(targetLineHeight)}
            </Text>
          )}
          {isDragging && (
            <Text style={[styles.distanceText, { left: bottomLinePosition - 75, top: (bottomLineHeight + 230) / 2 }]}>
              {calculateBottomLineLength(bottomFurniture, 300 - 10)}
            </Text>
          )}
          {isDragging && (
            <Text style={[styles.distanceText, { left: (leftLinePosition - 100) / 2, top: leftLineHeight - 25 }]}>
              {calculateDistanceText(leftLinePosition)}
            </Text>
          )}
          {isDragging && (
            <Text style={[styles.distanceText, { left: (rightLinePosition + 400) / 2, top: rightLineHeight + 5}]}>
              {calculateBottomLineLength(rightFurniture, 450 - 10)}
            </Text>
          )}
          {furnitureItems.map((item, index) => (
            <DraggableFurniture
              key={item.id}
              id={item.id}
              image={item.image}
              dimensions={item.dimensions}
              initialPosition={item.position}
              onTargetLinePositionChange={(position) => setTargetLinePosition(position)}
              onPositionChange={(newPosition) => {
                setFurnitureItems((prevItems) => {
                  const updatedItems = prevItems.map((furniture) =>
                    furniture.id === item.id ? { ...furniture, position: newPosition } : furniture
                  );
                  return updatedItems;
                });
              }}
              onDelete={handleDelete}
              deleteMode={isRed}
              onTargetLineHeightChange={(positionY) => setTargetLineHeight(positionY)}

              onBottomLinePositionChange={(x, y) => {
                setBottomLinePosition(x);
                setBottomLineHeight(y);
              }}
              onBottomFurnitureChange={(bottomY) => setBottomFurniture(bottomY)}

              onLeftLinePositionChange={(position) => setLeftLinePosition(position)}
              onLeftLineHeightChange={(positionY) => setLeftLineHeight(positionY)}

              onRightLinePositionChange={(rightEdgeX, positionY) => {
                const distanceFromRight = 450 - rightEdgeX; // Calculate distance from right wall
                setRightLinePosition(distanceFromRight); // Set the correct position
                setRightLineHeight(positionY + 5); // Update line's vertical alignment
              }}
              onRightFurnitureChange={(rightEdgePosition) => setRightFurniture(rightEdgePosition)}

              onDraggingChange={setIsDragging} // Track dragging state
            />
          ))}
        </View>
        <TouchableOpacity style={styles.screenshotButton} onPress={takeScreenshot}>
        <Image 
          source={require('../../images/Camera.png')} // Update with your image path
          style={styles.buttonImage}
        />
        </TouchableOpacity>
        <TouchableOpacity
        style={[
          styles.globalDeleteButton,
          { backgroundColor: isRed ? 'grey' : 'red' }, // Dynamically set background color
        ]}
        onPress={toggleDeleteMode}
      >
        <Ionicons name="trash-outline" size={35} color="white" />
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#abc2da',
    height: '100%',
    paddingTop: 12,
    paddingRight: 12,
    paddingLeft: 1,
  },
  scrollViewContainer: {
    flex: 1,
    marginRight: -2,
  },
  scrollView: {
    flex: 1,
    marginBottom: 12,
  },
  scrollViewContent: {
    paddingRight: 1,
  },
  scrollViewInner: {
    paddingLeft: 9,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  room: {
    // using scale factor of 27.27 so this is a 16.5 x 11 room
    width: 450,
    height: 300,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
    left: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#045497',
    textAlign: 'center',
    paddingLeft: 9,
    fontFamily: 'LondrinaLight',
    letterSpacing: 1,
  },
  dimensionText: {
    position: 'absolute', 
    color: '#4A4A4A', 
    fontWeight: 500, 
    fontSize: 13.5,         //adjust size to be smaller if needed. 
    backgroundColor: 'transparent',
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 4, 
    zIndex: 10,
    fontFamily: 'LondrinaLight',
    letterSpacing: 0.7,
  },
  showDimension: {
    top: 290,     //so its above the room
    left: 50, 
    transform: [{ translateX: -50 }], 
  },
  categoryContainer: {
    marginBottom: 5,
    width: '100%',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#045497',
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'LondrinaLight',
    letterSpacing: 1,
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  furnitureImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  furnitureText: {
    color: "#1c4f88",
    fontSize: 16,
  },
  furnitureInRoom: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  screenshotButton: {
    position: 'absolute',
    bottom: 25,
    right: 20,
  },
  buttonImage: {
    width: 35,
    height: 35,
  },
  deleteButton: { 
    position: 'absolute', 
    top: -10, 
    right: -10,  
    width: 25,  // Set width of the circle slightly bigger than the icon
    height: 25,  // Set height of the circle slightly bigger than the icon
    backgroundColor: 'white',
    borderRadius: 10,  // Half of the width/height to make it circular
    justifyContent: 'center',  // Center the icon horizontally
    alignItems: 'center',  // Center the icon vertically
    fontWeight: 'bold'
  },
  deleteButtonText: { 
    color: 'white', 
    fontSize: 16 
  },
  globalDeleteButton: { 
    position: 'absolute', 
    right: 10, 
    top: 200, 
    width: 50,  // Set a fixed width for the background box
    height: 50, // Set a fixed height for the background box
    //backgroundColor: 'red',
    justifyContent: 'center', // Center contents vertically
    alignItems: 'center', // Center contents horizontally
    borderRadius: 20, // Optional: make the background box rounded
    flexDirection: 'row', // Ensure the icon and text are in a row
  },
  
  globalDeleteButtonText: { 
    color: 'white',
    textAlign: 'center',  // Center the text
    marginLeft: 5,  // Optional: add space between icon and text
  },
  distanceText: {
    position: 'absolute',
    fontSize: 12,
    color: 'black',
    fontWeight: 'bold',
    backgroundColor: 'white',
    padding: 2,
    borderRadius: 3,
  },
  targetLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'red',
  },
  targetText: {
    position: 'absolute',
    left: 10,
    fontSize: 14,
    color: 'black',
  },
  horizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'red',
  },
});

export default RectangleRoom;
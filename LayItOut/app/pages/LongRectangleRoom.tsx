import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import chair from '../../images/Chair.png';
import bed from '../../images/Bed.png';
import bookshelf from '../../images/bookshelf_2.png';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}
const Drawer = createDrawerNavigator();

// Custom drawer content with furniture items
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.furnitureListContainer}>
      <Text style={styles.title}>Furniture List</Text>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('chair', chair)}>
        <Image source={chair} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Chair</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('bed', bed)}>
        <Image source={bed} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Bed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('bookshelf', bookshelf)}>
        <Image source={bookshelf} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Bookshelf</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// Keep your existing DraggableFurniture component unchanged
const DraggableFurniture = ({ image, initialPosition, wallX, onTargetLinePositionChange, onPositionChange, onTargetLineHeightChange, onDraggingChange }) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        onDraggingChange(true); // Notify parent that dragging has started
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = {
          x: positionRef.current.x + gestureState.dx,
          y: positionRef.current.y + gestureState.dy,
        };
        setPosition(newPosition);

        // Calculate midpoint between furniture and the wall
        const midpoint = (newPosition.x + wallX) / 2;
        onTargetLineHeightChange(newPosition.y + 5);
        onTargetLinePositionChange(newPosition.x + 25); // Update line position
      },
      onPanResponderRelease: (evt, gestureState) => {
        const finalPosition = {
          x: positionRef.current.x + gestureState.dx,
          y: positionRef.current.y + gestureState.dy,
        };
        positionRef.current = finalPosition;
        setPosition(finalPosition);
        onPositionChange(finalPosition);

        // Hide the target line and text once the furniture is released
        onTargetLinePositionChange(null);
        onDraggingChange(false);
      },
    })
  ).current;

  return (
    <Image
      source={image}
      style={[styles.furnitureInRoom, { left: position.x, top: position.y }]}
      {...panResponder.panHandlers}
    />
  );
};

// Keep your existing LongRectangleRoomScreen component unchanged
const LongRectangleRoomScreen = ({ furnitureItems, setFurnitureItems }, { navigation }: RouterProps) => {
  const wallX = 100; // Example x-coordinate of the wall (width of room container)
  const [targetLinePosition, setTargetLinePosition] = useState(null);
  const [targetLineHeight, setTargetLineHeight] = useState(null);
  const [isDragging, setIsDragging] = useState(false); // Track dragging state
  const viewShotRef = useRef(null); // Create a ref using useRef
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;
  const calculateDistanceText = (height) => {
    return `${Math.round(height)} px`;
  };

  useEffect(() => {
    // Lock orientation to landscape when the component mounts
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    };
    setOrientation();

    // Cleanup function to unlock orientation when the component unmounts
    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync(); // Unlock to return to the default orientation
      };
      unlockOrientation();
    };
  }, []);

  const takeScreenshot = async () => {
    if (viewShotRef.current) {
      try {
        // Capture the screenshot using captureRef
        const uri = await captureRef(viewShotRef.current, {
          format: 'png',
          quality: 0.8,
        });
        console.log("Screenshot captured:", uri);

        // Request permissions for media library
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          // Move the screenshot to the appropriate location in the file system
          const asset = await MediaLibrary.createAssetAsync(uri);
          console.log('Screenshot saved to gallery!', asset);

          // Save screenshot to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(storage, `users/${uid}/${Date.now()}.png`);

          const response = await fetch(uri); // Fetch the file from the uri
          const blob = await response.blob(); // Convert to blob for Firebase upload

          await uploadBytes(storageRef, blob); // Upload to Firebase storage
          const downloadURL = await getDownloadURL(storageRef); // Get download URL

          // Save the download URL to Firestore
          const firestore = getFirestore();
          await addDoc(collection(firestore, 'screenshots'), {
            downloadURL: downloadURL,
            uid: uid, // Add the user's uid
            createdAt: new Date(), // Optional: Add timestamp for better organization
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
    <View style={styles.container} ref={viewShotRef}>
      <StatusBar backgroundColor="black" />
      <View style={styles.room}>
        {/* Conditionally render the target line at a dynamic position */}
        {targetLinePosition !== null && (
          <View
            style={[
              styles.targetLine,
              { left: targetLinePosition },
              { height: targetLineHeight },
            ]}
          />
          
        )}
        {isDragging && (
          <Text style={[styles.distanceText, { left: targetLinePosition + 5, top: targetLineHeight / 2 }]}>
            {calculateDistanceText(targetLineHeight - 22)}
          </Text>
        )}
        
        {furnitureItems.map((item, index) => (
          <DraggableFurniture
            key={index}
            image={item.image}
            initialPosition={item.position}
            wallX={wallX} // Pass wall x-coordinate to DraggableFurniture
            onTargetLinePositionChange={(position) => setTargetLinePosition(position)}
            onPositionChange={(newPosition) => {
              const updatedItems = [...furnitureItems];
              updatedItems[index] = { ...item, position: newPosition };
              setFurnitureItems(updatedItems);
            }}
            onTargetLineHeightChange={(positionY) => setTargetLineHeight(positionY)}
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
    </View>
  );
};

const LongRectangleRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);

  const addFurniture = (name, image) => {
    const newItem = { name, image, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <Drawer.Navigator
      initialRouteName="LongRectangleRoomScreen"
      drawerType="slide"
      drawerPosition="left"
      overlayColor="transparent"
      drawerContent={(props) => <CustomDrawerContent {...props} addFurniture={addFurniture} />}
      drawerStyle={styles.drawer}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          width: 250,
        },
        headerTitle: '',
        headerStyle: {
          height: 50,
        },
        headerLeft: () => (
          <TouchableOpacity
            style={styles.menuButtonContainer}
            onPress={() => navigation.toggleDrawer()}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="LongRectangleRoomScreen"
        children={() => (
          <LongRectangleRoomScreen 
            furnitureItems={furnitureItems} 
            setFurnitureItems={setFurnitureItems}
          />
        )}
      />
    </Drawer.Navigator>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  room: {
    width: 645,
    height: 340,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
  },
  furnitureListContainer: {
    padding: 16,
    backgroundColor: '#D5D5D5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#045497',
  },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  furnitureImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  furnitureText: {
    color: 'black',
  },
  furnitureInRoom: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  menuButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D5D5D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  menuIcon: {
    fontSize: 24,
    color: '#045497',
    fontWeight: 'bold',
  },
  drawer: {
    width: 250,
  },
  screenshotButton: {
    position: 'absolute', // Position it at the bottom right
    bottom: 0,
    right: 2,
  },
  buttonImage: {
    width: 35, // Set the desired width
    height: 35, // Set the desired height
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
});
  
export default LongRectangleRoom;
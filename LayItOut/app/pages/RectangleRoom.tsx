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
import { NavigationProp } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange, onDelete, id, deleteMode}) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = {
          x: positionRef.current.x + gestureState.dx,
          y: positionRef.current.y + gestureState.dy,
        };
        setPosition(newPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const finalPosition = {
          x: positionRef.current.x + gestureState.dx,
          y: positionRef.current.y + gestureState.dy,
        };
        positionRef.current = finalPosition;
        setPosition(finalPosition);
        onPositionChange(finalPosition);
      },
    })
  ).current;

  return (
    <View style={[styles.furnitureInRoom, { left: position.x, top: position.y }]}>
      <Image source={image} style={styles.furnitureImage} {...panResponder.panHandlers} />
      {deleteMode && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
          <Ionicons name="close-circle-outline" size={25} color="red" style={{ fontWeight: 'bold'}}/>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Main RectangleRoom screen
const RectangleRoomScreen = ({ furnitureItems, setFurnitureItems }, { navigation }: RouterProps) => {
  const viewShotRef = useRef(null); // Create a ref using useRef
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

  const [deleteMode, setDeleteMode] = useState(false);

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleDelete = (id) => {
    setFurnitureItems((prevItems) => prevItems.filter(item => item.id !== id));
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
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <View ref={viewShotRef} style={styles.room}>
        {furnitureItems.map((item) => (
          <DraggableFurniture
            key={item.id}
            id={item.id}
            image={item.image}
            initialPosition={item.position}
            onPositionChange={(newPosition) => {
              setFurnitureItems((prevItems) => {
                const updatedItems = prevItems.map((furniture) =>
                  furniture.id === item.id ? { ...furniture, position: newPosition } : furniture
                );
                return updatedItems;
              });
            }}
            onDelete={handleDelete}
            deleteMode={deleteMode}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.screenshotButton} onPress={takeScreenshot}>
        <Image 
          source={require('../../images/Camera.png')} // Update with your image path
          style={styles.buttonImage}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.globalDeleteButton} onPress={toggleDeleteMode}>
        <Ionicons name="trash-outline" size={35} color="white" />
        <Text style={styles.globalDeleteButtonText}>{deleteMode ? 'Done' : 'Delete'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const RectangleRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);

  const addFurniture = (name, image) => {
    const newItem = { id: `${name}-${Date.now()}`, name, image, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      console.log('Furniture array after addition:', updatedItems);
      return updatedItems;
    });
  };

  return (
    <Drawer.Navigator
      initialRouteName="RectangleRoomScreen"
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
        name="RectangleRoomScreen"
        children={() => (
          <RectangleRoomScreen 
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
    width: 430,
    height: 300,
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
    color: "black",
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
  furnitureInRoom: {
    width: 50,
    height: 50,
    position: 'absolute',
  },
  screenshotButton: {
    position: 'absolute', // Position it at the bottom right
    bottom: 0,
    right: 110,
  },
  buttonImage: {
    width: 35, // Set the desired width
    height: 35, // Set the desired height
  },
  deleteButton: { 
    position: 'absolute', 
    top: -10, 
    right: -10,  
    width: 25,  // Set width of the circle slightly bigger than the icon
    height: 25,  // Set height of the circle slightly bigger than the icon
    backgroundColor: 'white',
    borderRadius: 15,  // Half of the width/height to make it circular
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
    right: 100, 
    top: 10, 
    width: 120,  // Set a fixed width for the background box
    height: 50, // Set a fixed height for the background box
    backgroundColor: 'red',
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
});

export default RectangleRoom;
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
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';

const scaleFactor = 25

// Furniture categories organization
const furnitureCategories = {
  'Living Room': [
    { name: 'Chair', image: chair, dimensions:{width: 2.2, height: 1.3} },
    { name: 'Bookshelf', image: bookshelf, dimensions:{width: 2.6, height: 3} }
  ],
  'Bedroom': [
    { name: 'Bed', image: bed, dimensions:{width: 5, height: 6.7} }
  ],
  'Kitchen': [],
  'Bathroom': []
};

// Keep your existing DraggableFurniture component unchanged
const DraggableFurniture = ({ image, initialPosition, onPositionChange, dimensions, scaledWidth, scaledHeight }) => {
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

  const newWidth = dimensions.width * scaledWidth
  const newHeight = dimensions.height * scaledHeight

  return (
    <Image
      source={image}
      style={[styles.furnitureInRoom, { left: position.x, top: position.y, width: newWidth, height: newHeight }]}
      resizeMode='contain'
      {...panResponder.panHandlers}
    />
  );
};

// Furniture sidebar component
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
                    onPress={() => addFurniture(item.name.toLowerCase(), item.image, item.dimensions)}
                  >
                    <Image source={item.image} style={styles.furnitureImage} />
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

// Keep your existing CustomRoomScreen component unchanged
const CustomRoomScreen = ({ furnitureItems, setFurnitureItems, navigation }: any) => {
  const [roomDimensions, setRoomDimensions] = useState({ width: 450, height: 300 });
  const viewShotRef = useRef(null); // Create a ref using useRef
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;
  const [widthScale, setWidthScaleFactor] = useState(25); // Default value
  const [heightScale, setHeightScaleFactor] = useState(25); // Default value


  useEffect(() => {
    const fetchRoomData = async () => {
      if (!uid) return; // Only fetch data if user is logged in

      try {
        // Create a query to get the most recent room by sorting by `createdAt` and limiting to 1 document
        const roomRef = collection(FIREBASE_DB, `rooms/${uid}/userRooms`);
        const most_recent = query(roomRef, orderBy('createdAt', 'desc'), limit(1)); // Assuming `createdAt` field exists

        const querySnapshot = await getDocs(most_recent);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          // Check if the data contains valid width and height
          if ((data.width && data.height) && (data.width <= 450 && data.height <= 300)) {
            setRoomDimensions({
              width: parseInt(data.width) * 25, // Adjust width if necessary
              height: parseInt(data.height) * 25, // Adjust height if necessary
            });
          }
          else {
            const baseWidth = 450; 
            const baseHeight = 300; 

            const widthScale = parseInt(data.width) / baseWidth;
            const heightScale = parseInt(data.height) / baseHeight; 
            setWidthScaleFactor(widthScale)
            setHeightScaleFactor(heightScale)

            setRoomDimensions({
              width: parseInt(data.width) * widthScale,
              height: parseInt(data.height) * heightScale,
            })
          }
        });
      } catch (error) {
        console.error("Error fetching room data: ", error);
      }
    };

    // Call fetchRoomData function to fetch data when component mounts
    fetchRoomData();
  }, [uid]);
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
      <StatusBar backgroundColor="black" />
      <View style={[styles.room, { width: roomDimensions.width, height: roomDimensions.height }]}>
        {furnitureItems.map((item, index) => (
          <DraggableFurniture
            key={index}
            image={item.image}
            dimensions={item.dimensions}
            initialPosition={item.position}
            onPositionChange={(newPosition) => {
              const updatedItems = [...furnitureItems];
              updatedItems[index] = { ...item, position: newPosition };
              setFurnitureItems(updatedItems);
            }}
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

const CustomRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);

  const addFurniture = (name, image, dimensions) => {
    const newItem = { name, image, dimensions, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <FurnitureSidebar addFurniture={addFurniture} />
      <View style={styles.mainContent} ref={viewShotRef}>
        <View style={styles.room}>
          {furnitureItems.map((item, index) => (
            <DraggableFurniture
              key={index}
              image={item.image}
              dimensions={item.dimensions}
              initialPosition={item.position}
              onPositionChange={(newPosition) => {
                const updatedItems = [...furnitureItems];
                updatedItems[index] = { ...item, position: newPosition };
                setFurnitureItems(updatedItems);
              }}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.screenshotButton} onPress={takeScreenshot}>
          <Image 
            source={require('../../images/Camera.png')}
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
    </View>
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
});
  
export default CustomRoom;
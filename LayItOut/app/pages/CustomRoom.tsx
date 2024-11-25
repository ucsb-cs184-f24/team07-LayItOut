import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder, ScrollView } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { NavigationProp } from '@react-navigation/native';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Direct imports for all furniture
import bathsink from '../../images/bathsink.png';
import bathtub from '../../images/bathtub3.png';
import bookshelf from '../../images/bookshelf_2.png';
import chair from '../../images/Chair.png';
import chair2 from '../../images/chair2.png';
import consoleTable from '../../images/consule.png';
import countertop from '../../images/countertop.png';
import dining from '../../images/dining.png';
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
import sink from '../../images/sink.png';
import tv from '../../images/tv.png';

const scaleFactor = 15;

// Furniture categories organization
const furnitureCategories = {
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

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange, dimensions, onDelete, id, deleteMode}) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = {
          x: positionRef.current.x + gestureState.dx * 0.5,
          y: positionRef.current.y + gestureState.dy * 0.5,
        };
        setPosition(newPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
        const finalPosition = {
          x: positionRef.current.x + gestureState.dx * 0.5,
          y: positionRef.current.y + gestureState.dy * 0.5,
        };
        positionRef.current = finalPosition;
        setPosition(finalPosition);
        onPositionChange(finalPosition);
      },
    })
  ).current;

  const scaledWidth = dimensions.width * scaleFactor
  const scaledHeight = dimensions.height * scaleFactor

  return (
    <View style={[styles.furnitureInRoom, { left: position.x, top: position.y, width: scaledWidth, height: scaledHeight }]}>
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
                    onPress={() => addFurniture(item.name, item.image, item.dimensions)}
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

const LongRectangleRoom = () => {
  const [roomDimensions, setRoomDimensions] = useState({ width: 450, height: 300 });
  const [furnitureItems, setFurnitureItems] = useState([]);
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
          if (data.width && data.height) {
            if (data.width > 30 && data.height > 20) {
              setRoomDimensions({
                width: parseInt(data.width) / 30 * 25, // Adjust width if necessary
                height: parseInt(data.height) / 20 * 25, // Adjust height if necessary
              });
            }
            else if (data.height > 20) {
              setRoomDimensions({
                width: data.width * 25, // Adjust width if necessary
                height: parseInt(data.height) / 20 * 25, // Adjust height if necessary
              });
            }
            else if (data.width > 30) {
              setRoomDimensions({
                width: parseInt(data.width) / 30 * 25, // Adjust width if necessary
                height: data.height * 25, // Adjust height if necessary
              });
            }
            else {
              setRoomDimensions({
                width: data.width * scaleFactor,
                height: data.height * scaleFactor, 
              });
            }
            }            
          }
        );
      } catch (error) {
        //console.error("Error fetching room data: ", error);
      }
    };

    // Call fetchRoomData function to fetch data when component mounts
    fetchRoomData();
  }, [uid]);
  
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
  // Add the debugging useEffect here
  useEffect(() => {
    //console.log('Furniture items updated:');
    furnitureItems.forEach((item, idx) => {
      //console.log(`Furniture ${idx}: ${item.name}, Position: x=${item.position.x}, y=${item.position.y}`);
    });
  }, [furnitureItems]); // This will run whenever furnitureItems changes

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
      <FurnitureSidebar addFurniture={(name, image, dimensions) => {
        const newItem = { id: `${name}-${Date.now()}`, name, image, dimensions, position: { x: ((roomDimensions.width/scaleFactor)/2), y: ((roomDimensions.height/scaleFactor/2)) } };
        setFurnitureItems((prevItems) => [...prevItems, newItem]);
      }} />
      <View style={styles.mainContent}>
      <View ref={viewShotRef} style={[styles.room, { width: roomDimensions.width, height: roomDimensions.height }]}>
      {furnitureItems.map((item) => (
        <DraggableFurniture
          key = {item.id}
          id = {item.id}
          image={item.image}
          dimensions={item.dimensions}
          initialPosition={item.position}
          onPositionChange={(newPosition) => {
            setFurnitureItems((prevItems) => {
              const updatedItems = prevItems.map((furniture) =>
                furniture.id === item.id ? { ...furniture, position: newPosition } : furniture
              );
              //console.log('Furniture array after move:', updatedItems);
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
    width: 450,
    height: 300,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
    left: -10,
  },
  longRoom: {
    width: 500,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
  },
  // pretty sure this isn't being used ^^ 
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#045497',
    textAlign: 'center',
    paddingLeft: 9,
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
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
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
    bottom: 57,
    right: 15,
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

export default LongRectangleRoom;
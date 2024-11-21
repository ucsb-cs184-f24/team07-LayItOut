import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

import chair from '../../images/Chair.png';
import bed from '../../images/Bed.png';
import bookshelf from '../../images/bookshelf_2.png';

// Furniture categories organization
const furnitureCategories = {
  'Living Room': [
    { name: 'Chair', image: chair },
    { name: 'Bookshelf', image: bookshelf }
  ],
  'Bedroom': [
    { name: 'Bed', image: bed }
  ],
  'Kitchen': [],
  'Bathroom': []
};

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange, onDelete, id, deleteMode}) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
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
                    onPress={() => addFurniture(item.name, item.image)}
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

// Main component
const SquareRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);
  const viewShotRef = useRef(null);
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

  const [deleteMode, setDeleteMode] = useState(false);

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const handleDelete = (id) => {
    setFurnitureItems((prevItems) => prevItems.filter(item => item.id !== id));
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

  const addFurniture = (name, image) => {
    const newItem = { id: `${name}-${Date.now()}`, name, image, position: { x: 155, y: 155 } };
    setFurnitureItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      //console.log('Furniture array after addition:', updatedItems);
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
    width: 310,
    height: 310,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
  },
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
    bottom: 25,
    right: 20,
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

export default SquareRoom;
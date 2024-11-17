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

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange, onDelete, id }) => {
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
      
      {/* Delete Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(id)}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const SquareRoomScreen = ({ furnitureItems, setFurnitureItems }, { navigation }: RouterProps) => {
  const viewShotRef = useRef(null);
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

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

  const takeScreenshot = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await captureRef(viewShotRef.current, {
          format: 'png',
          quality: 0.8,
        });
        console.log("Screenshot captured:", uri);

        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          const asset = await MediaLibrary.createAssetAsync(uri);
          console.log('Screenshot saved to gallery!', asset);

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

  // Handle furniture item deletion
  const handleDelete = (id) => {
    setFurnitureItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  return (
    <View style={styles.container} ref={viewShotRef}>
      <StatusBar backgroundColor="black" />
      <View style={styles.room}>
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
            onDelete={handleDelete} // Pass handleDelete function
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
  );
};

const SquareRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);

  const addFurniture = (name, image) => {
    const newItem = { id: `${name}-${Date.now()}`, name, image, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <Drawer.Navigator
      initialRouteName="SquareRoomScreen"
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
        name="SquareRoomScreen"
        children={() => (
          <SquareRoomScreen 
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
    width: 310,
    height: 310,
    aspectRatio: 1,
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
  deleteButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 18,
  },
  screenshotButton: {
    position: 'absolute', 
    bottom: 0,
    right: 170,
  },
  buttonImage: {
    width: 35, 
    height: 35, 
  },
});

export default SquareRoom;

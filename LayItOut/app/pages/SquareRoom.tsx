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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FIREBASE_AUTH } from '../../FirebaseConfig';

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const Drawer = createDrawerNavigator();

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

// Custom drawer content with categorized furniture items
const CustomDrawerContent = (props) => {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.furnitureListContainer}>
        <Text style={styles.title}>Furniture List</Text>
        
        {Object.entries(furnitureCategories).map(([category, items]) => (
          <View key={category} style={{ width: '100%', alignItems: 'center' }}>
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
                onPress={() => props.addFurniture(item.name.toLowerCase(), item.image)}
              >
                <Image source={item.image} style={styles.furnitureImage} />
                <Text style={styles.furnitureText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange }) => {
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
    <Image
      source={image}
      style={[styles.furnitureInRoom, { left: position.x, top: position.y }]}
      {...panResponder.panHandlers}
    />
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

  return (
    <View style={styles.container} ref={viewShotRef}>
      <StatusBar backgroundColor="black" />
      <View style={styles.room}>
        {furnitureItems.map((item, index) => (
          <DraggableFurniture
            key={index}
            image={item.image}
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
  );
};

const SquareRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);

  const addFurniture = (name, image) => {
    const newItem = { name, image, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <Drawer.Navigator
      initialRouteName="SquareRoomScreen"
      drawerType="slide"
      drawerPosition="left"
      overlayColor="transparent"
      drawerContent={(props) => <CustomDrawerContent {...props} addFurniture={addFurniture} />}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          width: 300,
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
    padding: 8,
    backgroundColor: '#D5D5D5',
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#045497',
    textAlign: 'center',
    width: '100%',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#045497',
    borderRadius: 12,
    marginBottom: 12,
    width: '80%',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    paddingLeft: 8,
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    paddingRight: 8,
  },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
    width: '75%',
    justifyContent: 'flex-start',
  },
  furnitureImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  furnitureText: {
    color: "black",
    fontSize: 16,
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
    width: 280,
  },
  furnitureInRoom: {
    width: 50,
    height: 50,
    position: 'absolute',
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
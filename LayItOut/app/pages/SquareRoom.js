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

const Drawer = createDrawerNavigator();
const scaleFactor = 25

// Custom drawer content with furniture items
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.furnitureListContainer}>
      <Text style={styles.title}>Furniture List</Text>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('chair', chair, { width: 2.2, height: 1.3 })}>
        <Image source={chair} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Chair</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('bed', bed, { width: 5, height: 6.7 })}>
        <Image source={bed} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Bed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('bookshelf', bookshelf, { width: 2.6, height: 3 })}>
        <Image source={bookshelf} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Bookshelf</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange, dimensions }) => {
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

const scaledWidth = dimensions.width * scaleFactor
const scaledHeight = dimensions.height * scaleFactor 

  return (
    <Image
      source={image}
      style={[styles.furnitureInRoom, { left: position.x, top: position.y, width: scaledWidth, height: scaledHeight }]}
      resizeMode='contain'
      {...panResponder.panHandlers}
    />
  );
};

// Main SquareRoom screen
const SquareRoomScreen = ({ furnitureItems, setFurnitureItems }) => {
  const viewShotRef = useRef(null); // Create a ref using useRef
  useFocusEffect(
    React.useCallback(() => {
      const lockLandscape = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      };
      lockLandscape();
      return async () => {
        await ScreenOrientation.unlockAsync();
      };
    }, [])
  );
  const takeScreenshot = async () => {
    if (viewShotRef.current) {
      try {
        // Capture the screenshot using captureRef
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

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
          alert('Screenshot saved successfully!');
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
            dimensions={item.dimensions}
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

const SquareRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);

  const addFurniture = (name, image, dimensions) => {
    const newItem = { name, image, dimensions, position: { x: 20, y: 20 } };
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
    // using scale factor of 25 so this is a 12 x 12 room
    width: 300,
    height: 300,
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
  screenshotButton: {
    position: 'absolute', // Position it at the bottom right
    bottom: 0,
    right: 140,
  },
  buttonImage: {
    width: 40, // Set the desired width
    height: 40, // Set the desired height
  },
});

export default SquareRoom;
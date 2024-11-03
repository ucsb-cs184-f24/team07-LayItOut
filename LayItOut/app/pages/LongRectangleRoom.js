import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import chair from '../../images/Chair.png';
import bed from '../../images/Bed.png';
import bookshelf from '../../images/bookshelf_1.png';

const Drawer = createDrawerNavigator();

// Custom drawer content with furniture items
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.furnitureListContainer}>
      <Text style={styles.title}>Furniture</Text>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('chair', chair)}>
        <Image source={chair} style={styles.furnitureImage} />
        <Text>Chair</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('bed', bed)}>
        <Image source={bed} style={styles.furnitureImage} />
        <Text>Bed</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.furnitureItem} onPress={() => props.addFurniture('bookshelf', bookshelf)}>
        <Image source={bookshelf} style={styles.furnitureImage} />
        <Text>Bookshelf</Text>
      </TouchableOpacity>
      {/* Add more furniture items as needed */}
    </DrawerContentScrollView>
  );
};

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // When drag starts, set position to the current position
        setPosition(prev => ({ ...prev })); // Keep the current position
      },
      onPanResponderMove: (evt, gestureState) => {
        setPosition({
          x: initialPosition.x + gestureState.dx, // Update position based on the drag
          y: initialPosition.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        // Update the initial position to the current position when dragging ends
        initialPosition.x = position.x;
        initialPosition.y = position.y;
      },
    })
  ).current;

  return (
    <Image
      source={image}
      style={[styles.furnitureInRoom, { left: position.x, top: position.y }]}
      {...panResponder.panHandlers} // Attach the pan responder
    />
  );
};

// Main LongRectangleRoom screen
const LongRectangleRoomScreen = ({ furnitureItems }) => {
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <View style={styles.room}>
        {/* Render added furniture items in the room */}
        {furnitureItems.map((item, index) => (
          <DraggableFurniture
            key={index}
            image={item.image}
            initialPosition={{ x: 20, y: 20 }} // You can modify this starting position if needed
          />
        ))}
      </View>
    </View>
  );
};

const LongRectangleRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]); // State to track added furniture items

  const addFurniture = (name, image) => {
    // Logic to add furniture to the room
    const newItem = { name, image }; // No need for x and y here
    setFurnitureItems(prevItems => [...prevItems, newItem]);
    console.log(`Added ${name} to the room`, image);
  };

  return (
    <Drawer.Navigator
      initialRouteName="LongRectangleRoomScreen"
      drawerType="slide"
      drawerPosition="left"
      overlayColor="transparent"
      drawerContent={(props) => <CustomDrawerContent {...props} addFurniture={addFurniture} />}
    >
      <Drawer.Screen
        name="LongRectangleRoomScreen"
        children={() => <LongRectangleRoomScreen furnitureItems={furnitureItems} />}
        options={{ title: 'Long Rectangle Room' }}
      />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  room: {
    width: 670,
    height: 340,
    borderWidth: 3,
    borderColor: 'blue',
    backgroundColor: '#ADD8E6',
    position: 'relative', // Allow absolute positioning of furniture items
  },
  furnitureListContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  furnitureInRoom: {
    width: 50,
    height: 50,
    position: 'absolute', // Allow positioning within the room
  },
});

export default LongRectangleRoom;

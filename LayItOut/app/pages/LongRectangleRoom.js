import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import chair from '../../images/Chair.png';
import bed from '../../images/Bed.png';
import bookshelf from '../../images/bookshelf_1.png';

const Drawer = createDrawerNavigator();

// Custom drawer content with furniture items
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.furnitureListContainer}>
      <Text style={styles.title}>Furniture List</Text>
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
    </DrawerContentScrollView>
  );
};

// Draggable furniture component
const DraggableFurniture = ({ image, initialPosition, onPositionChange }) => {
  const positionRef = useRef(initialPosition);
  const [position, setPosition] = useState(initialPosition); // Local state to manage position during drag

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        console.log('Drag started at:', position);
      },
      onPanResponderMove: (evt, gestureState) => {
        // Calculate new position based on gesture movement
        const newPosition = {
          x: positionRef.current.x + gestureState.dx,
          y: positionRef.current.y + gestureState.dy,
        };
        setPosition(newPosition); // Update local position
        console.log('Dragging to:', newPosition);
      },
      onPanResponderRelease: (evt, gestureState) => {
        // Calculate the final position on release
        const finalPosition = {
          x: positionRef.current.x + gestureState.dx,
          y: positionRef.current.y + gestureState.dy,
        };
        positionRef.current = finalPosition; // Update ref to the new final position
        setPosition(finalPosition); // Update local position
        onPositionChange(finalPosition); // Notify parent about the new position
        console.log('Drag released at:', finalPosition);
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

// Main LongRectangleRoom screen
const LongRectangleRoomScreen = ({ furnitureItems, setFurnitureItems }) => {
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
        {furnitureItems.map((item, index) => (
          <DraggableFurniture
            key={index}
            image={item.image}
            initialPosition={item.position} // Pass initial position here
            onPositionChange={(newPosition) => {
              // Update parent state with the latest position
              const updatedItems = [...furnitureItems];
              updatedItems[index] = { ...item, position: newPosition };
              setFurnitureItems(updatedItems);
              console.log('Updated position for', item.name, 'to', newPosition);
            }}
          />
        ))}
      </View>
    </View>
  );
};

const LongRectangleRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]); // State to track added furniture items

  const addFurniture = (name, image) => {
    const newItem = { name, image, position: { x: 20, y: 20 } }; // Initial position
    setFurnitureItems((prevItems) => [...prevItems, newItem]);
    console.log(`Added ${name} to the room at position`, newItem.position);
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
        children={() => (
          <LongRectangleRoomScreen furnitureItems={furnitureItems} setFurnitureItems={setFurnitureItems} />
        )}
        options={{ title: 'Furniture List' }}
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
    position: 'absolute',
  },
});

export default LongRectangleRoom;

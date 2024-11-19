import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder, ScrollView } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import camera from '../../images/Camera.png';

const scaleFactor = 25

// Direct imports for all furniture
import bathsink from '../../images/bathsink.png';
import bathtub from '../../images/bathub 3.png';
import bookshelf from '../../images/bookshelf_2.png';
import chair from '../../images/Chair.png';
import chair2 from '../../images/chair2.png';
import consoleTable from '../../images/consule.png';
import countertop from '../../images/countertop.png';
import dining from '../../images/dining.png';
import fireplace from '../../images/fireplace.png';
import fridge from '../../images/fridge.png';
import kitchenIsland from '../../images/kitcehn island.png';
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
import Chair from '../../images/Chair.png';
import sink from '../../images/sink.png';
import diningtable from '../../images/diningtable.png';
import stovee from '../../images/stovee.png';

// Furniture categories organization
const furnitureCategories = {
  'Living Room': [
    { name: 'Sofa (2-Seater)', image: sofa2, dimmensions:{width: 4, height: 3} },
    { name: 'Sofa (3-Seater)', image: sofa3, dimmensions:{width: 5, height: 3} },
    { name: 'Chair', image: chair, dimmensions:{width: 2.8, height: 2} },
    { name: 'Side Table 1', image: side1, dimmensions:{width: 1, height: 2} },
    { name: 'Side Table 2', image: side2, dimmensions:{width: 1.5, height: 2} },
    { name: 'Bookshelf', image: bookshelf, dimmensions:{width: 2.5, height: 3} },
    { name: 'Console Table', image: consoleTable, dimmensions:{width: 4.8, height: 4.8} },
    { name: 'Fireplace', image: fireplace, dimmensions:{width: 3, height: 2.5} },
    { name: 'Coffee Table', image: table1, dimmensions:{width: 2, height: 3} },
    { name: 'Lamp', image: lamp, dimmensions:{width: 2, height: 5} }
  ],
  'Bedroom': [
    { name: 'Queen Bed', image: queenbed, dimmensions:{width: 5, height: 6.7} },
    { name: 'Bedside Table', image: sidebed, dimmensions:{width: 1, height: 2} },
    { name: 'Wardrobe', image: wardrobe, dimmensions:{width: 2.5, height: 6} },
    { name: 'Office Chair', image: officeChair, dimmensions:{width: 1.6, height: 1.3} },
    { name: 'Table', image: table, dimmensions:{width: 4, height: 2.5} }
  ],
  'Kitchen': [
    { name: 'Refrigerator', image: fridge, dimmensions:{width: 29/12, height: 62/12} },
    { name: 'Sink', image: sink, dimmensions:{width: 22/12, height: 30/12} }, 
    { name: 'Kitchen Island', image: kitchenIsland, dimmensions:{width: 40/12, height: 80/12} },
    { name: 'Kitchen Table', image: kitchenTable, dimmensions:{width: 4, height: 4} },
    { name: 'Countertop', image: countertop, dimmensions:{width: 25/12, height: 3} },
    { name: 'Oven', image: oven, dimmensions:{width: 2.5, height: 3} },
    { name: 'Stove', image: stovee, dimmensions:{width: 2.5, height: 3} }, 
    { name: 'Dining Set', image: diningtable, dimmensions:{width: 4, height: 4} },
    { name: 'Dining Chair', image: chair2, dimmensions:{width: 2, height: 2} },
    { name: 'Dining Table', image: table3, dimmensions:{width: 4, height: 4} },
    { name: 'Trash Can', image: trashcan, dimmensions:{width: 2.5, height: 3} }, 
  ],
  'Bathroom': [
    { name: 'Bathtub', image: bathtub, dimmensions:{width: 2.5, height: 14/12} },
    { name: 'Sink', image: bathsink, dimmensions:{width: 19/12, height: 16/12} },
    { name: 'Toilet', image: toilet, dimmensions:{width: 20/12, height: 27/12} },
    { name: 'Washing Machine', image: washingMachine, dimmensions:{width: 27/12, height: 39/12} }
  ]
};

// Draggable furniture component stays the same
const DraggableFurniture = ({ image, initialPosition, onPositionChange, dimensions }) => {
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

// Furniture sidebar component stays the same
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
const RectangleRoom = () => {
  const [furnitureItems, setFurnitureItems] = useState([]);
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

  const addFurniture = (name, image, dimensions) => {
    const newItem = { name, image, dimensions, position: { x: 20, y: 20 } };
    setFurnitureItems((prevItems) => [...prevItems, newItem]);
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
            source={camera}
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
    // using scale factor of 25 so this is a 18 x 12 room
    width: 450,
    height: 300,
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
    right: 70,
  },
  buttonImage: {
    width: 35,
    height: 35,
  },
});

export default RectangleRoom;
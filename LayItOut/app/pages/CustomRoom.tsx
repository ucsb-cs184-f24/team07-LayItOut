import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, PanResponder, ScrollView, ActivityIndicator } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import chair from '../../images/Chair.png';
import bed from '../../images/Bed.png';
import bookshelf from '../../images/bookshelf_2.png';
import { useFonts } from 'expo-font'; 

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
const DraggableFurniture = ({ image, initialPosition, onPositionChange }) => {
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
    <Image
      source={image}
      style={[styles.furnitureInRoom, { left: position.x, top: position.y }]}
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

const LongRectangleRoom = () => {
  const [roomDimensions, setRoomDimensions] = useState({ width: 625, height: 340 });
  const [furnitureItems, setFurnitureItems] = useState([]);
  const viewShotRef = useRef(null); // Create a ref using useRef
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

  //Load custom font
  const [fontsLoaded] = useFonts({
    'LondrinaLight': require('../../assets/fonts/LondrinaSolidLight.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }

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
            setRoomDimensions({
              width: parseInt(data.width) * 50, // Adjust width if necessary
              height: parseInt(data.height) * 50, // Adjust height if necessary
            });
          }
        });
      } catch (error) {
        //console.error("Error fetching room data: ", error);
      }
    };

    // Call fetchRoomData function to fetch data when component mounts
    fetchRoomData();
  }, [uid]);
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
            setRoomDimensions({
              width: parseInt(data.width) * 50, // Adjust width if necessary
              height: parseInt(data.height) * 50, // Adjust height if necessary
            });
          }
        });
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
      <FurnitureSidebar addFurniture={(name, image) => {
        const newItem = { id: `${name}-${Date.now()}`, name, image, position: { x: 20, y: 20 } };
        setFurnitureItems((prevItems) => [...prevItems, newItem]);
      }} />
      <View style={styles.mainContent} ref={viewShotRef}>
        {/* Added Room Dimensions */}

        {/* Width Text */}
        <Text
          style={[
            styles.dimensionText, 
            styles.topDimension,
            {
              top: -(roomDimensions.height / 2) - 20,  
              left: roomDimensions.width / 2 - 50,
            },
          ]}
        >
          Width: {roomDimensions.width / 50} ft
        </Text>

        {/* Height Text */}
        <Text
          style={[
            styles.dimensionText, 
            styles.leftDimension,
            {
              top: roomDimensions.height  / 2 - 50,
              left: -(roomDimensions.width / 2) - 50,          // + 300
            },
          ]}
        >
          Height: {roomDimensions.height / 50} ft
        </Text>


      <View style={[styles.room, { width: roomDimensions.width, height: roomDimensions.height }]}>
      {furnitureItems.map((item, index) => (
        <DraggableFurniture
          key = {item.id}
          image={item.image}
          initialPosition={item.position}
          onPositionChange={(newPosition) => {
            setFurnitureItems((prevItems) => {
              const updatedItems = prevItems.map((furniture, idx) =>
                idx === index ? { ...furniture, position: newPosition } : furniture
              );
              //console.log('Furniture array after move:', updatedItems);
              return updatedItems;
            });
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  room: {
    width: 645,
    height: 340,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
  },
  sidebar: {
    width: 190,
    backgroundColor: '#D5D5D5',
    padding: 12,
    height: '100%',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  longRoom: {
    width: 500,
    height: 250,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
    position: 'relative',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#045497',
    textAlign: 'center',
    fontFamily: 'LondrinaLight',
    letterSpacing: 1,
  },
  dimensionText: {
    position: 'absolute', 
    color: '#A0A0A0', 
    fontWeight: 500, 
    fontSize: 14.5,         //adjust size to be smaller if needed. 
    backgroundColor: 'transparent',
    paddingVertical: 4, 
    paddingHorizontal: 8, 
    borderRadius: 4, 
    zIndex: 10,
    fontFamily: 'LondrinaLight',
    letterSpacing: 1.55,
  },
  topDimension: {
    // position: 'absolute',
    // textAlign: 'center',
    transform: [{ translateX: -50 }], 
  },
  leftDimension: {
    // position: 'absolute',
    // textAlign: 'center',
    transform: [{ translateX: -50 }, { rotate: '-90deg' }], 
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
    borderRadius: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'LondrinaLight',
    letterSpacing: 1,
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
    color: "black",
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
});

export default LongRectangleRoom;
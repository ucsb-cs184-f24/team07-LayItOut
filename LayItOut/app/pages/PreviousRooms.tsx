import React, { useState, useEffect } from 'react';
import { View, FlatList, ImageBackground, StatusBar, Image, Text, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_APP } from '../../FirebaseConfig';  // Ensure the firebase config is correct

const SquareRoom = () => {
  const [screenshots, setScreenshots] = useState<string[]>([]);

  // Fetch images from Firestore
  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const firestore = getFirestore(FIREBASE_APP);
        const screenshotCollection = collection(firestore, 'screenshots');
        const snapshot = await getDocs(screenshotCollection);

        const urls: string[] = [];
        
        snapshot.forEach((doc) => {
          const downloadURL = doc.data().downloadURL;  // Assuming the Firestore document has a 'downloadURL' field
          if (downloadURL) {
            urls.push(downloadURL);  // Add URL to the array
          }
        });

        setScreenshots(urls);  // Set the URLs in state
      } catch (error) {
        console.error('Error fetching screenshots: ', error);
      }
    };

    fetchScreenshots();
  }, []); // Empty dependency array ensures this runs once on mount

  // Render each item in the FlatList
  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}  // Use the image URL to display
        style={styles.image}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ImageBackground
        source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
        style={styles.background}
      >
        <FlatList
          data={screenshots}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          numColumns={2} // Display images in 2 columns
          columnWrapperStyle={styles.columnWrapper} // Add some spacing between columns
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    marginBottom: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
});

export default SquareRoom;

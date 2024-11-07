import React, { useState, useEffect } from 'react';
import { View, FlatList, ImageBackground, StatusBar, Image, Text, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { FIREBASE_APP, FIREBASE_AUTH } from '../../FirebaseConfig';  // Ensure the firebase config and auth are correct

const PreviousRooms = () => {
  const [screenshots, setScreenshots] = useState<string[]>([]);

  useEffect(() => {
    const fetchScreenshots = async () => {
      try {
        const firestore = getFirestore(FIREBASE_APP);
        const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

        if (uid) {
          const screenshotCollection = collection(firestore, 'screenshots');
          const q = query(screenshotCollection, where('uid', '==', uid)); // Filter by current user's uid
          const snapshot = await getDocs(q);

          const urls: string[] = [];
          snapshot.forEach((doc) => {
            const downloadURL = doc.data().downloadURL;
            if (downloadURL) {
              urls.push(downloadURL);  // Add URL to the array
            }
          });

          setScreenshots(urls);  // Set the URLs in state
        }
      } catch (error) {
        console.error('Error fetching screenshots: ', error);
      }
    };

    fetchScreenshots();
  }, []); // Empty dependency array ensures this runs once on mount

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
        source={require('../../images/no-shapes.jpg')}
        style={styles.background}
      >
        <FlatList
          data={screenshots}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
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

export default PreviousRooms;

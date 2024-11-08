import React, { useState, useEffect } from 'react';
import { View, FlatList, ImageBackground, StatusBar, Image, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_APP, FIREBASE_AUTH } from '../../FirebaseConfig';  // Ensure the firebase config and auth are correct

const PreviousRooms = () => {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch screenshots from Firestore
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
            // Check if downloadURL is a valid string before pushing to the array
            if (typeof downloadURL === 'string' && downloadURL.trim().length > 0) {
              urls.push(downloadURL);  // Add valid URL to the array
            } else {
              console.error('Invalid downloadURL:', downloadURL);  // Log invalid URL for debugging
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

  // Function to open modal with the selected image
  const openModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  // Render each image in the grid
  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.imageContainer}>
      <Image
        source={{ uri: item }}  // Use the image URL to display
        style={styles.image}
      />
    </TouchableOpacity>
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

      {/* Modal for displaying the image in full screen */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <Image 
              source={require('../../images/Close_Circle.png')}  // Ensure the path is correct
              style={styles.buttonImage}  // Style for the button
            />
          </TouchableOpacity>

          {/* Display selected image if available */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
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
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 5,
    padding: 5,  // Padding around the image to create space for the white border
    backgroundColor: 'white',  // White background for the border effect
    borderRadius: 10, 
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',  // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 80,  // Adjusted position to be closer to the top
    right: 30,  // Adjusted to be closer to the right corner
    zIndex: 1,  // Make sure it appears on top
  },
  buttonImage: {
    width: 25,  // Increased size of the icon
    height: 25,  // Increased size of the icon
    tintColor: 'white',  // Optional: Add tint color if you want the icon to be white
  },
  fullScreenImage: {
    width: '110%',
    height: '115%',
  },
});

export default PreviousRooms;

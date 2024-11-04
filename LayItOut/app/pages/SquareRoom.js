import React, { useEffect, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { uploadImageToFirebaseViaREST } from '../../FirebaseConfig'; // Ensure the path is correct
import * as FileSystem from 'expo-file-system';

const SquareRoom = () => {
  const viewShotRef = useRef(null); // Create a ref using useRef

  useEffect(() => {
    // Lock orientation to landscape when the component mounts
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
    };
    setOrientation();

    // Cleanup function to unlock orientation when the component unmounts
    return () => {
      const unlockOrientation = async () => {
        await ScreenOrientation.unlockAsync(); // Unlock to return to the default orientation
      };
      unlockOrientation();
    };
  }, []); // Empty dependency array ensures this runs on mount and unmount only

  const takeScreenshot = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await captureRef(viewShotRef.current, {
          format: 'png',
          quality: 0.8,
        });
        
        // Fetch the URI to retrieve the actual blob
        const response = await fetch(uri);
        const blob = await response.blob();
  
        await uploadImageToFirebaseViaREST(blob);
      } catch (error) {
        console.error("Error taking screenshot:", error);
        alert("Failed to save screenshot. Error: " + error.message);
      }
    }
  };

  return (
    <View style={styles.container} ref={viewShotRef}>
      <StatusBar backgroundColor="black" />
      <View style={styles.room} />
      <TouchableOpacity style={styles.screenshotButton} onPress={takeScreenshot}>
        <Image 
          source={require('../../images/Camera.png')} // Update with your image path
          style={styles.buttonImage}
        />
      </TouchableOpacity>
    </View>
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
    width: 350,
    height: 315,
    aspectRatio: 1,
    borderWidth: 3,
    borderColor: 'blue',
    backgroundColor: '#ADD8E6',
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

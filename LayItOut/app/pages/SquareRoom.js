import React, { useEffect, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { uploadImageToFirebase } from '../../FirebaseConfig'; // Ensure the path is correct

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
      // Lock the screen orientation to landscape left
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);

      // Capture the screenshot
      const uri = await captureRef(viewShotRef.current, {
        format: 'png',
        quality: 0.8,
      });

      console.log("Screenshot captured:", uri); // Log the captured URI

      // Check if the URI is defined
      if (uri) {
        await uploadImageToFirebase(uri); // Upload screenshot to Firebase
      } else {
        console.error("Failed to capture screenshot: URI is undefined");
        alert('Failed to capture screenshot. URI is undefined.');
      }
    } catch (error) {
      console.error("Error taking screenshot:", error);
      alert('Failed to save screenshot. Error: ' + error.message);
    } finally {
      // Optionally, unlock the orientation back to the default after capturing
      await ScreenOrientation.unlockAsync();
    }
  } else {
    console.error("ViewShot reference is null or undefined");
    alert('Failed to capture screenshot. ViewShot reference is not available.');
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

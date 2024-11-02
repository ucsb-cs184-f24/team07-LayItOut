import React, { useEffect, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, View, StatusBar, Button, Image, TouchableOpacity} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage


const RectangleRoom = () => {
  const viewShotRef = useRef(null); // Create a ref using useRef

  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT); // Adjust as needed
    };
    setOrientation();
  }, []);

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
      width: 550, 
      height: 315, 
      borderWidth: 3, 
      borderColor: 'blue', 
      backgroundColor: '#ADD8E6', 
  },
  screenshotButton: {
    position: 'absolute', // Position it at the bottom right
    bottom: 0,
    right: 40,
  },
  buttonImage: {
    width: 40, // Set the desired width
    height: 40, // Set the desired height
  },
});
  
export default RectangleRoom;
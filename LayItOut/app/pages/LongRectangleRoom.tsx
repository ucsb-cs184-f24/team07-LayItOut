import React, { useEffect, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationProp } from '@react-navigation/native';
import { StyleSheet, View, StatusBar, Image, TouchableOpacity} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Firebase authentication

interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const LongRectangleRoom = ({ navigation }: RouterProps) => {
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
  }, []);

  const takeScreenshot = async () => {
    // Check if the user is authenticated
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('You must be signed in to take a screenshot.');
      return;
    }

    if (viewShotRef.current) {
      try {
        // Capture the screenshot
        const uri = await captureRef(viewShotRef.current, {
          format: 'png',
          quality: 0.8,
        });
        console.log("Screenshot captured:", uri);
  
        // Request media library permissions
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === 'granted') {
          // Save to gallery
          const asset = await MediaLibrary.createAssetAsync(uri);
          console.log('Screenshot saved to gallery!', asset);
  
          // Upload to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(storage, `screenshots/${Date.now()}.png`);
  
          const response = await fetch(uri); 
          const blob = await response.blob(); 
  
          await uploadBytes(storageRef, blob); 
          const downloadURL = await getDownloadURL(storageRef);
  
          // Save URL to Firestore
          const firestore = getFirestore();
          await addDoc(collection(firestore, 'screenshots'), {
            downloadURL: downloadURL,
            userId: user.uid, // Save the user ID to associate with the screenshot
            timestamp: Date.now(),
          });
  
          // Success alert after all operations succeed
          alert('Screenshot saved successfully to Firebase and gallery!');
        } else {
          alert('Permission to access media library is required!');
        }
      } catch (error) {
        // Log the full error for debugging
        console.error("Error details:", error);
  
        // Check if the error is related to Firebase permissions or another minor issue
        if (error.code === 'storage/unauthorized') {
          alert('You do not have permission to upload files to Firebase Storage.');
        } else {
          alert('Failed to save screenshot. Please check permissions and Firebase configuration.');
        }
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
    width: 630, 
    height: 315, 
    borderWidth: 3, 
    borderColor: 'blue', 
    backgroundColor: '#ADD8E6', 
  },
  screenshotButton: {
    position: 'absolute', 
    bottom: 0,
    right: 0,
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
});

export default LongRectangleRoom;

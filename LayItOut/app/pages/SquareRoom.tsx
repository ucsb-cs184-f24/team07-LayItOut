
import React, { useEffect, useRef } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { NavigationProp } from '@react-navigation/native';
import { StyleSheet, View, StatusBar, Button, Image, TouchableOpacity} from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase storage
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import storage from '@react-native-firebase/storage';
import { FIREBASE_AUTH } from '../../FirebaseConfig';


interface RouterProps {
  navigation: NavigationProp<any, any>;
}

const SquareRoom = ({ navigation }: RouterProps) => {
  const viewShotRef = useRef(null); // Create a ref using useRef
  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

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
    if (viewShotRef.current) {
      try {
        // Capture the screenshot using captureRef
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

          // Save screenshot to Firebase Storage
          const storage = getStorage();
          const storageRef = ref(storage, `users/${uid}/${Date.now()}.png`);

          const response = await fetch(uri); // Fetch the file from the uri
          const blob = await response.blob(); // Convert to blob for Firebase upload

          await uploadBytes(storageRef, blob); // Upload to Firebase storage
          const downloadURL = await getDownloadURL(storageRef); // Get download URL

          // Save the download URL to Firestore
          const firestore = getFirestore();
          await addDoc(collection(firestore, 'screenshots'), {
            downloadURL: downloadURL,
            uid: uid, // Add the user's uid
            createdAt: new Date(), // Optional: Add timestamp for better organization
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
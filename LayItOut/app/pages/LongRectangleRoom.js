import React, { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';

const LongRectangleRoom = () => {
    
  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT); // Adjust as needed
    };
    setOrientation();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.room} />
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
        width: 670, 
        height: 340, 
        borderWidth: 3, 
        borderColor: 'blue', 
        backgroundColor: '#ADD8E6', 
    },
});
  
export default LongRectangleRoom;
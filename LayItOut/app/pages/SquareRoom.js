import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';

const SquareRoom = () => {
    
  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); // Adjust as needed
    };
    setOrientation();

    return async () => {
      await ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
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
        width: 350, 
        height: 350, 
        aspectRatio: 1,
        borderWidth: 3, 
        borderColor: 'blue', 
        backgroundColor: '#ADD8E6', 
    },
});
  
export default SquareRoom;
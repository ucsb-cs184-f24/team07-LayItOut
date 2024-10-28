import React, { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, ImageBackground, StatusBar, Dimensions } from 'react-native';

const SquareRoom = () => {
  const [layout, setLayout] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });
    
  useEffect(() => {
    const setOrientation = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT); // Adjust as needed
    };
    setOrientation();
  }, []);
    
  const onLayout = () => {
    setLayout({
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000"/>
      <ImageBackground
        source={require('../../images/no-shapes.jpg')}
        style={styles.background}
      >
        <View style={styles.room} />
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
        flex: 1, // Ensures background covers the entire container
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    room: {
        width: '93%', 
        height: '90%', 
        borderWidth: 3, 
        borderColor: 'white', 
        backgroundColor: 'rgba(255, 255, 255, 0.5)', 
    },
});
  
export default SquareRoom;

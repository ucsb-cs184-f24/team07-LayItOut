
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const PreviousRooms = () => {
  const navigation = useNavigation();


  return (
    <View>
      <StatusBar bargroundColor="#000000"/>
      <ImageBackground
        source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
        style={styles.background}
      >
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover', // Make the image cover the entire background
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    paragraph: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
  
  export default PreviousRooms;
  


import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');

const CreatePage = () => {
  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="transparent" translucent />
      
        <ImageBackground
          source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
          style={styles.background}
        >
          <View>


          </View>
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
        margin: 0, 
        padding: 0,
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
    button: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginBottom: 10,
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
  
  export default CreatePage;
  

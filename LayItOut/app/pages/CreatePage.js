import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const CreatePage = () => {
  const navigation = useNavigation();

  const handleSquareRoom = () => {
    navigation.navigate('SquareRoom');  // Navigate to SquareRoom
  };

  const handleRectangleRoom = () => {
    navigation.navigate('RectangleRoom');
  };

  const handleLongRectangleRoom = () => {
    navigation.navigate('LongRectangleRoom'); 
  };

  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="transparent" translucent />
      
        <ImageBackground
          source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
          style={styles.background}
        >
          <View>

            <Text style={styles.paragraph}>Choose a default Room Option:</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSquareRoom}
            >
              <Text style={styles.buttonText}>Square</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRectangleRoom}
            >
              <Text style={styles.buttonText}>Default Rectangle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={handleLongRectangleRoom}
            >
              <Text style={styles.buttonText}>Long Rectangle</Text>
            </TouchableOpacity>

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
        justifyContent: 'flex-start',     //leave as center if not doing paddingTop
        alignItems: 'center',
        paddingTop: 245,                // have to have flex-start
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
        fontSize: 22,
        color: '#fff',
        textAlign: 'left',
        marginBottom: 35,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 14,
        paddingHorizontal: 15,
        borderRadius: 25,
        width: 248,
        alignSelf: 'center',
        marginBottom: 13,
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
  
  export default CreatePage;
  

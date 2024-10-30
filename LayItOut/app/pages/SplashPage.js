import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

const { height, width } = Dimensions.get('window');

const SplashPage = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <StatusBar backgroundColor="transparent" translucent />
      
        <ImageBackground
          source={require('../../images/splash.png')} // Adjust the path as needed
          style={styles.background}
        >
          <View>
            <Text style={styles.title}>Lay It Out</Text>
            <Text style={styles.paragraph}>Begin planning your new space below!</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('Login')} // Navigate to Login
            >
              <Text style={styles.buttonText}>Get Started</Text>
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
  
  export default SplashPage;
  
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, StatusBar, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font'; 

const { height, width } = Dimensions.get('window');

const SplashPage = ({ navigation }) => {
  //Load custom font
  const [fontsLoaded] = useFonts({
    'LondrinaSolid': require('../../assets/fonts/LondrinaSolidRegular.ttf'),
    'LondrinaLight': require('../../assets/fonts/LondrinaSolidLight.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }

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
        fontSize: 40,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 5,
        fontFamily: 'LondrinaSolid',
        letterSpacing: 1.3,
    },
    paragraph: {
        fontSize: 19,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'LondrinaLight',
        letterSpacing: 1.2,
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 35,
        marginBottom: 10,
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'LondrinaSolid',
        letterSpacing: 0.9,
    },
});
  
  export default SplashPage;
  
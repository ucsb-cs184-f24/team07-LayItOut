
import React from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      navigation.navigate('Login');  // Navigate to Login after sign-out
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleCreateRoom = () => {
    navigation.navigate('CreatePage');  // Navigate to CreatePage
  };

  return (
    <View>
      <StatusBar bargroundColor="#000000"/>
      <ImageBackground
        source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
        style={styles.background}
      >
        <View>
          <TouchableOpacity
              style={styles.button1}
              onPress={handleCreateRoom}
            >
              <Text style={styles.buttonText}>Create a Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.button1}
            >
              <Text style={styles.buttonText}>View Previous Rooms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button2}
            onPress={handleSignOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
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
    button: {
        backgroundColor: 'white',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginBottom: 10,
    },
    button1: {
        backgroundColor: 'white',
        paddingVertical: 25,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 15,
    },
    button2: {
        backgroundColor: 'white',
        paddingVertical: 9,
        paddingHorizontal: 15,
        borderRadius: 25,
        marginBottom: 10,
        marginTop: 30,
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 19,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
  
  export default HomePage;
  
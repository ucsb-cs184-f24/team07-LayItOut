
import React, { useEffect} from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Dimensions, SafeAreaView, StatusBar } from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, deleteDoc } from 'firebase/firestore';
import { useFonts } from 'expo-font'; 


const { height, width } = Dimensions.get('window');

const HomePage = () => {

  const [fontsLoaded] = useFonts({
    'LondrinaSolid': require('../../assets/fonts/LondrinaSolidRegular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }

  const navigation = useNavigation();

  // This will be triggered when the user's authentication state changes
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        // If the user is logged in, delete their data
        await deleteUserData(user.uid);
      }
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const deleteUserData = async (uid) => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, `rooms/${uid}/userRooms`));
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref); // Delete each room document
      });
      console.log('User data deleted successfully from Firestore');
    } catch (error) {
      console.error("Error deleting data on login: ", error);
    }
  };

  
  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
    } catch (error) {
      console.error("Error deleting data on logout: ", error);
    }
  };

  const handleCreateRoom = () => {
    navigation.navigate('CreatePage');  // Navigate to CreatePage
  };

  const handlePrevRoom = () => {
    navigation.navigate('PreviousRooms');  // Navigate to PreviousRooms
  };

  return (
    <View>
      <StatusBar bargroundColor="#000000"/>
      <ImageBackground
        source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
        style={styles.background}
      >
      <View style={styles.logoContainer}>
        <Image 
          source={require('../../images/logo.png')} // Replace with your logo image path
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <View>
        <Text style={styles.title}>      </Text>
        <Text style={styles.title}>      </Text>
          <TouchableOpacity
              style={styles.button1}
              onPress={handleCreateRoom}
            >
              <Text style={styles.buttonText}>Create a Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={styles.button1}
              onPress={handlePrevRoom}
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
    logoContainer: {
      position: 'absolute',
      top: 30, // Adjust this value to move the logo up or down
      alignItems: 'center',
      width: '100%',
    },
    logo: {
        width: 340, // Adjust the width to fit your logo size
        height: 340, // Adjust the height as needed
    },
    innerContainer: {
      flex: 1,
      justifyContent: 'center', // Center vertically
      alignItems: 'center', // Center horizontally
      marginVertical: 20,
      marginTop: 50,
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
        borderRadius: 35,
        marginBottom: 10,
    },
    button1: {
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 25,
        borderRadius: 35,
        marginBottom: 15,
    },
    button2: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 35,
        marginBottom: 10,
        marginTop: 30,
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 26,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'LondrinaSolid',
        letterSpacing: 1,
    },
});
  
  export default HomePage;
  




  // button: {
  //   backgroundColor: 'white',
  //   paddingVertical: 12,
  //   paddingHorizontal: 15,
  //   borderRadius: 20,
  //   width: 248,
  //   alignSelf: 'center',
  //   marginBottom: 18,
  // },
  // buttonText: {
  //   color: '#006EB9',
  //   fontSize: 30,
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   fontFamily: 'LondrinaSolid',
  //   letterSpacing: 1.2,

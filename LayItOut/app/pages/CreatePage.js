import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, Dimensions, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { collection, addDoc } from 'firebase/firestore';  // Import Firestore functions
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';  // Import Firestore database instance
import { useFonts } from 'expo-font'; 

const { height, width } = Dimensions.get('window');

const CreatePage = () => {
  const navigation = useNavigation();

  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [customHeight, setCustomHeight] = useState('');
  const [customWidth, setCustomWidth] = useState('');

  //Custom font 
  const [fontsLoaded] = useFonts({
    'LondrinaSolid': require('../../assets/fonts/LondrinaSolidRegular.ttf'),
    'LondrinaLight': require('../../assets/fonts/LondrinaSolidLight.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#000ff" />;
  }

  const handleSquareRoom = () => {
    navigation.navigate('SquareRoom');  // Navigate to SquareRoom
  };

  const handleRectangleRoom = () => {
    navigation.navigate('RectangleRoom');
  };

  const handleCustomRoom = () => {
    setShowCustomInputs(!showCustomInputs);  // Toggle input fields
  };

  const uid = FIREBASE_AUTH.currentUser ? FIREBASE_AUTH.currentUser.uid : null;

  function hasMultipleDecimals(input) { 
    const parts = input.split(".")
    if (parts.length > 1){
      if (parts[1].length > 1) {
        return true
      }
      else {
        return false
      }
    }
    else {
      return false
    }
  }

  const handleSaveCustomRoom = async () => {
    if (customWidth <= 30 && customHeight <= 20) {
      if ((customWidth < 5 && customHeight < 5)) {
        alert("Dimensions too small. You're room must be at least 5x5.")
      }
      else if ((customWidth < 5 && customHeight >= 5)) {
        alert("Width too small")
      }
      else if ((customWidth >= 5 && customHeight < 5)) {
        alert("Height too small")
      }
      else if ((hasMultipleDecimals(customWidth) || hasMultipleDecimals(customHeight))) {
        alert("Height or Width cannot have more than one decimal place.")
      }
      else if (customWidth >= 5 && customHeight >= 5) {
        try {
          // Add room dimensions to Firestore
          const docRef = await addDoc(collection(FIREBASE_DB, `rooms/${uid}/userRooms`), {
            height: customHeight,
            width: customWidth,
            createdAt: new Date(),
          });
          //console.log('Room saved with ID:', docRef.id);
          //Alert.alert('Alert', 'Custom room dimensions saved successfully!');
          
          // Clear inputs and navigate to CustomRoom
          setShowCustomInputs(false);
          setCustomHeight('');
          setCustomWidth('');
  
          navigation.navigate('CustomRoom');    
          
        } catch (error) {
          console.error('Error saving custom room dimensions: ', error);
          Alert.alert('Error', 'Failed to save custom room dimensions.');
        }
    }
    
    } else {
      Alert.alert('Input Error', 'Please enter valid height and width values. \n Height must be <= 20 and width must be <= 30.');
    }
  };
  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar backgroundColor="transparent" translucent />
        <ImageBackground
          source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
          style={styles.background}
        >
          <View>
            <Text style={styles.title}>Choose a Room Option:</Text>

            <TouchableOpacity style={styles.button} onPress={handleSquareRoom}>
              <Text style={styles.buttonText}>Default Square</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRectangleRoom}>
              <Text style={styles.buttonText}>Default Rectangle</Text>
            </TouchableOpacity>

            <View style={styles.customInputContainer}>
              <TouchableOpacity style={styles.createButton} onPress={handleCustomRoom}>
                <Text style={styles.buttonText}>Create Custom Room</Text>
              </TouchableOpacity>

              {showCustomInputs && (
                <>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      placeholder="Height (ft)"
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={customHeight}
                      onChangeText={setCustomHeight}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Width (ft)"
                      placeholderTextColor="#888"
                      keyboardType="numeric"
                      value={customWidth}
                      onChangeText={setCustomWidth}
                    />
                  </View>

                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveCustomRoom}>
                    <Text style={styles.saveButtonText}>Create!</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', 
    width: width,
    height: height,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 200,  
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    margin: 0, 
    padding: 0,
  },
  title: {
    fontSize: 45,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -30,
    marginBottom: 25,
    fontFamily: "LondrinaSolid",
    letterSpacing: 2,
  },
  button: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 35,
    width: 248,
    alignSelf: 'center',
    marginBottom: 18,
  },
  buttonText: {
    color: '#006EB9',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'LondrinaSolid',
    letterSpacing: 1.2,
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    width: '100%',
    alignItems: 'center',
  },
  customInputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 35,
    width: 248,
    alignSelf: 'center',
    elevation: 5,
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    color: '#006EB9',
    width: 100,
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 5,
    marginHorizontal: 5,
    backgroundColor: 'white',
    fontFamily: "LondrinaLight",
    letterSpacing: 1,
  },
  saveButton: {
    backgroundColor: '#006EB9',
    width: 150,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 35,
    marginTop: 10,
    alignSelf: 'center',
  },
  saveButtonText: {
    color: 'white', 
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: "LondrinaSolid",
    letterSpacing: 1.5,
  },
});

export default CreatePage;

import React, { useState } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity, TextInput, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

const { height, width } = Dimensions.get('window');

const CreatePage = () => {
  const navigation = useNavigation();

  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [customHeight, setCustomHeight] = useState('');
  const [customWidth, setCustomWidth] = useState('');

  const handleSquareRoom = () => {
    navigation.navigate('SquareRoom');  // Navigate to SquareRoom
  };

  const handleRectangleRoom = () => {
    navigation.navigate('RectangleRoom');
  };

  const handleCustomRoom = () => {
    setShowCustomInputs(!showCustomInputs);  // Toggle input fields
  };

  const handleSaveCustomRoom = () => {
    console.log('Custom Room Dimensions:', customHeight, customWidth);
    setShowCustomInputs(false);
    // navigate to the custom room here
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

            <View style={styles.customInputContainer}>
            <TouchableOpacity 
              style={styles.createButton}
              onPress={handleCustomRoom}
            >
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
      resizeMode: 'cover', // Make the image cover the entire background
      width: width,
      height: height,
      justifyContent: 'flex-start',     //leave as center if not doing paddingTop
      alignItems: 'center',
      paddingTop: 200,                // have to have flex-start
      ...StyleSheet.absoluteFillObject,
  },
  container: {
      flex: 1,
      margin: 0, 
      padding: 0,
  },
  title: {
      fontSize: 28,
      color: '#fff',
      fontWeight: 'bold',
      marginBottom: 15,
  },
  paragraph: {
      fontSize: 22,
      color: '#fff',
      textAlign: 'left',
      marginBottom: 35,
  },
  button: {
      backgroundColor: 'white',
      paddingVertical: 15,
      paddingHorizontal: 15,
      borderRadius: 15,
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
  createButton: {
    paddingVertical: 8,  // Reduce vertical padding to make button slimmer
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  customInputContainer: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 15,
    width: 248,
    alignSelf: 'center',
    elevation: 5,
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
      borderRadius: 10,
      paddingHorizontal: 15,
      marginVertical: 5,
      marginHorizontal: 5,
      backgroundColor: 'white',
    },
    saveButton: {
        backgroundColor: '#006EB9',
        width: 150,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10,
        alignSelf: 'center',
    },
    saveButtonText: {
      color: 'white', // Text color for "Save Room" button, ensuring it contrasts with the button background
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },

});
  
  export default CreatePage;
  

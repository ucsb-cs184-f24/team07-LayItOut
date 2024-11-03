import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, StatusBar, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

// Custom drawer content with furniture items
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.furnitureListContainer}>
      <Text style={styles.title}>Furniture</Text>
      <View style={styles.furnitureItem}>
        <Image source={{ uri: 'https://example.com/sofa.png' }} style={styles.furnitureImage} />
        <Text>Sofa</Text>
      </View>
      <View style={styles.furnitureItem}>
        <Image source={{ uri: 'https://example.com/bed.png' }} style={styles.furnitureImage} />
        <Text>Bed</Text>
      </View>
      <View style={styles.furnitureItem}>
        <Image source={{ uri: 'https://example.com/shelf.png' }} style={styles.furnitureImage} />
        <Text>Shelf</Text>
      </View>
      {/* Add more furniture items as needed */}
    </DrawerContentScrollView>
  );
};

// Main RectangleRoom screen
const RectangleRoomScreen = () => {
  useFocusEffect(
    React.useCallback(() => {
      const lockLandscape = async () => {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      };
      lockLandscape();

      return async () => {
        await ScreenOrientation.unlockAsync();
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="black" />
      <View style={styles.room}>
        {/* Main room content goes here */}
      </View>
    </View>
  );
};

// Main RectangleRoom component with custom drawer
const RectangleRoom = () => {
  return (
    <Drawer.Navigator
      initialRouteName="RectangleRoomScreen"
      drawerType="slide"
      drawerPosition="left"
      overlayColor="transparent"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="RectangleRoomScreen"
        component={RectangleRoomScreen}
        options={{ title: 'Rectangle Room' }}
      />
    </Drawer.Navigator>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  room: {
    width: 550,
    height: 340,
    borderWidth: 3,
    borderColor: 'blue',
    backgroundColor: '#ADD8E6',
  },
  furnitureListContainer: {
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  furnitureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  furnitureImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
});

export default RectangleRoom;
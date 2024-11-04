import React, { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

// Custom drawer content with furniture items
const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.furnitureListContainer}>
      <Text style={styles.title}>Furniture List</Text>
      <View style={styles.furnitureItem}>
        <Image source={{ uri: 'https://example.com/sofa.png' }} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Sofa</Text>
      </View>
      <View style={styles.furnitureItem}>
        <Image source={{ uri: 'https://example.com/bed.png' }} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Bed</Text>
      </View>
      <View style={styles.furnitureItem}>
        <Image source={{ uri: 'https://example.com/shelf.png' }} style={styles.furnitureImage} />
        <Text style={styles.furnitureText}>Shelf</Text>
      </View>
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
      drawerStyle={styles.drawer}
      screenOptions={({ navigation }) => ({
        drawerStyle: {
          width: 250,
        },
        headerTitle: '',
        headerStyle: {
          height: 50,
        },
        headerLeft: () => (
          <TouchableOpacity
            style={styles.menuButtonContainer}
            onPress={() => navigation.toggleDrawer()}
          >
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="RectangleRoomScreen"
        component={RectangleRoomScreen}
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
    width: 430,
    height: 300,
    borderWidth: 3,
    borderColor: 'white',
    backgroundColor: '#045497',
  },
  furnitureListContainer: {
    padding: 16,
    backgroundColor: '#D5D5D5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#045497',
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
  furnitureText: {
    color: "black",
  },
  menuButtonContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D5D5D5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  menuIcon: {
    fontSize: 24,
    color: '#045497',
    fontWeight: 'bold',
  },
  drawer: {
    width: 250,
  },
});

export default RectangleRoom;
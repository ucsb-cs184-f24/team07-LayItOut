import { Text, View } from "react-native";
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

import SplashPage from './pages/SplashPage';
import Login from './pages/Login';
import List from './pages/List';
import Details from './pages/Details';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function InsideLayout() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string;

        if (route.name === 'My app') {
          iconName = focused ? 'home' : 'home-outline'; // Icon for "My app" tab
        } else {
          iconName = focused ? 'information-circle' : 'information-circle-outline'; // Icon for "Welcome" tab
        }

        // Return the icon component
        return <Ionicons name = {iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'blue',   // Active icon color
      tabBarInactiveTintColor: 'gray', // Inactive icon color
    })}
    >
      <Tab.Screen name="My app" component={List} />
      <Tab.Screen name="Welcome" component={Details} />
    </Tab.Navigator> 
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user: any) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashPage}
          options={{ headerShown: false }}
        />
        {user ? (
          <Stack.Screen
            name="Inside"
            component={InsideLayout}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
  );
}
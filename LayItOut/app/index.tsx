import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { StatusBar } from 'expo-status-bar';
//import { StyleSheet, Text, View } from 'react-native';
import Login from './pages/Login';
import List from './pages/List';
import Details from './pages/Details';
import { useState, useEffect } from 'react'; 
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import React from 'react';

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  
  return (
    <InsideStack.Navigator> 
      <InsideStack.Screen name="My app" component={List} />
      <InsideStack.Screen name="Welcome" component={Details} />      
    </InsideStack.Navigator> 
    
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user: any) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer independent = {true}> 
      <Stack.Navigator initialRouteName="Login"> 
        {user ? (
          <Stack.Screen name="Inside" component={InsideLayout} options={{ headerShown: false}} />
        ) : (
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false}} />
        )}
      </Stack.Navigator>
    </NavigationContainer> 
  );
} 
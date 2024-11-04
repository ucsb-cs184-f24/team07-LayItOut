import { Text, View } from "react-native";
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';

import SplashPage from './pages/SplashPage';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import LongRectangleRoom from './pages/LongRectangleRoom';
import RectangleRoom from './pages/RectangleRoom';
import SquareRoom from './pages/SquareRoom';
import PreviousRooms from "./pages/PreviousRooms";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="HomePage" component={HomePage} />
      <InsideStack.Screen name="CreatePage" component={CreatePage} options={{ title: 'Create a Room' }} />
      <InsideStack.Screen name="SquareRoom" component={SquareRoom} options={{ title: 'Square Room' }} />
      <InsideStack.Screen name="RectangleRoom" component={RectangleRoom} options={{ title: 'Rectangle Room' }} />
      <InsideStack.Screen name="LongRectangleRoom" component={LongRectangleRoom} options={{ title: 'Long Rectangle Room' }} />
      <InsideStack.Screen name="PreviousRooms" component={PreviousRooms} options={{ title: 'View Previous Rooms' }} />
    </InsideStack.Navigator>
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
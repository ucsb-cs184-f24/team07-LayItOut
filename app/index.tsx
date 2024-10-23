import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login'
import HomePage from './screens/HomePage'
import CreatePage from './screens/CreatePage'
import { onAuthStateChanged, User } from 'firebase/auth';
import { fire_auth } from '@/FirebaseConfig';


const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();

function InsideLayout({ user }: { user: User | null }) {
  return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Home Page"> 
      {() => <HomePage user={user} />}
      </InsideStack.Screen> 
      <InsideStack.Screen 
        name="Create Layout"  // Add the Create Layout screen
        component={CreatePage} 
        options={{ headerShown: true, title: 'Create Layout' }}  // Optional title
      />
    </InsideStack.Navigator>
  )
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(fire_auth, (user) => {
      console.log('user', user);
      setUser(user)
    });
  }, []);
  return (
    <Stack.Navigator initialRouteName="Login">
      {user ? (
        <Stack.Screen name='Inside' options={{ headerShown: false }}>
          {() => <InsideLayout user={user} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false}}/>
      )}
    </Stack.Navigator>
  );
}


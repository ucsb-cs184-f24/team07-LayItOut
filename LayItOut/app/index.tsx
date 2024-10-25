import React from 'react';
import SplashPage from './pages/SplashPage.js'; 
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={SplashPage} 
          options={{ title: 'Getting Started', 
            headerStyle: { height: 22, },
            headerTitleStyle: { 
              fontSize: 18, // Adjust font size if needed
              color: '#006EB9',
              marginTop: -80, // Adjust the position to move it up
            }, 

       }} // Title to display on the header
        />
      </Stack.Navigator>
  );

}

export default App;
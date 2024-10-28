
import React from 'react';
import CreatePage from './pages/CreatePage.js'; 
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

function App() {
  return (
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={CreatePage} 
          options={{ title: 'Create a Room', 
            headerStyle: { height: 22, },
            headerTitleStyle: { 
              fontSize: 20, // Adjust font size if needed
              color: '#006EB9',
              marginTop: -85, // Adjust the position to move it up
            }, 

       }} // Title to display on the header
        />
      </Stack.Navigator>
  );

}

export default App;

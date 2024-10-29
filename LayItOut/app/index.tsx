import React from 'react';
import RectangleRoom from './pages/RectangleRoom.js'; 
import { View } from 'react-native';  // Import View from react-native

function App() {
  return (
    <View style={{ flex: 1 }}>
      <RectangleRoom />
    </View>  
  );
}

export default App;

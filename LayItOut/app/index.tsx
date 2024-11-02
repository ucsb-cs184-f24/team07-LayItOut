import React from 'react';
import LongRectangleRoom from './pages/LongRectangleRoom.js'; 
import RectangleRoom from './pages/RectangleRoom.js';
import CreatePage from './pages/CreatePage.js';
import SquareRoom from './pages/SquareRoom.js';

import { View } from 'react-native';  // Import View from react-native

function App() {
  return (
    <View style={{ flex: 1 }}>
      <SquareRoom/>
    </View>  
  );
}

export default App;

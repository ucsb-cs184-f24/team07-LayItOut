import React from 'react';
import SplashPage from './pages/SplashPage.js'; 
import { View } from 'react-native';  // Import View from react-native

function App() {
  return (
    <View style={{ flex: 1 }}>
      <SplashPage />
    </View>  
  );
}

export default App;
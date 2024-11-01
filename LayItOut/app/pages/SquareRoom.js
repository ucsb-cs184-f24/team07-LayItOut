import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function SquareRoom() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Drawer" onPress={() => navigation.openDrawer()} />
      <Text>Square Room Screen</Text>
    </View>
  );
}
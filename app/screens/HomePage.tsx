import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useState } from 'react'
import { User } from 'firebase/auth';
import { useNavigation } from 'expo-router';

interface HomePageProps {
    user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
    const navigation = useNavigation<any>();

    const handleCreateLayout = () => {
        navigation.navigate("Create Layout"); // Navigate to Create Layout screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.welcomeText}>Welcome{user ? `, ${user.email}` : ''}!</Text>
            <Button title="Create Layout" onPress={handleCreateLayout} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,  // Take the full height of the screen
      justifyContent: 'center',  // Center vertically
      alignItems: 'center',  // Center horizontally
      backgroundColor: '#f8f8f8', // Optional: Change the background color
    },
    welcomeText: {
      fontSize: 24,  // Change the font size
      fontWeight: 'bold',  // Make the text bold
      color: '#333',  // Optional: Change the text color
    },
  });
  

export default HomePage
import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import { User } from 'firebase/auth';
import { useNavigation } from 'expo-router';

interface HomePageProps {
    user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
    const navigation = useNavigation<any>();

    const handleCreateLayout = () => {
        navigation.navigate("Create Layout");
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
    },
  });
  

export default HomePage
import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

const CreateLayout = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Layout Page</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default CreateLayout;

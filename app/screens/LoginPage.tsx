import { View, StyleSheet, TextInput, ActivityIndicator, Button } from 'react-native';
import React, { useState } from 'react';
import { fire_auth } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = fire_auth;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error)
            alert('Sign in failed: ' + error.message)
        } finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any) {
            console.log(error)
            alert('Sign up failed: ' + error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                value={email}
                style={styles.input}
                placeholder='email'
                autoCapitalize='none'
                onChangeText={(text) => setEmail(text)}>
            </TextInput>
            <TextInput 
                secureTextEntry={true}
                value={password}
                style={styles.input}
                placeholder='password'
                autoCapitalize='none'
                onChangeText={(text) => setPassword(text)}>
            </TextInput>
        
            { loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <View style={styles.buttonContainer}>
                        <Button title="Login" onPress={signIn} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Create account" onPress={signUp} />
                    </View>                
                </>
            )}
        </View>
    );
};

export default LoginPage;

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    },
    buttonContainer: {
        marginVertical: 10,
    }
});
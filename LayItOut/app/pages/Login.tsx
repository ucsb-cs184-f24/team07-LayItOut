import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, Image, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import loginButtonImage from '../../images/loginButton.png';
import createAccountButtonImage from '../../images/createAccountButton.png';
import backgroundImage from '../../images/Background.png';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Welcome ' + email)
            navigation.navigate('Inside');
        } 

        catch (error: any) {
            console.log(error); 
            alert('Sign in failed: ' + error.message)
        }

        finally {
            setLoading(false);
        }
    }

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Check your email!')
            navigation.navigate('Inside');
        }

        catch (error: any) {
            console.log(error);
            alert('Registration failed: ' + error.message)
        }
        
        finally {
            setLoading(false); 
        }
    }

    return (
        <ImageBackground source={backgroundImage} style={styles.background}>
            <View style={styles.container}>
                <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
                
                {loading ? ( <ActivityIndicator size="large" color = "#000ff" /> 
                ) : ( 
                    <>
                            <TouchableOpacity style={styles.button} onPress={signIn}>
                                <Image source={loginButtonImage} style={styles.buttonImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, { marginVertical: -10 }]} onPress={signUp}>
                                <Image source={createAccountButtonImage} style={styles.buttonImage} />
                            </TouchableOpacity>
                        </>
                )}
                </KeyboardAvoidingView>
            </View>
        </ImageBackground>
    );
};

export default Login;

const styles = StyleSheet.create({
    background: {
        flex: 1, // Make sure the background takes up the whole screen
        justifyContent: 'center', // Center contents
    },
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
        //backgroundColor: '#fff'
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
        borderColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent border
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonImage: {
        width: '100%', // Adjust based on your design
        height: 50,    // Adjust based on your design
        resizeMode: 'contain', // or 'cover' based on your design
    }
})
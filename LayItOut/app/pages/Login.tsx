import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, Image, Dimensions, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import loginButtonImage from '../../images/loginButton.png';
import createAccountButtonImage from '../../images/createAccountButton.png';
import backgroundImage from '../../images/splash.png';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');


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
            navigation.navigate('Back');
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
            navigation.navigate('Back');
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
                <Text style={styles.title}> Log In/Sign Up</Text>
                <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
                
                {loading ? ( <ActivityIndicator size="large" color = "#000ff" testID="activity-indicator" /> 
                ) : ( 
                    <>
                            <TouchableOpacity style={styles.button} onPress={signIn} testID="login-button" >
                                <Image source={loginButtonImage} style={styles.buttonImage} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button]} onPress={signUp} testID="signup-button" >
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
        width: width,
        height: height,
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject,
    },
    title: {
        fontSize: 35,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    container: {
        marginHorizontal: 20,
        flex: 1, 
        justifyContent: 'center'
    }, 
    input: {
        marginVertical: 5, 
        height: 50, 
        borderWidth: 1,
        borderRadius: 20, 
        padding: 20,
        width: 300,
        //backgroundColor: '#fff'
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
        borderColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent border
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 2,
    },
    buttonImage: {
        width: '100%', // Adjust based on your design
        height: 30,    // Adjust based on your design
        resizeMode: 'contain', // or 'cover' based on your design
    }
})
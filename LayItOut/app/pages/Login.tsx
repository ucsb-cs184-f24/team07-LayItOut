import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, ActivityIndicator, KeyboardAvoidingView, Image, Dimensions, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import loginButtonImage from '../../images/loginButton.png';
import createAccountButtonImage from '../../images/createAccountButton.png';
import backgroundImage from '../../images/splash.png';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { useFonts } from 'expo-font'; 

const { height, width } = Dimensions.get('window');


interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const Login = ({ navigation }: RouterProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); 
    const auth = FIREBASE_AUTH;

    //Load custom font
    const [fontsLoaded] = useFonts({
        'LondrinaSolid': require('../../assets/fonts/LondrinaSolidRegular.ttf'),
    });

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#000ff" />;
    }

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
                <Text style={styles.title, {fontFamily: 'LondrinaSolid', color: '#fff', fontSize: 43 }}>Log In/Sign Up</Text>
                <KeyboardAvoidingView behavior='padding'>
                <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
                
                {loading ? ( <ActivityIndicator size="large" color = "#000ff" /> 
                ) : ( 
                    <>
                            <TouchableOpacity style={styles.button} onPress={signIn}>
                                <Text style={styles.buttonText}>Log In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button2} onPress={signUp}>
                                <Text style={styles.buttonText}>Create Account</Text>
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
        justifyContent: 'center',
    }, 
    input: {
        marginVertical: 5, 
        height: 50, 
        borderWidth: 1,
        borderRadius: 15, 
        paddingHorizontal: 15, // Only horizontal padding for width adjustment
        paddingVertical: 10,
        width: 300,
        //backgroundColor: '#fff'
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white
        borderColor: 'rgba(255, 255, 255, 0.8)', // Optional: semi-transparent border,
        textAlignVertical: 'center', // Centers text vertically
        textAlign: 'left' // Aligns text to the left
    },
    button: {
        backgroundColor: 'white',
        paddingVertical: 7,
        paddingHorizontal: 5,
        borderRadius: 35,
        marginBottom: 10,
        marginTop: 25,
        alignItems: 'center',
    },
    button2: {
        backgroundColor: 'white',
        paddingVertical: 7,
        paddingHorizontal: 5,
        borderRadius: 35,
        marginBottom: 0,
        marginTop: 0,
        alignItems: 'center',
    },
    buttonText: {
        color: '#006EB9',
        fontSize: 18.5,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: 'LondrinaSolid',
        letterSpacing: 1.5,
    }
})
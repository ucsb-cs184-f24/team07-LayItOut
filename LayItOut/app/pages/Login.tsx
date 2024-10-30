import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
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
        <View style={styles.container}>
            <KeyboardAvoidingView behavior='padding'>
            <Text> Enter if you dare... </Text>
            <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
            <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>
            
            {loading ? ( <ActivityIndicator size="large" color = "#000ff" /> 
            ) : ( 
                <> 
                    <Button title="Login" onPress={() => signIn()}/>
                    <Button title="Create Account" onPress={() => signUp()}/>
                </>
            )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default Login;

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
    }
})
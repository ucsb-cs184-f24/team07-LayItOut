import {View, Text, Button } from 'react-native';
import React, { useEffect, useState} from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
//import { useEffect, useState } from 'react';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const List = ({ navigation }: RouterProps) => {
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const currentUser =FIREBASE_AUTH.currentUser;
        if (currentUser) {
            setUserEmail(currentUser.email);
        }
    }, []);

    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text> {userEmail ? `User Email: ${userEmail}` : 'Hello' }</Text>
            <Button onPress={() => navigation.navigate('Welcome')} title="Welcome" />
            <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
        </View>
    )
}

export default List; 
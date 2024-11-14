// Import necessary testing libraries and components
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Login from '../pages/Login'; // Adjust the path as needed
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

// Mock the alert function globally 
global.alert = jest.fn();

// Mock Firebase authentication functions
jest.mock('firebase/auth', () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
}));

// Mock Firebase configuration
jest.mock('../../FirebaseConfig', () => ({
    FIREBASE_AUTH: {
        currentUser: null,
    },
}));

describe('Login Screen', () => {
    const navigationMock = {
        navigate: jest.fn(),
    };

    it('renders login page elements correctly', () => {
        const { getByPlaceholderText, getByTestId } = render(
            <NavigationContainer>
                <Login navigation={navigationMock} />
            </NavigationContainer>
        );
        expect(getByPlaceholderText('Email')).toBeTruthy();
        expect(getByPlaceholderText('Password')).toBeTruthy();
    });

    it('displays an ActivityIndicator while loading', async () => {
        const { getByPlaceholderText, getByTestId, queryByTestId } = render(
            <NavigationContainer>
                <Login navigation={navigationMock} />
            </NavigationContainer>
        );

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByTestId('login-button'); // Add 'testID' to your TouchableOpacity in Login component

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.press(loginButton);

        expect(queryByTestId('activity-indicator')).toBeTruthy();
        await waitFor(() => expect(queryByTestId('activity-indicator')).toBeFalsy());
    });

    it('calls signInWithEmailAndPassword with correct parameters', async () => {
        signInWithEmailAndPassword.mockResolvedValueOnce({ user: {} });
        const { getByPlaceholderText, getByTestId } = render(
            <NavigationContainer>
                <Login navigation={navigationMock} />
            </NavigationContainer>
        );

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByTestId('login-button');

        fireEvent.changeText(emailInput, 'test@example.com');
        fireEvent.changeText(passwordInput, 'password123');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                FIREBASE_AUTH,
                'test@example.com',
                'password123'
            );
        });
    });

    it('handles sign-in failure with an alert', async () => {
        signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Invalid credentials'));
        const { getByPlaceholderText, getByTestId } = render(
            <NavigationContainer>
                <Login navigation={navigationMock} />
            </NavigationContainer>
        );

        const emailInput = getByPlaceholderText('Email');
        const passwordInput = getByPlaceholderText('Password');
        const loginButton = getByTestId('login-button');

        fireEvent.changeText(emailInput, 'wrong@example.com');
        fireEvent.changeText(passwordInput, 'wrongpassword');
        fireEvent.press(loginButton);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith(expect.stringMatching(/Sign in failed:/));
        });
    });
});

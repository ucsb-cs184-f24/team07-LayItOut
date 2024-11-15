import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomePage from '../pages/HomePage'; // Adjust the path as needed
import { useNavigation } from '@react-navigation/native';

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}));

describe('HomePage', () => {
  it('navigates to CreatePage when "Create a Room" button is pressed', () => {
    const { getByText } = render(<HomePage />);
    const createRoomButton = getByText('Create a Room');
    const mockNavigate = useNavigation().navigate;

    fireEvent.press(createRoomButton);

    expect(mockNavigate).toHaveBeenCalledWith('CreatePage');
  });
});

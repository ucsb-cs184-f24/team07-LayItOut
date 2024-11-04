// PreviousRooms.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import { useUser } from './UserContext'; // Import the user context

const PreviousRooms = () => {
  const { user } = useUser(); // Access user data from context
  const [screenshots, setScreenshots] = useState([]);

  useEffect(() => {
    if (user) {
      // Fetch screenshots from Firebase based on user ID
      const fetchScreenshots = async () => {
        // Assuming you have a function to get screenshots by user ID
        const userScreenshots = await getUserScreenshots(user.uid); // Replace user.id with user.uid
        setScreenshots(userScreenshots);
      };

      fetchScreenshots();
    }
  }, [user]);

  return (
    <View>

      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
        Previous Rooms for User: {user?.displayName || 'Guest'}
      </Text>
      <FlatList
        data={screenshots}
        keyExtractor={(item) => item.id} // Assume each screenshot has a unique ID
        renderItem={({ item }) => (
          <View>
            
            <Image source={{ uri: item.url }} style={{ width: 100, height: 100 }} />
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default PreviousRooms;

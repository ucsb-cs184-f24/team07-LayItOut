import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, ImageBackground, Dimensions, StatusBar, Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { useFocusEffect } from '@react-navigation/native';

const { height, width } = Dimensions.get('window');

const PreviousRooms = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Flag to ensure component is mounted

      const fetchScreenshots = async () => {
        try {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert("Permission Denied", "Permission to access the gallery was denied.");
            setError("Permission denied to access media library.");
          } else {
            const media = await MediaLibrary.getAssetsAsync({
              first: 10,
              mediaType: 'photo',
              sortBy: 'creationTime',
            });

            if (media.assets.length > 0 && isActive) {
              console.log("Images URIs:", media.assets.map(img => img.uri)); // Log URIs for debugging
              setImages(media.assets);  // Save images if component is still active
            } else {
              setError("No screenshots available.");
            }
          }
        } catch (err) {
          console.error("Error fetching images:", err);
          setError(err.message);
        }
      };

      fetchScreenshots();

      return () => {
        isActive = false;  // Cleanup: ensure state isn't updated when unmounted
        setImages([]);
      };
    }, []) // Empty array ensures this effect runs when the page is focused
  );

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000000" />
      <ScrollView contentContainerStyle={styles.imageContainer}>
        {images.length > 0 ? (
          images.map((image, index) => (
            <ImageBackground
              key={index}
              source={{ uri: image.uri, cache: 'reload' }}  // Force reload from URI
              style={styles.image}
              resizeMode="cover"
              onError={(error) => console.error("Image load error:", error.nativeEvent.error)}
            />
          ))
        ) : (
          <Text style={styles.noImagesText}>No screenshots available.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  image: {
    width: width * 0.9,  // Set to 90% of the screen width
    height: height * 0.5, // Set to 50% of the screen height
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  noImagesText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default PreviousRooms;

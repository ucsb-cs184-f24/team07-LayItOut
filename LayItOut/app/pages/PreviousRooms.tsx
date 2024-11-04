import React from 'react';
import { StyleSheet, View, ImageBackground, FlatList, StatusBar, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

const PreviousRooms = () => {
  // Dummy data for demonstration (replace with your image URLs as needed)
  const screenshots = new Array(6).fill(null); // Creates an array with 6 empty placeholders

  const renderItem = () => (
    <View style={styles.imageBox} />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ImageBackground
        source={require('../../images/no-shapes.jpg')} // Adjust the path as needed
        style={styles.background}
      >
        <FlatList
          data={screenshots}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          numColumns={2} // Display images in 2 columns
          columnWrapperStyle={styles.columnWrapper} // Add some spacing between columns
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: width,
    height: height,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50
  },
  columnWrapper: {
    justifyContent: 'space-between', // Space out the columns evenly
    marginHorizontal: 10, // Horizontal margin for columns
  },
  imageBox: {
    width: width * 0.45, // Each box takes 45% of the width
    height: width * 0.45, // Keep the height the same as the width for a square box
    backgroundColor: '#d3d3d3', // Light gray color as placeholder
    borderRadius: 30,
    marginBottom: 15, // Space between rows
    marginHorizontal: 5,
  },
});

export default PreviousRooms;

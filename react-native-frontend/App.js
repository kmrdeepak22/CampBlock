// App.js or index.js
import React, { useState } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { View, StyleSheet } from 'react-native';
import Navigation from './src/components/Navigation';
import { UserProvider } from './src/components/UserContext';

const App = () => {

  return (
    <PaperProvider>
    <View style={styles.container}>
      <UserProvider>
        <Navigation />
      </UserProvider>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282828', // Terminal background color
  },
});

export default App;

import React from 'react';
import {Text} from 'react-native';
import {StyleSheet, SafeAreaView} from 'react-native';
import RNFS from 'react-native-fs';

const SplashScreen = () => {
  const path = `${RNFS.DocumentDirectoryPath}`;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>
        Booking application is loading. Please wait...
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    textAlign: 'center',
  },
  text: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    fontSize: 24,
    textAlign: 'center',
  },
  progress: {
    marginVertical: 16,
    marginHorizontal: 32,
  },
});

export default SplashScreen;

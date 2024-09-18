import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const MiniAppScreen = () => {
  return (
    <View style={styles.container}>
      <Text>This is MiniApp SCREEN</Text>
    </View>
  );
};

export default MiniAppScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
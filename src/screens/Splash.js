import React from 'react';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native';

export default function Splash() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
      <Text>Loading...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
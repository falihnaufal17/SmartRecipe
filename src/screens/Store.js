import React from 'react';
import { Text, View, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {MD3Colors} from 'react-native-paper'

export default function Store() {
  return (
    <View style={styles.container}>
      <Icon name="cogs" size={128} style={{marginBottom: 16}} />
      <Text style={styles.titleText}>Under Maintenance</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleText: {
    fontWeight: '600',
    fontSize: 32
  }
})
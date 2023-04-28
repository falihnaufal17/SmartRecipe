import React from 'react'
import {View, Text, Pressable, Image, StyleSheet} from 'react-native'

export default function Preview({route, navigation}) {
  const {picture} = route.params

  return (
    <View style={styles.container}>
      <Pressable style={styles.btnBack} onPress={() => navigation.goBack()}>
        <Text style={styles.btnBackLabel}>Back</Text>
      </Pressable>
      <Image source={{ uri: `file://${picture?.path}` }} style={{ width: '100%', height: '100%' }} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  btnBack: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 2
  },
  btnBackLabel: {
    color: '#000000'
  }
})
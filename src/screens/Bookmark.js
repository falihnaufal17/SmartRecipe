import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text } from 'react-native-paper'

const sampleData = {
  title: 'sample recipe'
}

function _renderItem({ item: { title } }) {
  return (
    <View>
      <Text variant='titleLarge'>{title}</Text>
    </View>
  )
}

function _headerItem() {
  return (
    <View style={styles.header}>
      <Text variant='headlineLarge'>Bookmark</Text>
    </View>
  )
}

export default function Bookmark() {
  return (
    <FlatList
      data={Array.from({ length: 30 }, () => sampleData)}
      keyExtractor={(item, key) => key}
      renderItem={_renderItem}
      ListHeaderComponent={_headerItem}
      contentContainerStyle={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  header: {
    elevation: 8,
    marginBottom: 16
  }
})
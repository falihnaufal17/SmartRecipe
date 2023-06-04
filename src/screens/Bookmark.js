import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Text } from 'react-native-paper'
import { useAuth } from '../contexts/Auth'

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
  const auth = useAuth()
  const [data, setData] = useState([])

  useFocusEffect(useCallback(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('https://33e7-125-164-22-234.ngrok-free.app/api/bookmark/get-bookmark', {
          headers: {
            'Authorization': `Bearer ${auth.authData.token}`
          }
        })
      
        setData(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchBookmarks()
  }, []))
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
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
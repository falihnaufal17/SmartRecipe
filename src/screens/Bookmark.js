import { useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { View, StyleSheet, FlatList, RefreshControl, ToastAndroid, ActivityIndicator, Image, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-paper'
import { useAuth } from '../contexts/Auth'
import { BASE_API_URL } from '../constants/general'

function _renderItem({ item: { title, body, recipe_id }, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(recipe_id)} style={styles.item}>
      <Image source={{uri: body.image}} style={styles.thumbnail} />
      <Text variant='titleLarge'>{title}</Text>
    </TouchableOpacity>
  )
}

function _headerItem() {
  return (
    <View style={styles.header}>
      <Text variant='headlineLarge'>Bookmark</Text>
    </View>
  )
}

function EmptyComponent({loading}) {
  if (loading) {
    return (
      <ActivityIndicator />
    )
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text variant="bodyMedium">Oops, Bookmark is empty</Text>
    </View>
  )
}

export default function Bookmark({ navigation }) {
  const auth = useAuth()
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(false)
  const { navigate } = navigation

  useFocusEffect(useCallback(() => {
    fetchBookmarks()
  }, []))

  const fetchBookmarks = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_API_URL}/bookmark/get-bookmark`, {
        headers: {
          'Authorization': `Bearer ${auth.authData.token}`
        }
      })
      
      setRefreshing(false)
      setLoading(false)
      setData(response.data.data)
    } catch (error) {
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
    }
  }

  const onRefresh = () => {
    setRefreshing(true)

    fetchBookmarks()
  }

  const goToDetail = (id) => navigate('RecipeStack', { id })

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={(item) => _renderItem({...item, onPress: goToDetail})}
      ListHeaderComponent={_headerItem}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={<EmptyComponent loading={loading} />}
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
  },
  item: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10
  },
})
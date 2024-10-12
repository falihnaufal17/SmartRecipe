import axios from 'axios'
import { useEffect, useState } from 'react'
import { TouchableOpacity, Image, Text, View, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native'
import { BASE_API_URL } from '../constants/general'

const Item = ({ title, thumbnail, id, row, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(row)} style={styles.item}>
      <Image source={{ uri: thumbnail }} style={styles.thumbnail} />
      <Text style={styles.titleItem}>{title}</Text>
    </TouchableOpacity>
  )
}

const ListEmpty = ({ loading }) => (
  <View style={styles.emptyContainer}>
    {loading ? (
      <>
        <ActivityIndicator size="large" />
        <Text>Sedang memuat...</Text>
      </>
    ) : <Text>Maaf, resep tidak ditemukan</Text>
    }
  </View>
)

export default function RecipeList({ route, navigation }) {
  const [data, setData] = useState({
    detectedIngredients: [],
    data: []
  })
  const [loading, setLoading] = useState(false)
  const { photo } = route.params
  const { navigate } = navigation

  useEffect(() => {
    if (photo) {
      fetchListByPhoto(photo)
    }
  }, [photo])

  const fetchListByPhoto = async (dPhoto) => {
    setLoading(true)
    setData({
      detectedIngredients: [],
      data: []
    })

    try {
      const { path } = dPhoto
      const formData = new FormData()

      formData.append('image', {
        name: `${path.split('/')[path.split('/').length - 1]}`,
        type: `image/${path.split('/')[path.split('/').length - 1].split('.')[1]}`,
        uri: `file://${path}`
      })

      const res = await axios.post(`${BASE_API_URL}/clarifai/detect`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      const { data: recipes, detectedIngredients } = res.data

      setData({
        data: recipes,
        detectedIngredients: [...detectedIngredients.split(';')]
      })
      setLoading(false)

    } catch (e) {
      console.log(e)
      Alert.alert('Peringatan', e.response?.data?.message?.message ?? 'Maaf terjadi kesalahan')
      setData({
        detectedIngredients: [],
        data: []
      })
      setLoading(false)
    }
  }

  const sanitizeDetectedIngredients = () => {
    return data.detectedIngredients.filter((item, index) => {
      return data.detectedIngredients.indexOf(item) === index
    }) || []
  }

  const goToDetail = (row) => navigate('RecipeStack', { row, detected: data.detectedIngredients })

  return (
    <View style={styles.container(loading)}>
      <Text style={styles.subtitle}>Resep yang ditemukan:</Text>
      <FlatList
        data={data.data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Item title={item.title} thumbnail={item.thumbnail} id={item.id} row={item} onPress={goToDetail} />}
        ListEmptyComponent={<ListEmpty loading={loading} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={!loading ? (
          <>
            <Text style={styles.title}>Berhasil menemukan {data.data.length} resep!</Text>
            {sanitizeDetectedIngredients().length > 0 ? (
              <>
                <Text style={styles.subtitle}>Bahan-bahan yang terdeteksi:</Text>
                {sanitizeDetectedIngredients().map((item, key) => (
                  <Text style={styles.itemIngredients} key={key}>{key + 1}. {item}</Text>
                ))}
              </>
            ) : null}
          </>
        ) : null}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: (loading) => ({
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    ...(loading ? { alignItems: 'center', justifyContent: 'center' } : {})
  }),
  emptyContainer: {
    flex: 1,
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
  title: {
    fontWeight: '600',
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16
  },
  item: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleItem: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000'
  },
  subtitle: {
    fontWeight: '600',
    fontSize: 20,
    color: '#000000',
    marginBottom: 10
  },
  itemIngredients: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 16
  }
})
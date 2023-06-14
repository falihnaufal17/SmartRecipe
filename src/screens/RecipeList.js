import axios from 'axios'
import { useEffect, useState } from 'react'
import { TouchableOpacity, Image, Text, View, StyleSheet, Alert, FlatList, ActivityIndicator } from 'react-native'
import { BASE_API_URL } from '../constants/general'

const Item = ({ title, image, id, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(id)} style={styles.item}>
      <Image source={{ uri: image }} style={styles.thumbnail} />
      <Text style={styles.titleItem}>{title}</Text>
    </TouchableOpacity>
  )
}

const ListEmpty = ({ loading }) => (
  <View style={styles.emptyContainer}>
    {loading ? (
      <>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </>
    ) : <Text>Oops data recipe is not found</Text>
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
      const { data: respData } = res.data
      const { data: recipes, detectedIngredients } = respData

      setData({
        data: recipes,
        detectedIngredients
      })
      setLoading(false)

    } catch (e) {
      Alert.alert('Failed', e.response.data?.message?.message ?? 'Oops something wrong')
      setData({
        detectedIngredients: [],
        data: []
      })
      setLoading(false)
    }
  }

  const goToDetail = (id) => navigate('RecipeStack', { id })

  return (
    <View style={styles.container(loading)}>
      <Text style={styles.subtitle}>Suggested Recipe:</Text>
      <FlatList
        data={data.data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <Item title={item.title} image={item.image} id={item.id} onPress={goToDetail} />}
        ListEmptyComponent={<ListEmpty loading={loading} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={!loading ? (
          <>
            <Text style={styles.title}>Yayy found {data.data.length} item recipes!</Text>
            {data.detectedIngredients.length > 0 ? (
              <>
                <Text style={styles.subtitle}>Detected Ingredients:</Text>
                {data.detectedIngredients.map((item, key) => (
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
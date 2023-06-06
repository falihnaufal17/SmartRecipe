import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'
import React, { useCallback, useState } from 'react'
import { Alert, View, StyleSheet, ActivityIndicator, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import { firstLetterCapital } from '../helper';
import {Text, MD3Colors} from 'react-native-paper'
import { useAuth } from '../contexts/Auth';

const Recipe = ({ route }) => {
  const { id } = route.params
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const auth = useAuth()

  useFocusEffect(
    useCallback(() => {
      const fetchDetail = async () => {
        setLoading(true)

        try {
          const response = await axios.get(`https://smartrecipeapi.kevinpratamasinaga.my.id/api/clarifai/detail/${id}`)

          setDetail(response.data?.data)
          setLoading(false)
        } catch (e) {
          setLoading(false)
          Alert.alert('Error', e.response.data?.message?.message ?? 'oops something wrong')
        }
      }

      fetchDetail()

      return () => {
        setDetail(null)
      }
    }, [id])
  )

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    )
  }

  const addToBookmark = async () => {
    try {
      const res = await axios.post('https://smartrecipeapi.kevinpratamasinaga.my.id/api/bookmark/add-bookmark', {recipeId: id}, {
        headers: {
          'Authorization': `Bearer ${auth.authData.token}`
        }
      })
      console.log(res.data)
    } catch (error) {
      console.log(error.response.data)
      // Alert.alert('Error', error.response.data.message)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image source={{ uri: detail?.image }} style={styles.thumbnail} />
          <Text style={styles.headerTitle}>{detail?.title}</Text>
          <TouchableOpacity style={styles.btnBookmark} activeOpacity={0.8} onPress={addToBookmark}>
            <Text style={styles.txtBtnBookmark}>Add to Bookmark</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Ingredients:</Text>
          {detail?.ingredients?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>- {firstLetterCapital(item.name)} ({item.amount.metric.value} {item.amount.metric.unit})</Text>
          ))}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Equipments:</Text>
          {detail?.equipments?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>- {firstLetterCapital(item.name)}</Text>
          ))}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Instructions:</Text>
          {detail?.instructions?.map((item, key) => (
            <>
              {item?.name?.length > 0 ? <Text style={styles.contentItem} key={key}>{key + 1}. {item.name}</Text> : null}
              {item.steps.map((step, stepKey) => (
                <Text style={styles.contentItem} key={stepKey}>{step.number}. {step.step}</Text>
              ))}
            </>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Recipe

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10
  },
  header: {
    alignItems: 'baseline'
  },
  headerTitle: {
    fontWeight: '600',
    color: '#000000',
    fontSize: 24,
    marginBottom: 20,
    lineHeight: 32,
    textAlign: 'center'
  },
  content: {
    textAlign: 'justify',
    fontSize: 16
  },
  contentTitle: {
    fontWeight: '600',
    fontSize: 16,
    color: '#000000',
    marginBottom: 10
  },
  contentItem: {
    fontWeight: '400',
    fontSize: 14,
    color: '#000000',
    marginBottom: 8,
    lineHeight: 22
  },
  contentSection: {
    marginBottom: 16
  },
  btnBookmark: {
    backgroundColor: MD3Colors.primary40,
    paddingVertical: 10,
    width: '100%',
    marginBottom: 16,
    borderRadius: 100
  },
  txtBtnBookmark: {
    color: '#FFF',
    textAlign: 'center'
  }
})
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Alert, View, StyleSheet, ActivityIndicator, Image, ScrollView, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native'
import {Text, MD3Colors} from 'react-native-paper'
import { useAuth } from '../contexts/Auth';
import { BASE_API_URL } from '../constants/general';
import { WebView } from 'react-native-webview';

const Recipe = ({ route }) => {
  const { row } = route.params
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const auth = useAuth()

  const fetchDetail = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/clarifai/detail/${row.id}`, {
        headers: {
          'Authorization': `Bearer ${auth.authData.token}`
        }
      })

      setDetail(response.data.data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      Alert.alert('Peringatan', e.response.data?.message?.message ?? 'Maaf terjadi kesalahan')
    }
  }

  useEffect(() => {

    fetchDetail()

    return () => {
      setDetail(null)
    }
  }, [row])

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator />
        <Text>Sedang memuat...</Text>
      </View>
    )
  }

  const addToBookmark = async () => {
    try {
      const res = await axios.post(`${BASE_API_URL}/bookmark/add-bookmark`, {recipeId: row.id}, {
        headers: {
          'Authorization': `Bearer ${auth.authData.token}`
        }
      })

      fetchDetail()
      ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
    } catch (error) {
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
    }
  }

  const deleteBookmark = async () => {
    try {
      const res = await axios.delete(`${BASE_API_URL}/bookmark/delete-bookmark/${detail.bookmarkId}`, {
        headers: {
          'Authorization': `Bearer ${auth.authData.token}`
        }
      })

      fetchDetail()
      ToastAndroid.show(res.data.message, ToastAndroid.SHORT)
    } catch (error) {
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT)
    }
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: detail?.thumbnail }} style={styles.thumbnail} />
          <Text style={styles.headerTitle}>{detail?.title}</Text>
          {detail ? !detail?.isBookmarked ? (
            <TouchableOpacity style={styles.btnBookmark} activeOpacity={0.8} onPress={addToBookmark}>
              <Text style={styles.txtBtnBookmark}>Simpan ke dalam riwayat resep</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btnBookmark, styles.btnDangerBookmark]} activeOpacity={0.8} onPress={deleteBookmark}>
              <Text style={styles.txtBtnBookmark}>Hapus dari riwayat resep</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Bahan-bahan:</Text>
          {detail?.ingredients?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>- {item}</Text>
          ))}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Peralatan:</Text>
          {detail?.equipments?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>- {item}</Text>
          ))}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Instruksi:</Text>
          {detail?.instructions?.map((item, key) => (
            <View style={styles.row} key={key}>
              <Text style={styles.contentItem}>{key + 1}. </Text> 
              <Text style={styles.contentItem}>{item}</Text> 
            </View>
          ))}
        </View>
        <View style={styles.contentSection}>
        <Text style={styles.contentTitle}>Video Tutorial</Text>
          <WebView
            source={{ uri: detail?.videoUrl }}
            allowsInlineMediaPlayback={true}
            style={styles.videoEmbed}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Recipe

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20
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
  },
  btnDangerBookmark: {
    backgroundColor: MD3Colors.error40,
  },
  row: {
    flexDirection: 'row'
  },
  videoEmbed: {
    width: '100%',
    height: 200
  }
})
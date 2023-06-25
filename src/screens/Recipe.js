import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios'
import React, { useCallback, useState, useEffect } from 'react'
import { Alert, View, StyleSheet, ActivityIndicator, Image, ScrollView, SafeAreaView, TouchableOpacity, ToastAndroid } from 'react-native'
import { firstLetterCapital } from '../helper';
import {Text, MD3Colors} from 'react-native-paper'
import { useAuth } from '../contexts/Auth';
import { BASE_API_URL } from '../constants/general';
import MLKitTranslator, { LANG_TAGS } from '../MLKitTranslator';

const Recipe = ({ route }) => {
  const { id } = route.params
  const [detail, setDetail] = useState(null)
  const [loading, setLoading] = useState(false)
  const auth = useAuth()

  const fetchDetail = async () => {
    setLoading(true)

    try {
      const response = await axios.get(`${BASE_API_URL}/clarifai/detail/${id}`, {
        headers: {
          'Authorization': `Bearer ${auth.authData.token}`
        }
      })

      setDetail(response.data?.data)
      setLoading(false)
    } catch (e) {
      setLoading(false)
      Alert.alert('Error', e.response.data?.message?.message ?? 'oops something wrong')
    }
  }

  useEffect(() => {
    fetchDetail();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDetail()

      return () => {
        setDetail(null)
      }
    }, [id])
  )

  const addToBookmark = async () => {
    try {
      const res = await axios.post(`${BASE_API_URL}/bookmark/add-bookmark`, {recipeId: id}, {
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

  const translateTextToIndonesian = async (text) => {
    try {
      const sourceLang = await MLKitTranslator.identifyLanguage(text);
      const targetLang = LANG_TAGS.INDONESIAN;
      const isSourceLangDownloaded = await MLKitTranslator.isModelDownloaded(sourceLang);
      const isTargetLangDownloaded = await MLKitTranslator.isModelDownloaded(targetLang);

      if (!isSourceLangDownloaded || !isTargetLangDownloaded) {
        Alert.alert('Terjemahan', 'Model bahasa belum tersedia, sedang mengunduh... Anda akan diberitahu lagi setelah berhasil diunduh');
        await MLKitTranslator.downloadModel(sourceLang);
        await MLKitTranslator.downloadModel(targetLang);
        Alert.alert('Terjemahan', 'Unduhan berhasil');
      } else {
        const translatedText = await MLKitTranslator.translateText(text, sourceLang, targetLang);
        return translatedText;
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  }

  const translateIngredients = async () => {
    const translatedIngredients = await Promise.all(detail?.ingredients?.map(async (item) => {
      const translatedName = await translateTextToIndonesian(item.name);
      const translatedAmount = await translateTextToIndonesian(`${item.amount.metric.value} ${item.amount.metric.unit}`);
      return `- ${firstLetterCapital(translatedName)} (${translatedAmount})`;
    }));
    return translatedIngredients;
  }

  const translateEquipments = async () => {
    const translatedEquipments = await Promise.all(detail?.equipments?.map(async (item) => {
      const translatedName = await translateTextToIndonesian(item.name);
      return `- ${firstLetterCapital(translatedName)}`;
    }));
    return translatedEquipments;
  }

  const translateInstructions = async () => {
    const translatedInstructions = await Promise.all(detail?.instructions?.map(async (item, key) => {
      let translatedSteps = [];
      if (item?.name?.length > 0) {
        const translatedName = await translateTextToIndonesian(item.name);
        translatedSteps.push(`${key + 1}. ${translatedName}`);
      }
      const translatedStepItems = await Promise.all(item.steps.map(async (step) => {
        const translatedStepNumber = await translateTextToIndonesian(step.number);
        const translatedStep = await translateTextToIndonesian(step.step);
        return `${translatedStepNumber}. ${translatedStep}`;
      }));
      translatedSteps = translatedSteps.concat(translatedStepItems);
      return translatedSteps.join('\n');
    }));
    return translatedInstructions;
  }

  const fetchTranslatedDetail = async () => {
    setLoading(true);

    try {
      const translatedIngredients = await translateIngredients();
      const translatedEquipments = await translateEquipments();
      const translatedInstructions = await translateInstructions();

      const translatedDetail = {
        ...detail,
        ingredients: translatedIngredients,
        equipments: translatedEquipments,
        instructions: translatedInstructions
      };

      setDetail(translatedDetail);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Gagal menerjemahkan detail resep');
    }
  }

  useEffect(() => {
    if (detail) {
      fetchTranslatedDetail();
    }
  }, [detail]);

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: detail?.image }} style={styles.thumbnail} />
          <Text style={styles.headerTitle}>{detail?.title}</Text>
          {detail ? !detail?.isBookmarked ? (
            <TouchableOpacity style={styles.btnBookmark} activeOpacity={0.8} onPress={addToBookmark}>
              <Text style={styles.txtBtnBookmark}>Tambah ke penanda buku</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btnBookmark, styles.btnDangerBookmark]} activeOpacity={0.8} onPress={deleteBookmark}>
              <Text style={styles.txtBtnBookmark}>Hapus dari penanda buku</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Bahan-bahan:</Text>
          {detail?.ingredients?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>{item}</Text>
          ))}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Peralatan:</Text>
          {detail?.equipments?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>{item}</Text>
          ))}
        </View>
        <View style={styles.contentSection}>
          <Text style={styles.contentTitle}>Instruksi:</Text>
          {detail?.instructions?.map((item, key) => (
            <Text style={styles.contentItem} key={key}>{item}</Text>
          ))}
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
})
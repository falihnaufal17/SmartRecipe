import React, { useRef, useState, useCallback } from 'react'
import { View, StyleSheet, ActivityIndicator, Pressable, Alert, Modal, FlatList, Image, Text, TouchableOpacity } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import axios from 'axios'

const Item = ({ title, image }) => {
  return (
    <View style={styles.item}>
      <Image source={{ uri: image }} style={styles.thumbnail} />
      <Text style={styles.titleItem}>{title}</Text>
    </View>
  )
}

export default function Home({ navigation }) {
  const devices = useCameraDevices()
  const device = devices.back
  const camera = useRef(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const takePicture = async () => {
    const photo = await camera.current.takeSnapshot({
      qualityPrioritization: 'quality',
      quality: 1,
      base64: true,
      skipMetadata: true
    })
    const formData = new FormData()
    formData.append('name', 'testtt')
    formData.append('image', {
      name: `${photo.path.split('/')[photo.path.split('/').length - 1]}`,
      type: `image/${photo.path.split('/')[photo.path.split('/').length - 1].split('.')[1]}`,
      uri: `file://${photo.path}`
    })
    setLoading(true)

    axios.post(`https://smartrecipeapi.kevinpratamasinaga.my.id/api/clarifai/detect`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => {
        setModalVisible(true)
        setData(res.data.data)
        setLoading(false)
      })
      .catch((e) => {
        Alert.alert('Failed', e.response.data)
        setLoading(false)
      })
  }

  if (device == null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>)
  }

  return (
    <>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.content}>
        <TouchableOpacity style={styles.takePicture} onPress={takePicture} />
      </View>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Text style={styles.headerModal}>Yayy found {data.length} item recipes!</Text>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Item title={item.title} image={item.image} />}
          contentContainerStyle={styles.listContainer}
        />
      </Modal>
      <Modal
        visible={loading}
        animationType="fade"
        style={styles.loadingScan}
        transparent
      >
        <View style={styles.loadingScan}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingScanText}>Scanning...</Text>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  cameraContainer: {
    position: 'relative'
  },
  content: {
    position: 'absolute',
    bottom: 30,
    right: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  takePicture: {
    backgroundColor: '#FF0000',
    width: 50,
    height: 50,
    borderRadius: 100,
    borderColor: '#FFFFFF',
    borderWidth: 2
  },
  listContainer: {
    marginHorizontal: 16,
    marginVertical: 16
  },
  thumbnail: {
    width: 300,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 10
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
  headerModal: {
    fontWeight: '600',
    fontSize: 24,
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16
  },
  loadingScan: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  loadingScanText: {
    color: '#FFFFFF',
    marginTop: 10,
    fontSize: 16
  }
})
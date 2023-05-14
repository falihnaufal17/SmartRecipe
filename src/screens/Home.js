import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'
import { useFocusEffect } from '@react-navigation/native'

export default function Home({navigation}) {
  const devices = useCameraDevices()
  const camera = useRef(null)
  const [device, setDevice] = useState(null)
  const { navigate } = navigation

  useEffect(() => {
    setDevice(devices.back)
    return () => setDevice(null)
  }, [devices.back])

  useFocusEffect(
    useCallback(() => {
      setDevice(devices.back)

      return () => setDevice(null)
    }, [devices.back])
  )

  const takePicture = async () => {
    const photo = await camera.current.takeSnapshot({
      skipMetadata: true
    })

    if (photo) {
      navigate('RecipeListStack', {photo})
    }
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
    borderWidth: 3
  }
})
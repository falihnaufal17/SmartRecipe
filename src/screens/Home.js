import React, { useRef, useState } from 'react'
import { View, StyleSheet, ActivityIndicator, Pressable } from 'react-native'
import { Camera, useCameraDevices } from 'react-native-vision-camera'

export default function Home({navigation}) {
  const devices = useCameraDevices()
  const device = devices.back
  const camera = useRef(null)
  const [picture, setPicture] = useState(null)

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
        <Pressable style={styles.takePicture} onPress={async () => {
          const photo = await camera.current.takePhoto({
            qualityPrioritization: 'quality',
          })

          setPicture(photo)

          navigation.navigate('PreviewStack', {picture: photo})
        }} />
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
    alignItems:'center'
  },
  takePicture: {
    backgroundColor: '#FF0000',
    width: 50,
    height: 50,
    borderRadius: 100,
    borderColor: '#FFFFFF',
    borderWidth: 2
  }
})
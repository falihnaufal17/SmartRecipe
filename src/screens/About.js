import React, { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";
import {View, Text, StyleSheet} from 'react-native'

export default function About() {
  const [permission, setPermission] = useState('denied')

  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus()
      setPermission(cameraPermission)
    }

    requestCameraPermission()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Camera Permission: {permission}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20
  }
})
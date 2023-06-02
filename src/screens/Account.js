import React, { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";
import {View, StyleSheet, TouchableOpacity, Permission, PermissionsAndroid} from 'react-native'
import {MD2Colors, Text} from 'react-native-paper'

export default function About() {
  const [permission, setPermission] = useState('denied')
  const [locationPermission, setLocationPermission] = useState('denied')

  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus()
      setPermission(cameraPermission)
    }

    const hasLocationPermission = async () => {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      setLocationPermission(granted ? 'authorized' : 'denied')
    };

    requestCameraPermission()
    hasLocationPermission()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text variant="bodyLarge">Lorem Ipsum</Text>
          <Text variant="bodyLarge">loremIpsum@mail.com</Text>
        </View>
        <Text variant="bodyLarge">Camera Permission: {permission}</Text>
        <Text variant="bodyLarge">Location Permission: {locationPermission}</Text>
      </View>
      <TouchableOpacity style={styles.btnLogout} activeOpacity={0.8}>
        <Text style={styles.txtBtnLogout}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: 'space-between'
  },
  btnLogout: {
    padding: 8,
    backgroundColor: MD2Colors.red500,
    borderRadius: 8
  },
  txtBtnLogout: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.5
  }
})
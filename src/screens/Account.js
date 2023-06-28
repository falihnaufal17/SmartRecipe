import React, { useEffect, useState } from "react";
import { Camera } from "react-native-vision-camera";
import {View, StyleSheet, TouchableOpacity, PermissionsAndroid} from 'react-native'
import {MD2Colors, Text} from 'react-native-paper'
import { useAuth } from "../contexts/Auth";

export default function About() {
  const [permission, setPermission] = useState('denied')
  const [locationPermission, setLocationPermission] = useState('denied')
  const auth = useAuth()

  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus()
      setPermission(cameraPermission)
    }

    const hasLocationPermission = async () => {
      const granted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      setLocationPermission(granted ? 'Diizinkan' : 'Tidak Diizinkan')
    };

    requestCameraPermission()
    hasLocationPermission()
  }, [])

  return (
    <View style={styles.container}>
      <View>
        <View>
          <Text variant="bodyLarge">Nama Lengkap: {auth.authData.fullname}</Text>
          <Text variant="bodyLarge">Nama Pengguna: {auth.authData.username}</Text>
        </View>
        <Text variant="bodyLarge">Izin Akses Kamera: {permission}</Text>
        <Text variant="bodyLarge">Izin Akses Lokasi: {locationPermission}</Text>
      </View>
      <TouchableOpacity style={styles.btnLogout} activeOpacity={0.8} onPress={() => auth.signOut()}>
        <Text style={styles.txtBtnLogout}>Keluar</Text>
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
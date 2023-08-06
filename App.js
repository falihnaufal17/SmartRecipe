import React, { useEffect } from 'react';
import Screen from './src/screens';
import { AuthProvider } from './src/contexts/Auth';
import { Camera } from 'react-native-vision-camera';
import VersionCheck from 'react-native-version-check';
import {Alert, BackHandler, Linking} from 'react-native'

const App = () => {
  useEffect(() => {

    const requestCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus()
      if (cameraPermission === 'denied') {
        await Camera.requestCameraPermission()
      }
    }

    checkUpdateNeeded()
    requestCameraPermission()
  }, [])

  const checkUpdateNeeded = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate()

      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Mohon Perbarui',
          'Kamu harus memperbarui aplikasi kamu sebelum digunakan',
          [
            {
              text: 'Perbarui',
              onPress: () => {
                BackHandler.exitApp()
                Linking.openURL(updateNeeded.storeUrl)
              }
            }
          ],
          {cancelable: false}
        )
      }

    } catch (e) {
      throw e
    }
  }

  return (
    <AuthProvider>
      <Screen />
    </AuthProvider>
  )
}

export default App;
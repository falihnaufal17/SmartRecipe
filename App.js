import React, { useEffect } from 'react';
import Screen from './src/screens';
import { AuthProvider } from './src/contexts/Auth';
import { Camera } from 'react-native-vision-camera';

const App = () => {
  useEffect(() => {
    const requestCameraPermission = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus()
      if (cameraPermission === 'denied') {
        await Camera.requestCameraPermission()
      }
    }

    requestCameraPermission()
  }, [])

  return (
    <AuthProvider>
      <Screen />
    </AuthProvider>
  )
}

export default App;
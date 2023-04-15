import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'

import Splash from './Splash';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Home from './Home';

const Stack = createNativeStackNavigator();

export default function Screen() {
  const [loading, setLoading] = React.useState(false)
  const [token, setToken] = React.useState(null)

  React.useEffect(() => {
    // cek token dari local storage
    const checkToken = async () => {
      setLoading(true)
      try {
        setLoading(false)
        const tkn = await AsyncStorage.getItem('token')
        console.log(tkn)
        setToken(tkn)
      } catch (e) {
        setLoading(false)
        console.log(e)
      }
    }

    checkToken()
  }, [])

  if (loading) {
    return <Splash />
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          {token ? (
            <>
              <Stack.Screen name="Home" component={Home} />
            </>
          ) : (
            <>
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
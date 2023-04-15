import React from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SignIn({navigation}) {
  const [show, setShow] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [payload, setPayload] = React.useState({
    username: '',
    password: ''
  })

  const handleSetShow = () => {
    setShow(!show)
  }

  const handleSignIn = async () => {
    setLoading(true)
    // logic login pake api --> axios

    setTimeout(async () => {
      const token = 'some token'

      // set token to local storage
      await AsyncStorage.setItem('token', token)
      setLoading(false)
    }, 1000)
  }

  const handleRedirectSignUp = () => {
    navigation.navigate('SignUp')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>SmartRecipe</Text>
      <Text style={styles.screenTitle}>Masuk</Text>
      <View style={styles.formGroup}>
        <Text>Nama Pengguna</Text>
        <TextInput placeholder="Masukan pengguna" style={styles.formControl} />
      </View>
      <View style={styles.formGroup}>
        <Text>Kata Sandi</Text>
        <View style={styles.formGroupAppend}>
          <TextInput placeholder="Masukan kata sandi" secureTextEntry={!show} />
          <Icon onPress={handleSetShow} name={!show ? "eye" : "eye-off"} size={20} />
        </View>
      </View> 
      <TouchableOpacity
        onPress={handleSignIn}
        activeOpacity={0.8}
        style={styles.btnSignIn}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.btnSignInText}>Masuk</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleRedirectSignUp}
        activeOpacity={0.8}
        style={[styles.btnSignIn, styles.btnSignUp]}>
        <Text style={styles.btnSignInText}>Daftar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16
  },
  formGroup: {
    marginBottom: 16
  },
  formControl: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1
  },
  formGroupAppend: {
    flexDirection: 'row',
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnSignIn: {
    backgroundColor: '#6750A4',
    width: '100%',
    paddingVertical: 10,
    borderRadius: 100,
    marginBottom: 16
  },
  btnSignInText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    fontWeight: '500'
  },
  btnSignUp: {
    backgroundColor: '#625B71',
  },
  appTitle: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400',
    color: '#000000',
    marginBottom: 64,
    textAlign: 'center'
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '400',
    lineHeight: 28,
    color: '#000000',
    marginBottom: 32,
    textAlign: 'center'
  }
})
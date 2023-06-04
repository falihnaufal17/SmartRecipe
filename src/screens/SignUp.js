import React from 'react'
import { StyleSheet, TextInput, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import {Text, MD3Colors} from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { APP_NAME, REGISTER_LABEL_INPUT } from '../constants/general'
import axios from 'axios'

export default function SignUp({navigation}) {
  const [show, setShow] = React.useState(false)
  const [showRetype, setShowRetype] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [payload, setPayload] = React.useState({
    fullname: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = React.useState({})

  const handleSetShow = () => {
    setShow(!show)
  }

  const handleSetShowRetype = () => {
    setShowRetype(!showRetype)
  }

  const handleSignUp = async () => {
    const objError = {}

    setLoading(true)
    
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') {
        objError[key] = `${REGISTER_LABEL_INPUT[key]} harus diisi`
  
        setErrors(prev => ({...prev, ...objError}))
        setLoading(false)
        return
      } else {
        const tempObj = errors
        delete tempObj[key]

        setErrors(prev => ({...prev, ...tempObj}))
        setLoading(false)
        return
      }
    })
    
    if (Object.keys(objError).length === 0) {
      try {
        const res = await axios.post('https://smartrecipeapi.kevinpratamasinaga.my.id/api/account/register', payload)
  
        if (res) {
          setLoading(false)
          handleRedirectSignIn()
        }
      } catch (error) {
        setLoading(false)
        Alert.alert('Error', error.response.data.message)
      }
    }
  }

  const handleRedirectSignIn = () => {
    navigation.goBack()
  }

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>{APP_NAME}</Text>
      <Text style={styles.screenTitle}>Daftar</Text>
      <View style={styles.formGroup}>
        <Text>Nama Lengkap</Text>
        <TextInput placeholder="Masukan nama lengkap" style={styles.formControl} onChangeText={v => setPayload(prev => ({...prev, fullname: v}))} />
        {errors?.fullname ? <Text style={styles.textError} variant="bodySmall">{errors.fullname}</Text> : null}
      </View>
      <View style={styles.formGroup}>
        <Text>Nama Pengguna</Text>
        <TextInput placeholder="Masukan pengguna" style={styles.formControl} onChangeText={v => setPayload(prev => ({...prev, username: v}))} />
        {errors?.username ? <Text style={styles.textError} variant="bodySmall">{errors.username}</Text> : null}
      </View>
      <View style={styles.formGroup}>
        <Text>Kata Sandi</Text>
        <View style={styles.formGroupAppend}>
          <TextInput placeholder="Masukan kata sandi" secureTextEntry={!show} onChangeText={v => setPayload(prev => ({...prev, password: v}))} />
          <Icon onPress={handleSetShow} name={!show ? "eye" : "eye-off"} size={20} />
        </View>
        {errors?.password ? <Text style={styles.textError} variant="bodySmall">{errors.password}</Text> : null}
      </View>
      <View style={styles.formGroup}>
        <Text>Masukan Ulang Kata Sandi</Text>
        <View style={styles.formGroupAppend}>
          <TextInput placeholder="Masukan ulang kata sandi" secureTextEntry={!showRetype} onChangeText={v => setPayload(prev => ({...prev, confirmPassword: v}))} />
          <Icon onPress={handleSetShowRetype} name={!showRetype ? "eye" : "eye-off"} size={20} />
        </View>
        {errors?.confirmPassword ? <Text style={styles.textError} variant="bodySmall">{errors.confirmPassword}</Text> : null}
      </View>
      <TouchableOpacity
        onPress={handleSignUp}
        activeOpacity={0.8}
        style={styles.btnSignIn}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.btnSignInText}>Daftar</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleRedirectSignIn}
        activeOpacity={0.8}
        style={[styles.btnSignIn, styles.btnSignUp]}>
        <Text style={styles.btnSignInText}>Masuk</Text>
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
    fontSize: 38,
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
  },
  textError: {
    color: MD3Colors.error50
  }
})
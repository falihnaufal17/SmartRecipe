import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, Alert, TouchableOpacity, Linking, PermissionsAndroid, ScrollView, SafeAreaView, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PLACES } from '../constants/store';
import axios from 'axios'
import { API_KEY_GOOGLE_MAPS, BASE_URL_PLACES_API } from '../constants/general';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import LocationEnabler from "react-native-location-enabler"

Geocoder.init(API_KEY_GOOGLE_MAPS);

const {
  PRIORITIES: { HIGH_ACCURACY },
  useLocationSettings,
} = LocationEnabler

export default function Store() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  })
  const [activePlace, setActivePlace] = useState('')
  const [dataPlaces, setDataPlaces] = useState([])
  const [originPlace, setOriginPlace] = useState('')
  const [enabled, requestResolution] = useLocationSettings(
    {
      priority: HIGH_ACCURACY, // default BALANCED_POWER_ACCURACY
      alwaysShow: true, // default false
      needBle: true, // default false
    },
    false /* optional: default undefined */,
  )
  const [isActiveLocation, setIsActiveLocation] = useState(false)
  const mapRef = useRef()

  useFocusEffect(
    useCallback(() => {
      getCurrentPosition()

      return () => {
        setRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        })
        setActivePlace('')
        setDataPlaces([])
        setOriginPlace('')
      }
    }, [])
  )
  
  // Check if location permission is granted
  const hasLocationPermission = async () => {
    const grantByUser = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Geolocation Permission',
        message: 'Can we access your location?',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    console.log('grantByUser', grantByUser);
    if (grantByUser === 'granted') {
      console.log('You can use Geolocation');
      return true;
    } else {
      console.log('You cannot use Geolocation');
      return false;
    }
  };

  const getCurrentPosition = async () => {
    requestResolution()

    if (await hasLocationPermission()) {
      Geolocation.getCurrentPosition(
        position => {
          setRegion(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          mapRef.current.animateToRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          })
          Geocoder.from(position.coords.latitude, position.coords.longitude)
            .then(json => {
              const addressComponent = json.results[0].address_components[0];

              setOriginPlace(addressComponent.short_name)
            })
            .catch(error => console.warn(error));
        },
        error => Alert.alert('Location Error', error.message),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000
        },
      );
    } else {
      Alert.alert(
        'Izin Akses Lokasi Diperlukan',
        'Tolong berikan izin akses lokasi pada pengaturan aplikasi',
      );
    }
  };

  const onChoosePlace = async (place) => {
    const encodedPlace = place.toLowerCase().replace(" ", "%20")
    
    Geolocation.getCurrentPosition(
      async position => {

        setActivePlace(place)
    
        try {
          const response = await axios.get(`${BASE_URL_PLACES_API}/nearbysearch/json?key=${API_KEY_GOOGLE_MAPS}&location=${position.coords.latitude},${position.coords.longitude}&radius=1500&keyword=${encodedPlace}`)
    
          if (response.data.results.length > 0) {
            setRegion(prev => ({
              ...prev,
              latitudeDelta: 0.090,
              longitudeDelta: 0.0150
            }))
            setDataPlaces(response.data.results)
          } else {
            setDataPlaces([])
            Alert.alert("Info", response.data.status)
          }
        } catch (e) {
          throw e
        }

      },
      error => Alert.alert('Location Error', error.message),
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }

  // const onOpenDirection = (destination) => {
  //   const originFormatted = originPlace.replace(' ', '+')
  //   const destinationFormatted = destination?.replace(' ', '+')

  //   Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${originFormatted}&destination=${destinationFormatted}`)
  // }

  const setCurrentPosition = useCallback(() => {
    getCurrentPosition()
    setIsActiveLocation(true)
  }, [getCurrentPosition, isActiveLocation])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal style={styles.placeList} showsHorizontalScrollIndicator={false}>
        {PLACES.map((item, key) => {
          const activeItemStyle = item.value === activePlace ? { ...styles.placeItemActive } : {}
          const activeItemLabelStyle = item.value === activePlace ? { ...styles.placeItemLabelActive } : {}

          return (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onChoosePlace(item.value)}
              style={[
                styles.placeItem,
                { ...activeItemStyle }
              ]}
              key={key}
            >
              <Text style={[styles.placeItemLabel, { ...activeItemLabelStyle }]}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <TouchableOpacity
        style={styles.btnGetCurrentLocation}
        onPress={setCurrentPosition}
      >
        <Icon name="target" size={30} color={isActiveLocation ? "#3f50b5" : "#7A7A7A"} />
      </TouchableOpacity>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsMyLocationButton={false}
        showsUserLocation={true}
        zoomControlEnabled={true}
        region={region}
        ref={mapRef}
      >
        {dataPlaces.length > 0 ? dataPlaces.map((item, key) => (
          <Marker
            key={key}
            title={item.name}
            description={item?.opening_hours?.open_now ? 'Buka' : 'Tutup'}
            coordinate={{
              latitude: item.geometry.location.lat,
              longitude: item.geometry.location.lng,
            }}
            icon={{ uri: item.icon, width: 40, height: 40, scale: 2 }}
          />
        )) : null}
      </MapView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1
  },
  titleText: {
    fontWeight: '600',
    fontSize: 32
  },
  placeList: {
    position: 'absolute',
    top: '10%',
    zIndex: 2
  },
  placeItem: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 8,
    elevation: 8
  },
  placeItemLabel: {
    color: '#0B0B45',
    fontSize: 14
  },
  placeItemActive: {
    backgroundColor: '#0B0B45'
  },
  placeItemLabelActive: {
    color: '#FFF',
  },
  btnGetCurrentLocation: {
    position: 'absolute',
    bottom: '15%',
    right: 9,
    backgroundColor: '#FFF',
    zIndex: 3,
    width: 42,
    height: 42,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    elevation: 1,
    opacity: 0.99
  },
  txtGetCurrentLocation: {
    color: '#000'
  }
})
import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Linking, PermissionsAndroid, ScrollView, SafeAreaView, Dimensions, Image } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { PLACES } from '../constants/store';
import axios from 'axios'
import { API_KEY_GOOGLE_MAPS, BASE_URL_PLACES_API } from '../constants/general';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';

Geocoder.init(API_KEY_GOOGLE_MAPS);

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

  useEffect(() => {
    getCurrentPosition()
  }, [])

  // Check if location permission is granted
  const hasLocationPermission = async () => {
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const getCurrentPosition = () => {
    if (hasLocationPermission()) {
      Geolocation.getCurrentPosition(
        position => {
          setRegion(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
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
          maximumAge: 10000,
        },
      );
    } else {
      Alert.alert(
        'Location Permission Required',
        'Please grant location permission in app settings',
      );
    }
  };

  const onChoosePlace = useCallback(async (place) => {
    const encodedPlace = place.toLowerCase().replace(" ", "%20")
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;

    getCurrentPosition()
    setActivePlace(place)

    try {
      const response = await axios.get(`${BASE_URL_PLACES_API}/nearbysearch/json?key=${API_KEY_GOOGLE_MAPS}&location=${region.latitude},${region.longitude}&radius=1500&keyword=${encodedPlace}`)

      if (response.data.results.length > 0) {
        const northeastLat = response.data.results[0].geometry.viewport.northeast.lat;
        const southwestLat = response.data.results[0].geometry.viewport.southwest.lat;
        const latDelta = northeastLat - southwestLat;
        const lngDelta = latDelta * ASPECT_RATIO;
        console.log(response.data)
        setRegion(prev => ({
          ...prev,
          latitude: response.data.results[0].geometry.location.lat,
          longitude: response.data.results[0].geometry.location.lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta,
        }))
        setDataPlaces(response.data.results)
      } else {
        Alert.alert("Info", response.data.status)
      }
    } catch (e) {
      throw e
    }
  }, [])

  const onOpenDirection = (destination) => {
    const originFormatted = originPlace.replace(' ', '+')
    const destinationFormatted = destination?.replace(' ', '+')

    Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${originFormatted}&destination=${destinationFormatted}`)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView horizontal style={styles.placeList} showsHorizontalScrollIndicator={false}>
        {PLACES.map((item, key) => {
          const activeItemStyle = item.value === activePlace ? { ...styles.placeItemActive } : {}
          const activeItemLabelStyle = item.value === activePlace ? { ...styles.placeItemLabelActive } : {}

          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => onChoosePlace(item.value)} style={[styles.placeItem, { ...activeItemStyle }]} key={key}>
              <Text style={[styles.placeItemLabel, { ...activeItemLabelStyle }]}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsMyLocationButton={true}
        showsUserLocation={true}
        zoomControlEnabled={true}
        region={region}
      >
        {dataPlaces.length > 0 ? dataPlaces.map((item, key) => (
          <Marker
            key={key}
            title="test"
            description="test"
            onPress={(cb) => onOpenDirection(item.name)}
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
  }
})
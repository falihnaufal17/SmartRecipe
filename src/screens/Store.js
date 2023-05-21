import React, { useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Alert, TouchableOpacity, Linking } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { PLACES } from '../constants/store';
import axios from 'axios'
import { API_KEY_GOOGLE_MAPS, BASE_URL_PLACES_API } from '../constants/general';
import Geocoder from 'react-native-geocoding';

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

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (pos) => {
        setRegion(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        Geocoder.from(pos.coords.latitude, pos.coords.longitude)
          .then(json => {
            const addressComponent = json.results[0].address_components[0];

            setOriginPlace(addressComponent.short_name)
          })
          .catch(error => console.warn(error));
      },
      (error) => Alert.alert('GetCurrentPosition Error', JSON.stringify(error)),
      { enableHighAccuracy: true }
    );
  };

  const onChoosePlace = useCallback(async (place) => {
    setActivePlace(place)
    try {
      const response = await axios.get(`${BASE_URL_PLACES_API}/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${place}&inputtype=textquery&key=${API_KEY_GOOGLE_MAPS}`)

      setRegion(prev => ({
        ...prev,
        latitude: response.data.candidates[0].geometry.location.lat,
        longitude: response.data.candidates[0].geometry.location.lng,
      }))
      setDataPlaces(response.data.candidates)
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
    <View style={styles.container}>
      <View style={styles.placeList}>
        {PLACES.map((item, key) => {
          const activeItemStyle = item.value === activePlace ? { ...styles.placeItemActive } : {}
          const activeItemLabelStyle = item.value === activePlace ? { ...styles.placeItemLabelActive } : {}

          return (
            <TouchableOpacity activeOpacity={0.8} onPress={() => onChoosePlace(item.value)} style={[styles.placeItem, { ...activeItemStyle }]} key={key}>
              <Text style={[styles.placeItemLabel, { ...activeItemLabelStyle }]}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>
      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        showsMyLocationButton={true}
        showsUserLocation={true}
        zoomControlEnabled={true}
        region={region}
      >
        {dataPlaces.map((item, key) => (
          <Marker
            key={key}
            title={item.name}
            description={item.formatted_address}
            onPress={(cb) => onOpenDirection(item.name)}
            coordinate={{
              latitude: item.geometry.location.lat,
              longitude: item.geometry.location.lng,
            }}
          />
        ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: 400,
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
    flexDirection: 'row',
    position: 'absolute',
    top: '10%',
    left: 0,
    right: 0,
    zIndex: 2,
    justifyContent: 'center',
    alignItems: 'center'
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
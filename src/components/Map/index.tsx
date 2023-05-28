import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from './style';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
  watchPositionAsync
} from 'expo-location'
import axios from 'axios';
import Address from '../Address';

export default function Map() {
  const [location, setLocation] = useState<LocationObject | null>(null)
  const [address, setAddress] = useState<string>('')
  const mapRef = useRef<MapView>(null)
  const token = ''
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition)
    }
  }

  const getAddresByReverseGeocode = async (latitude: number | undefined, longitude: number | undefined) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            access_token: token,
          },
        }
      );
      const data = response.data;
      const firstFeature = data.features[0];
      if (firstFeature) {
        setAddress(firstFeature.place_name);
      }
    } catch (error) {
      console.log('Error converting latitude and longitude to address: ', error);
    }
  };



  useEffect(() => {
    requestLocationPermissions()
  }, [])

  useEffect(() => {
    watchPositionAsync({
      accuracy: LocationAccuracy.Highest,
      timeInterval: 1000,
      distanceInterval: 1,
    }, ((response) => {
      setLocation(response);
      mapRef.current?.animateCamera({
        pitch: 70,
        center: response.coords
      })
    }))
  }, [])

  useEffect(() => {
    getAddresByReverseGeocode(location?.coords.latitude, location?.coords.longitude)
  }, [location])


  return (
    <View style={styles.container}>
      {
        location &&
        (
          <>
            <MapView
              mapType='hybrid'
              zoomControlEnabled
              customMapStyle={[{
                featureType: "landscape.natural",
                elementType: "geometry.stroke",
                stylers: [{ color: "red" }],
              }]}
              loadingEnabled
              ref={mapRef}
              style={{ flex: 1, width: '100%' }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005
              }}
            >
              <Marker coordinate={{ latitude: location.coords.latitude, longitude: location.coords.longitude }} />
            </MapView>
            <Address address={address} />
          </>
        )
      }
    </View>
  );
}

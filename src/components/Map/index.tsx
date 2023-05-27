import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { styles } from '../style';
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationObject,
  LocationAccuracy,
  watchPositionAsync
} from 'expo-location'

export default function Map() {
  const [location, setLocation] = useState<LocationObject | null>(null)
  const mapRef = useRef<MapView>(null)
  async function requestLocationPermissions() {
    const { granted } = await requestForegroundPermissionsAsync();
    if (granted) {
      const currentPosition = await getCurrentPositionAsync();
      setLocation(currentPosition)
    }
  }
  useEffect(() => {
    requestLocationPermissions()
  }, [])

  useEffect(() => {
   watchPositionAsync({
    accuracy: LocationAccuracy.Highest,
    timeInterval: 1000,
    distanceInterval: 1,
   },((response)=>{
    setLocation(response);
    mapRef.current?.animateCamera({
      pitch: 70,
      center: response.coords
    })
   }))
  }, [])
  

  return (
    <View style={styles.container}>
      {location &&
        <MapView
          ref={mapRef}
          style={{ flex: 1, width: '100%' }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
        >
          <Marker coordinate={{latitude: location.coords.latitude, longitude: location.coords.longitude}}/>
        </MapView>
      }
    </View>
  );
}

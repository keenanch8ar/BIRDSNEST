import React from 'react';
import MapView, { AnimatedRegion, Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions} from 'react-native';



export default class TrackingScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <MapView 
          style={styles.mapStyle} 
          initialRegion={{
            latitude: 33.892668,
            longitude: 130.840288,
            latitudeDelta: 10.0922,
            longitudeDelta: 10.0421,}} 
        />
      </View>
      
    );
  }
}

TrackingScreen.navigationOptions = {
  title: 'BIRDS-5: Tracking',
  headerStyle: {
    backgroundColor: '#131a20',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
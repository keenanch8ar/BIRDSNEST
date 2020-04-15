import React, { Component } from 'react';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const defaultRegion = {
  latitude: 33.892668,
  longitude: 130.840288,
  latitudeDelta: 5,
  longitudeDelta: 5,
}




const isAndroid = (Platform.OS === 'android');
const userMarkerImage_android = require('../assets/images/user_location_icon_android.png');


export default class TrackingScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {

      region: defaultRegion,
      mapMargin:1,
      mapLat: 0,
      mapLong: 0,
      curSatInfo: {lat: 0, lng: 0, height: 0, velocity: 0},
      lockedToSatLoc: true,

      userLat: 0,
      userLong: 0,
      userAlt: 0,
      userLocErrorSnackbarVisible: false,
      gotUserLoc: false,
      showUserLoc: false,
      showUserLocMarker: false,
      userNextPass: {max_alt: 0, max_alt_time: 0, rise_azimuth: 0, rise_time: 0, set_azimuth: 0, set_time: 0},
      userNextPassError: true,

      searchText: "",
      searchLat: 0,
      searchLong: 0,
      searchNextPass: {max_alt: 0, max_alt_time: 0, rise_azimuth: 0, rise_time: 0, set_azimuth: 0, set_time: 0},
      searchNextPassError: true,
      showSearchLocMarker: false,
      searchErrorSnackbarVisible: false,
      TLE_Data: "",
    };


  }

  printDate(date) {
    // Create an array with the current month, day and time
      var dateArr = [ date.getMonth() + 1, date.getDate(), date.getFullYear() ];
    // Create an array with the current hour, minute and second
      var timeArr = [ date.getHours(), date.getMinutes() ];
    // Determine AM or PM suffix based on the hour
      var suffix = ( timeArr[0] < 12 ) ? "AM" : "PM";
    // Convert hour from military time
      timeArr[0] = ( timeArr[0] < 12 ) ? timeArr[0] : timeArr[0] - 12;
    // If hour is 0, set it to 12
      timeArr[0] = timeArr[0] || 12;
    // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( timeArr[i] < 10 ) {
          timeArr[i] = "0" + timeArr[i];
        }
      }
    // Return the formatted string
      return dateArr.join("/") + " at " + timeArr.join(":") + " " + suffix;
}


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      var _this = this;
      _this.setState({ locErrorSnackbarVisible: true })
      setTimeout(function () { _this.setState({ locErrorSnackbarVisible: false }) }, 5000);
    }
    var location = await Location.getCurrentPositionAsync({});
    var userLat = location.coords.latitude;
    var userLong = location.coords.longitude;
    var userAlt = location.coords.longitude;
    this.setState({ userLat });
    this.setState({ userLong });
    this.setState({ userAlt });
    this.setState({ gotUserLoc: true });
    //this.getNextPass(this, userLat, userLong, userAlt, true);
    this.setState({ showUserLocMarker: true });
  };


  componentDidMount() {
    this._getLocationAsync(); //get user location
    this._getTLE(); //get sat location

  }

  setMargin = () => {
    this.setState({ mapMargin: 0 })
  }

  _getTLE() {
    //axios.get(`https://www.space-track.org/basicspacedata/query/class/tle_latest/ORDINAL/1/NORAD_CAT_ID/25544/format/tle`)

    axios
      .get('https://www.n2yo.com/rest/v1/satellite/tle/25544&apiKey=U726VS-YUR6BP-5CYTW9-4CT4')
      .then(res => {
        var data = res.data.tle;
        
        // break the textblock into an array of lines
        var lines1 = data.split('\n');
        var lines2 = data.split('\n');
        // remove one line, starting at the first position
        lines1.splice(1, 2);
        lines2.splice(0, 1);
        // join the array back into a single string
        var newtext = lines1.concat(lines2);

        this.setState({ TLE_Data: newtext });

        console.log(this.state.TLE_Data[0]);
        console.log(this.state.TLE_Data[1]);
      })

  }

  showUserLoc() {
    this.setState({ lockedToSatLoc: false });
    this.setState({ showUserLoc: true });
    let region = {
      latitude: this.state.userLat,
      longitude: this.state.userLong,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }
    this.map.animateToRegion(region);
    var _this = this;
    setTimeout(function(){ _this.userLocMarker.showCallout(); }, 1000);
  }

  makeSearchMarker(location) {
    var searchLat = location.latitude;
    var searchLong = location.longitude;
    this.setState({ searchLat });
    this.setState({ searchLong });
    this.setState({ showSearchLocMarker: true})
    let region = {
      latitude: searchLat,
      longitude: searchLong,
      latitudeDelta: 0.5,
      longitudeDelta: 0.5,
    }
    this.setState({ lockedToSatLoc: false });
    this.map.animateToRegion(region);
    //this.getNextPass(this, searchLat, searchLong, 0, false);
  }


  render() {

    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          onMoveShouldSetResponder={() => {
            this.setState({ lockedToSatLoc: false })
            return true
          }}
          onLongPress={e => this.makeSearchMarker(e.nativeEvent.coordinate)}
          ref={map => { this.map = map }}
          showsUserLocation={true}
          showsCompass={true}
          showsMyLocationButton={false}
          style={[styles.mapStyle, { marginBottom: this.state.mapMargin }]}
          //customMapStyle={MapStyling}
          initialRegion={this.state.region}
          onMapReady={this.setMargin}
        >
          <Marker
            ref={ref => { this.userLocMarker = ref; }}
            coordinate={{
              latitude: this.state.userLat,
              longitude: this.state.userLong
            }}
            image={isAndroid ? userMarkerImage_android : null}
            opacity={this.state.showUserLocMarker ? 1.0 : 0}
          >
            {isAndroid ? null : <Image source={userMarkerImage} style={{ width: 25, height: 25 }} resizeMode="contain" />}
          </Marker>

          <Marker
            ref={ref => { this.searchLocMarker = ref; }}
            coordinate={{
              latitude: this.state.searchLat,
              longitude: this.state.searchLong
            }}
            opacity={this.state.showSearchLocMarker ? 1.0 : 0}
          >
          </Marker>

        </MapView>

        <ActionButton
          buttonColor='#3498db'
          renderIcon={active => active ? (<Icon name="md-locate" style={styles.actionButtonIcon} /> ) : (<Icon name="md-locate" style={styles.actionButtonIcon} />)}
          offsetX={15}
          offsetY={90}
          fixNativeFeedbackRadius={true}
          userNativeFeedback={true}
          onPress={() => { this.showUserLoc() }}
        />

        <ActionButton
          buttonColor='#ffbb00'
          renderIcon={active => active ? (<Icon name="md-cube" style={styles.actionButtonIcon} />) : (<Icon name="md-cube" style={styles.actionButtonIcon} />)}
          offsetX={15}
          offsetY={15}
          fixNativeFeedbackRadius={true}
          userNativeFeedback={true}
          //onPress={() => { this.getTLE() }}
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
    flex: 1,
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  actionButtonIcon: {
    fontSize: 23,
    height: 25,
    color: 'white',
  },
});

const MapStyling = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#8ec3b9"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1a3646"
      }
    ]
  },
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#64779e"
      }
    ]
  },
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#4b6878"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#334e87"
      }
    ]
  },
  {
    "featureType": "landscape.natural",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6f9ba5"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#3C7680"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#304a7d"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2c6675"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#255763"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#b0d5ce"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#023e58"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#98a5be"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1d2c4d"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#283d6a"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#3a4762"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0e1626"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#4e6d70"
      }
    ]
  }
]

import React, { Component } from 'react';
import MapView, { AnimatedRegion, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Image } from 'react-native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import { getGroundTracks, getLatLngObj } from "tle.js";
import { AppLoading } from 'expo';
import { color } from 'react-native-reanimated';
import * as Sentry from "@sentry/react-native";
import axiosRetry from 'axios-retry';

const defaultRegion = {
  latitude: 33.892668,
  longitude: 130.840288,
  latitudeDelta: 50,
  longitudeDelta: 50,
}

const AUDIBLE_CIRCLE_RADIUS_M = 1000 * 2000;

const TLEStr = '1998-067PA\n1 43552U 98067PA  18203.24282627  .00006515  00000-0  10313-3 0  9994\n2 43552  51.6412 203.9371 0005837 350.6408   9.4476 15.54781596  1354'
const testingaxious = ["UGUISU", "", ""]
const tleArr = [
  'ISS (ZARYA)',
  '1 25544U 98067A   17206.18396726  .00001961  00000-0  36771-4 0  9993',
  '2 25544  51.6400 208.9163 0006317  69.9862  25.2906 15.54225995 67660'
];

const tle_ISS = `ISS (ZARYA)
1 25544U 98067A   17206.18396726  .00001961  00000-0  36771-4 0  9993
2 25544  51.6400 208.9163 0006317  69.9862  25.2906 15.54225995 67660`;

const isAndroid = (Platform.OS === 'android');
const userMarkerImage_android = require('../assets/images/user_location_icon_android.png');
const satMarkerImage_android = require('../assets/images/birds3_gold.png');
const satMarker2Image_android = require('../assets/images/birds3_white.png');
const satMarker3Image_android = require('../assets/images/birds3_red.png');
const satMarker4Image_android = require('../assets/images/birds4_J.png');

const satMarkerImage_gold = require('../assets/images/Gold_BIRDS3_IOS.png');
const satMarkerImage_red = require('../assets/images/Red_BIRDS3_IOS.png');
const satMarkerImage_white = require('../assets/images/White_BIRDS3_IOS.png');
const satMarkerImage_BIRDS4J= require('../assets/images/BIRDS4_J_IOS.png');
const userMarkerImage = require('../assets/images/user_location_icon.png');

// Import API keys from constants
import { N2YO_API_KEY } from './constants/apiKeys';


export default class TrackingScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {

      region: defaultRegion,
      mapMargin: 1,
      mapLat: 0,
      mapLong: 0,
      curSatInfo: { lat: 0, lng: 0, height: 0, velocity: 0 },
      lockedToSatLoc: true,

      userLat: 0,
      userLong: 0,
      userAlt: 0,
      userLocErrorSnackbarVisible: false,
      gotUserLoc: false,
      showUserLoc: false,
      showUserLocMarker: false,
      userNextPass: { max_alt: 0, max_alt_time: 0, rise_azimuth: 0, rise_time: 0, set_azimuth: 0, set_time: 0 },
      userNextPassError: true,

      searchText: "",
      searchLat: 0,
      searchLong: 0,
      searchNextPass: { max_alt: 0, max_alt_time: 0, rise_azimuth: 0, rise_time: 0, set_azimuth: 0, set_time: 0 },
      searchNextPassError: true,
      showSearchLocMarker: false,
      searchErrorSnackbarVisible: false,

      TLE_Data: [],
      TLE_Data_Nep: [],
      TLE_Data_Sri: [],
      TLE_Data_BIRDS4_J: [],

      TLE_Ready: false,

      satCoord: { lat: 0, lng: 0 },
      satCoords: [],
      satCoords2: [],
      satCoords3: [],

      satCoord_Nep: { lat: 0, lng: 0 },
      satCoords_Nep: [],
      satCoords2_Nep: [],

      satCoord_Sri: { lat: 0, lng: 0 },
      satCoords_Sri: [],
      satCoords2_Sri: [],

      satCoord_BIRDS4_J: { lat: 0, lng: 0 },


    };


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

  updateSatLocation(_this) {

    //checks if the JSat TLE data is empty, if it has no data the sat will not update

    if (this.state.TLE_Data === undefined || this.state.TLE_Data.length == 0 || this.state.TLE_Data.length == 1 || this.state.TLE_Data.includes("")) {
      // array empty or does not exist
      console.log('The J SAT data is empty');
    }
    else {
      const satCoord = getLatLngObj(this.state.TLE_Data);
      this.setState({ satCoord });
    }


    if (this.state.TLE_Data_Nep === undefined || this.state.TLE_Data_Nep.length == 0 || this.state.TLE_Data_Nep.length == 1 || this.state.TLE_Data_Nep.includes("")) {
      // array empty or does not exist
      console.log('The N SAT data is empty');
    }
    else {
      const satCoord_Nep = getLatLngObj(this.state.TLE_Data_Nep);
      this.setState({ satCoord_Nep });
    }



    if (this.state.TLE_Data_Sri === undefined || this.state.TLE_Data_Sri.length == 0 || this.state.TLE_Data_Sri.length == 1 || this.state.TLE_Data_Sri.includes("")) {
      // array empty or does not exist
      console.log('The S SAT data is empty');
    }
    else {
      const satCoord_Sri = getLatLngObj(this.state.TLE_Data_Sri);
      this.setState({ satCoord_Sri });
    }


    if (this.state.TLE_Data_BIRDS4_J === undefined || this.state.TLE_Data_BIRDS4_J.length == 0 || this.state.TLE_Data_BIRDS4_J.length == 1 || this.state.TLE_Data_BIRDS4_J.includes("")) {
      // array empty or does not exist
      console.log('The BIRDS-4 J SAT data is empty');
    }
    else {
      const satCoord_BIRDS4_J = getLatLngObj(this.state.TLE_Data_BIRDS4_J);
      this.setState({ satCoord_BIRDS4_J });
    }

  }

  componentDidMount() {
    this._getLocationAsync(); //get user location
    this._getTLE(); //get sat location
    var _this = this;
    //get sat location every second
    this.satUpdateAsyncID = setInterval(function () { _this.updateSatLocation(_this); }, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.satUpdateAsyncID);
  }


  setMargin = () => {
    this.setState({ mapMargin: 0 })
  }

  snapToSat() {
    this.setState({ lockedToSatLoc: true })
    let region = {
      latitude: this.state.satCoord.lat,
      longitude: this.state.satCoord.lng,
      latitudeDelta: 50,
      longitudeDelta: 50,
    }
    this.map.animateToRegion(region);

  }


  _getTLE(_this) {

    let one = `https://api.n2yo.com/rest/v1/satellite/tle/44331&apiKey=${N2YO_API_KEY}`;
    let two = `https://api.n2yo.com/rest/v1/satellite/tle/44329&apiKey=${N2YO_API_KEY}`;
    let three = `https://api.n2yo.com/rest/v1/satellite/tle/44330&apiKey=${N2YO_API_KEY}`;
    let four = `https://api.n2yo.com/rest/v1/satellite/tle/25544&apiKey=${N2YO_API_KEY}`;


    //Allows axios to retry three times if on shoddy internet connection and they fail the inital request
    axiosRetry(axios, { retries: 3 });

    const requestOne = axios.get(one);
    const requestTwo = axios.get(two);
    const requestThree = axios.get(three);
    const requestFour = axios.get(four);

    //Splits the request data into the three variables to be used
    axios.all([requestOne, requestTwo, requestThree, requestFour]).then(axios.spread((...responses) => {
      const responseOne = responses[0]
      const responseTwo = responses[1]
      const responseThree = responses[2]
      const responseFour = responses[3]

      // Grab the TLE data from the responses
      var dataJ = responseOne.data.tle;
      var dataN = responseTwo.data.tle;
      var dataS = responseThree.data.tle;
      var dataBIRDS4_J = responseFour.data.tle;

      // Prepare the TLE to be used by functions. Break the textblock into an array of lines
      var lines1J = dataJ.split('\n');
      var lines2J = dataJ.split('\n');
      // remove one line, starting at the first position
      lines1J.splice(1, 2);
      lines2J.splice(0, 1);
      // join the array back into a single string
      const nameJ = ["UGUISU"];
      var tempJ = nameJ.concat(lines1J);
      var newtextJ = tempJ.concat(lines2J);

      this.setState({ TLE_Data: newtextJ });

      //Get the projected orbit and ground tracks of UGUISU, the orbit is smiliar for J, N and S sats so only need to calculate for one
      this._getSatCoords();

      ///////////////////////////////////////////////////////////////////////////

      // Prepare N sat TLE. break the textblock into an array of lines
      var lines1N = dataN.split('\n');
      var lines2N = dataN.split('\n');
      // remove one line, starting at the first position
      lines1N.splice(1, 2);
      lines2N.splice(0, 1);
      // join the array back into a single string
      const nameN = ["NEPALISAT-1"];
      var tempN = nameN.concat(lines1N);
      var newtextN = tempN.concat(lines2N);

      this.setState({ TLE_Data_Nep: newtextN });

      ///////////////////////////////////////////////////////////////////////////

      // Prepare S sat TLE. break the textblock into an array of lines
      var lines1S = dataS.split('\n');
      var lines2S = dataS.split('\n');
      // remove one line, starting at the first position
      lines1S.splice(1, 2);
      lines2S.splice(0, 1);
      // join the array back into a single string
      const nameS = ["RAAVANA-1"];
      var tempS = nameS.concat(lines1S);
      var newtextS = tempS.concat(lines2S);

      this.setState({ TLE_Data_Sri: newtextS });


            ///////////////////////////////////////////////////////////////////////////

      // Prepare BIRDS4 J sat TLE. break the textblock into an array of lines
      var lines1_4J = dataBIRDS4_J.split('\n');
      var lines2_4J = dataBIRDS4_J.split('\n');
      // remove one line, starting at the first position
      lines1_4J.splice(1, 2);
      lines2_4J.splice(0, 1);
      // join the array back into a single string
      const name_4J = ["TSURU"];
      var temp_4J = name_4J.concat(lines1_4J);
      var newtext_4J = temp_4J.concat(lines2_4J);

      this.setState({ TLE_Data_BIRDS4_J: newtext_4J });

    })).catch(errors => {
      // react on errors.
      console.log(errors);
      Sentry.captureException(errors);

    })

    this.setState({ TLEReady: true });


  };

  _getSatCoords = async () => {

    const orbitLines = await getGroundTracks({
      tle: this.state.TLE_Data,

      // Resolution of plotted points.  Defaults to 1000 (plotting a point once for every second).
      stepMS: 1000,

      // Returns points in [lng, lat] order when true, and [lng, lat] order when false.
      isLngLatFormat: false
    });

    var satCoords = [];
    var satCoords2 = [];
    var satCoords3 = [];
    for (var i = 0; i < orbitLines[0].length; i++) {
      satCoords = [...satCoords, { latitude: orbitLines[0][i][0], longitude: orbitLines[0][i][1] }];
    }
    for (var i = 0; i < orbitLines[1].length; i++) {
      satCoords2 = [...satCoords2, { latitude: orbitLines[1][i][0], longitude: orbitLines[1][i][1] }];
    }
    for (var i = 0; i < orbitLines[2].length; i++) {
      satCoords3 = [...satCoords3, { latitude: orbitLines[2][i][0], longitude: orbitLines[2][i][1] }];
    }

    this.setState({ satCoords });
    this.setState({ satCoords2 });
    this.setState({ satCoords3 });


  };


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
    setTimeout(function () { _this.userLocMarker.showCallout(); }, 1000);
  }

  makeSearchMarker(location) {
    var searchLat = location.latitude;
    var searchLong = location.longitude;
    this.setState({ searchLat });
    this.setState({ searchLong });
    this.setState({ showSearchLocMarker: true })
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
          customMapStyle={MapStyling}
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

          <MapView.Marker.Animated
            ref={ref => { this.satMarker = ref; }}
            coordinate={{
              latitude: this.state.satCoord.lat,
              longitude: this.state.satCoord.lng
            }}
            title="NEPALISAT-1"
            image={isAndroid ? satMarkerImage_android : null}
            opacity={(this.state.satCoord.latitude != 0 || this.state.satCoord.latitude != 0) ? 1.0 : 0}
          >
            {isAndroid ? null : <Image source={satMarkerImage_gold} style={{ width: 40, height: 40 }} resizeMode="contain" />}
          </MapView.Marker.Animated>

          <MapView.Marker.Animated
            ref={ref => { this.satMarker = ref; }}
            coordinate={{
              latitude: this.state.satCoord_Nep.lat,
              longitude: this.state.satCoord_Nep.lng
            }}
            title="RAAVANA-1"
            image={isAndroid ? satMarker2Image_android : null}
            opacity={(this.state.satCoord.latitude != 0 || this.state.satCoord.latitude != 0) ? 1.0 : 0}
          >
            {isAndroid ? null : <Image source={satMarkerImage_white} style={{ width: 40, height: 40 }} resizeMode="contain" />}
          </MapView.Marker.Animated>

          <MapView.Marker.Animated
            ref={ref => { this.satMarker = ref; }}
            coordinate={{
              latitude: this.state.satCoord_Sri.lat,
              longitude: this.state.satCoord_Sri.lng
            }}
            title="UGUISU"
            image={isAndroid ? satMarker3Image_android : null}
            opacity={(this.state.satCoord.latitude != 0 || this.state.satCoord.latitude != 0) ? 1.0 : 0}
          >
            {isAndroid ? null : <Image source={satMarkerImage_red} style={{ width: 40, height: 40 }} resizeMode="contain" />}
          </MapView.Marker.Animated>

          <MapView.Marker.Animated
            ref={ref => { this.satMarker = ref; }}
            coordinate={{
              latitude: this.state.satCoord_BIRDS4_J.lat,
              longitude: this.state.satCoord_BIRDS4_J.lng
            }}
            title="BIRDS-4 SATS"
            image={isAndroid ? satMarker4Image_android : null}
            opacity={(this.state.satCoord.latitude != 0 || this.state.satCoord.latitude != 0) ? 1.0 : 0}
          >
            {isAndroid ? null : <Image source={satMarkerImage_BIRDS4J} style={{ width: 40, height: 40 }} resizeMode="contain" />}
          </MapView.Marker.Animated>

          <MapView.Polyline
            coordinates={this.state.satCoords}
            strokeWidth={2}
            strokeColor="#65b3ff"
            lineJoin="round" />

          <MapView.Polyline
            coordinates={this.state.satCoords2}
            strokeWidth={2}
            strokeColor="#1e90ff"
            lineJoin="round"
            tappable={true} />

          <MapView.Polyline
            coordinates={this.state.satCoords3}
            strokeWidth={2}
            strokeColor="#004a92"
            lineJoin="round" />



        </MapView>

        <ActionButton
          buttonColor='#3498db'
          renderIcon={active => active ? (<Icon name="md-locate" style={styles.actionButtonIcon} />) : (<Icon name="md-locate" style={styles.actionButtonIcon} />)}
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
          onPress={() => { this.snapToSat() }}
        />
      </View>
    );
  }
}



TrackingScreen.navigationOptions = {
  title: 'BIRDS-NEST: Tracking',
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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



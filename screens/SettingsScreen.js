import React, { Component } from 'react';
import { SectionList, StyleSheet, Text, View, RefreshControl } from 'react-native';

import Icon from '@expo/vector-icons/MaterialCommunityIcons';
import { ScrollView } from 'react-native-gesture-handler';
import ElevatedView from 'react-native-elevated-view';

import * as firebase from 'firebase';
import 'firebase/firestore';
// Initialize Cloud Firestore through Firebase

if (!firebase.apps.length) {
    firebase.initializeApp({
		apiKey: "AIzaSyABeGUXqmmjlGsOD1jB_M3y6_l0kACvyHU",
		authDomain: "birdsnest-3d05c.firebaseapp.com",
		databaseURL: "https://birdsnest-3d05c.firebaseio.com",
		projectId: "birdsnest-3d05c",
		storageBucket: "birdsnest-3d05c.appspot.com",
		messagingSenderId: "614322410300",
		appId: "1:614322410300:web:504a2b7d8bc27593698439",
		measurementId: "G-22N9KR9EBX"
	});
}

var db = firebase.firestore();

import { YellowBox } from 'react-native';
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


export default class SettingsScreen extends Component {


	constructor(props) {
		super(props);

		this.state = {
			dataFromDatabase: [],
			isLoading: false
		};


	} 


	 async componentDidMount() {

		 this.setState({ isLoading: true });
		 const items = [];



		 firebase
			 .firestore()
			 .collection("sats")
			 .doc("0001")
			 .collection("records")
			 .orderBy("Timestamp","desc")
			 .limit(1)
			 .get()
			 .then((querySnapshot) => { //Notice the arrow funtion which bind `this` automatically.
				 querySnapshot.forEach(function (doc) {
					 items.push(doc.data());
				 });
				 this.setState({ dataFromDatabase: items, isLoading: false }); //set data in state here
			 });
	 }

	render() {

		const data = this.state.dataFromDatabase;

		if (data && data.length > 0) {
			console.log("Document timestamp:",data[0]);
			return (
			
				<ScrollView
					style={{ backgroundColor: "#131a20" }}
				>
					<View style={styles.dataContainer} >
						<View style={styles.rowContainer} >
							<ElevatedView elevation={5} style={[styles.card, { marginTop: 10 }]} >
								<Text style={styles.cardTitle}>Last Transmission</Text>
								<Text style={styles.cardText}> </Text>
								<View style={styles.rowContainerLeft} >
									<Icon name="clock" size={20} style={styles.icon} />
									<Text style={styles.cardText}>{data[0].CW_update.toDate().toString()}</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Icon name="radio-tower" size={20} style={styles.icon} />
									<Text style={styles.cardText}>{data[0].Recorded_observatory}</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Operation Mode: </Text>
									<Text style={styles.cardText}>{data[0].Operation_mode}</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Uplink Success:  </Text>
									<Text style={styles.cardText}>{data[0].Uplink_success.toString()}</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Last Reset:  </Text>
									<Text style={styles.cardText}>{data[0].From_last_reset}</Text>
								</View>
							</ElevatedView>
						</View>
	
						<View style={styles.rowContainer} >
							<ElevatedView elevation={5} style={[styles.card, { marginTop: 10 }]} >
								<Text style={styles.cardTitle}>Battery Information</Text>
								<Text style={styles.cardText}> </Text>
								<View style={styles.rowContainerLeft} >
									<Icon name="battery" size={20} style={styles.icon} />
									<Text style={styles.cardText}>LiPo Battery</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Battery Current:  </Text>
									<Text style={styles.cardText}>{data[0].Battery_current}A</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Battery Heater:  </Text>
									<Text style={styles.cardText}>{data[0].Battery_heater.toString()}</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Battery Temperature:  </Text>
									<Text style={styles.cardText}>{data[0].Battery_temp}</Text>
									<Icon name="temperature-celsius" size={20} style={styles.icon} />
									
								</View>
							</ElevatedView>
						</View>
	
						<View style={styles.rowContainer} >
							<ElevatedView elevation={5} style={[styles.card, { marginTop: 10 }]} >
								<Text style={styles.cardTitle}>Ambient Temperatures</Text>
								<Text style={styles.cardSubtitle}> </Text>
								<View style={styles.rowContainerCenter} >
									<Text style={styles.cardSubtitle}>LiPo Battery </Text>
								</View>
								<Text style={styles.cardText}> </Text>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Current State:  </Text>
									<Text style={styles.cardText}>Normal Range</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Temperature:  </Text>
									<Text style={styles.cardText}>{data[0].Battery_temp}</Text>
									<Icon name="temperature-celsius" size={20} style={styles.icon} />
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Peak Temperature:  </Text>
									<Text style={styles.cardText}>85</Text>
									<Icon name="temperature-celsius" size={20} style={styles.icon} />
								</View>
								<Text style={styles.cardText}> </Text>
								<View style={styles.rowContainerCenter} >
									<Text style={styles.cardSubtitle}>Solar Panel </Text>
								</View>
								<Text style={styles.cardText}> </Text>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Current State:  </Text>
									<Text style={styles.cardText}>Normal Range</Text>
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Temperature:  </Text>
									<Text style={styles.cardText}>-18.07</Text>
									<Icon name="temperature-celsius" size={20} style={styles.icon} />
								</View>
								<View style={styles.rowContainerLeft} >
									<Text style={styles.cardText}>Peak Temperature:  </Text>
									<Text style={styles.cardText}>-30</Text>
									<Icon name="temperature-celsius" size={20} style={styles.icon} />
								</View>
							</ElevatedView>
						</View>
	
						<View style={styles.rowContainer} >
							<ElevatedView elevation={5} style={[styles.card, { marginTop: 10 }]} >
								<Text style={styles.cardTitle}>IMU Information</Text>
								<Text style={styles.cardText}> </Text>
	
								<View style={styles.rowContainer} >
									<View style={{ flex: 0.33, alignItems: 'center' }}>
										<Text style={styles.cardSubtitle}>Acc</Text>
										<Text style={styles.cardText}>X: 0.02 g</Text>
										<Text style={styles.cardText}>Y: -0.02 g</Text>
										<Text style={styles.cardText}>Z: 0.02 g</Text>
									</View>
	
									<View style={{ flex: 0.33, alignItems: 'center' }}>
										<Text style={styles.cardSubtitle}>Gyro</Text>
										<Text style={styles.cardText}>X: {data[0].Gyro_XYZ[0]} d/s</Text>
										<Text style={styles.cardText}>Y: {data[0].Gyro_XYZ[1]} d/s</Text>
										<Text style={styles.cardText}>Z: {data[0].Gyro_XYZ[2]} d/s</Text>
									</View>
	
									<View style={{ flex: 0.33, alignItems: 'center' }}>
										<Text style={styles.cardSubtitle}>Mag</Text>
										<Text style={styles.cardText}>X: 7.34 mT</Text>
										<Text style={styles.cardText}>Y: -35.78 mT</Text>
										<Text style={styles.cardText}>Z: -7.34 mT</Text>
									</View>
								</View>
							</ElevatedView>
						</View>
					</View>
				</ScrollView>
			);
		} else {
			return <Text style={styles.cardTitle}>Loading...</Text>
		}
		
	}
}
SettingsScreen.navigationOptions = {
	title: 'BIRDS-5: Data',
};
const styles = StyleSheet.create({
	dataContainer: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '#131a20',
	},
	rowContainer: {
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	rowContainerLeft: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	rowContainerCenter: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
	card: {
		margin: 5,
		padding: 10,
		flex: 1,
		backgroundColor: '#19222a',
	},
	cardTitle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 22,
	},
	cardSubtitle: {
		color: 'white',
		fontSize: 18,
	},
	cardSubheading: {
		marginBottom: 5,
		marginTop: 7.5,
	},
	helpIconHeading: {
		marginBottom: 7.5,
		textAlign: 'center',
	},
	cardText: {
		color: 'white',
		fontSize: 14,
		marginBottom: 5,
	},
	icon: {
		backgroundColor: "transparent",
		color: "white",
		paddingRight: 5,
	},
	helpIcon: {
		backgroundColor: "transparent",
		color: "#e5e5e5",
		paddingLeft: 7.5,
	},
});
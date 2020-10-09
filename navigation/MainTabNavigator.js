import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import TabBarIcon from '../components/TabBarIcon';
import TrackingScreen from '../screens/TrackingScreen';
import CADScreen from '../screens/CADScreen';
import DataScreen from '../screens/DataScreen';
import GalleryScreen from '../screens/GalleryScreen';


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const TrackingStack = createStackNavigator(
  {
    Tracking: TrackingScreen,
  },
  config
);

TrackingStack.navigationOptions = {
  tabBarLabel: 'Tracking',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={ Platform.OS === 'ios' ? 'ios-compass': 'md-compass' }/>
  ),
};

TrackingStack.path = '';

const CADStack = createStackNavigator(
  {
    CAD: CADScreen,
  },
  config
);

CADStack.navigationOptions = {
  tabBarLabel: 'CAD Model',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-cube' : 'md-cube'} />
  ),
};

CADStack.path = '';

const DataStack = createStackNavigator(
  {
    Data: DataScreen,
  },
  config
);

DataStack.navigationOptions = {
  tabBarLabel: 'Data',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-analytics' : 'md-podium'} />
  ),
};

DataStack.path = '';


const GalleryStack = createStackNavigator(
  {
    Gallery: GalleryScreen,
  },
  config
);

GalleryStack.navigationOptions = {
  tabBarLabel: 'Gallery',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-albums' : 'md-images'} />
  ),
};

GalleryStack.path = '';


const tabNavigator = createBottomTabNavigator({
  
  GalleryStack,
  TrackingStack,
  CADStack,
  DataStack,
});

tabNavigator.path = '';

export default tabNavigator;

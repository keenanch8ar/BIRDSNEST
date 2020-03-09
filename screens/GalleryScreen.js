import React from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';



export default class GalleryScreen extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello World!</Text>
      </View>

    );
  }
}

GalleryScreen.navigationOptions = {
  title: 'BIRDS-5: Gallery',
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
});
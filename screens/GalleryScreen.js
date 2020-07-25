import React from 'react';
import { StyleSheet, Text, View, Dimensions} from 'react-native';
import Gallery from 'react-native-image-gallery';



export default class GalleryScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      images: [
        { caption: 'This is the first image taken by BIRDS-3 satellites. It is an image of the sun', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg5.jpg?alt=media&token=42ca0712-95bc-452b-b36d-57d58e63c614' } },
        { caption: 'This image shows the southern coastal part of India. On the west coast, Kerala and Goa and on the east Tamil Nadu can be seen.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg1.jpg?alt=media&token=69f4fd55-49d7-4f63-9974-75fca02c1656' } },
        { caption: 'This photo shows south of Sri Lanka', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg2.jpg?alt=media&token=b9f1d23e-6e87-4c69-acac-484b20fc930a' } },
        { caption: 'This photo was taken over Sri Lanka. This shows the beautiful Sri Lankan island surrounded by the blue ocean', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg3.jpg?alt=media&token=69b02fe8-5131-48e2-9694-22294c7f6f8b' } },
        { caption: 'This photo was taken when the satellite was over Japan. It shows beautiful clouds and the horizon', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg4.jpg?alt=media&token=bcd405c4-8496-4d93-8b7f-d929fdc0aea8' } },
        { caption: 'Our blue planet in the eyes of BIRDS-3 satellites.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg6.jpg?alt=media&token=10390f63-8763-4d5f-be80-7b25485d252d' } },
        { caption: 'BIRDS-3 satellite takes a snapshot of Mongolia and it’s capital Ulaanbaatar. The command was sent from the National University of Mongolia (NUM).', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg7.jpg?alt=media&token=44bb6fa7-4429-435c-908d-f0d3191f6d57' } },
        { caption: 'The red dotted frames which is in the photo and Google map are same area.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg8.png?alt=media&token=7dbef26f-4dd6-4c40-b1e8-4a6ea6e30428' } },
        { caption: 'This photo was taken from Ghana, and their capital Accra is shown in this photo.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg9.jpg?alt=media&token=be02d12e-5627-4526-8758-a198a069ca73' } },
        { caption: 'We can see Sun and Earth in this photo. This photo was taken by Uguisu.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg10.jpg?alt=media&token=1d54d959-8c67-4978-a9b1-fcb1879ba9bd' } },
        { caption: 'Raavana-1 was able to capture “The Palk Strait” (Tamil: பாக்கு நீரிணை, Sinhala: පෝක් සමුද්ර සන්ධිය) between Sri Lanka and India.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg11.jpg?alt=media&token=38d0f802-d915-41ae-92aa-aae56c167262' } },
        { caption: 'Amami-Oshima, Tokunoshima, Yoronjima Island, Okinoerabu Island and Okinawa (under the clouds) in Japan taken by Uguisu; Japan satellite.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg12.jpg?alt=media&token=8cd397e3-fb4e-4070-96ca-64807c6b4c5f' } },
        { caption: 'BIRDS-3 took image of South Korea alongside the island of Jeju.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg13.jpg?alt=media&token=a8e86284-27ad-4c8d-8e03-7b17544d8f5f' } },
        { caption: 'We took this photo. We can see clouds and the ocean. There is a light spectrum of the sun. Can you see that?', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg14.jpg?alt=media&token=2404bd13-4b9e-4ca2-a4e0-5631eb985d9f' } },
        { caption: 'This image shows the sun and the Earth. We can see the light of the sun falling on the Earth.', source: { uri: 'https://firebasestorage.googleapis.com/v0/b/birdsnest-3d05c.appspot.com/o/birds3_images%2Fimg15.jpg?alt=media&token=48e3c0fb-e5b0-4c7e-807c-5779cc61801c' } }
      ]
    };
    this.onChangeImage = this.onChangeImage.bind(this);

    // this.addImages();
    // this.removeImages();
    // this.removeImage(2, 3000);
  }

  addImages() {
    // Debugging helper : keep adding images at the end of the gallery.
    setInterval(() => {
      const newArray = [...this.state.images, { source: { uri: 'http://i.imgur.com/DYjAHAf.jpg' } }];
      this.setState({ images: newArray });
    }, 5000);
  }

  removeImage(slideIndex, delay) {
    // Debugging helper : remove a given image after some delay.
    // Ensure the gallery doesn't crash and the scroll is updated accordingly.
    setTimeout(() => {
      const newArray = this.state.images.filter((element, index) => index !== slideIndex);
      this.setState({ images: newArray });
    }, delay);
  }

  removeImages() {
    // Debugging helper : keep removing the last slide of the gallery.
    setInterval(() => {
      const { images } = this.state;
      console.log(images.length);
      if (images.length <= 1) {
        return;
      }
      const newArray = this.state.images.filter((element, index) => index !== this.state.images.length - 1);
      this.setState({ images: newArray });
    }, 2000);
  }

  onChangeImage(index) {
    this.setState({ index });
  }

  renderError() {
    return (
      <View style={{ flex: 1, backgroundColor: 'black', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>This image cannot be displayed...</Text>
        <Text style={{ color: 'white', fontSize: 15, fontStyle: 'italic' }}>... but this is fine :)</Text>
      </View>
    );
  }

  get caption() {
    const { images, index } = this.state;
    return (
      <View style={{ bottom: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontStyle: 'italic' }}>{(images[index] && images[index].caption) || ''} </Text>
      </View>
    );
  }

  get galleryCount() {
    const { index, images } = this.state;
    return (
      <View style={{ top: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'right', color: 'white', fontSize: 15, fontStyle: 'italic', paddingRight: '10%' }}>{index + 1} / {images.length}</Text>
      </View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <Gallery
          style={{ flex: 1, backgroundColor: '#696969' }}
          images={this.state.images}
          errorComponent={this.renderError}
          onPageSelected={this.onChangeImage}
          initialPage={0}
        />
        {this.galleryCount}
        {this.caption}
      </View>
    );
  }

}

GalleryScreen.navigationOptions = {
  title: 'BIRDS-NEST: Gallery',
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
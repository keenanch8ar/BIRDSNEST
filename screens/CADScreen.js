import * as React from 'react';
import { WebView } from 'react-native-webview';

export default class CADScreen extends React.Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        style={{flex:1}}
        javaScriptEnabled={true}
        source={{ uri: 'https://hotmail93837.autodesk360.com/g/shares/SH56a43QTfd62c1cd968aa1e71d6b4b37c71?viewState=NoIgbgDAdAjCA0IBGATAphAzANgOy4FokAOTAQwIBZ1siBjXOg7AJmJRkzQDMBOXbpRABdIA' }}
        onNavigationStateChange={this.handleWebViewNavigationStateChange}
      />
    );
  }


  handleWebViewNavigationStateChange = newNavState => {
    // newNavState looks something like this:
    // {
    //   url?: string;
    //   title?: string;
    //   loading?: boolean;
    //   canGoBack?: boolean;
    //   canGoForward?: boolean;
    // }
    const { url } = newNavState;
    if (!url) return;
  
    // handle certain doctypes
    if (url.includes('.pdf')) {
      this.webview.stopLoading();
      // open a modal with the PDF viewer
    }
  
    // one way to handle a successful form submit is via query strings
    if (url.includes('?message=success')) {
      this.webview.stopLoading();
      // maybe close this view?
    }
  
    // one way to handle errors is via query string
    if (url.includes('?errors=true')) {
      this.webview.stopLoading();
    }
  
    // redirect somewhere else
    if (url.includes('google.com')) {
      const newURL = 'https://facebook.github.io/react-native/';
      const redirectTo = 'window.location = "' + newURL + '"';
      this.webview.injectJavaScript(redirectTo);
    }
  };
}

CADScreen.navigationOptions = {
  title: 'BIRDS-NEST: CAD Model',
  headerStyle: {
    backgroundColor: '#131a20',
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};
import * as React from 'react';
import { WebView } from 'react-native-webview';

export default class App extends React.Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        style={{flex:1}}
        javaScriptEnabled={true}
        source={{ uri: 'https://myhub.autodesk360.com/ue2d9e293/g/shares/SHabee1QT1a327cf2b7a9907ea329c429482?mode=embed&viewState=NoIgbgDAdAjCA0IBsAmAxhALJgnAZgFoYBDAUwA4DNydLy80YCB2cmW5gVmLT2PJABdIA' }}
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

App.navigationOptions = {
  title: 'BIRDS-5: CAD Model',
};
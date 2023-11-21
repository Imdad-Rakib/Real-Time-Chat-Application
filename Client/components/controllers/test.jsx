// Import necessary components from React and React Native
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Linking } from 'react-native';

const MyButtonPage = () => {

  const showAlert = (msg) => {
    Alert.alert(
      'Downloaded',
      err,
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false }
    );
  }


  const downloadFile = () => {
      const { config, fs } = RNFetchBlob;
      const date = new Date();
      const fileDir = fs.dirs.DownloadDir;
      config({
        // add this option that makes response data to be stored as a file,
        // this is much more performant.
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path:
            fileDir +
            '/download_' +
            Math.floor(date.getDate() + date.getSeconds() / 2) +
            '.pdf',
          description: 'file download',
        },
      })
        .fetch('GET', 'http://localhost:5000/inbox/download/chemistry-1700456018398.pdf')
      .then(res => {
          // the temp file path
        console.log('The file saved to ', res.path());
        showAlert('file downloaded successfully ');
      });
  };

  const requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        // [
          // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        // ],
        {
          title: 'Storage Permission Required',
          message:
            'Application needs access to your storage to download File ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      console.log(granted);
      // console.log(PermissionsAndroid.RESULTS);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the Storage');
      } 
      else if(granted === 'never_ask_again'){
        Linking.openSettings();
      } 
      else {
        console.log('Storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleButtonPress = () => {
    console.log('Button Pressed!');
    requestStoragePermission();
  };

  return (
    <View style={styles.container}>
    <TouchableOpacity style = {styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles using StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

// Export the component for use in other parts of your application
export default MyButtonPage;

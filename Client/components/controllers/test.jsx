// Import necessary components from React and React Native
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, PermissionsAndroid } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { Linking } from 'react-native';

const MyButtonPage = () => {

  const showAlert = (msg) => {
    Alert.alert(
      'Downloaded',
      msg,
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false }
    );
  }


  const downloadFile = (fileName) => {
      console.log('fileName', fileName);
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
            '/' +
            fileName,
            // Math.floor(date.getDate() + date.getSeconds() / 2) +
          description: 'file download',
        },
      })
        .fetch('GET', `http://localhost:5000/inbox/download/${fileName}`)
      .then(res => {
          // the temp file path
        // console.log(res);
        console.log('The file saved to ', res.path());
        showAlert('file downloaded successfully ');
      });
  };

  
  const handleButtonPress = () => {
    downloadFile('video.mp4');
    // requestStoragePermission();
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

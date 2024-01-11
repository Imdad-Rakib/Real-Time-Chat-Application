import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useSelector } from 'react-redux';
import Modal from "react-native-modal";
import { useState } from "react";
import { setCurrentChat } from "../../store/slices/currentChatSlice.mjs";
import { useDispatch } from "react-redux";

const ChatOptions = ({navigation}) =>{
  const [isVisible, setIsVisible] = useState(false)
  const receiver = useSelector((state) => state.currentChat);
  const sender = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const showError = (err) => {
    Alert.alert(
      'Error',
      err,
      [
        {
          text: 'OK',
        },
      ],
      { cancelable: false }
    );
  }
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `${seconds} sec`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} hour`;
    } else if (seconds < 604800) {
      const days = Math.floor(seconds / 86400);
      return `${days} day`;
    } else {
      const weeks = Math.floor(seconds / 604800);
      return `${weeks} week`;
    }
  };
  const handleTimerSelection = async (duration) =>{
    try{
      let res = await fetch('http://localhost:5000/inbox/setDisappearingMsg',{
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: receiver.conversation_id,
          room: receiver.room,
          receiver: receiver.email,
          sender: sender.email,
          expiry: duration * 1000
        }),
        credentials: 'include',
      })
      res = await res.json();
      if(res.error) showError(res.error);
      else{
        setIsVisible(false);
        let x = {...receiver};
        x.disappearing_flag = true;
        dispatch(setCurrentChat(x));
        // console.log(receiver);
        navigation.navigate('Inbox')
      }
    }catch(err){
      console.log(err);
      showError('An error occured. Please try again.')
    }
  }
  return(
    <>
      <Modal
        style={{ backgroundColor: 'white', width: '80%', height: '35%', top: '30%', left: '5%', position: 'absolute', overflow: 'scroll' }}
        isVisible={isVisible}
        avoidKeyboard={false}
        onBackdropPress={() => setIsVisible(false)}
      >
        <Text style = {{alignSelf: 'center', fontSize: 20, color: 'black', marginBottom: 10}}>Set Timer</Text>
        <View>
          <View style={styles.optionsContainer}>
            {[180, 900, 1800, 86400, 604800].map((duration) => (
              <TouchableOpacity
                key={duration}
                onPress={() => handleTimerSelection(duration)}
                style={styles.optionButton}
              >
                <Text style={styles.optionText}>{formatTime(duration)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
      <View style={[styles.imgContainer, { height: 90, width: 90, alignSelf: 'center', marginTop: 30 }]}>
        <Image
          style={{ height: 90, width: 90 }}
          source={{
            uri: `http://localhost:5000/getImage/${encodeURIComponent(receiver.email)}`
          }}
        />
      </View>
      <View style={{ backgroundColor: 'green', width: 20, height: 20, position: 'absolute', borderRadius: 50, borderColor: 'white', borderWidth: 3.5, left: 210, top: 95 }}>

      </View>
      <Text style={{ fontSize: 22, color: 'black', marginTop: 12, textAlign: 'center', fontWeight: 'bold' }}>{receiver.name}</Text>
      <View style = {{marginTop: 20, marginLeft: 13}}>
        <Text style = {{fontSize: 16}}>Actions</Text>
        <TouchableOpacity onPress={() =>{setIsVisible(true)}}><Text style = {styles.options}>Disappearing Message</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => {navigation.navigate('Room')}}><Text style = {styles.options}>Chat Rooms</Text></TouchableOpacity>
        <TouchableOpacity><Text style={styles.options}>Media & Files</Text></TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  imgContainer: {
    borderRadius: 50,
    overflow: 'hidden',
    backgroundColor: '#ebebeb',
    marginLeft: 12,
  },
  options: {
    fontSize: 18,
    color: 'black',
    marginTop: 17,
    marginBottom: 17,
    // padding: 10
  },
  optionsContainer:{
    flexDirection: 'column',
    // marginTop: 20,
  },
  optionButton:{
    // backgroundColor: '#0055cc',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  optionText: {
    // color: '',
    fontSize: 18,
  },
});

export default ChatOptions
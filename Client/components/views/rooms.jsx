import {Alert,  Text, FlatList, View, TouchableOpacity, TouchableHighlight, StyleSheet, TextInput, Button } from "react-native"
import Icon from  'react-native-vector-icons/MaterialIcons'
import {useEffect, useState} from 'react'
import Modal from "react-native-modal";
import { useNavigation } from "@react-navigation/native";
import { setCurrentChat } from "../../store/slices/currentChatSlice.mjs";
import { useDispatch, useSelector} from "react-redux";

const Rooms = () => {
  const [rooms, setRooms] = useState([])
  const [value, setValue] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState(false);
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch();

  const navigation = useNavigation();
  const currentChat = useSelector((state) => state.currentChat)

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
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsVisible(true)}>
          <Icon
            style={{ marginTop: 2 }}
            name='add'
            size={25}
            color='black'
          />
        </TouchableOpacity>
      ),
    });
  }, [])
  useEffect(() =>{
    const getRooms = async () =>{
      try {
        let response = await fetch('http://localhost:5000/conversations/getRooms', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify({
            id: currentChat.conversation_id,
          }),
          credentials: 'include',
        })
        response = await response.json();
        if (response.error) {
          showError(response.error);
        }
        else {
          setRooms(response.rooms);
        }
      }
      catch (err) {
        console.log(err);
        showError('An error occured. Please try again');
      }
    }
    getRooms();
  }, [])
  const createNewRoom = async () =>{
    try {
      let response = await fetch('http://localhost:5000/conversations/newRoom', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          conversation_id: currentChat.conversation_id,
          name: value,
          creator: user.email
        }),
        credentials: 'include',
      })
      response = await response.json();
      if (response.error) {
        showError(response.error);
      }
      else if(response.success){
        let x = {...currentChat};
        x.room = value;
        dispatch(setCurrentChat(x))
        navigation.navigate('Inbox');
      }
      else{
        setError(true);
      }
    }
    catch (err) {
      console.log(err);
      showError('An error occured. Please try again');
    }
  }
  const switchRoom = (room) =>{
    let x = {...currentChat}
    x.room = room;
    dispatch(setCurrentChat(x));
    navigation.navigate('Inbox');
  }
  useEffect(() =>{
    setError(false);
  }, [value])
  return (
    <View style = {{height: '100%', backgroundColor: 'white'}}>

        <Modal
          style = {{backgroundColor: 'white', width:'80%', height: '30%', top: '30%', left: '5%', position: 'absolute'}}
          isVisible={isVisible}
          avoidKeyboard={false}
          onBackdropPress={() => setIsVisible(false)}
        >
        <View>
            <TextInput
              style = {{borderBottomWidth: 1, borderColor: '#ccc', width: '80%', marginLeft: 25, marginTop: -20, padding: 5}}
              placeholder="Type the name of the room"
              value = {value}
              onChangeText={(text) => {setValue(text)}}
            />
            {error && <Text style = {{color: 'red'}}>Room with this name already exists. Try different</Text>}
            <TouchableOpacity
              style = {{ width: 70, height: 35, marginLeft: 110, marginTop: 20, borderRadius: 20}}
            >
              <Button 
                title = 'Create' 
                style = {{backgroundColor: 'red'}}
                onPress={createNewRoom}
              />
            </TouchableOpacity>
        </View>
        </Modal>
      <View style = {styles.header}>
        <Text style = {{ fontSize: 23, color: 'black'}}>All rooms</Text>
      </View>
      <View style = {{height: 1, borderBottomWidth: 1, borderColor: '#ccc'}}/>
      <View style = {{padding: 10, marginLeft: 10}}>
        <FlatList
          data={rooms}
          keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
          renderItem={({item, index}) =>{
          return(
            <TouchableOpacity onPress = {() =>switchRoom(item.name)}>
              <View>
                <Text style={{ fontSize: 19, color: 'black' }}>{item.name}</Text>
                <Text>
                  {item.name === 'General' ? 'Default' : `Created by ${currentChat.email === item.creator ? currentChat.name : 'you'}`}
                </Text>
              </View>
            </TouchableOpacity>
          )
          }
          } 
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    padding: 10
  }
})

export default Rooms

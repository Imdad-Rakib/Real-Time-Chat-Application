import React, {useState, useEffect, useRef} from 'react';
import {ActivityIndicator, Alert, Button, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ImageComponent } from 'react-native';
import { timestamp } from '../../utilities/timestamp.mjs';
import { useRoute } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import { updateConversation } from '../../store/slices/conversationSlice.mjs';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Inbox = () => {
    const route = useRoute();
    const dispatch = useDispatch();
    const sender = useSelector((state) => state.user);
    const socket = useSelector((state) => state.socket.socket);
    const [value, setValue] = useState('');
    // const [inputHeight, setInputHeight] = useState(38);
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    useEffect(() =>{
        socket.on('private_message', (msg, conversation) => {
            console.log('new message');
            if(msg.sender === route.params.email){
                conversation.isOpened = true;
                // callback({ok: true})
                setMessages(prev => {
                    const newMessages = [msg, ...prev]
                    return newMessages;
                })
            }
            // else{
            //     callback({ok: false});
            // }
            dispatch(updateConversation(conversation))
        })
    },[]);
    setTimeout(() => {
        setLoading(false);
    }, 500);
    
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
    async function getMessage(){
        try{
            let response = await fetch('http://localhost:5000/inbox', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body:JSON.stringify({
                    person1: sender.email,
                    person2: route.params.email
                }),
                credentials: 'include',
            })
            response = await response.json();
            if(response.error){
                showError(response.error);
            }
            else{
                setMessages(response.messages);
            }
        }
        catch(err){
            console.log(err);
            showError('An error occured. Please try again');
        }
    }
    useEffect(() => {
        getMessage();
    }, []);
    const handleSend = () => {
        if(value === '') return;
        socket.emit('private_message', {
            text: value,
            sender: sender.email,
            sender_name: sender.name,
            receiver: route.params.email,
            receiver_name: route.params.name,
        }, (res) =>{
            if(res.error){
                showError(res.error)
            }
            else{
                // console.log(res.conversation);
                dispatch(updateConversation(res.conversation));
            }
        })
        setMessages(prev => {
            const newMessages = [{text: value, sender: sender.email, receiver: route.params.email, createdAt: Date.now()}, ...prev]
            return newMessages;
        })
        setValue('');
    }
    const renderItem = ({item}) =>{
        return(
            <View style = {{flexDirection: item.sender !== sender.email ? 'row': ''}}>
                {item.sender !== sender.email && 
                <View style={[styles.imgContainer, {position: 'absolute', bottom: 4, left: 0}]}>
                    {/* <Image
                        style={styles.image}
                        source={{ uri: 'https://example.com/your-image.jpg' }}
                    /> */}
                </View>}
            <View style={[
                styles.messageContainer,
                {
                    alignSelf: item.sender === sender.email ? 'flex-end' : 'flex-start',
                    backgroundColor: item.sender === sender.email ? '#0000FF' : '#f5f5f5',
                    marginRight: item.sender === sender.email ? 15 : 0,
                    marginLeft: item.sender !== sender.email ? 50 : 0,
                    borderTopLeftRadius: item.sender === sender.email ? 20 : 12,
                    borderTopRightRadius: item.sender !== sender.email ? 20 : 12,
                    borderBottomLeftRadius: item.sender === sender.email ? 20 : 2,
                    borderBottomRightRadius: item.sender !== sender.email ? 20 : 2,


                }
            ]}>
            
                <Text style={[
                    styles.messageText,
                    {
                        color: item.sender === sender.email ? 'white' : 'black',
                    }
                ]}>
                    {item.text}
                </Text>
                {/* <Text style={{ fontSize: 12, textAlign: 'right', color: '#f5f5f5', fontStyle: 'italic'}}>{timestamp(item.createdAt)}</Text> */}
            </View>
            </View>
        )
    }
    return (
        loading ? 
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='#007bff' />
            </View>
            :
            (<View style = {{backgroundColor: 'white', height: '100%'}}>
               <View style={styles.allMessageContainer}>
                   <FlatList
                       data={messages}
                       keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
                       renderItem={renderItem}
                       inverted
                   />
               </View>
                <View style={styles.messageOptions}>
                    <TextInput
                        style={styles.input}
                        multiline = {true}
                        value={value}
                        onChangeText={(text)=>{setValue(text)}}
                        placeholder="Type your message..."
                    />
                    <TouchableOpacity title="Send" onPress={handleSend}>
                        <Icon
                            name='send'
                            size={27}
                            color='blue'
                        />
                    </TouchableOpacity>
                </View>
            </View>)
    );
};

const styles = StyleSheet.create({
    loader: {
        minHeight: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageOptions: {
        // backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        // backgroundColor: 'red',
        // padding: 5,
        position: 'absolute',
        bottom: 0,
        // marginleft: 20,
        
    },
    input: {
        width: '80%',
        backgroundColor: '#f5f5f5',
        borderRadius: 19,
        marginRight: 10,
        fontSize: 15,
        paddingLeft: 20,
        height: 40,
    },
    allMessageContainer:{
        // height: '90%',
        marginTop: 10,
        marginBottom: 60,
        backgroundColor: 'white',
        // borderBottomWidth: 1,
        
    },
    messageContainer: {
        maxWidth: 250,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 10,
        paddingTop: 10,
        // borderTopLeftRadius: 20,
        marginBottom: 5,
        marginTop: 5,
    },
    sender: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    messageText: {
        letterSpacing: 0.2,
        lineHeight: 21,
        fontSize: 16,
        fontFamily: 'Arial',
        // color: 'white',
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
    },
    imgContainer: {
        width: 27,
        height: 27,
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#ebebeb',
        marginLeft: 12,
    },
});

export default Inbox;

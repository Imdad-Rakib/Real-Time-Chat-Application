import React, {useState, useEffect, useCallback} from 'react';
import {Image, ActivityIndicator, Alert, Button, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ImageComponent, Keyboard, Animated, Easing, PermissionsAndroid, Platform, TouchableWithoutFeedback, Radio } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import DocumentPicker, {types} from 'react-native-document-picker'
import { setMessages, addMessage } from '../../store/slices/messageSlice.mjs';
import store from '../../store/index.mjs';
import { setCurrentChat } from '../../store/slices/currentChatSlice.mjs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFile, faFilePdf, faFileText, faPlateWheat } from '@fortawesome/free-solid-svg-icons';
import RNFetchBlob from 'rn-fetch-blob';
import Modal from "react-native-modal";

import { useNavigation } from "@react-navigation/native";
import { updateConversation } from '../../store/slices/conversationSlice.mjs';

const Inbox = () => {
    const dispatch = useDispatch();
    const socket = useSelector((state) => state.socket.socket);
    const sender = useSelector((state) => state.user);
    const receiver = useSelector((state) => state.currentChat);
    const messages = useSelector((state) => state.message.messages)
    const [value, setValue] = useState('');
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const navigation = useNavigation();
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

    useEffect(() =>{
        navigation.setOptions({
            headerTitle: () => (
                <TouchableOpacity 
                    style = {{flexDirection: 'row'}}
                    onPress={() =>{
                        navigation.navigate('Chat Options')
                    }}
                >
                    <View style={[styles.imgContainer, {height: 42, width: 42,  marginRight: 8, marginLeft: -20 }]}>
                    <Image
                        style={{height: 42, width: 42}}
                            source={{
                                uri: `http://localhost:5000/getImage/${encodeURIComponent(receiver.email)}` }}
                    />
                    </View>
                    <View style={{ backgroundColor: 'green', width: 16, height: 16, position: 'absolute', borderRadius: 50, borderColor: 'white', borderWidth: 3.5, left: 12, top: 22 }}>

                    </View>
                    <Text style = {{fontSize: 21, color: 'black', marginTop: 8}}>{receiver.name}</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity
                    onPress={handlePress}
                >
                <Icon
                    name='swap-horiz'
                    size={27}
                        color= '#0055cc'
                />
                </TouchableOpacity>
            ),
        });
    }, [receiver]);

    setTimeout(() => {
        setLoading(false);
    }, 200);
   
    useEffect(() => {
        async function getMessage() {
            if(!receiver.conversation_id){
                dispatch(setMessages([]))
                return;
            }
            try {
                let response = await fetch('http://localhost:5000/inbox', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        conversation_id: receiver.conversation_id,
                        name: receiver.room
                    }),
                    credentials: 'include',
                })
                response = await response.json();
                if (response.error) {
                    showError(response.error);
                }
                else {
                    dispatch(setMessages(response.messages));
                    let x = {...receiver};
                    x.disappearing_flag = response.disappearing_flag;
                    dispatch(setCurrentChat(x))
                }
            }
            catch (err) {
                console.log(err);
                showError('An error occured. Please try again');
            }
        }
        getMessage();
    }, [receiver]);
    
    const handlePress = () =>{
        console.log('okay');
        if(receiver.conversation_id === ''){
            showError('Start a conversation to switch room');
        }
        else{
            navigation.navigate('Room');
        }
    }
    
    const handleSend = async (files) => {
        if(value === '' && !files) return;
        const formData = new FormData();
        if(files) {
            if(files.length > 3){
                showError('Maximum 3 files can be sent at a time');
                return;
            }
            else{
                files.forEach((file, index) => {
                    formData.append(`file${index + 1}`, file);
                });
            }
        }
        formData.append('text', value)
        formData.append('sender', sender.email)
        formData.append('receiver', receiver.email)
        formData.append('sender_name', sender.name)
        formData.append('receiver_name', receiver.name)
        formData.append('conversation_id', receiver.conversation_id)
        formData.append('room_name', receiver.room);
        try {
            let res = await fetch('http://localhost:5000/inbox/privateMessage', {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                credentials: 'include',
            })
            res = await res.json();
            if (res.error) {
                showError(res.error);
            }
            else {
                let x = { ...store.getState().currentChat }
                if (x.conversation_id === '') {
                    x.conversation_id = res.conversation._id;
                    x.room = res.conversation.last_room;
                    dispatch(setCurrentChat(x));
                }
                dispatch(addMessage({sender: sender.email, text: value, file: res.file}));
                dispatch(updateConversation(res.conversation));
            }
        }
        catch (err) {
            console.log(err);
            showError('An error occured. Please try again');
        }
    }
    const selectFile = async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'formSheet',
                type: ['*/*'],
                allowMultiSelection: false,
            });
            handleSend(response);
        } catch (err) {
            console.log(err);
        }
    };
    const trimmedFileName = (file) => {
        let i = file.name.length;
        while (i > 0) {
            if (file.name[i] === '-') {
                break;
            }
            i--;
        }
        return file.name.substring(0, i) + file.extname;
    }
    const downloadFile = (file) => {
        
        const { config, fs } = RNFetchBlob;
        const fileDir = fs.dirs.DownloadDir;
        const name = trimmedFileName(file);
        console.log(name);
        config({
            fileCache: true,
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path:
                    fileDir +
                    '/' +
                    name,
                description: 'file download',
            },
        })
            .fetch('GET', `http://localhost:5000/inbox/download/${file.name}`)
            .then(res => {
                Alert.alert(
                    'Download',
                    'File downloaded successfully',
                    [
                        {
                            text: 'OK',
                        },
                    ],
                    { cancelable: false }
                );
            });
    };

    const requestPermission = async (file) => {
        console.log(Platform.constants.Release);
        if(Platform.constants.Release !== '13'){  
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                        title: 'Storage Permission',
                        message:'',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('permission denied');
                    return
                }
            } catch (err) {
                console.warn(err);
                return
            }
        }
        downloadFile(file);
    };
    const handleLongPress = (flag) =>{

    }
    const renderItem = ({item}) =>{
        return(
            <View style = {{flexDirection: item.sender !== sender.email ? 'row': ''}}>
                {item.sender !== sender.email && 
                    <View style={[styles.imgContainer, { position: 'absolute', bottom: 4, left: 0 }]}>
                    <Image
                        style={{height: 27, width: 27}}
                            source={{ uri: `http://localhost:5000/getImage/${encodeURIComponent(receiver.email)}` }}
                    />
                    </View>
                }
                <View style={[
                    styles.messageContainer,
                    {
                        alignSelf: item.sender === sender.email ? 'flex-end' : 'flex-start',
                        backgroundColor: item.file || item.sender !== sender.email ? '#f5f5f5' : '#0000FF' ,
                        marginRight: item.sender === sender.email ? 15 : 0,
                        marginLeft: item.sender !== sender.email ? 50 : 0,
                        borderTopLeftRadius: item.sender === sender.email ? 20 : 12,
                        borderTopRightRadius: item.sender !== sender.email ? 20 : 12,
                        borderBottomLeftRadius: item.sender === sender.email ? 20 : 2,
                        borderBottomRightRadius: item.sender !== sender.email ? 20 : 2,


                    }
                ]}>
                <TouchableWithoutFeedback 
                    onLongPress={() => {
                        if(sender.email === item.sender) setIsVisible(true);
                    }} 
                    delayLongPress={200}
                >
                {
                    item.file ? 
                    (
                        <TouchableOpacity activeOpacity = {0.7} style = {{flexDirection: 'row'}} onPress={() => {
                            // downloadFile(item.file)
                            requestPermission(item.file);
                        }}>
                            <View style={{ backgroundColor: '#e0e0e0', height: 40, width: 40, borderRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
                                <FontAwesomeIcon icon={faFileText} size={25} color="gray" />
                            </View>
                            <View style = {{marginLeft: 10}}>
                                <Text style = {{color: 'black', fontSize: 15, maxWidth: 150}}>{trimmedFileName(item.file)}</Text>
                                <Text style = {{fontSize: 13, marginTop: 2 }}>{(item.file.size / 1024).toFixed(1)} KB</Text>
                            </View>
                        </TouchableOpacity>
                    ):
                    (
                        <Text style={[
                            styles.messageText,
                            {
                                color: item.sender === sender.email ? 'white' : 'black',
                            }
                        ]}>
                            {item.text}
                        </Text>
                    )
                    }
                    {/* <Text style={{ fontSize: 12, textAlign: 'right', color: '#f5f5f5', fontStyle: 'italic'}}>{timestamp(item.createdAt)}</Text> */}
                    </TouchableWithoutFeedback>
                </View>
            </View>
        )
    }
    // const [selectedDuration, setSelectedDuration] = useState(null)
    const renderDurationItem = ({item}) =>{
        return(
            <TouchableOpacity onPress={() => console.log('okay')} style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                {/* <Radio selected={'5' === item.id} /> */}
                <Text>{item.label}</Text>
            </TouchableOpacity>
        )
    }
    return (
        loading ? 
            <View style={styles.loader}>
                <ActivityIndicator size='large' color='#007bff' />
            </View>
            :
            (<View style = {{backgroundColor: 'white', height: '100%'}}>
                <View style={{ backgroundColor: '#7F00FF', paddingTop: 1, paddingBottom: 1, flexDirection: 'row', justifyContent: 'center'}}>
                    {receiver.room === '' ? 
                    (<Text style = {{fontSize: 16, color: 'white'}}>Start conversation</Text>)
                    :
                    (<>
                        <Icon
                            name='arrow-forward'
                            size={18}
                            color='black'
                            style = {{marginTop: 1, color: 'white'}}
                        />
                        <Text style = {{color: 'white', textAlign: 'center', fontSize: 16, fontWeight: 'bold'}}>{receiver.room}</Text>
                        <Text style = {{color: 'white', fontSize: 20}}>{receiver.disappearing_flag ? " Timer" : ""}</Text>
                    </>)}
                </View>
               <View style={styles.allMessageContainer}>
                    <Modal
                        style={{ backgroundColor: 'white', width: '80%', height: '30%', top: '30%', left: '5%', position: 'absolute' }}
                        isVisible={isVisible}
                        avoidKeyboard={false}
                        onBackdropPress={() => setIsVisible(false)}
                    >
                        {/*  */}
                        <FlatList
                            data={[
                                { id: 1, label: '5 seconds', value: 5 },
                                { id: 2, label: '30 seconds', value: 30 },
                                { id: 3, label: '1 minute', value: 60 },
                                { id: 4, label: '5 minutes', value: 300 },
                                { id: 5, label: '30 minutes', value: 1800 },
                                { id: 6, label: '1 hour', value: 3600 },
                            ]}
                            renderItem={renderDurationItem}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </Modal> 
                    
                   <FlatList
                       data={messages}
                       keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
                       renderItem={renderItem}
                       inverted
                   />
               </View>
                <View style={styles.messageOptions}>
                    <TouchableOpacity
                        onPress={selectFile}
                    >
                    <Icon
                        name = 'attachment'
                        size = {27}
                        style={{ transform: [{ rotate: '-45deg' }], color: '#0055cc'}}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Icon
                        name = 'photo'
                        size = {27}
                        style={{ color: '#0055cc', marginLeft: 5}}
                    />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        multiline = {true}
                        value={value}
                        onChangeText={(text)=>{setValue(text)}}
                        placeholder="Type your message"
                    />
                    <TouchableOpacity
                        onPress={() => { handleSend(); setValue('') }}
                    >
                    <Icon
                        name='send'
                        size={27}
                        color='#0055cc'
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        position: 'absolute',
        bottom: 0,
       
        
    },
    input: {
        width: '70%',
        backgroundColor: '#f5f5f5',
        borderRadius: 19,
        marginRight: 10,
        marginLeft: 10,
        fontSize: 15,
        paddingLeft: 20,
        height: 35,
    },
    allMessageContainer:{
        marginBottom: 85,
        backgroundColor: 'white',
        
    },
    messageContainer: {
        maxWidth: 250,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 10,
        paddingTop: 10,
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
    },
    timestamp: {
        fontSize: 12,
        color: 'gray',
    },
    imgContainer: {
        borderRadius: 50,
        overflow: 'hidden',
        backgroundColor: '#ebebeb',
        marginLeft: 12,
    },
});

export default Inbox;

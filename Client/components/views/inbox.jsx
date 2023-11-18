import React, {useState, useEffect, useCallback} from 'react';
import {ActivityIndicator, Alert, Button, View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ImageComponent, Keyboard, Animated, Easing } from 'react-native';
import { useSelector } from 'react-redux';
import { useDispatch} from 'react-redux';
import DocumentPicker, {types} from 'react-native-document-picker'
import { setMessages } from '../../store/slices/messageSlice.mjs';
import { setCurrentChat } from '../../store/slices/currentChatSlice.mjs';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from "@react-navigation/native";
import { handleSend } from '../../Socket/index.mjs';

const Inbox = () => {
    const dispatch = useDispatch();
    // const animatedWidth = useRef(new Animated.Value(100)).current;
    const socket = useSelector((state) => state.socket.socket);
    const sender = useSelector((state) => state.user);
    const receiver = useSelector((state) => state.currentChat);
    const messages = useSelector((state) => state.message.messages)
    // const [isKeyboardActive, setIsKeyboardActive] = useState(false);
    const [value, setValue] = useState('');
    // const [inputHeight, setInputHeight] = useState(38);
    const [loading, setLoading] = useState(true);
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

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
    //         setIsKeyboardActive(true);
    //         Animated.timing(animatedWidth, {
    //             toValue: '80%', // Final width
    //             duration: 1000, // Animation duration in milliseconds
    //             easing: Easing.linear, // You can choose different easing functions
    //         }).start();
    //         // Keyboard is shown, trigger the animation
    //         // increaseWidthWithAnimation();
    //     });

    //     const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
    //         setIsKeyboardActive(false);

    //         // Keyboard is hidden, you can reset the width or apply any other animation
    //         // animatedWidth.setValue(100); // Reset width to the initial value

    //     });

    //     return () => {
    //         keyboardDidShowListener.remove();
    //         keyboardDidHideListener.remove();
    //     };
    // }, []);

    useEffect(() =>{
        navigation.setOptions({
            // title: receiver.name,
            // headerStyle: {
            //     height: 100,
            // },
            headerTitle: () => (
                <TouchableOpacity style = {{flexDirection: 'row'}}>
                    <View style={[styles.imgContainer, {height: 42, width: 42, marginRight: 8, marginLeft: -20 }]}>
                        {/* <Image
                        style={styles.image}
                        source={{ uri: 'https://example.com/your-image.jpg' }}
                    /> */}
                    </View>
                {/* <View> */}
                    <Text style = {{fontSize: 21, color: 'black', marginTop: 8}}>{receiver.name}</Text>
                    {/* <View style = {{flexDirection: 'row'}}>
                        <Icon
                            style = {{marginTop: 1}}
                            name='arrow-forward'
                            size={15}
                            onPress={() => {
                                console.log('Hello, World');
                            }}

                        />
                        <Text style = {{fontSize: 16, marginLeft: 3, marginTop: -2}}>{receiver.room}</Text>
                    </View> */}
                {/* </View> */}
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
                  // color='blue'
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
        if(receiver.conversation_id === ''){
            showError('Start a conversation to switch room');
        }
        else{
            navigation.navigate('Room');
        }
    }
    /*const handleSend = async () =>{
        try {
            let response = fetch(url, {
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
            }
        }
        catch (err) {
            console.log(err);
            showError('An error occured. Please try again');
        }
    }*/
    const selectFile = useCallback(async () => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'formSheet',
                type: ['*/*'],
                allowMultiSelection: true,
            });
            console.log(response);
            const files = response.map(file => ({
                uri: file.uri,
                type: file.type,
                name: file.name,
            }));
            const formData = new FormData();
            files.forEach((file, index) => {
                formData.append(`file${index}`, file);
            });
            handleSend();
            // setFileResponse(response);
        } catch (err) {
            console.log(err);
        }
    }, []);
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
                    </>)}
                </View>
               <View style={styles.allMessageContainer}>
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
                        onPress={() => { handleSend(socket, dispatch, sender.email, receiver.email, sender.name, receiver.name, receiver.conversation_id, receiver.room, value); setValue('') }}
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
        // height: '90%',
        marginTop: 10,
        marginBottom: 90,
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

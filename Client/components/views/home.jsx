import {View, FlatList, Alert, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'
import moment from "moment";
import {useState, useEffect} from 'react'
import SearchUser from "./search";
import { useDispatch, useSelector } from "react-redux";
import { timestamp } from "../../utilities/timestamp.mjs";
import { setConversation, updateConversation, updateConversationStatus } from "../../store/slices/conversationSlice.mjs";
import { setCurrentChat } from "../../store/slices/currentChatSlice.mjs";

const Home = ({navigation}) =>{
    
    const dispatch = useDispatch();
    const conversation = useSelector((state) => state.conversation)
    const user = useSelector((state) => state.user);

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
    useEffect(()=>{
        async function getConversations(){
            try {
                let response = await fetch('http://localhost:5000/conversations',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({email: user.email }),
                        credentials: 'include'
                    })
                response = await response.json();
                if (response.error) {
                    showError(response.error)
                }
                else {
                    dispatch(setConversation(response.conversations))
                }
            }
            catch (err) {
                console.log('Error: ', err);
                showError('An error occured. Please try again.')
            }
        }
        getConversations();
    }, [])
    const handlePress = async(item) =>{
        let name, email;
        if (user.email === item.creator) {
            name = item.participant_name
            email = item.participant
        }
        else {
            name = item.creator_name
            email = item.creator
        }
        dispatch(setCurrentChat({ name, email, room: item.last_room, conversation_id: item._id }));
        if(item.updated_by !== user.email && !item.isOpened){
            console.log('ok');
            try {
                let response = await fetch('http://localhost:5000/conversations/modify', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        creator: item.creator,
                        participant: item.participant
                    }),
                    credentials: 'include',
                })
                response = await response.json();
                console.log(response);
                if (response.error) {
                    showError(response.error);
                }
                else {
                    console.log('okay');
                    dispatch(updateConversationStatus({creator: item.creator, participant: item.participant}))
                    navigation.navigate('Inbox');
                }
            }
            catch (err) {
                console.log(err);
                showError('An error occured. Please try again');
            }
        }
        navigation.navigate('Inbox');
    }
    const renderItem = ({ item }) => {
        let name, email;
        if(user.email === item.creator){
            name = item.participant_name
            email = item.participant
        }
        else{
            name = item.creator_name
            email = item.creator
        }
        let msg = item.last_msg;
        msg = msg.split('\n')[0];
        if(msg.length > 30){
            msg = msg.slice(0, 30);
            msg += '....'
        }
        msg += '  ' + timestamp(item.last_updated);
        
        if(item.last_msg === ''){
            if(item.updated_by === user.email){
                msg = 'You sent an attachment' + msg;
            }
            else{
                msg = 'Attachment' + msg;
            }
        }
        else{
            if(item.update_by === user.email){
                msg = 'You: ' + msg;
            }
        }
        return (
            <TouchableOpacity
                style={styles.nameContainer}
                activeOpacity={0.4}
                onPress = {() => handlePress(item)}
            >
                <View style={styles.imgContainer }>
                    <Image
                        style={styles.image}
                        source={{ uri: `http://localhost:5000/getImage/${encodeURIComponent(email)}` }}
                    />
                </View>
                <View style={{ backgroundColor: 'green', width: 18, height: 18, position: 'absolute', borderRadius: 50, borderColor: 'white', borderWidth: 3.5, left: 52, top: 42 }}>

                </View>
                <View style = {{marginLeft: 15}}>
                    <Text style={{
                        fontSize: 17, 
                        marginBottom: 3,
                        fontWeight: item.updated_by !== user.email && !item.isOpened ? 'bold' : 'normal',
                        color: item.updated_by !== user.email && !item.isOpened ? 'black' : 'gray'
                    }}

                    >
                        {name}
                    </Text>
                    <Text 
                        style={{
                            fontSize: 14,
                            fontWeight: item.updated_by !== user.email && !item.isOpened ? 'bold': 'normal',
                            color: item.updated_by !== user.email && !item.isOpened ? 'black': 'gray'
                        }}
                    >
                        {msg}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
    return(
        <View style = {{backgroundColor: 'white', height: '100%'}}>
        <TouchableOpacity 
            style={styles.searchContainer} 
            onPress={() =>{
                navigation.navigate('Search')
            }}
            activeOpacity={0.8}
        >
            <Icon name="search" size={20} color="gray" />
            <Text style = {{marginLeft: 15, fontSize: 16}}>Search</Text>
        </TouchableOpacity>
        <FlatList
            data={conversation.conversation}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
        />
        </View>
    )
}
const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        margin: 10,
        // borderWidth: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 50,
        borderRadius: 20,
        padding: 10,
    },
    nameContainer: {
        flexDirection: 'row',
        // borderWidth: 1,
        marginBottom: 5,
        paddingTop: 5,
        paddingBottom: 5,
        alignItems: 'center',
    },
    imgContainer:{
        width: 55, 
        height: 55, 
        borderRadius: 50, 
        overflow: 'hidden', 
        // backgroundColor: '#ebebeb',
        marginLeft: 12,
    },
    image:{
        width: 55,
        height: 55,
    }
});
export default Home;
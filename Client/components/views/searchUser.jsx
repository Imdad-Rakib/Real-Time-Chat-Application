import { useState, useRef } from "react"
import {FlatList, Alert, View, TextInput, StyleSheet,Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import { useDebouncedCallback } from "use-debounce";
import Icon from 'react-native-vector-icons/MaterialIcons'
import { io } from 'socket.io-client';
import { socket } from "../../App";
import { useSelector } from 'react-redux';


export default function SearchUser({navigation}){
   
    const [value, setValue] = useState('');
    const sender = useSelector((state) => state.user);
    const [searchResult, setSearchResult] = useState([]);
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
    const handlePress = (email, name) =>{
        // setSearchResult(prev => {
        //     let newState = [...prev];
        //     newState[index].state = 'person';
        //     return newState;
        // })
        navigation.navigate('Inbox', {
            email,
            name
        });
        // console.log(state.current.props.name);
        // state.current.setNativeProps({name: 'person'});
        // try {
        //     let response = await fetch('http://localhost:5000/users/searchUser', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify(
        //             {
        //                 requestedBy: 'u1904032@student.cuet.ac.bd',
        //                 requestedTo: email
        //             }),
        //         credentials: 'include'
        //     })
        //     response = await response.json();
        //     if (response.error) {
        //         showError(response.error)
        //     }
        //     else {
                
        //     }
        // }
        // catch (err) {
        //     console.log(err);
        //     showError('An error occured. Please try again');
        // }
    }
    const debounced = useDebouncedCallback(() => {
        const searchUser = async ()=>{
            try{
                let response = await fetch('http://localhost:5000/users/searchUser',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                    {
                        searchFor: value,
                        email: sender.email,
                    }),
                    credentials: 'include'
                })
                response = await response.json();
                if(response.error){
                    showError(response.error)
                }
                else{
                    // console.log(response.foundUsers);
                    setSearchResult(response.users);
                }
            }
            catch(err){
                console.log(err);
                showError('An error occured. Please try again');
            }
        }
        searchUser();
    }, 100);
    return(
        <>
            <View style = {styles.searchBar}>
                <Icon
                    style = {styles.icon}
                    name = 'search'
                    // size = {25}
                />
                <TextInput
                    style = {styles.input}
                    onChangeText={(text) =>{
                        setValue(text);
                        debounced();
                    }}
                    value={value}
                    placeholder="Search"
                />
            </View>
            <FlatList
                data={searchResult}
                keyExtractor={(item, index) => index.toString()}
                renderItem={ ({ item, index }) => 
                (
                    <TouchableOpacity 
                        onPress={() => handlePress(item.email, item.name)}
                        // keyboardShouldPersistTaps="always" 
                    >
                        
                        <View style={styles.nameItem}>
                            <Text style = {styles.name}>{item.name}</Text>
                         {/* {!item.friend &&
                            <TouchableOpacity onPress = {() => handlePress(item.email, index)}>
                                <Icon
                                    name={item.state}
                                    size = {30}
                                    color= '#007bff'
                                />
                            </TouchableOpacity>
                        } */}
                        </View>
                    </TouchableOpacity>
                )}
            />
    </>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 5,
    },
    icon: {
        fontSize: 22,
        marginRight: 10,
        marginLeft: 10,
        marginTop: 3
    },
    input: {
        flex: 1,
        fontSize: 17,
        padding: 5,
        borderColor: '#ccc',
    },
    nameItem: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50,
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    name:{
        fontSize: 17,
        // marginTop: 5
    },
    // personAdd:{
    //     fontSize: 30,
    //     color: '#007bff',
    // }
});

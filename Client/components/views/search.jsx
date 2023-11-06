import { useState} from "react"
import {FlatList, Alert, View, TextInput, StyleSheet,Text, TouchableOpacity, KeyboardAvoidingView, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons'

export default function Search({ handlePress, debounced, searchResult}){
   
    const [value, setValue] = useState('');
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
                        debounced(text);
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
                    >
                        
                        <View style={styles.nameItem}>
                            <Text style = {styles.name}>{item.name}</Text>
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
});

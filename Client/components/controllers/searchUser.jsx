import Search from "../views/search"
import { setCurrentChat } from "../../store/slices/currentChatSlice.mjs";
import { useDispatch, useSelector } from "react-redux";
import { useDebouncedCallback } from 'use-debounce';
import { Alert } from "react-native";

import { useState } from "react";

const SearchUser = ({navigation}) => {
  const sender = useSelector((state) => state.user);
  const [searchResult, setSearchResult] = useState([]);
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
  const handlePress = async (email, name) => {
    try {
      let response = await fetch('http://localhost:5000/conversations/getConversationInfo', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({
          person1: email,
          person2: sender.email
        }),
        credentials: 'include',
      })
      response = await response.json();
      if (response.error) {
        showError(response.error);
      }
      else {
        dispatch(setCurrentChat({ email, name, conversation_id: response.conversation?._id, room: response.conversation?.last_room}))
        navigation.navigate('Inbox');
      }
    }
    catch (err) {
      console.log(err);
      showError('An error occured. Please try again');
    }
    
  }
  const debounced = useDebouncedCallback((value) => {
    const searchUser = async () => {
      try {
        let response = await fetch('http://localhost:5000/users/searchUser', {
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
        if (response.error) {
          showError(response.error)
        }
        else {
          setSearchResult(response.users);
        }
      }
      catch (err) {
        console.log(err);
        showError('An error occured. Please try again');
      }
    }
    searchUser();
  }, 100);
  return (
    <Search 
      handlePress = {handlePress}
      debounced = {debounced}
      searchResult={searchResult}

    />
  )
}

export default SearchUser
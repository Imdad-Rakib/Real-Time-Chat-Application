/* eslint-disable prettier/prettier */
/* eslint-disable semi */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { io } from 'socket.io-client';
import { setSocket } from '../store/slices/socketSlice.mjs';
import { updateConversation } from '../store/slices/conversationSlice.mjs';
import { addMessage } from '../store/slices/messageSlice.mjs';
import { setCurrentChat } from '../store/slices/currentChatSlice.mjs';
import store from '../store/index.mjs';

const socketConfiguration = (email, dispatch) => {
  const socket = io('http://localhost:5000');
  dispatch(setSocket(socket));
  socket.on('connect', () => {
    socket.emit('client-info', email);
  });
  socket.on('private_message', (msg, conversation) => {
    let x = {...store.getState().currentChat};
    if (msg.sender === x.email) {
      if (conversation.last_room !== x.room){
        x.room = conversation.last_room;
        dispatch(setCurrentChat(x))
      }
      dispatch(addMessage(msg))
    }
    dispatch(updateConversation(conversation))
  })
  socket.on('Disappearing_Messages_Activated', (payload)=>{
    let x = {...store.getState().currentChat};
    if(payload.activatedBy === x.email){
      x.disappearing_flag = true;
      x.room = payload.room;
      dispatch(setCurrentChat(x));
    }
  })
  socket.on('Messages_Expired', (payload, conversation) =>{
    console.log('expired ', conversation);
    let x = {...store.getState().currentChat};
    if(payload.conversation_id === x.conversation_id && payload.room === x.room){
      x.disappearing_flag = false;
      dispatch(setCurrentChat(x));
    }
    dispatch(updateConversation(conversation))
  })
  socket.on('Disappearing_Messages_Deactivated', (payload) =>{
    let x = {...store.getState().currentChat};
    if (payload.activatedBy === x.email) {
      x.disappearing_flag = false;
      x.room = payload.room;
      dispatch(setCurrentChat(x));
    }
  })
}

export {socketConfiguration};

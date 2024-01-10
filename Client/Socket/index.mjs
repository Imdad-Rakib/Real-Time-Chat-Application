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
    if (msg.sender === store.getState().currentChat.email) {
      if (conversation.last_room !== store.getState().currentChat.room){
        let x = {...store.getState().currentChat};
        x.room = conversation.last_room;
        dispatch(setCurrentChat(x))
      }
      dispatch(addMessage(msg))
    }
    dispatch(updateConversation(conversation))
  })
}

// const handleSend = (socket, dispatch, sender, receiver, sender_name, receiver_name, conversation_id, room_name, text) => {
//   if (text === '') {
//     return;
//   }
//   socket.emit('private_message', {
//     text,
//     conversation_id,
//     sender,
//     receiver,
//     sender_name,
//     receiver_name,
//     room_name,
//   }, (res) => {
//     if (res.error){
//       console.log(res.error)
//     }
//     else {
//       let x = {...store.getState().currentChat}
//       if (x.conversation_id === ''){
//         x.conversation_id = res.conversation._id;
//         x.room = res.conversation.last_room;
//         dispatch(setCurrentChat(x));
//       }
//       // console.log(res.conversation);
//       // dispatch(setCurrentChat(x));
//       dispatch(addMessage(res.msg))
//       dispatch(updateConversation(res.conversation));
//     }
//   })
//   // setMessages(prev => {
//   //   const newMessages = [{ text: value, sender: sender.email, receiver: receiver.email, createdAt: Date.now() }, ...prev]
//   //   return newMessages;
//   // })
//   // setValue('');
// }

export {socketConfiguration};

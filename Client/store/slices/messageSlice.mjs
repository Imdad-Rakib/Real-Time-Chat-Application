/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = [...action.payload];
      // console.log(state.messages);
    },
    addMessage: (state, action) =>{
      state.messages = [action.payload, ...state.messages];
    }
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;

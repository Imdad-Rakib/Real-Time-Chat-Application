/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const currentChatSlice = createSlice({
  name: 'currentChat',
  initialState: {
    name: '',
    email: '',
    room: '',
    conversation_id: '',
    disappearing_flag: false,
  },
  reducers: {
    setCurrentChat: (state, action) => {
      state.name = action.payload.name || '';
      state.email = action.payload.email || '';
      state.room = action.payload.room || '';
      state.conversation_id = action.payload.conversation_id || '';
      state.disappearing_flag = action.payload.disappearing_flag;
    }
  },
});

export const { setCurrentChat } = currentChatSlice.actions;
export default currentChatSlice.reducer;

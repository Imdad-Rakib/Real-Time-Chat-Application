/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const currentChatSlice = createSlice({
  name: 'currentChat',
  initialState: {
    name: '',
    email: '',
    room: '',
    conversation_id: '',
  },
  reducers: {
    setCurrentChat: (state, action) => {
      state.name = action.payload.name || '';
      state.email = action.payload.email || '';
      state.room = action.payload.room || '';
      state.conversation_id = action.payload.conversation_id || '';
    }
  },
});

export const { setCurrentChat } = currentChatSlice.actions;
export default currentChatSlice.reducer;

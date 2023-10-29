/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const conversationSlice = createSlice({
    name: 'conversation',
    initialState: {
        conversation: [],
    },
    reducers: {
        setConversation: (state, action) => {
            // let x = [...state.conversations];
            state.conversation = [...action.payload];
        },
        updateConversation: (state, action) => {
            let x = [...state.conversation].filter((item) =>{
                return (item.creator !== action.payload.creator || item.participant !== action.payload.participant);
            });
            state.conversation = [action.payload, ...x];
        },
        updateConversationStatus: (state, action) =>{
            console.log('here');
            let x = [...state.conversation];
            let  foundItem = x.find((item) => item.creator === action.payload.creator && item.participant === action.payload.participant);
            foundItem.isOpened = true;
            state.conversation = [...x];
        },
    },
});

export const { setConversation, updateConversation, updateConversationStatus } = conversationSlice.actions;
export default conversationSlice.reducer;

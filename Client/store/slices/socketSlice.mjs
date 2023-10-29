/* eslint-disable prettier/prettier */
import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
    name: 'socket',
    initialState: {
        socket: null,
    },
    reducers: {
        setSocket: (state, action) => {
            console.log('new socket');
            state.socket = action.payload;
        },
        deleteSocket: state => {
            state.socket = null;
        },
    },
});

export const { setSocket, deleteSocket } = socketSlice.actions;
export default socketSlice.reducer;

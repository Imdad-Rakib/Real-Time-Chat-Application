/* eslint-disable prettier/prettier */
// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import user from './slices/userSlice.mjs';
import socket from './slices/socketSlice.mjs';
import conversation from './slices/conversationSlice.mjs';

const store = configureStore({
    reducer: {
        user,
        socket,
        conversation,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
 
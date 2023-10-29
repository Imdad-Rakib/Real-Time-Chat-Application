/* eslint-disable prettier/prettier */
import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: null,
    email: null,
  },
  reducers: {
    setUser: (state, action) => {
        state.name = action.payload.name;
        state.email = action.payload.email;
    },
    deleteUser: state => {
      state.name = state.email = null;
    },
  },
});

export const {setUser, deleteUser} = userSlice.actions;
export default userSlice.reducer;

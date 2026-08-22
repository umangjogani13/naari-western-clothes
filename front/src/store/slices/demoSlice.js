import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  counter: 0,
  users: [],
  loading: false,
  error: null,
};

const demoSlice = createSlice({
  name: 'demo',
  initialState,
  reducers: {
    increment: (state) => {
      state.counter += 1;
    },
    decrement: (state) => {
      state.counter -= 1;
    },
    resetCounter: (state) => {
      state.counter = 0;
    },
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
    }
  },
});

export const {
  increment,
  decrement,
  resetCounter,
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  clearUsers
} = demoSlice.actions;

export default demoSlice.reducer;

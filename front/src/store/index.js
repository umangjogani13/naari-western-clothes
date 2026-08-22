import { configureStore } from '@reduxjs/toolkit';
import demoReducer from './slices/demoSlice';

export const store = configureStore({
  reducer: {
    demo: demoReducer,
  },
});

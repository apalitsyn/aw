import { configureStore } from '@reduxjs/toolkit';

const dummyReducer = (state = {}, action: any) => state;

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';

// Temporary empty reducer until we add feature slices
const dummyReducer = (state = {}) => state;

export const store = configureStore({
    reducer: {
        dummy: dummyReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

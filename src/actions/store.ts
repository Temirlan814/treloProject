// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import type { ThunkAction, Action } from '@reduxjs/toolkit';

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Используем правильный тип для Thunk
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export default store;
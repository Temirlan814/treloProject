import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers/index.ts';

const store = configureStore({
    reducer: rootReducer
});

export default  store;
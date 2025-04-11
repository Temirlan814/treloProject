import { combineReducers } from 'redux';
import boardReducer from './boardReducer';

const rootReducer = combineReducers({
    boards: boardReducer,
});

export default rootReducer;

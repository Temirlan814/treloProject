import { combineReducers } from 'redux';
import boardReducer from './boardReducer';
import columnReducer from "./columnReducer.ts";
import taskReducer from "./taskReducer.ts";

const rootReducer = combineReducers({
    boards: boardReducer,
    columns: columnReducer,
    tasks: taskReducer,
});

export default rootReducer;

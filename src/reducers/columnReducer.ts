// src/reducers/columnReducer.ts
import { ADD_COLUMN, DELETE_COLUMN, UPDATE_COLUMN_TITLE, REORDER_COLUMNS } from '../actions/columnActions';
import { BoardType } from '../types';

const columnReducer = (state: BoardType[] = [], action: any): BoardType[] => {
    switch (action.type) {
        case ADD_COLUMN:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? { ...board, columns: [...board.columns, action.payload.column] }
                    : board
            );

        case DELETE_COLUMN:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? { ...board, columns: board.columns.filter(col => col.id !== action.payload.columnId) }
                    : board
            );

        case UPDATE_COLUMN_TITLE:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? {
                        ...board,
                        columns: board.columns.map(col =>
                            col.id === action.payload.columnId
                                ? { ...col, title: action.payload.newTitle }
                                : col
                        )
                    }
                    : board
            );

        case REORDER_COLUMNS:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? { ...board, columns: action.payload.newColumns }
                    : board
            );

        default:
            return state;
    }
};

export default columnReducer;
import {
    FETCH_BOARDS,
    ADD_BOARD,
    DELETE_BOARD,
    UPDATE_BOARD, REPLACE_COLUMNS,
} from '../actions/boardActions';
import { BoardType } from '../types';

interface BoardState {
    boards: BoardType[];
}

const initialState: BoardState = {
    boards: [],
};

const boardReducer = (state = initialState, action: any): BoardState => {
    switch (action.type) {
        case FETCH_BOARDS:
            return { ...state, boards: action.payload };
        case ADD_BOARD:
            return { ...state, boards: [...state.boards, action.payload] };
        case DELETE_BOARD:
            return {
                ...state,
                boards: state.boards.filter((board) => board.id !== action.payload),
            };
        case REPLACE_COLUMNS:
            return {
                ...state,
                boards: state.boards.map(board =>
                    board.id === action.payload.boardId
                        ? { ...board, columns: action.payload.newColumns }
                        : board
                )
            };
        case UPDATE_BOARD:
            return {
                ...state,
                boards: state.boards.map((board) =>
                    board.id === action.payload.id
                        ? { ...board, ...action.payload }
                        : board
                ),
            };
        default:
            return state;
    }
};

export default boardReducer;

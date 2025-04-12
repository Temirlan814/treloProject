import { Dispatch } from 'redux';
import {BoardType, ColumnType} from '../types.ts';
import {
    createBoardApi,
    updateBoardApi,
    deleteBoardApi,
    fetchBoards as fetchBoardsApi
} from '../api/BoardApi';
import {AppThunk} from "./store.ts";
import {updateColumnsInBoard} from "../api/ColumnApi.ts";

export const REPLACE_COLUMNS = 'REPLACE_COLUMNS';
export const FETCH_BOARDS = 'FETCH_BOARDS';
export const ADD_BOARD = 'ADD_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';

export const fetchBoards = () => async (dispatch: Dispatch) => {
    try {
        const response = await fetchBoardsApi();
        dispatch({ type: FETCH_BOARDS, payload: response.data });
    } catch (error) {
        console.error('Failed to fetch boards', error);
    }
};

export const addBoard = (board: BoardType): AppThunk<Promise<BoardType>> => {
    return async (dispatch) => {
        try {
            const response = await createBoardApi(board);
            dispatch({ type: ADD_BOARD, payload: response.data });
            return response.data;
        } catch (error) {
            console.error('Failed to add board', error);
            throw error;
        }
    };
};

export const replaceColumns = (boardId: string, newColumns: ColumnType[]): AppThunk => {
    return async dispatch => {
        try {
            dispatch({ type: REPLACE_COLUMNS, payload: { boardId, newColumns } });
            await updateColumnsInBoard(boardId, newColumns);
        } catch (error) {
            console.error('Failed to replace columns', error);
        }
    };
};
export const deleteBoard = (boardId: string) => async (dispatch: Dispatch) => {
    try {
        await deleteBoardApi(boardId);
        dispatch({ type: DELETE_BOARD, payload: boardId });
    } catch (error) {
        console.error('Failed to delete board', error);
    }
};

export const updateBoard = (boardId: string, updatedBoard: Partial<BoardType>) => async (dispatch: Dispatch) => {
    try {
        const response = await updateBoardApi(boardId, updatedBoard);  // Вызов API для обновления доски
        dispatch({ type: UPDATE_BOARD, payload: response.data });
    } catch (error) {
        console.error('Failed to update board', error);
    }
};

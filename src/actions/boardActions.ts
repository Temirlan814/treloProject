import { Dispatch } from 'redux';
import { BoardType } from '../types.ts';
import {
    createBoardApi,
    updateBoardApi,
    deleteBoardApi,
    fetchBoards as fetchBoardsApi
} from '../api/BoardApi';

export const FETCH_BOARDS = 'FETCH_BOARDS';
export const ADD_BOARD = 'ADD_BOARD';
export const DELETE_BOARD = 'DELETE_BOARD';
export const UPDATE_BOARD = 'UPDATE_BOARD';

export const fetchBoards = () => async (dispatch: Dispatch) => {
    try {
        const response = await fetchBoardsApi();  // Вызов API для получения досок
        dispatch({ type: FETCH_BOARDS, payload: response.data });
    } catch (error) {
        console.error('Failed to fetch boards', error);
    }
};

export const addBoard = (board: BoardType) => async (dispatch: Dispatch) => {
    try {
        const response = await createBoardApi(board);  // Вызов API для добавления доски
        dispatch({ type: ADD_BOARD, payload: response.data });
    } catch (error) {
        console.error('Failed to add board', error);
    }
};

export const deleteBoard = (boardId: string) => async (dispatch: Dispatch) => {
    try {
        await deleteBoardApi(boardId);  // Вызов API для удаления доски
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

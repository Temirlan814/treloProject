// src/actions/columnActions.ts
import { ColumnType } from '../types';
import { AppThunk } from './store';
import { updateColumnsInBoard } from '../api/ColumnApi';
import { replaceColumns } from './boardActions';

export const ADD_COLUMN = 'ADD_COLUMN';
export const DELETE_COLUMN = 'DELETE_COLUMN';
export const UPDATE_COLUMN_TITLE = 'UPDATE_COLUMN_TITLE';
export const REORDER_COLUMNS = 'REORDER_COLUMNS';

export const addColumn = (boardId: string, column: ColumnType): AppThunk => {
    return async (dispatch, getState) => {
        const currentColumns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
        const updatedColumns = [...currentColumns, column];
        await updateColumnsInBoard(boardId, updatedColumns);
        dispatch({ type: ADD_COLUMN, payload: { boardId, column } });
    };
};

export const deleteColumn = (boardId: string, columnId: string): AppThunk => {
    return async (dispatch, getState) => {
        const currentColumns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
        const updatedColumns = currentColumns.filter(col => col.id !== columnId);
        await updateColumnsInBoard(boardId, updatedColumns);
        dispatch({ type: DELETE_COLUMN, payload: { boardId, columnId } });
    };
};

export const updateColumn = (boardId: string, columnId: string, newTitle: string): AppThunk => {
    return async (dispatch, getState) => {
        const currentColumns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
        const updatedColumns = currentColumns.map(col =>
            col.id === columnId ? { ...col, title: newTitle } : col
        );
        await updateColumnsInBoard(boardId, updatedColumns);
        dispatch({ type: UPDATE_COLUMN_TITLE, payload: { boardId, columnId, newTitle } });
    };
};

export const reorderColumns = (boardId: string, newColumns: ColumnType[]): AppThunk => {
    return async dispatch => {
        await updateColumnsInBoard(boardId, newColumns);
        dispatch(replaceColumns(boardId, newColumns));
    };
};
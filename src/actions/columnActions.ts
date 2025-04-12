import { ColumnType } from '../types';
import { AppThunk } from './store';
import { updateColumnsInBoard } from '../api/ColumnApi';
import { replaceColumns } from './boardActions';


export const addColumn = (boardId: string, column: ColumnType): AppThunk => {
    return async (dispatch, getState) => {
        const currentColumns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
        const updatedColumns = [...currentColumns, column];
        dispatch(replaceColumns(boardId, updatedColumns));
        await updateColumnsInBoard(boardId, updatedColumns);

    };
};

export const deleteColumn = (boardId: string, columnId: string): AppThunk => {
    return async (dispatch, getState) => {
        const currentColumns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
        const updatedColumns = currentColumns.filter(col => col.id !== columnId);
        await updateColumnsInBoard(boardId, updatedColumns);
        dispatch(replaceColumns(boardId, updatedColumns));
    };
};

export const updateColumn = (boardId: string, columnId: string, newTitle: string): AppThunk => {
    return async (dispatch, getState) => {
        const currentColumns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
        const updatedColumns = currentColumns.map(col =>
            col.id === columnId ? { ...col, title: newTitle } : col
        );
        dispatch(replaceColumns(boardId, updatedColumns));
        await updateColumnsInBoard(boardId, updatedColumns);
    };
};

export const reorderColumns = (boardId: string, newColumns: ColumnType[]): AppThunk => {
    return async dispatch => {
        await updateColumnsInBoard(boardId, newColumns);
        dispatch(replaceColumns(boardId, newColumns));
    };
};
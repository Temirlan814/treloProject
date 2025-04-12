import { ColumnType } from '../types.ts';
import api from './ApiClient';

export const updateColumnsInBoard = (boardId: string, columns: ColumnType[]) => {
    return api.patch(`/boards/${boardId}`, { columns });
};

export const addColumnToBoard = async (boardId: string, newColumn: ColumnType, currentColumns: ColumnType[], setColumns: (cols: ColumnType[]) => void) => {
    const updatedColumns = [...currentColumns, newColumn];
    await updateColumnsInBoard(boardId, updatedColumns);
    setColumns(updatedColumns);
};

export const deleteColumnFromBoard = async (boardId: string, columnId: string, currentColumns: ColumnType[], setColumns: (cols: ColumnType[]) => void) => {
    const updatedColumns = currentColumns.filter(col => col.id !== columnId);
    await updateColumnsInBoard(boardId, updatedColumns);
    setColumns(updatedColumns);
};

export const updateColumnTitle = async (boardId: string, columnId: string, newTitle: string, currentColumns: ColumnType[], setColumns: (cols: ColumnType[]) => void) => {
    const updatedColumns = currentColumns.map(col =>
        col.id === columnId ? { ...col, title: newTitle } : col
    );
    await updateColumnsInBoard(boardId, updatedColumns);
    setColumns(updatedColumns);
};

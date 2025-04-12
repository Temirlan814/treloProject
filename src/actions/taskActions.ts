import { TaskType } from '../types';
import { AppThunk } from './store';
import { addTaskToColumn, deleteTaskFromColumn, updateTaskInColumn } from '../api/TaskApi';
import { replaceColumns } from './boardActions';

export const addTask = (
    boardId: string,
    columnId: string,
    task: TaskType
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const board = getState().boards.boards.find(b => b.id === boardId);
        if (!board) return;

        const updatedColumns = board.columns.map(col =>
            col.id === columnId
                ? { ...col, tasks: [...col.tasks, task] }
                : col
        );
        dispatch(replaceColumns(boardId, updatedColumns));
        await addTaskToColumn(boardId, columnId, task, board.columns);
    };
};

export const deleteTask = (
    boardId: string,
    columnId: string,
    taskId: string
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const board = getState().boards.boards.find(b => b.id === boardId);
        if (!board) return;

        const updatedColumns = board.columns.map(col =>
            col.id === columnId
                ? { ...col, tasks: col.tasks.filter(t => t.id !== taskId) }
                : col
        );
        dispatch(replaceColumns(boardId, updatedColumns));
        await deleteTaskFromColumn(boardId, columnId, taskId, board.columns);
    };
};

export const updateTask = (
    boardId: string,
    columnId: string,
    taskId: string,
    updatedTask: Partial<TaskType>
): AppThunk<Promise<void>> => {
    return async (dispatch, getState) => {
        const board = getState().boards.boards.find(b => b.id === boardId);
        if (!board) return;

        const updatedColumns = board.columns.map(col =>
            col.id === columnId
                ? {
                    ...col,
                    tasks: col.tasks.map(t =>
                        t.id === taskId ? { ...t, ...updatedTask } : t
                    ),
                }
                : col
        );
        dispatch(replaceColumns(boardId, updatedColumns));
        await updateTaskInColumn(boardId, columnId, taskId, updatedTask, board.columns);
    };
};

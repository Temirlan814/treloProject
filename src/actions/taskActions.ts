// src/actions/taskActions.ts
import { TaskType } from '../types';
import { AppThunk } from './store';
import { addTaskToColumn, deleteTaskFromColumn, updateTaskInColumn } from '../api/TaskApi';

export const ADD_TASK = 'ADD_TASK';
export const DELETE_TASK = 'DELETE_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';
export const MOVE_TASK = 'MOVE_TASK';

export const addTask = (
    boardId: string,
    columnId: string,
    task: TaskType
): AppThunk<Promise<void>> => { // Указываем возвращаемый тип
    return async (dispatch, getState) => {
        try {
            const columns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
            await addTaskToColumn(boardId, columnId, task, columns);

            dispatch({
                type: ADD_TASK,
                payload: { boardId, columnId, task }
            });

        } catch (error: unknown) { // Явно указываем тип ошибки
            let errorMessage = 'Failed to add task';
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new Error(errorMessage);
        }
    };
};

// Для всех actions укажите возвращаемый Promise
export const deleteTask = (
    boardId: string,
    columnId: string,
    taskId: string
): AppThunk<Promise<void>> => { // Добавляем возвращаемый тип
    return async (dispatch, getState) => {
        try {
            const columns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
            await deleteTaskFromColumn(boardId, columnId, taskId, columns);
            dispatch({ type: DELETE_TASK, payload: { boardId, columnId, taskId } });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to delete task');
        }
    };
};

export const updateTask = (
    boardId: string,
    columnId: string,
    taskId: string,
    updatedTask: Partial<TaskType>
): AppThunk<Promise<void>> => { // Добавляем возвращаемый тип
    return async (dispatch, getState) => {
        try {
            const columns = getState().boards.boards.find(b => b.id === boardId)?.columns || [];
            await updateTaskInColumn(boardId, columnId, taskId, updatedTask, columns);
            dispatch({ type: UPDATE_TASK, payload: { boardId, columnId, taskId, updatedTask } });
        } catch (error) {
            throw new Error(error instanceof Error ? error.message : 'Failed to update task');
        }
    };
};
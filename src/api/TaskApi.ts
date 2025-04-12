import api from './ApiClient';
import { ColumnType, TaskType } from '../types.ts';

const updateTasksInColumn = async (
    boardId: string,
    updatedColumns: ColumnType[]
): Promise<void> => {
    await api.patch(`/boards/${boardId}`, { columns: updatedColumns });
};

export const addTaskToColumn = async (
    boardId: string,
    columnId: string,
    newTask: TaskType,
    allColumns: ColumnType[]
): Promise<ColumnType[]> => {
    const updatedColumns = allColumns.map((col) =>
        col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col
    );
    await updateTasksInColumn(boardId, updatedColumns);
    return updatedColumns;
};

export const deleteTaskFromColumn = async (
    boardId: string,
    columnId: string,
    taskId: string,
    allColumns: ColumnType[]
): Promise<ColumnType[]> => {
    const updatedColumns = allColumns.map((col) =>
        col.id === columnId ? { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) } : col
    );
    await updateTasksInColumn(boardId, updatedColumns);
    return updatedColumns;
};

export const updateTaskInColumn = async (
    boardId: string,
    columnId: string,
    taskId: string,
    updatedFields: Partial<TaskType>,
    allColumns: ColumnType[]
): Promise<ColumnType[]> => {
    const updatedColumns = allColumns.map((col) =>
        col.id === columnId
            ? {
                ...col,
                tasks: col.tasks.map((t) =>
                    t.id === taskId ? { ...t, ...updatedFields } : t
                ),
            }
            : col
    );
    await updateTasksInColumn(boardId, updatedColumns);
    return updatedColumns;
};

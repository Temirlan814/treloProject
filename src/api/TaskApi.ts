import api from './ApiClient';
import { ColumnType, TaskType } from '../App';

// Обновить колонки после модификации задач
const updateTasksInColumn = async (
    boardId: string,
    updatedColumns: ColumnType[]
): Promise<void> => {
    await api.patch(`/boards/${boardId}`, { columns: updatedColumns });
};

// Добавить задачу в колонку
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

// Удалить задачу из колонки
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

// Обновить задачу (заголовок, описание, теги)
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

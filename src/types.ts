// src/types.ts

export interface TaskType {
    id: string;
    title: string;
    description?: string;
    tags?: string[];
}

export interface ColumnType {
    id: string;
    title: string;
    tasks: TaskType[];
}

export interface BoardType {
    id: string;
    title: string;
    columns: ColumnType[];
}
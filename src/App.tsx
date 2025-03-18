// src/App.tsx
import React, { useState } from 'react';
import BoardList from './components/BoardList';
import Board from './components/Board';
import './styles/App.css';

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

const App: React.FC = () => {
    const [boards, setBoards] = useState<BoardType[]>([
        {
            id: 'board-1',
            title: 'Фмыс ч',
            columns: [
                {
                    id: 'col-1',
                    title: 'casZ',
                    tasks: [
                        { id: 'task-1', title: 'Задача 1', description: 'Описание 1' },
                        { id: 'task-2', title: 'Задача 2', description: 'Описание 2', tags: ['tag1'] },
                    ],
                },
            ],
        },
        {
            id: 'board-2',
            title: 'Фваыс',
            columns: [
                {
                    id: 'col-2',
                    title: 'Another Column',
                    tasks: [{ id: 'task-3', title: 'Задача 3' }],
                },
            ],
        },
    ]);

    // Какая доска сейчас выбрана
    const [activeBoardId, setActiveBoardId] = useState<string>(boards[0].id);

    const activeBoard = boards.find((b) => b.id === activeBoardId);

    // Обновить колонки в активной доске
    const setColumnsForActiveBoard = (columns: ColumnType[]) => {
        if (!activeBoard) return;
        setBoards((prev) =>
            prev.map((board) =>
                board.id === activeBoard.id ? { ...board, columns } : board
            )
        );
    };

    // Добавить доску
    const addBoard = (title: string) => {
        const newBoard: BoardType = {
            id: 'board-' + Date.now(),
            title,
            columns: [],
        };
        setBoards((prev) => [...prev, newBoard]);
        setActiveBoardId(newBoard.id);
    };

    // Редактировать заголовок доски
    const editBoardTitle = (boardId: string, newTitle: string) => {
        setBoards((prev) =>
            prev.map((b) =>
                b.id === boardId ? { ...b, title: newTitle } : b
            )
        );
    };

    // Удалить доску
    const deleteBoard = (boardId: string) => {
        const filtered = boards.filter((b) => b.id !== boardId);
        setBoards(filtered);
        if (filtered.length > 0) {
            setActiveBoardId(filtered[0].id);
        }
    };

    return (
        <div className="app-container">
            <BoardList
                boards={boards}
                activeBoardId={activeBoardId}
                setActiveBoardId={setActiveBoardId}
                addBoard={addBoard}
                editBoardTitle={editBoardTitle}
                deleteBoard={deleteBoard}
            />

            {activeBoard && (
                <Board
                    board={activeBoard}
                    setColumns={setColumnsForActiveBoard}
                />
            )}
        </div>
    );
};

export default App;

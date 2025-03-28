// src/App.tsx
import React, {useEffect, useState} from 'react';
import BoardList from './components/BoardList';
import Board from './components/Board';
import './styles/App.css';
import {createBoard, deleteBoardApi, fetchBoards, updateBoard} from "./api/BoardApi.ts";

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
    const [boards, setBoards] = useState<BoardType[]>([]);
    const [activeBoardId, setActiveBoardId] = useState<string | null>(null);

    useEffect(() => {
        fetchBoards()
            .then(res => {
                setBoards(res.data);
                if (res.data.length > 0) {
                    setActiveBoardId(res.data[0].id);
                }
            })
            .catch(err => console.error('Failed to load boards', err));
    }, []);

    const activeBoard = boards.find((b) => b.id === activeBoardId) || null;

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
        createBoard(newBoard)
            .then((res) => {
                setBoards((prev) => [...prev, res.data]);
                setActiveBoardId(res.data.id);
            })
            .catch((err) => console.error('Failed to create board', err));
    };

    // Редактировать заголовок доски
    const editBoardTitle = (boardId: string, newTitle: string) => {
        updateBoard(boardId, { title: newTitle })
            .then(() => {
                setBoards((prev) =>
                    prev.map((b) =>
                        b.id === boardId ? { ...b, title: newTitle } : b
                    )
                );
            })
            .catch((err) => console.error('Failed to update board', err));
    };

    // Удалить доску
    const deleteBoard = (boardId: string) => {
        deleteBoardApi(boardId)
            .then(() => {
                const filtered = boards.filter((b) => b.id !== boardId);
                setBoards(filtered);
                if (filtered.length > 0) {
                    setActiveBoardId(filtered[0].id);
                } else {
                    setActiveBoardId(null);
                }
            })
            .catch((err) => console.error('Failed to delete board', err));
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

// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import BoardList from './components/BoardList';
import Board from './components/Board';
import './styles/App.css';
import {
    createBoard,
    deleteBoardApi,
    fetchBoards,
    updateBoard
} from './api/BoardApi';

import { BoardType, ColumnType} from './types'; // вынеси типы отдельно если нужно

const BoardListView: React.FC<{
    boards: BoardType[];
    setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
}> = ({ boards, setBoards }) => {
    const navigate = useNavigate();

    const addBoard = (title: string) => {
        const newBoard: BoardType = {
            id: 'board-' + Date.now(),
            title,
            columns: [],
        };
        createBoard(newBoard)
            .then((res) => {
                setBoards((prev) => [...prev, res.data]);
                navigate(`/board/${res.data.id}`);
            })
            .catch((err) => console.error('Failed to create board', err));
    };

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

    const deleteBoard = (boardId: string) => {
        deleteBoardApi(boardId)
            .then(() => {
                setBoards((prev) => prev.filter((b) => b.id !== boardId));
            })
            .catch((err) => console.error('Failed to delete board', err));
    };

    return (
        <div className="app-container">
            <BoardList
                boards={boards}
                activeBoardId={null}
                setActiveBoardId={(id) => navigate(`/board/${id}`)}
                addBoard={addBoard}
                editBoardTitle={editBoardTitle}
                deleteBoard={deleteBoard}
            />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2>← Выберите доску</h2>
            </div>
        </div>
    );
};

const SingleBoardView: React.FC<{
    boards: BoardType[];
    setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
}> = ({ boards, setBoards }) => {
    const { id } = useParams<{ id: string }>();
    const board = boards.find((b) => b.id === id);

    const setColumns = (columns: ColumnType[]) => {
        setBoards((prev) =>
            prev.map((b) => (b.id === id ? { ...b, columns } : b))
        );
    };

    if (!board) return <div>Board not found</div>;

    return (
        <div className="app-container">
            <BoardList
                boards={boards}
                activeBoardId={id!}
                setActiveBoardId={() => {}}
                addBoard={() => {}}
                editBoardTitle={() => {}}
                deleteBoard={() => {}}
            />
            <Board board={board} setColumns={setColumns} />
        </div>
    );
};

const App: React.FC = () => {
    const [boards, setBoards] = useState<BoardType[]>([]);

    useEffect(() => {
        fetchBoards()
            .then((res) => {
                setBoards(res.data);
            })
            .catch((err) => console.error('Failed to load boards', err));
    }, []);

    return (
        <Routes>
            <Route path="/" element={<BoardListView boards={boards} setBoards={setBoards} />} />
            <Route path="/board/:id" element={<SingleBoardView boards={boards} setBoards={setBoards} />} />
        </Routes>
    );
};

export default App;
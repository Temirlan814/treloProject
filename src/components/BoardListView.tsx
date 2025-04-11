import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BoardType } from '../types';
import BoardList from './BoardList';  // Импортируем уже существующий компонент BoardList
import { createBoardApi, updateBoardApi, deleteBoardApi } from '../api/BoardApi'; // Для взаимодействия с API

interface BoardListViewProps {
    boards: BoardType[];
    setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
}

const BoardListView: React.FC<BoardListViewProps> = ({ boards, setBoards }) => {
    const navigate = useNavigate();

    const addBoard = (title: string) => {
        const newBoard: BoardType = { id: 'board-' + Date.now(), title, columns: [] };
        createBoardApi(newBoard)
            .then((res) => {
                setBoards((prev) => [...prev, res.data]);
                navigate(`/board/${res.data.id}`);
            })
            .catch((err) => console.error('Failed to create board', err));
    };

    const editBoardTitle = (boardId: string, newTitle: string) => {
        updateBoardApi(boardId, { title: newTitle })
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

export default BoardListView;

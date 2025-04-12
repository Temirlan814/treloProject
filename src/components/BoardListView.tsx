import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks.ts';
import BoardList from './BoardList';
import { fetchBoards, addBoard, updateBoard, deleteBoard } from '../actions/boardActions';
import { BoardType } from '../types.ts';

const BoardListView: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const boards = useAppSelector((state) => state.boards.boards);

    useEffect(() => {
        dispatch(fetchBoards());
    }, [dispatch]);

    const handleAddBoard = (title: string) => {
        const newBoard: BoardType = { id: 'board-' + Date.now(), title, columns: [] };
        dispatch(addBoard(newBoard)).then((res) => {
            navigate(`/board/${res.id}`);
        });
    };

    const handleEditBoardTitle = (boardId: string, newTitle: string) => {
        dispatch(updateBoard(boardId, { title: newTitle }));
    };

    const handleDeleteBoard = (boardId: string) => {
        dispatch(deleteBoard(boardId));
    };

    return (
        <div className="app-container">
            <BoardList
                boards={boards}
                activeBoardId={null}
                setActiveBoardId={(id) => navigate(`/board/${id}`)}
                addBoard={handleAddBoard}
                editBoardTitle={handleEditBoardTitle}
                deleteBoard={handleDeleteBoard}
            />
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h2>← Выберите доску</h2>
            </div>
        </div>
    );
};

export default BoardListView;

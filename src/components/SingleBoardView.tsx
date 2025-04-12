import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks';
import { BoardType, ColumnType } from '../types';
import Board from './Board';
import BoardList from './BoardList';
import { addBoard, deleteBoard, updateBoard, fetchBoards } from '../actions/boardActions';

const SingleBoardView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const boards = useAppSelector((state) => state.boards.boards);
    const board = useAppSelector(state => state.boards.boards.find(b => b.id === id));

    useEffect(() => {
        if (!boards.length) {
            dispatch(fetchBoards());
        }
    }, [dispatch, boards.length]);

    const setColumns = (columns: ColumnType[]) => {
        if (!board) return;
        dispatch(updateBoard(board.id, { columns }));
    };

    const handleAddBoard = (title: string) => {
        const newBoard: BoardType = { id: 'board-' + Date.now(), title, columns: [] };
        dispatch(addBoard(newBoard)).then((res) => {
            if (res && 'id' in res) {
                navigate(`/board/${res.id}`);
            }
        });
    };

    const handleEditBoardTitle = (boardId: string, newTitle: string) => {
        dispatch(updateBoard(boardId, { title: newTitle }));
    };

    const handleDeleteBoard = (boardId: string) => {
        dispatch(deleteBoard(boardId)).then(() => {
            navigate('/');
        });
    };

    if (!board) return <div>Board not found</div>;

    return (
        <div className="app-container">
            <BoardList
                boards={boards}
                activeBoardId={id!}
                setActiveBoardId={(id) => navigate(`/board/${id}`)}
                addBoard={handleAddBoard}
                editBoardTitle={handleEditBoardTitle}
                deleteBoard={handleDeleteBoard}
            />
            <Board boardId={id!} />
        </div>
    );
};

export default SingleBoardView;

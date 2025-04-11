import React from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { BoardType, ColumnType } from '../types';
import Board from './Board';
import BoardList from './BoardList';
import {createBoardApi, deleteBoardApi, updateBoardApi} from "../api/BoardApi.ts";

interface SingleBoardViewProps {
    boards: BoardType[];
    setBoards: React.Dispatch<React.SetStateAction<BoardType[]>>;
}

const SingleBoardView: React.FC<SingleBoardViewProps> = ({ boards, setBoards }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const board = boards.find((b) => b.id === id);

    const setColumns = (columns: ColumnType[]) => {
        setBoards((prev) =>
            prev.map((b) => (b.id === id ? { ...b, columns } : b))
        );
    };

    if (!board) return <div>Board not found</div>;

    const addBoard = (title: string) => {
        const newBoard: BoardType = { id: 'board-' + Date.now(), title, columns: [] };
        console.log(newBoard);
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
                activeBoardId={id!}
                setActiveBoardId={(id) => navigate(`/board/${id}`)}
                addBoard={addBoard}
                editBoardTitle={editBoardTitle}
                deleteBoard={deleteBoard}
            />
            <Board board={board} setColumns={setColumns} />
        </div>
    );
};

export default SingleBoardView;

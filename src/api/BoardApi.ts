import axios from 'axios';
import { BoardType } from '../types.ts';

const boardApi = axios.create({
    baseURL: 'http://localhost:4000',
});

export const fetchBoards = () => {
    return boardApi.get<BoardType[]>('/boards');
};

export const createBoardApi = (board: BoardType) => {
    console.log(board);
    return boardApi.post('/boards', board);
};

export const updateBoardApi = (id: string, updatedBoard: Partial<BoardType>) => {
    return boardApi.patch(`/boards/${id}`, updatedBoard);
};

export const deleteBoardApi = (id: string) => {
    return boardApi.delete(`/boards/${id}`);
};

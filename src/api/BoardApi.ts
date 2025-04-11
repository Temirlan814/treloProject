import axios from 'axios';
import { BoardType } from '../types.ts';

const boardApi = axios.create({
    baseURL: 'http://localhost:4000',
});

// Получение всех досок
export const fetchBoards = () => {
    return boardApi.get<BoardType[]>('/boards');
};

// Если в будущем нужно будет добавлять, редактировать или удалять доски:
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

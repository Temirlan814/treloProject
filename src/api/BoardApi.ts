import axios from 'axios';
import { BoardType } from '../App.tsx';

const boardApi = axios.create({
    baseURL: 'http://localhost:4000',
});

// Получение всех досок
export const fetchBoards = () => {
    return boardApi.get<BoardType[]>('/boards');
};

// Если в будущем нужно будет добавлять, редактировать или удалять доски:
export const createBoard = (board: BoardType) => {
    return boardApi.post('/boards', board);
};

export const updateBoard = (id: string, updatedBoard: Partial<BoardType>) => {
    return boardApi.patch(`/boards/${id}`, updatedBoard);
};

export const deleteBoardApi = (id: string) => {
    return boardApi.delete(`/boards/${id}`);
};

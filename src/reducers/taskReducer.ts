// src/reducers/taskReducer.ts
import { ADD_TASK, DELETE_TASK, UPDATE_TASK, MOVE_TASK } from '../actions/taskActions';
import { BoardType } from '../types';

const taskReducer = (state: BoardType[] = [], action: any): BoardType[] => {
    switch (action.type) {
        case ADD_TASK:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? {
                        ...board,
                        columns: board.columns.map(col =>
                            col.id === action.payload.columnId
                                ? { ...col, tasks: [...col.tasks, action.payload.task] }
                                : col
                        )
                    }
                    : board
            );

        case DELETE_TASK:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? {
                        ...board,
                        columns: board.columns.map(col =>
                            col.id === action.payload.columnId
                                ? { ...col, tasks: col.tasks.filter(t => t.id !== action.payload.taskId) }
                                : col
                        )
                    }
                    : board
            );

        case UPDATE_TASK:
            return state.map(board =>
                board.id === action.payload.boardId
                    ? {
                        ...board,
                        columns: board.columns.map(col =>
                            col.id === action.payload.columnId
                                ? {
                                    ...col,
                                    tasks: col.tasks.map(t =>
                                        t.id === action.payload.taskId ? { ...t, ...action.payload.updatedTask } : t
                                    )
                                }
                                : col
                        )
                    }
                    : board
            );

        default:
            return state;
    }
};

export default taskReducer;
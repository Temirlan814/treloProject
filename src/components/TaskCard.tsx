import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { TaskType } from '../types.ts';
import TaskModal from './TaskModal';
import '../styles/TaskCard.css';
import { useAppDispatch } from '../hooks';
import { deleteTask, updateTask } from '../actions/taskActions';

interface TaskCardProps {
    task: TaskType;
    index: number;
    columnId: string;
    boardId: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
                                               boardId,
                                               task,
                                               index,
                                               columnId,
                                           }) => {
    const dispatch = useAppDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleDelete = () => {
        dispatch(deleteTask(boardId, columnId, task.id))
            .catch((err: Error) => console.error('Failed to delete task:', err.message));
    };

    const handleSaveEdit = (title: string, desc: string, tags: string[]) => {
        dispatch(updateTask(
            boardId,
            columnId,
            task.id,
            { title, description: desc, tags }
        )).catch((err: Error) => console.error('Failed to update task:', err.message));
    };

    return (
        <>
            <Draggable draggableId={task.id} index={index}>
                {(provided) => (
                    <div
                        className="task-card"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                    >
                        <div className="task-card-header">
                            <div className="task-title">{task.title}</div>
                            <div
                                className="task-menu"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowMenu(!showMenu);
                                }}
                            >
                                ...
                            </div>
                            {showMenu && (
                                <div className="task-menu-dropdown">
                                    <div
                                        className="dropdown-item"
                                        onClick={() => {
                                            setShowEditModal(true);
                                            setShowMenu(false);
                                        }}
                                    >
                                        Edit
                                    </div>
                                    <div
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleDelete();
                                            setShowMenu(false);
                                        }}
                                    >
                                        Delete
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Draggable>

            {showEditModal && (
                <TaskModal
                    onClose={() => setShowEditModal(false)}
                    initialTitle={task.title}
                    initialDesc={task.description || ''}
                    initialTags={task.tags || []}
                    onSave={(title, desc, tags) => {
                        handleSaveEdit(title, desc, tags);
                        setShowEditModal(false);
                    }}
                />
            )}
        </>
    );
};

export default TaskCard;
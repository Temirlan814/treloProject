// src/components/TaskCard.tsx
import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ColumnType, TaskType } from '../types.ts';
import TaskModal from './TaskModal';
import '../styles/TaskCard.css';
import {deleteTaskFromColumn, updateTaskInColumn} from "../api/TaskApi.ts";

interface TaskCardProps {
    task: TaskType;
    index: number;
    allColumns: ColumnType[];
    columnId: string;
    boardId: string; // ← ✅ Добавляем
    setColumns: (cols: ColumnType[]) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
                                               boardId,
                                               task,
                                               index,
                                               allColumns,
                                               columnId,
                                               setColumns,
                                           }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleDelete = () => {
        deleteTaskFromColumn(boardId, columnId, task.id, allColumns)
            .then(updated => setColumns(updated))
            .catch(err => console.error('Failed to delete task', err));

    };

    const handleSaveEdit = (title: string, desc: string, tags: string[]) => {
        // Обновить задачу в state
        updateTaskInColumn(boardId, columnId, task.id, { title, description: desc, tags }, allColumns)
            .then(updated => setColumns(updated))
            .catch(err => console.error('Failed to update task', err));

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

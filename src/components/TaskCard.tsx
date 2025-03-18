// src/components/TaskCard.tsx
import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { ColumnType, TaskType } from '../App';
import TaskModal from './TaskModal';
import '../styles/TaskCard.css';

interface TaskCardProps {
    task: TaskType;
    index: number;
    allColumns: ColumnType[];
    columnId: string;
    setColumns: (cols: ColumnType[]) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
                                               task,
                                               index,
                                               allColumns,
                                               columnId,
                                               setColumns,
                                           }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleDelete = () => {
        const newCols = allColumns.map((col) => {
            if (col.id === columnId) {
                return {
                    ...col,
                    tasks: col.tasks.filter((t) => t.id !== task.id),
                };
            }
            return col;
        });
        setColumns(newCols);
    };

    const handleSaveEdit = (title: string, desc: string, tags: string[]) => {
        // Обновить задачу в state
        const newCols = allColumns.map((col) => {
            if (col.id !== columnId) return col;
            return {
                ...col,
                tasks: col.tasks.map((t) =>
                    t.id === task.id ? { ...t, title, description: desc, tags } : t
                ),
            };
        });
        setColumns(newCols);
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

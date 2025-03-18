// src/components/Column.tsx
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ColumnType, TaskType } from '../App';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import '../styles/Column.css';

interface ColumnProps {
    column: ColumnType;
    index: number;
    allColumns: ColumnType[];
    setColumns: (cols: ColumnType[]) => void;
}

const Column: React.FC<ColumnProps> = ({ column, index, allColumns, setColumns }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(column.title);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const tasksContainerRef = useRef<HTMLDivElement | null>(null);

    const handleDeleteColumn = () => {
        const newCols = allColumns.filter((c) => c.id !== column.id);
        setColumns(newCols);
    };

    const saveColumnTitle = () => {
        if (!tempTitle.trim()) return;
        const newCols = allColumns.map((c) =>
            c.id === column.id ? { ...c, title: tempTitle.trim() } : c
        );
        setColumns(newCols);
        setIsEditingTitle(false);
    };

    const addTask = (title: string, description: string, tags: string[]) => {
        const newTask: TaskType = {
            id: 'task-' + Date.now(),
            title,
            description,
            tags,
        };
        const newCols = allColumns.map((c) =>
            c.id === column.id ? { ...c, tasks: [...c.tasks, newTask] } : c
        );
        setColumns(newCols);
    };

    return (
        <Draggable draggableId={column.id} index={index}>
            {(providedCol) => (
                <div
                    className="column"
                    ref={providedCol.innerRef}
                    {...providedCol.draggableProps}
                    style={providedCol.draggableProps.style}
                >
                    <div className="column-header">
                        {isEditingTitle ? (
                            <div className="edit-column-title">
                                <input
                                    value={tempTitle}
                                    onChange={(e) => setTempTitle(e.target.value)}
                                />
                                <button onClick={saveColumnTitle}>Save</button>
                                <button
                                    onClick={() => {
                                        setIsEditingTitle(false);
                                        setTempTitle(column.title);
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <strong {...providedCol.dragHandleProps}>{column.title}</strong>
                                <div
                                    className="column-menu"
                                    onClick={() => setShowMenu(!showMenu)}
                                >
                                    ...
                                </div>
                            </>
                        )}
                        {showMenu && (
                            <div className="column-menu-dropdown">
                                <div
                                    className="dropdown-item"
                                    onClick={() => {
                                        setIsEditingTitle(true);
                                        setShowMenu(false);
                                    }}
                                >
                                    Edit
                                </div>
                                <div
                                    className="dropdown-item"
                                    onClick={() => {
                                        handleDeleteColumn();
                                        setShowMenu(false);
                                    }}
                                >
                                    Delete
                                </div>
                            </div>
                        )}
                    </div>
                    <Droppable droppableId={column.id} type="DEFAULT" ignoreContainerClipping={true}>
                        {(providedTasks) => (
                            <div
                                className="tasks-container"
                                ref={(node) => {
                                    providedTasks.innerRef(node);
                                    tasksContainerRef.current = node;
                                }}
                                {...providedTasks.droppableProps}
                            >
                                {column.tasks.map((task, taskIndex) => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        index={taskIndex}
                                        allColumns={allColumns}
                                        columnId={column.id}
                                        setColumns={setColumns}
                                    />
                                ))}
                                {providedTasks.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <div
                        className="add-task-button"
                        onClick={() => setShowAddTaskModal(true)}
                    >
                        + Add Task
                    </div>
                    {showAddTaskModal && (
                        <TaskModal
                            onClose={() => setShowAddTaskModal(false)}
                            onSave={(title, desc, tags) => {
                                addTask(title, desc, tags);
                                setShowAddTaskModal(false);
                            }}
                        />
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default Column;

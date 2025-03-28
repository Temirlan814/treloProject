// src/components/Column.tsx
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ColumnType, TaskType } from '../App';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import '../styles/Column.css';
import {deleteColumnFromBoard, updateColumnTitle} from "../api/ColumnApi.ts";
import {addTaskToColumn} from "../api/TaskApi.ts";

interface ColumnProps {
    boardId: string;
    column: ColumnType;
    index: number;
    allColumns: ColumnType[];
    setColumns: (cols: ColumnType[]) => void;
}


const Column: React.FC<ColumnProps> = ({boardId, column, index, allColumns, setColumns }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(column.title);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const tasksContainerRef = useRef<HTMLDivElement | null>(null);

    const handleDeleteColumn = () => {
        deleteColumnFromBoard(boardId, column.id, allColumns, setColumns);

    };


    const saveColumnTitle = () => {
        if (!tempTitle.trim()) return;

        updateColumnTitle(boardId, column.id, tempTitle.trim(), allColumns, setColumns);
        setIsEditingTitle(false);

    };


    const addTask = (title: string, description: string, tags: string[]) => {
        const newTask: TaskType = {
            id: 'task-' + Date.now(),
            title,
            description,
            tags,
        };
        addTaskToColumn(boardId, column.id, newTask, allColumns)
            .then(updated => setColumns(updated))
            .catch(err => console.error('Failed to add task', err));
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
                                <div className="edit-column-buttons">
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
                                        boardId={boardId} // ✅ передаём сюда
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

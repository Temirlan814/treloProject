// src/components/Column.tsx
import React, { useState, useRef } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { ColumnType, TaskType } from '../types.ts';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import '../styles/Column.css';
import { useAppDispatch, useAppSelector } from '../hooks';
import { deleteColumn, updateColumn } from '../actions/columnActions';
import { addTask } from '../actions/taskActions';

interface ColumnProps {
    boardId: string;
    column: ColumnType;
    index: number;
}

const Column: React.FC<ColumnProps> = ({ boardId, column, index }) => {
    const dispatch = useAppDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [tempTitle, setTempTitle] = useState(column.title);
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const tasksContainerRef = useRef<HTMLDivElement | null>(null);

    const currentBoard = useAppSelector((state) =>
        state.boards.boards.find((b) => b.id === boardId)
    );
    const columns = currentBoard?.columns || [];

    const handleDeleteColumn = () => {
        dispatch(deleteColumn(boardId, column.id));
    };

    const saveColumnTitle = () => {
        if (!tempTitle.trim()) return;
        dispatch(updateColumn(boardId, column.id, tempTitle.trim()));
        setIsEditingTitle(false);
    };

    const handleAddTask = (title: string, description: string, tags: string[]) => {
        const newTask: TaskType = {
            id: `task-${Date.now()}`,
            title,
            description,
            tags,
        };
        dispatch(addTask(boardId, column.id, newTask))
            .catch((err: Error) => console.error('Failed to add task:', err.message));
        setShowAddTaskModal(false);
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
                                    onKeyPress={(e) => e.key === 'Enter' && saveColumnTitle()}
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
                                        boardId={boardId}
                                        task={task}
                                        index={taskIndex}
                                        columnId={column.id}
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
                            onSave={handleAddTask}
                            initialTitle=""
                            initialDesc=""
                            initialTags={[]}
                        />
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default Column;
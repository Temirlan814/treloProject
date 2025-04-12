import React, {useEffect, useRef, useState} from 'react';
import { DragDropContext, DropResult, Droppable, DragUpdate, DragStart } from '@hello-pangea/dnd';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ColumnType } from '../types';
import Column from './Column';
import '../styles/Board.css';
import { useHorizontalScroll } from './useHorizontalScroll';
import { replaceColumns } from '../actions/boardActions.ts';
import {addColumn} from '../actions/columnActions.ts';

interface BoardProps {
    boardId: string;
}

const Board: React.FC<BoardProps> = ({ boardId }) => {
    const [showAddColForm, setShowAddColForm] = useState(false);
    const [newColTitle, setNewColTitle] = useState('');
    const columnsContainerRef = useRef<HTMLDivElement>(null);
    const pointerOffsetRef = useRef<{ x: number; y: number } | null>(null);
    const isDraggingRef = useRef(false);
    const isTaskDraggingRef = useRef(false);
    const dispatch = useAppDispatch();

    const board = useAppSelector((state) =>
        state.boards.boards.find((b) => b.id === boardId)
    );

    const columns = useAppSelector((state) =>
        state.boards.boards.find((b) => b.id === boardId)?.columns || []

    );
    const [columnsState, setColumnsState] = useState<ColumnType[]>(columns);

    useEffect(() => {
        setColumnsState(columns);
    }, [columns]);


    const { updatePosition } = useHorizontalScroll(columnsContainerRef);

    const onDragStart = (start: DragStart) => {
        if (start.type === 'DEFAULT') {
            isTaskDraggingRef.current = true;
        } else if (start.type === 'COLUMN') {
            isDraggingRef.current = true;
        }
        document.addEventListener('mousemove', handleMouseMove);
        updatePosition({ position: pointerOffsetRef.current?.x || 0, isScrollAllowed: true });
    };

    const handleMouseMove = (event: MouseEvent) => {
        pointerOffsetRef.current = { x: event.clientX, y: event.clientY };
        updatePosition({
            position: pointerOffsetRef.current?.x || 0,
            isScrollAllowed: isTaskDraggingRef.current || isDraggingRef.current,
        });
    };

    const onDragUpdate = (update: DragUpdate) => {
        if (update.destination) {
            pointerOffsetRef.current = { x: update.destination.index * 100, y: 0 };
        }

        updatePosition({
            position: pointerOffsetRef.current?.x || 0,
            isScrollAllowed: isTaskDraggingRef.current || isDraggingRef.current,
        });
    };

    const onDragEnd = (result: DropResult) => {
        isDraggingRef.current = false;
        isTaskDraggingRef.current = false;
        document.removeEventListener('mousemove', handleMouseMove);

        const { source, destination, type } = result;
        if (!destination) return;

        const correctDestinationId = document
            .elementFromPoint(pointerOffsetRef.current?.x || 0, pointerOffsetRef.current?.y || 0)
            ?.closest('[data-rbd-droppable-id]')
            ?.getAttribute('data-rbd-droppable-id');

        if (correctDestinationId && correctDestinationId !== destination.droppableId) {
            destination.droppableId = correctDestinationId;
        }

        const newCols = [...columnsState];

        if (type === 'COLUMN') {
            const [moved] = newCols.splice(source.index, 1);
            newCols.splice(destination.index, 0, moved);
        } else {
            const startColIndex = newCols.findIndex((c) => c.id === source.droppableId);
            const endColIndex = newCols.findIndex((c) => c.id === destination.droppableId);
            if (startColIndex < 0 || endColIndex < 0) return;

            const startCol = newCols[startColIndex];
            const endCol = newCols[endColIndex];

            if (startCol.id === endCol.id) {
                const newTasks = [...startCol.tasks];
                const [movedTask] = newTasks.splice(source.index, 1);
                const safeIndex = Math.min(destination.index, newTasks.length);
                newTasks.splice(safeIndex, 0, movedTask);
                newCols[startColIndex] = { ...startCol, tasks: newTasks };
            } else {
                const startTasks = [...startCol.tasks];
                const [movedTask] = startTasks.splice(source.index, 1);
                const endTasks = [...endCol.tasks];

                let insertIndex = destination.index;
                if (pointerOffsetRef.current) {
                    const columnElement = document.querySelector(
                        `[data-rbd-droppable-id="${destination.droppableId}"]`
                    );
                    if (columnElement) {
                        const rect = columnElement.getBoundingClientRect();
                        const relativeY = pointerOffsetRef.current.y - rect.top;
                        insertIndex = Math.round((relativeY / rect.height) * endTasks.length);
                    }
                }

                const safeIndex = Math.min(insertIndex, endTasks.length);
                endTasks.splice(safeIndex, 0, movedTask);

                newCols[startColIndex] = { ...startCol, tasks: startTasks };
                newCols[endColIndex] = { ...endCol, tasks: endTasks };
            }
        }
        setColumnsState(newCols);
        dispatch(replaceColumns(boardId, newCols));
    };

    const handleAddColumn = () => {
        if (!newColTitle.trim()) return;
        const newColumn: ColumnType = {
            id: `col-${Date.now()}`,
            title: newColTitle.trim(),
            tasks: [],
        };
        dispatch(addColumn(boardId, newColumn))
        setNewColTitle('');
        setShowAddColForm(false);
    };

    if (!board) return <div>Board not found</div>;

    return (
        <div className="board">
            <div className="board-header">
                <div className="board-title">{board.title}</div>
                <div className="board-actions">
                    <button className="board-button">Filter</button>
                    {!showAddColForm && (
                        <button className="board-button" onClick={() => setShowAddColForm(true)}>
                            + Add Column
                        </button>
                    )}
                </div>
            </div>
            {showAddColForm && (
                <div className="add-column-form">
                    <input
                        type="text"
                        placeholder="Column title"
                        value={newColTitle}
                        onChange={(e) => setNewColTitle(e.target.value)}
                    />
                    <button className="black-button" onClick={handleAddColumn}>
                        Add
                    </button>
                    <button className="white-button" onClick={() => setShowAddColForm(false)}>
                        Cancel
                    </button>
                </div>
            )}
            <DragDropContext
                onDragStart={onDragStart}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
            >
                <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                    {(provided) => (
                        <div
                            className="columns-container"
                            ref={(node) => {
                                provided.innerRef(node);
                                columnsContainerRef.current = node;
                            }}
                            {...provided.droppableProps}
                        >
                            {columnsState.map((col, index) => (
                                <Column
                                    key={col.id}
                                    boardId={board.id}
                                    column={col}
                                    index={index}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default Board;

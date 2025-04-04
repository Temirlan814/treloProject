// src/components/Board.tsx
import React, { useRef, useState,  } from 'react';
import {DragDropContext, DropResult, Droppable, DragUpdate, DragStart} from '@hello-pangea/dnd';
import { BoardType, ColumnType } from '../types';
import Column from './Column';
import '../styles/Board.css';
import {useHorizontalScroll} from "./useHorizontalScroll.tsx";
import {addColumnToBoard, updateColumnsInBoard} from "../api/ColumnApi.ts";

interface BoardProps {
    board: BoardType;
    setColumns: (columns: ColumnType[]) => void;
}


const Board: React.FC<BoardProps> = ({ board, setColumns }) => {
    const [showAddColForm, setShowAddColForm] = useState(false);
    const [newColTitle, setNewColTitle] = useState('');
    const columnsContainerRef = useRef<HTMLDivElement>(null);
    const pointerOffsetRef = useRef<{ x: number; y: number } | null>(null);
    const isDraggingRef = useRef(false);

    const onDragStart = (start: DragStart) => {
        if (start.type === "DEFAULT") { // TaskCard
            isTaskDraggingRef.current = true;
        } else if (start.type === "COLUMN") { // Column
            isDraggingRef.current = true;
        }
        console.log(start.type);
        document.addEventListener("mousemove", handleMouseMove); // Добавляем обработчик мыши
        updatePosition({ position: pointerOffsetRef.current?.x || 0, isScrollAllowed: true });
    };

    const handleMouseMove = (event: MouseEvent) => {
        pointerOffsetRef.current = { x: event.clientX, y: event.clientY };

        updatePosition({
            position: pointerOffsetRef.current?.x || 0,
            isScrollAllowed: isTaskDraggingRef.current || isDraggingRef.current
        });
    };


    const { updatePosition } = useHorizontalScroll(columnsContainerRef);

    const isTaskDraggingRef = useRef(false); // Новый флаг для задач

    const onDragUpdate = (update: DragUpdate) => {
        if (update.destination) {
            pointerOffsetRef.current = { x: update.destination.index * 100, y: 0 };
        }

        updatePosition({
            position: pointerOffsetRef.current?.x || 0,
            isScrollAllowed: isTaskDraggingRef.current || isDraggingRef.current
        });
    };


    const onDragEnd = (result: DropResult) => {
        isDraggingRef.current = false;
        isTaskDraggingRef.current = false;
        document.removeEventListener("mousemove", handleMouseMove);

        const { source, destination, type } = result;
        if (!destination) return;

        const correctDestinationId = document
            .elementFromPoint(pointerOffsetRef.current?.x || 0, pointerOffsetRef.current?.y || 0)
            ?.closest("[data-rbd-droppable-id]")
            ?.getAttribute("data-rbd-droppable-id");

        if (correctDestinationId && correctDestinationId !== destination.droppableId) {
            destination.droppableId = correctDestinationId;
        }

        let newCols = [...board.columns];

        if (type === "COLUMN") {
            const [moved] = newCols.splice(source.index, 1);
            newCols.splice(destination.index, 0, moved);
        } else {
            const startColIndex = newCols.findIndex(c => c.id === source.droppableId);
            const endColIndex = newCols.findIndex(c => c.id === destination.droppableId);
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
                    const columnElement = document.querySelector(`[data-rbd-droppable-id="${destination.droppableId}"]`);
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

        setColumns(newCols);
        updateColumnsInBoard(board.id, newCols) // ✅ сохраняем в базу
            .catch(err => console.error('Failed to sync task changes to API', err));
    };



    const addColumn = () => {
        if (!newColTitle.trim()) return;
        const newColumn: ColumnType = {
            id: `col-${Date.now()}`,
            title: newColTitle.trim(),
            tasks: [],
        };
        addColumnToBoard(board.id, newColumn, board.columns, setColumns);
        setNewColTitle('');
        setShowAddColForm(false);
    };








    return (
        <div className="board">
            <div className="board-header">
                <div className="board-title">{board.title}</div>
                <div className="board-actions">
                    <button className="board-button">Filter</button>
                    {!showAddColForm && (
                        <button className="board-button" onClick={() => setShowAddColForm(true)}>+ Add Column</button>
                    )}
                </div>
            </div>
            {showAddColForm && (
                <div className="add-column-form">
                    <input type="text" placeholder="Column title" value={newColTitle} onChange={(e) => setNewColTitle(e.target.value)} />
                    <button className="black-button" onClick={addColumn}>Add</button>
                    <button className="white-button" onClick={() => setShowAddColForm(false)}>Cancel</button>
                </div>
            )}
            <DragDropContext onDragStart={onDragStart} onDragUpdate={onDragUpdate} onDragEnd={onDragEnd}>
                <Droppable droppableId="all-columns" direction="horizontal" type="COLUMN">
                    {(provided) => (
                        <div className="columns-container" ref={(node) => {
                            provided.innerRef(node);
                            columnsContainerRef.current = node;
                        }} {...provided.droppableProps}>
                            {board.columns.map((col, index) => (
                                <Column
                                    key={col.id}
                                    boardId={board.id}
                                    column={col}
                                    index={index}
                                    allColumns={board.columns}
                                    setColumns={setColumns}
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

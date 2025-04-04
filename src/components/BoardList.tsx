import React, { useState } from 'react';
import { BoardType } from '../App';
import '../styles/BoardList.css';
import { useTheme } from '../context/ThemeContext.tsx'; // ✅ Подключили ThemeContext

interface BoardListProps {
    boards: BoardType[];
    activeBoardId: string | null;
    setActiveBoardId: (id: string) => void;
    addBoard: (title: string) => void;
    editBoardTitle: (boardId: string, newTitle: string) => void;
    deleteBoard: (boardId: string) => void;
}

const BoardList: React.FC<BoardListProps> = ({
                                                 boards,
                                                 activeBoardId,
                                                 setActiveBoardId,
                                                 addBoard,
                                                 editBoardTitle,
                                                 deleteBoard,
                                             }) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newBoardTitle, setNewBoardTitle] = useState('');
    const [editingBoardId, setEditingBoardId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState('');

    const { theme, toggleTheme } = useTheme(); // ✅ Используем тему

    const openAddForm = () => setShowAddForm(true);
    const closeAddForm = () => {
        setShowAddForm(false);
        setNewBoardTitle('');
    };

    const handleAddBoard = () => {
        if (newBoardTitle.trim()) {
            addBoard(newBoardTitle.trim());
            setNewBoardTitle('');
            setShowAddForm(false);
        }
    };

    const startEditBoard = (boardId: string, currentTitle: string) => {
        setEditingBoardId(boardId);
        setEditingTitle(currentTitle);
    };

    const saveEditBoard = () => {
        if (editingBoardId && editingTitle.trim()) {
            editBoardTitle(editingBoardId, editingTitle.trim());
        }
        setEditingBoardId(null);
        setEditingTitle('');
    };

    return (
        <div className="sidebar">
            <h2>Boards</h2>

            {/* ✅ Переключатель темы (иконка 🌙 / 🌞) */}
            <button
                onClick={toggleTheme}
                className="theme-toggle-button"
                title="Toggle theme"
            >
                {theme === 'light' ? '🌙' : '🌞'}
            </button>

            {!showAddForm && (
                <button className="add-board-button" onClick={openAddForm}>
                    + Add Board
                </button>
            )}

            {showAddForm && (
                <div className="add-board-form">
                    <input
                        type="text"
                        placeholder="board title"
                        value={newBoardTitle}
                        onChange={(e) => setNewBoardTitle(e.target.value)}
                    />
                    <div className="buttons-row">
                        <button onClick={handleAddBoard} className="black-button">
                            Add
                        </button>
                        <button onClick={closeAddForm} className="white-button">
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <ul className="boards-list">
                {boards.map((board) => (
                    <li
                        key={board.id}
                        className={`board-item ${board.id === activeBoardId ? 'active-board' : ''}`}
                        onClick={() => setActiveBoardId(board.id)}
                    >
                        {editingBoardId === board.id ? (
                            <div className="edit-board-title">
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                />
                                <button onClick={saveEditBoard}>Save</button>
                                <button
                                    onClick={() => {
                                        setEditingBoardId(null);
                                        setEditingTitle('');
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                {board.title}
                                <div className="board-actions">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            startEditBoard(board.id, board.title);
                                        }}
                                    >
                                        ✎
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteBoard(board.id);
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default React.memo(BoardList);

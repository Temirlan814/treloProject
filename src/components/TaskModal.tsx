// src/components/TaskModal.tsx
import React, { useState } from 'react';
import '../styles/TaskModal.css';

interface TaskModalProps {
    onClose: () => void;
    onSave: (title: string, description: string, tags: string[]) => void;
    initialTitle?: string;
    initialDesc?: string;
    initialTags?: string[];
}

const TaskModal: React.FC<TaskModalProps> = ({
                                                 onClose,
                                                 onSave,
                                                 initialTitle = '',
                                                 initialDesc = '',
                                                 initialTags = [],
                                             }) => {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDesc);
    const [tags, setTags] = useState<string[]>(initialTags);
    const [newTag, setNewTag] = useState('');

    const handleAddTag = () => {
        if (newTag.trim()) {
            setTags((prev) => [...prev, newTag.trim()]);
            setNewTag('');
        }
    };

    const handleSave = () => {
        onSave(title.trim(), description.trim(), tags);
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Add New Task</h2>
                <div className="modal-field">
                    <label>Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task title"
                    />
                </div>
                <div className="modal-field">
                    <label>Description</label>
                    <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a more detailed description..."
                    />
                </div>
                <div className="modal-field">
                    <label>Tags</label>
                    <div className="tags-row">
                        {tags.map((tag, i) => (
                            <span key={i} className="tag-item">{tag}</span>
                        ))}
                    </div>
                    <div className="add-tag-row">
                        <input
                            placeholder="Add a tag"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                        />
                        <button onClick={handleAddTag}>+</button>
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={onClose} className="white-button">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="black-button">
                        Add Task
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;

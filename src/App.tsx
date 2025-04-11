import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import BoardListView from './components/BoardListView';
import SingleBoardView from './components/SingleBoardView';
import './styles/App.css';
import {BoardType} from "./types.ts";
import {fetchBoards} from "./api/BoardApi.ts";

const App: React.FC = () => {
    const [boards, setBoards] = useState<BoardType[]>([]);

    useEffect(() => {
        fetchBoards()
            .then((res) => {
                setBoards(res.data);
            })
            .catch((err) => console.error('Failed to load boards', err));
    }, []);

    return (
        <Routes>
            <Route path="/" element={<BoardListView boards={boards} setBoards={setBoards} />} />
            <Route path="/board/:id" element={<SingleBoardView boards={boards} setBoards={setBoards} />} />
        </Routes>
    );
};

export default App;

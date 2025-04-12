import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BoardListView from './components/BoardListView';
import SingleBoardView from './components/SingleBoardView';
import './styles/App.css';

const App: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<BoardListView />} />
            <Route path="/board/:id" element={<SingleBoardView />} />
        </Routes>
    );
};

export default App;

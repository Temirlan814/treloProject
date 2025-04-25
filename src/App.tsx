import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BoardListView from './components/BoardListView';
import SingleBoardView from './components/SingleBoardView';
import Login from './pages/Login';
import Register from './pages/Register';
import './styles/App.css';

// Тип для пользователя
type User = {
    role: string;
    // другие поля пользователя при необходимости
};

// Проверка аутентификации
const isAuthenticated = (): boolean => {
    const user = localStorage.getItem('user');
    return user !== null;
};

// Получение роли пользователя
const getUserRole = (): string | null => {
    const user = localStorage.getItem('user');
    if (user) {
        try {
            const parsedUser: User = JSON.parse(user);
            return parsedUser.role;
        } catch {
            return null;
        }
    }
    return null;
};

// Компонент защищенного маршрута
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Компонент админского маршрута
const AdminRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    if (getUserRole() !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

const App: React.FC = () => {
    return (
        <Router>
            <div className="app-container">
                <Routes>
                    {/* Публичные маршруты */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Защищенные маршруты */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <BoardListView />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/board/:id"
                        element={
                            <ProtectedRoute>
                                <SingleBoardView />
                            </ProtectedRoute>
                        }
                    />

                    {/* Админский маршрут */}
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <div className="admin-panel">
                                    <h2>Админская панель</h2>
                                    <p>Добро пожаловать в админку!</p>
                                </div>
                            </AdminRoute>
                        }
                    />

                    {/* Резервный маршрут для несуществующих путей */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
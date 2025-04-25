import type React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import BoardListView from "./components/BoardListView"
import SingleBoardView from "./components/SingleBoardView"
import Login from "./pages/Login"
import Register from "./pages/Register"
import "./styles/App.css"

// Проверка аутентификации
const isAuthenticated = (): boolean => {
    const user = sessionStorage.getItem("user")
    return user !== null
}

// Компонент защищенного маршрута
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />
    }
    return children
}

const App: React.FC = () => {
    return (
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

                {/* Резервный маршрут для несуществующих путей */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App

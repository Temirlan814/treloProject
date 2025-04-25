import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { loginApi } from "../api/AuthApi"

const Login: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleLogin = async () => {
        try {
            setIsLoading(true)
            setError("")

            const response = await loginApi({ email, password })

            if (response.data.success) {
                // Store authentication token or user info in session storage
                // This is more secure than localStorage for sensitive data
                sessionStorage.setItem("user", JSON.stringify(response.data.user))
                navigate("/")
            } else {
                setError(response.data.message || "Ошибка входа")
            }
        } catch (err) {
            console.error("Login error:", err)
            setError("Ошибка сервера. Пожалуйста, попробуйте позже.")
        } finally {
            setIsLoading(false)
        }
    }

    return React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Войти"),
        React.createElement("input", {
            type: "email",
            placeholder: "Email",
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
            disabled: isLoading,
        }),
        React.createElement("input", {
            type: "password",
            placeholder: "Пароль",
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
            disabled: isLoading,
        }),
        error && React.createElement("p", { style: { color: "red" } }, error),
        React.createElement(
            "button",
            {
                onClick: handleLogin,
                disabled: isLoading,
            },
            isLoading ? "Загрузка..." : "Войти",
        ),
    )
}

export default Login
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { registerApi } from "../api/AuthApi"

const Register: React.FC = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = async () => {
        try {
            setIsLoading(true)
            setError("")

            const response = await registerApi({ email, password })

            if (response.data.success) {
                // Store authentication token or user info in session storage
                sessionStorage.setItem("user", JSON.stringify(response.data.user))
                navigate("/")
            } else {
                setError(response.data.message || "Ошибка регистрации")
            }
        } catch (err) {
            console.error("Registration error:", err)
            setError("Ошибка сервера. Пожалуйста, попробуйте позже.")
        } finally {
            setIsLoading(false)
        }
    }

    return React.createElement(
        "div",
        null,
        React.createElement("h2", null, "Регистрация"),
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
                onClick: handleRegister,
                disabled: isLoading,
            },
            isLoading ? "Загрузка..." : "Зарегистрироваться",
        ),
    )
}

export default Register
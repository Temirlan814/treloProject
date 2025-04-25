import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');  // Перенаправление на главную страницу вашего сайта
        } else {
            alert(data.message);
        }
    };

    return React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'Войти'),
        React.createElement('input', {
            type: 'email',
            placeholder: 'Email',
            value: email,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
        }),
        React.createElement('input', {
            type: 'password',
            placeholder: 'Пароль',
            value: password,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
        }),
        React.createElement('button', { onClick: handleLogin }, 'Войти')
    );
};

export default Login;

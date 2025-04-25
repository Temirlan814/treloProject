import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        const res = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate('/');
        } else {
            alert(data.message);
        }
    };

    return React.createElement(
        'div',
        null,
        React.createElement('h2', null, 'Регистрация'),
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
        React.createElement('input', {
            type: 'text',
            placeholder: 'Роль',
            value: role,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value),
        }),
        React.createElement('button', { onClick: handleRegister }, 'Зарегистрироваться')
    );
};

export default Register;

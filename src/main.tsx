import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { Provider } from 'react-redux';  // Импортируем Provider
import store from './actions/store.ts';  // Импортируем созданный store

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider store={store}>  {/* Оборачиваем в Provider */}
            <ThemeProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </Provider>
    </StrictMode>
);

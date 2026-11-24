import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// Без StrictMode: застосунок ініціалізується один раз і керує своїм DOM сам.
createRoot(document.getElementById('root')).render(<App />);

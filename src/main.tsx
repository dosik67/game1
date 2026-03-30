import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import FractionsApp from './FractionsApp.tsx';
import './index.css';

const path = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/fractions' || path === '/zip' ? <FractionsApp /> : <App />}
  </StrictMode>,
);

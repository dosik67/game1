import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import FractionsApp from './FractionsApp.tsx';
import MainMenu from './MainMenu.tsx';
import './index.css';

const path = window.location.pathname;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/' ? <MainMenu /> : path === '/game1' ? <App /> : path === '/game2' ? <FractionsApp /> : <MainMenu />}
  </StrictMode>,
);

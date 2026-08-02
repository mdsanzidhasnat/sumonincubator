import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.tsx';
import {ContactSettingsProvider} from './context/ContactSettingsContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ContactSettingsProvider>
        <App />
      </ContactSettingsProvider>
    </BrowserRouter>
  </StrictMode>,
);

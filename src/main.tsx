import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './catalog.css';
import './workspace.css';
import './metadata-validation.css';
import './lyrics-editor.css';
import './lyrics-embed.css';
import './phase4-operations.css';
import './sonictrace.css';
import './readability.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

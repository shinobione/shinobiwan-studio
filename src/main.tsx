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
import './c3-deep-audio.css';
import './ux-foundation.css';
import './readability.css';
import './c2-5-a-polish.css';
import './album-management.css';
import './c2-5-d-navigation.css';
import './c2-5-d2-intake.css';
import './c2-5-e-migration.css';
import './c2-5-e2-review.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

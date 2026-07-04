import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RewardProvider }   from './context/RewardContext';
import { NotebookProvider } from './context/NotebookContext';
import { NotifProvider }    from './context/NotifContext';
import { PuzzleProvider }   from './context/PuzzleContext';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <NotifProvider>
          <RewardProvider>
            <NotebookProvider>
              <PuzzleProvider>
                <App />
              </PuzzleProvider>
            </NotebookProvider>
          </RewardProvider>
        </NotifProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
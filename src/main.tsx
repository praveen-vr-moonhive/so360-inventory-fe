import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock Provider for Standalone Development
// In real Shell integration, this comes from the host
const MockShellProvider = ({ children }: { children: React.ReactNode }) => {
    // Mock context values
    return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <MockShellProvider>
                <App />
            </MockShellProvider>
        </BrowserRouter>
    </React.StrictMode>
);

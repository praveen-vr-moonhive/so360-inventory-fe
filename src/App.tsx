import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages for performance
const LeadsPage = lazy(() => import('./pages/LeadsPage'));
const LeadDetailPage = lazy(() => import('./pages/LeadDetailPage'));
const PipelinePage = lazy(() => import('./pages/PipelinePage'));
const DealDetailPage = lazy(() => import('./pages/DealDetailPage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <main className="w-full">
                <Suspense fallback={<div className="p-8 text-slate-400">Loading module...</div>}>
                    {children}
                </Suspense>
            </main>
        </div>
    );
};

const App = () => {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="leads" replace />} />
                <Route path="leads" element={<LeadsPage />} />
                <Route path="leads/:id" element={<LeadDetailPage />} />
                <Route path="pipeline" element={<PipelinePage />} />
                <Route path="deal/:id" element={<DealDetailPage />} />
                <Route path="tasks" element={<TasksPage />} />
                <Route path="tasks/:id" element={<TaskDetailPage />} />
                <Route path="settings" element={<SettingsPage />} />
            </Routes>
        </Layout>
    );
};

export default App;

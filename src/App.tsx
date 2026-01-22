import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Lazy load pages for performance
const ItemsPage = lazy(() => import('./pages/ItemsPage'));
const ItemDetailPage = lazy(() => import('./pages/ItemDetailPage'));
const StockLocationsPage = lazy(() => import('./pages/StockLocationsPage'));
const StockOverviewPage = lazy(() => import('./pages/StockOverviewPage'));
const StockAdjustmentsPage = lazy(() => import('./pages/StockAdjustmentsPage'));
const StockTransfersPage = lazy(() => import('./pages/StockTransfersPage'));
const MovementsPage = lazy(() => import('./pages/MovementsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-500/30">
            <main className="w-full">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="text-slate-500 font-medium animate-pulse text-sm">Loading Inventory Module...</div>
                    </div>
                }>
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
                <Route path="/" element={<Navigate to="items" replace />} />

                {/* 1. Items List & Detail */}
                <Route path="items" element={<ItemsPage />} />
                <Route path="items/:id" element={<ItemDetailPage />} />

                {/* 2. Stock Locations */}
                <Route path="locations" element={<StockLocationsPage />} />

                {/* 3. Stock Overview */}
                <Route path="overview" element={<StockOverviewPage />} />

                {/* 4. Movements (Combined) */}
                <Route path="movements" element={<MovementsPage />} />

                {/* 5. Direct Movement Access (Optional) */}
                <Route path="adjustments" element={<StockAdjustmentsPage />} />
                <Route path="transfers" element={<StockTransfersPage />} />

                {/* 6. Settings */}
                <Route path="settings" element={<SettingsPage />} />

                {/* Legacy Redirects */}
                <Route path="products" element={<Navigate to="../items" replace />} />
                <Route path="products/:id" element={<Navigate to="../../items/:id" replace />} />
            </Routes>
        </Layout>
    );
};

export default App;

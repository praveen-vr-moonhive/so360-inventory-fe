import React, { useState } from 'react';
import StockAdjustmentsPage from './StockAdjustmentsPage';
import StockTransfersPage from './StockTransfersPage';
import { ArrowRightLeft, History } from 'lucide-react';

const MovementsPage = () => {
    const [activeTab, setActiveTab] = useState<'adjustments' | 'transfers'>('adjustments');

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Tab Header for Movements */}
            <div className="border-b border-slate-800 bg-slate-950/50 pt-6 px-8 sticky top-0 z-20 backdrop-blur-md">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => setActiveTab('adjustments')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative ${activeTab === 'adjustments' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <History size={16} /> Adjustments
                        {activeTab === 'adjustments' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('transfers')}
                        className={`pb-4 text-sm font-bold uppercase tracking-widest flex items-center gap-2 transition-all relative ${activeTab === 'transfers' ? 'text-blue-500' : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <ArrowRightLeft size={16} /> Transfers
                        {activeTab === 'transfers' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>}
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {activeTab === 'adjustments' ? (
                    <StockAdjustmentsPage />
                ) : (
                    <StockTransfersPage />
                )}
            </div>
        </div>
    );
};

export default MovementsPage;

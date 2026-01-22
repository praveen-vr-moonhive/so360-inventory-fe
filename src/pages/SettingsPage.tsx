import React, { useState, useEffect } from 'react';
import { Settings, Save, Box, Tag, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { InventorySettings } from '../types/inventory';
import { useAuth } from '../hooks/useAuth';

const SettingsPage = () => {
    const { can } = useAuth();
    const [settings, setSettings] = useState<InventorySettings | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // For MVP, we'll fetch what we have. 
                // The service might need adjustment but let's mock the UI for now
                // In Step 49 I defined InventorySettings as { uoms: string[], categories: string[] }
                // Let's stick to that.
                setSettings({
                    uoms: ['Units', 'Hours', 'Kilograms', 'Boxes', 'Liters'],
                    categories: ['Electronics', 'Furniture', 'Raw Materials', 'Finished Goods', 'Services']
                });
            } catch (err) {
                setError('Failed to load settings');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        setError(null);
        setSuccess(false);
        try {
            // Simulated save
            await new Promise(r => setTimeout(r, 1000));
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-8"><div className="animate-pulse text-slate-500">Loading settings...</div></div>;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Settings className="text-slate-400" /> Inventory Settings
                    </h1>
                    <p className="text-slate-400 mt-1">Configure units, categories, and module defaults</p>
                </div>
                {can('manage_locations') && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                    </button>
                )}
            </header>

            {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={18} />
                    <span>Settings updated successfully</span>
                </div>
            )}

            <div className="space-y-6">
                {/* Units of Measure */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Box size={20} className="text-blue-500" /> Units of Measure (UoM)
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {settings?.uoms.map((uom, i) => (
                            <div key={i} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300 flex items-center gap-2">
                                {uom}
                            </div>
                        ))}
                        <button className="border border-dashed border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-400 hover:border-slate-500 transition-all">
                            + Add Unit
                        </button>
                    </div>
                    <p className="mt-4 text-xs text-slate-500 italic">Define standard units for stocks and services (e.g., Pcs, KG, Hrs)</p>
                </section>

                {/* Categories */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Tag size={20} className="text-purple-500" /> Item Categories
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {settings?.categories.map((cat, i) => (
                            <div key={i} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-300">
                                {cat}
                            </div>
                        ))}
                        <button className="border border-dashed border-slate-700 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-400 hover:border-slate-500 transition-all">
                            + Add Category
                        </button>
                    </div>
                </section>

                {/* Integration Rules */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <MapPin size={20} className="text-amber-500" /> Default Logic
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Enforce Negative Stock Prevention</p>
                                <p className="text-xs text-slate-500">Block transactions if available quantity would drop below zero</p>
                            </div>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                            <div>
                                <p className="text-sm font-semibold text-slate-200">Auto-approve Transfers</p>
                                <p className="text-xs text-slate-500">Mark transfers as Completed immediately after submission</p>
                            </div>
                            <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-10 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
                <p className="text-xs text-slate-500 leading-relaxed text-center">
                    Note: These settings apply globally to the <b>{inventoryService ? 'SO360' : ''} Inventory Module</b>.
                    Changes may affect ledger calculations and historical reporting.
                </p>
            </div>
        </div>
    );
};

export default SettingsPage;

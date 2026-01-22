import React, { useState, useEffect } from 'react';
import { Plus, History, TrendingUp, TrendingDown, Clipboard, Calendar, Package, MapPin, AlertCircle } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { StockAdjustment, Item, StockLocation, AdjustmentType } from '../types/inventory';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';

const StockAdjustmentsPage = () => {
    const { can } = useAuth();
    const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        item_id: '',
        location_id: '',
        type: 'Increase' as AdjustmentType,
        quantity: 0,
        reason: '',
        date: new Date().toISOString().split('T')[0]
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [adjData, itemData, locData] = await Promise.all([
                inventoryService.getAdjustments(),
                inventoryService.getItems(),
                inventoryService.getLocations()
            ]);
            setAdjustments(adjData);
            setItems(itemData.filter(i => i.type === 'Product'));
            setLocations(locData);
        } catch (err) {
            setError('Failed to fetch adjustments data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.quantity <= 0) {
            setError('Quantity must be positive');
            return;
        }

        // Confirmation modal before submit (simplified for MVP as a window.confirm, 
        // but for high premium feel I'd build a custom one. Let's do a simple one first)
        if (!window.confirm('Are you sure you want to commit this stock adjustment? This action cannot be undone.')) {
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const selectedItem = items.find(i => i.id === form.item_id);
            const selectedLoc = locations.find(l => l.id === form.location_id);

            await inventoryService.createAdjustment({
                ...form,
                item_name: selectedItem?.name,
                location_name: selectedLoc?.name
            });

            setIsModalOpen(false);
            fetchData();
            // Reset form
            setForm({
                item_id: '',
                location_id: '',
                type: 'Increase',
                quantity: 0,
                reason: '',
                date: new Date().toISOString().split('T')[0]
            });
        } catch (err: any) {
            setError(err.message || 'Failed to create adjustment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            header: 'Date',
            accessor: (adj: StockAdjustment) => (
                <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} />
                    <span>{new Date(adj.date).toLocaleDateString()}</span>
                </div>
            )
        },
        {
            header: 'Item',
            accessor: (adj: StockAdjustment) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-white">{adj.item_name}</span>
                </div>
            )
        },
        {
            header: 'Location',
            accessor: (adj: StockAdjustment) => (
                <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin size={14} className="text-slate-500" />
                    <span>{adj.location_name}</span>
                </div>
            )
        },
        {
            header: 'Type & Quantity',
            accessor: (adj: StockAdjustment) => (
                <div className="flex items-center gap-2">
                    {adj.type === 'Increase' ? (
                        <TrendingUp size={16} className="text-emerald-400" />
                    ) : (
                        <TrendingDown size={16} className="text-rose-400" />
                    )}
                    <span className={`font-bold ${adj.type === 'Increase' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {adj.type === 'Increase' ? '+' : '-'}{adj.quantity}
                    </span>
                </div>
            )
        },
        {
            header: 'Reason',
            accessor: (adj: StockAdjustment) => adj.reason,
            className: 'text-slate-400 truncate max-w-[200px]'
        },
        {
            header: 'By',
            accessor: (adj: StockAdjustment) => (
                <span className="text-slate-500 text-xs italic">{adj.created_by_name}</span>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <History className="text-blue-500" /> Stock Adjustments
                    </h1>
                    <p className="text-slate-400 mt-1">Record and track manual stock corrections</p>
                </div>
                {can('create_adjustment') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Plus size={20} />
                        New Adjustment
                    </button>
                )}
            </header>

            {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            <Table
                data={adjustments}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No adjustments history found."
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Stock Adjustment"
            >
                <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
                    <p className="text-xs text-slate-500 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 mb-4">
                        Use adjustments for damages, losses, or manual corrections. To move stock between warehouses, use <b>Transfers</b> instead.
                    </p>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Item *</label>
                        <select
                            required
                            value={form.item_id}
                            onChange={(e) => setForm({ ...form, item_id: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        >
                            <option value="">Select Item...</option>
                            {items.map(i => (
                                <option key={i.id} value={i.id}>{i.name} ({i.sku})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Location *</label>
                        <select
                            required
                            value={form.location_id}
                            onChange={(e) => setForm({ ...form, location_id: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        >
                            <option value="">Select Location...</option>
                            {locations.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Type</label>
                            <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, type: 'Increase' })}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all ${form.type === 'Increase' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <TrendingUp size={14} /> Increase
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setForm({ ...form, type: 'Decrease' })}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-all ${form.type === 'Decrease' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                                >
                                    <TrendingDown size={14} /> Decrease
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Quantity *</label>
                            <input
                                required
                                type="number"
                                min="1"
                                value={form.quantity}
                                onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-center"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Reason *</label>
                        <textarea
                            required
                            placeholder="Why are you making this adjustment? (e.g. Broken item, Inventory count correction)"
                            value={form.reason}
                            onChange={(e) => setForm({ ...form, reason: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-20 resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Adjustment Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`flex-1 font-semibold py-2 rounded-lg transition-all shadow-lg ${form.type === 'Increase'
                                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20'
                                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20'
                                } text-white`}
                        >
                            {isSubmitting ? 'Processing...' : 'Confirm Adjustment'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StockAdjustmentsPage;

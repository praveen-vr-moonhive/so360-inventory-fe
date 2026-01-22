import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, MapPin, Package, Calendar, Clock, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { StockTransfer, Item, StockLocation } from '../types/inventory';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';

const StockTransfersPage = () => {
    const { can } = useAuth();
    const [transfers, setTransfers] = useState<StockTransfer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        item_id: '',
        from_location_id: '',
        to_location_id: '',
        quantity: 0
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [trData, itemData, locData] = await Promise.all([
                inventoryService.getTransfers(),
                inventoryService.getItems(),
                inventoryService.getLocations()
            ]);
            setTransfers(trData);
            setItems(itemData.filter(i => i.type === 'Product'));
            setLocations(locData);
        } catch (err) {
            setError('Failed to fetch transfers data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.from_location_id === form.to_location_id) {
            setError('Source and destination locations must be different');
            return;
        }

        if (form.quantity <= 0) {
            setError('Quantity must be positive');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        try {
            const selectedItem = items.find(i => i.id === form.item_id);
            const fromLoc = locations.find(l => l.id === form.from_location_id);
            const toLoc = locations.find(l => l.id === form.to_location_id);

            await inventoryService.createTransfer({
                ...form,
                item_name: selectedItem?.name,
                from_location_name: fromLoc?.name,
                to_location_name: toLoc?.name,
                status: 'Completed' // MVP logic: auto-complete for now
            });

            setIsModalOpen(false);
            fetchData();
            // Reset form
            setForm({ item_id: '', from_location_id: '', to_location_id: '', quantity: 0 });
        } catch (err: any) {
            setError(err.message || 'Failed to create transfer');
        } finally {
            setIsSubmitting(false);
        }
    };

    const columns = [
        {
            header: 'Date & Status',
            accessor: (tr: StockTransfer) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Calendar size={12} />
                        <span>{new Date(tr.date).toLocaleDateString()}</span>
                    </div>
                    <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${tr.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}>
                        {tr.status}
                    </span>
                </div>
            )
        },
        {
            header: 'Movement',
            accessor: (tr: StockTransfer) => (
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-tight">From</span>
                        <span className="text-white font-medium">{tr.from_location_name}</span>
                    </div>
                    <ArrowRight size={16} className="text-slate-600 mt-4" />
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-tight">To</span>
                        <span className="text-white font-medium">{tr.to_location_name}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Item',
            accessor: (tr: StockTransfer) => (
                <div className="flex items-center gap-2">
                    <span className="text-slate-200">{tr.item_name}</span>
                </div>
            )
        },
        {
            header: 'Quantity',
            accessor: (tr: StockTransfer) => (
                <span className="font-bold text-blue-400 text-lg">{tr.quantity}</span>
            )
        },
        {
            header: 'By',
            accessor: (tr: StockTransfer) => (
                <span className="text-slate-500 text-xs italic">{tr.created_by_name}</span>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <ArrowRightLeft className="text-blue-500" /> Stock Transfers
                    </h1>
                    <p className="text-slate-400 mt-1">Move products between your warehouse locations</p>
                </div>
                {can('create_transfer') && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Plus size={20} />
                        New Transfer
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
                data={transfers}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No stock transfers recorded yet."
            />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="New Stock Transfer"
            >
                <form onSubmit={handleSubmit} className="space-y-4 text-slate-200">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">From Location *</label>
                            <select
                                required
                                value={form.from_location_id}
                                onChange={(e) => setForm({ ...form, from_location_id: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            >
                                <option value="">Select Source...</option>
                                {locations.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">To Location *</label>
                            <select
                                required
                                value={form.to_location_id}
                                onChange={(e) => setForm({ ...form, to_location_id: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            >
                                <option value="">Select Destination...</option>
                                {locations.map(l => (
                                    <option key={l.id} value={l.id}>{l.name}</option>
                                ))}
                            </select>
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
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-bold text-center text-xl"
                        />
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-3 mt-4">
                        <CheckCircle2 size={18} className="text-blue-400 mt-0.5" />
                        <div className="text-xs text-blue-300">
                            <p className="font-bold mb-1">Stock Availability Check</p>
                            <p className="opacity-80">Final verification of stock availability will be performed upon submission. If insufficient stock exists at the source, the transfer will be rejected.</p>
                        </div>
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
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20"
                        >
                            {isSubmitting ? 'Processing...' : 'Complete Transfer'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StockTransfersPage;

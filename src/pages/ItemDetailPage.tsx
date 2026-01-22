import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Package, Layers, Tag, DollarSign, Box,
    ArrowUpRight, ArrowDownLeft, ArrowRightLeft,
    History, Info, AlertCircle
} from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { Item, LedgerEntry } from '../types/inventory';
import { Table } from '../components/common/Table';
import { TableSkeleton } from '../components/common/Skeleton';

const ItemDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<Item | null>(null);
    const [ledger, setLedger] = useState<LedgerEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setIsLoading(true);
            try {
                const [itemData, ledgerData] = await Promise.all([
                    inventoryService.getItemById(id),
                    inventoryService.getLedger(id)
                ]);

                if (itemData) {
                    setItem(itemData);
                    setLedger(ledgerData);
                } else {
                    setError('Item not found');
                }
            } catch (err) {
                setError('Failed to load item details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (isLoading) return <div className="p-8"><TableSkeleton /></div>;
    if (error || !item) return (
        <div className="p-8 text-center">
            <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{error || 'Something went wrong'}</h2>
            <button onClick={() => navigate('/items')} className="text-blue-400 hover:underline">Back to Items</button>
        </div>
    );

    const columns = [
        {
            header: 'Date',
            accessor: (entry: LedgerEntry) => (
                <span className="text-slate-400">{new Date(entry.date).toLocaleString()}</span>
            )
        },
        {
            header: 'Movement Type',
            accessor: (entry: LedgerEntry) => {
                const getIcon = () => {
                    if (entry.movement_type.toLowerCase().includes('in')) return <ArrowDownLeft size={14} className="text-emerald-400" />;
                    if (entry.movement_type.toLowerCase().includes('out')) return <ArrowUpRight size={14} className="text-rose-400" />;
                    return <ArrowRightLeft size={14} className="text-blue-400" />;
                };
                return (
                    <div className="flex items-center gap-2">
                        {getIcon()}
                        <span className="font-medium text-slate-200">{entry.movement_type}</span>
                    </div>
                );
            }
        },
        {
            header: 'Quantity',
            accessor: (entry: LedgerEntry) => (
                <span className={`font-bold ${entry.quantity_change > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {entry.quantity_change > 0 ? '+' : ''}{entry.quantity_change}
                </span>
            )
        },
        {
            header: 'Location',
            accessor: (entry: LedgerEntry) => entry.location_name,
            className: 'text-slate-300'
        },
        {
            header: 'Reference',
            accessor: (entry: LedgerEntry) => entry.reference,
            className: 'text-slate-500 font-mono text-xs'
        },
        {
            header: 'Created By',
            accessor: (entry: LedgerEntry) => entry.created_by_name,
            className: 'text-slate-500 text-xs italic'
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <button
                onClick={() => navigate('..')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Items
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                {/* Section A: Item Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700 shadow-inner">
                                {item.type === 'Product' ? <Package size={32} className="text-blue-400" /> : <Layers size={32} className="text-purple-400" />}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-1">{item.name}</h1>
                                <span className="text-xs font-mono text-slate-500 tracking-widest">{item.sku}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Tag size={16} />
                                    <span className="text-sm">Type</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.type === 'Product' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                                    {item.type}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Box size={16} />
                                    <span className="text-sm">UoM</span>
                                </div>
                                <span className="text-white font-medium">{item.unit_of_measure}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <DollarSign size={16} />
                                    <span className="text-sm">Cost Price</span>
                                </div>
                                <span className="text-white font-medium">${item.cost_price.toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <TrendingUp size={16} className="text-emerald-500" />
                                    <span className="text-sm">Seling Price</span>
                                </div>
                                <span className="text-white font-medium">${item.selling_price.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <Box size={120} />
                        </div>
                        <span className="text-blue-100 text-xs font-bold uppercase tracking-wider">Current Global Stock</span>
                        <div className="text-4xl font-black mt-2 flex items-baseline gap-2">
                            {ledger.reduce((acc, curr) => acc + curr.quantity_change, 0)}
                            <span className="text-sm font-normal text-blue-200 uppercase">{item.unit_of_measure}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-blue-100 text-xs bg-blue-500/30 w-fit px-2 py-1 rounded-lg">
                            <Info size={14} />
                            <span>Aggregated from all locations</span>
                        </div>
                    </div>
                </div>

                {/* Section B: Stock Ledger */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <History size={20} className="text-blue-500" /> Stock Ledger
                        </h2>
                        <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                            Source of Truth • Append-only
                        </span>
                    </div>

                    <Table
                        data={ledger}
                        columns={columns}
                        emptyMessage="No movements recorded for this item."
                    />

                    <div className="mt-6 flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
                        <AlertCircle size={18} className="text-amber-500 shrink-0" />
                        <p className="text-xs text-amber-200/70 leading-relaxed">
                            The ledger is a strictly read-only record of all historical movements. Edits or deletions are not permitted to ensure audit-level traceability.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const TrendingUp = ({ className, size }: { className?: string, size: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
    </svg>
);

export default ItemDetailPage;

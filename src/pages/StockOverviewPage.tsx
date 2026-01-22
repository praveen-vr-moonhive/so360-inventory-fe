import React, { useState, useEffect } from 'react';
import { Search, Filter, Box, MapPin, Clock, AlertTriangle } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { StockLevel } from '../types/inventory';
import { Table } from '../components/common/Table';

const StockOverviewPage = () => {
    const [stockLevels, setStockLevels] = useState<StockLevel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('All');
    const [lowStockFilter, setLowStockFilter] = useState(false);

    const fetchStock = async () => {
        setIsLoading(true);
        try {
            const data = await inventoryService.getStockOverview();
            setStockLevels(data);
        } catch (error) {
            console.error('Failed to fetch stock levels', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStock();
    }, []);

    const filteredStock = stockLevels.filter(sl => {
        const matchesSearch =
            sl.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sl.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = locationFilter === 'All' || sl.location_name === locationFilter;
        // Low stock threshold fixed at 10 for MVP
        const matchesLowStock = !lowStockFilter || sl.available_quantity < 10;
        return matchesSearch && matchesLocation && matchesLowStock;
    });

    const uniqueLocations = Array.from(new Set(stockLevels.map(sl => sl.location_name)));

    const columns = [
        {
            header: 'Item',
            accessor: (sl: StockLevel) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center border border-slate-700">
                        <Box size={16} className="text-blue-400" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-white text-sm">{sl.item_name}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{sl.sku}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Location',
            accessor: (sl: StockLevel) => (
                <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin size={14} className="text-slate-500" />
                    <span>{sl.location_name}</span>
                </div>
            )
        },
        {
            header: 'Available Quantity',
            accessor: (sl: StockLevel) => (
                <div className="flex items-center gap-2">
                    <span className={`font-bold text-lg ${sl.available_quantity < 10 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {sl.available_quantity}
                    </span>
                    <span className="text-xs text-slate-500 uppercase">{sl.unit}</span>
                    {sl.available_quantity < 10 && (
                        <div className="group relative">
                            <AlertTriangle size={14} className="text-amber-500" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 border border-slate-700 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Low Stock Level
                            </div>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Last Updated',
            accessor: (sl: StockLevel) => (
                <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock size={12} />
                    <span>{new Date(sl.last_updated_at).toLocaleString()}</span>
                </div>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight">Stock Overview</h1>
                <p className="text-slate-400 mt-1">Real-time inventory levels across all locations</p>
            </header>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    <input
                        type="text"
                        placeholder="Filter by item or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-800 pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-200"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1">
                        <MapPin size={16} className="text-slate-500" />
                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="bg-transparent text-sm text-slate-300 focus:outline-none py-1.5 cursor-pointer"
                        >
                            <option value="All">All Locations</option>
                            {uniqueLocations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        onClick={() => setLowStockFilter(!lowStockFilter)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${lowStockFilter
                                ? 'bg-amber-500/10 border-amber-500/50 text-amber-400'
                                : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                    >
                        <AlertTriangle size={16} />
                        Low Stock Only
                    </button>
                </div>
            </div>

            <Table
                data={filteredStock}
                columns={columns}
                isLoading={isLoading}
                emptyMessage="No stock availability found for selected filters."
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Items</span>
                    <div className="text-2xl font-bold text-white mt-1">{stockLevels.length}</div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Low Stock Items</span>
                    <div className="text-2xl font-bold text-amber-400 mt-1">
                        {stockLevels.filter(sl => sl.available_quantity < 10).length}
                    </div>
                </div>
                <div className="bg-slate-900/40 border border-slate-800/50 p-6 rounded-2xl">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Stock Out Items</span>
                    <div className="text-2xl font-bold text-rose-400 mt-1">
                        {stockLevels.filter(sl => sl.available_quantity === 0).length}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StockOverviewPage;

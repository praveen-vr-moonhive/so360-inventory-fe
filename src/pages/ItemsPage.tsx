import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Package, Box, Tag, Layers, AlertCircle } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { Item, ItemType, ItemStatus } from '../types/inventory';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../hooks/useAuth';

const ItemsPage = () => {
    const navigate = useNavigate();
    const { can } = useAuth();
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<'All' | ItemType>('All');
    const [statusFilter, setStatusFilter] = useState<'All' | ItemStatus>('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form state for new item
    const [newItem, setNewItem] = useState({
        name: '',
        sku: '',
        type: 'Product' as ItemType,
        unit_of_measure: '',
        cost_price: 0,
        selling_price: 0,
        status: 'Active' as ItemStatus
    });

    const fetchItems = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await inventoryService.getItems();
            setItems(data);
        } catch (err) {
            setError('Failed to load items. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleCreateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inventoryService.createItem(newItem);
            setIsCreateModalOpen(false);
            fetchItems();
            // Reset form
            setNewItem({
                name: '',
                sku: '',
                type: 'Product',
                unit_of_measure: '',
                cost_price: 0,
                selling_price: 0,
                status: 'Active'
            });
        } catch (err: any) {
            setError(err.message || 'Failed to create item');
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || item.type === typeFilter;
        const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    const columns = [
        {
            header: 'Item & SKU',
            accessor: (item: Item) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                        {item.type === 'Product' ? (
                            <Package size={20} className="text-blue-400" />
                        ) : (
                            <Layers size={20} className="text-purple-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-white">{item.name}</span>
                        <span className="text-xs text-slate-500 font-mono tracking-wider">{item.sku}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Type',
            accessor: (item: Item) => (
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${item.type === 'Product'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                    {item.type}
                </span>
            )
        },
        {
            header: 'UoM',
            accessor: (item: Item) => <span className="text-slate-400">{item.unit_of_measure}</span>
        },
        {
            header: 'Cost Price',
            accessor: (item: Item) => <span className="text-slate-300">${item.cost_price.toLocaleString()}</span>
        },
        {
            header: 'Selling Price',
            accessor: (item: Item) => <span className="text-slate-300">${item.selling_price.toLocaleString()}</span>
        },
        {
            header: 'Status',
            accessor: (item: Item) => (
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold border ${item.status === 'Active'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                    }`}>
                    {item.status}
                </span>
            )
        }
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Items</h1>
                    <p className="text-slate-400 mt-1">Manage all products and service offerings</p>
                </div>
                {can('create_item') && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Plus size={20} />
                        Create Item
                    </button>
                )}
            </header>

            {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-300">Dismiss</button>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={18} />
                    <input
                        type="text"
                        placeholder="Search SKU or Item Name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-800 pl-12 pr-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-200"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1">
                        <Filter size={16} className="text-slate-500" />
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as any)}
                            className="bg-transparent text-sm text-slate-300 focus:outline-none py-1.5 cursor-pointer"
                        >
                            <option value="All">All Types</option>
                            <option value="Product">Products</option>
                            <option value="Service">Services</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-1">
                        <Filter size={16} className="text-slate-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-transparent text-sm text-slate-300 focus:outline-none py-1.5 cursor-pointer"
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            <Table
                data={filteredItems}
                columns={columns}
                isLoading={isLoading}
                onRowClick={(item) => navigate(item.id)}
                emptyMessage="No items found. Create your first item to start inventory."
            />

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Item"
            >
                <form onSubmit={handleCreateItem} className="space-y-4 text-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Item Name *</label>
                        <input
                            required
                            type="text"
                            value={newItem.name}
                            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            placeholder="e.g. MacBook Pro 14"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">SKU *</label>
                        <input
                            required
                            type="text"
                            value={newItem.sku}
                            onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            placeholder="e.g. LAP-001"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Type</label>
                            <select
                                value={newItem.type}
                                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as ItemType })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            >
                                <option value="Product">Product</option>
                                <option value="Service">Service</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">UoM *</label>
                            <input
                                required
                                type="text"
                                value={newItem.unit_of_measure}
                                onChange={(e) => setNewItem({ ...newItem, unit_of_measure: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder="e.g. Units, Hours"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Cost Price</label>
                            <input
                                type="number"
                                min="0"
                                value={newItem.cost_price}
                                onChange={(e) => setNewItem({ ...newItem, cost_price: parseFloat(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Selling Price</label>
                            <input
                                type="number"
                                min="0"
                                value={newItem.selling_price}
                                onChange={(e) => setNewItem({ ...newItem, selling_price: parseFloat(e.target.value) })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 rounded-lg transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 rounded-lg transition-all shadow-lg shadow-blue-900/20"
                        >
                            Create Item
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ItemsPage;

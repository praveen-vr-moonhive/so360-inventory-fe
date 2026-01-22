import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Home, Edit2, AlertCircle } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import { StockLocation } from '../types/inventory';
import { Modal } from '../components/common/Modal';
import { TableSkeleton } from '../components/common/Skeleton';
import { useAuth } from '../hooks/useAuth';

const StockLocationsPage = () => {
    const { can } = useAuth();
    const [locations, setLocations] = useState<StockLocation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [newLocation, setNewLocation] = useState({
        name: '',
        address: '',
        is_default: false
    });

    const fetchLocations = async () => {
        setIsLoading(true);
        try {
            const data = await inventoryService.getLocations();
            setLocations(data);
        } catch (err) {
            setError('Failed to load locations.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleCreateLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await inventoryService.createLocation(newLocation);
            setIsCreateModalOpen(false);
            fetchLocations();
            setNewLocation({ name: '', address: '', is_default: false });
        } catch (err: any) {
            setError(err.message || 'Failed to create location');
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Stock Locations</h1>
                    <p className="text-slate-400 mt-1">Define where your stock physically exists</p>
                </div>
                {can('manage_locations') && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Plus size={20} />
                        New Location
                    </button>
                )}
            </header>

            {error && (
                <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-lg flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {isLoading ? (
                <TableSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {locations.map((loc) => (
                        <div key={loc.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl border ${loc.is_default ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                    <MapPin size={24} />
                                </div>
                                {loc.is_default && (
                                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">
                                        <Home size={10} /> Default
                                    </span>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{loc.name}</h3>
                            <p className="text-slate-400 text-sm mb-6 flex-grow">{loc.address || 'No address provided'}</p>

                            <div className="flex items-center justify-end border-t border-slate-800 pt-4 mt-auto">
                                <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors">
                                    <Edit2 size={16} /> Edit Details
                                </button>
                            </div>
                        </div>
                    ))}


                    {can('manage_locations') && (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:border-slate-700 hover:text-slate-400 transition-all gap-3 h-full min-h-[200px]"
                        >
                            <div className="p-3 rounded-full bg-slate-800/50">
                                <Plus size={24} />
                            </div>
                            <span className="font-semibold">Add New Warehouse</span>
                        </button>
                    )}
                </div>
            )}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Manage Location"
            >
                <form onSubmit={handleCreateLocation} className="space-y-4 text-slate-200">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Location Name *</label>
                        <input
                            required
                            type="text"
                            value={newLocation.name}
                            onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                            placeholder="e.g. Main Warehouse"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1.5">Address</label>
                        <textarea
                            value={newLocation.address}
                            onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all h-24 resize-none"
                            placeholder="Full physical address..."
                        />
                    </div>

                    <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                        <input
                            type="checkbox"
                            id="default-toggle"
                            checked={newLocation.is_default}
                            onChange={(e) => setNewLocation({ ...newLocation, is_default: e.target.checked })}
                            className="w-4 h-4 rounded border-slate-700 text-blue-600 focus:ring-blue-500 bg-slate-900"
                        />
                        <label htmlFor="default-toggle" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                            Set as Default Location
                            <span className="block text-xs text-slate-500 font-normal">New items will be assigned here by default</span>
                        </label>
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
                            Save Location
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StockLocationsPage;

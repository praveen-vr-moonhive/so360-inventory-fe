import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, FileText, AlertCircle, Clock, CheckCircle,
    XCircle, Package, User, Calendar, Loader2, Truck, Building2
} from 'lucide-react';
import { procurementService } from '../../services/procurementService';
import { useInventoryFormatters } from '../../utils/formatters';

interface POLine {
    id: string;
    item_id: string;
    description: string;
    quantity: number;
    unit_price: number;
    received_quantity: number;
    items?: { name: string; sku: string };
}

interface PO {
    id: string;
    po_number: string;
    status: string;
    total_amount: number;
    created_at: string;
    expected_delivery_date?: string;
    pr_id?: string;
    vendor?: { id: string; name: string; contact_email?: string };
    po_lines: POLine[];
}

const PODetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const formatters = useInventoryFormatters();
    const [po, setPo] = useState<PO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchPO();
    }, [id]);

    const fetchPO = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await procurementService.getPODetail(id!);
            setPo(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load PO details');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'received': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'partially_received': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            case 'cancelled': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            default: return 'bg-slate-700/50 text-slate-400 border-slate-600';
        }
    };

    const totalAmount = po?.po_lines?.reduce((sum, line) =>
        sum + (line.quantity * line.unit_price), 0) || po?.total_amount || 0;

    const totalReceived = po?.po_lines?.reduce((sum, line) =>
        sum + (line.received_quantity || 0), 0) || 0;

    const totalOrdered = po?.po_lines?.reduce((sum, line) =>
        sum + line.quantity, 0) || 0;

    const receiveProgress = totalOrdered > 0 ? Math.round((totalReceived / totalOrdered) * 100) : 0;

    if (isLoading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !po) {
        return (
            <div className="p-8 text-center">
                <AlertCircle size={48} className="mx-auto text-rose-500 mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{error || 'PO not found'}</h2>
                <button onClick={() => navigate('/procurement/po')} className="text-blue-400 hover:underline">
                    Back to Purchase Orders
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <button
                onClick={() => navigate('/procurement/po')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Purchase Orders
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - PO Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                <FileText size={28} className="text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    #{po.po_number}
                                </h1>
                                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(po.status)}`}>
                                    {po.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {po.vendor && (
                                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
                                    <Building2 size={16} className="text-slate-500" />
                                    <div>
                                        <span className="text-xs text-slate-500 block">Vendor</span>
                                        <span className="text-sm text-white">{po.vendor.name}</span>
                                        {po.vendor.contact_email && (
                                            <span className="block text-xs text-slate-500">{po.vendor.contact_email}</span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {po.pr_id && (
                                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
                                    <FileText size={16} className="text-slate-500" />
                                    <div>
                                        <span className="text-xs text-slate-500 block">Source PR</span>
                                        <button
                                            onClick={() => navigate(`/procurement/pr/${po.pr_id}`)}
                                            className="text-sm text-blue-400 hover:text-blue-300"
                                        >
                                            #PR-{po.pr_id.slice(0, 8).toUpperCase()}
                                        </button>
                                    </div>
                                </div>
                            )}
                            {po.expected_delivery_date && (
                                <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
                                    <Truck size={16} className="text-slate-500" />
                                    <div>
                                        <span className="text-xs text-slate-500 block">Expected Delivery</span>
                                        <span className="text-sm text-white">
                                            {new Date(po.expected_delivery_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl">
                                <Clock size={16} className="text-slate-500" />
                                <div>
                                    <span className="text-xs text-slate-500 block">Created</span>
                                    <span className="text-sm text-white">
                                        {new Date(po.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Total */}
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white">
                        <span className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Order Total</span>
                        <div className="text-4xl font-black mt-2">
                            {formatters.formatCurrency(totalAmount)}
                        </div>
                        <p className="mt-2 text-sm text-indigo-200">
                            {po.po_lines?.length || 0} line items
                        </p>
                    </div>

                    {/* Receiving Progress */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-2">
                            <Package size={16} />
                            Receiving Progress
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Total Ordered</span>
                                <span className="text-white font-bold">{totalOrdered} units</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Received</span>
                                <span className="text-emerald-400 font-bold">{totalReceived} units</span>
                            </div>
                            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${receiveProgress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                    style={{ width: `${receiveProgress}%` }}
                                />
                            </div>
                            <div className="text-center text-xs text-slate-500">
                                {receiveProgress}% received
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Line Items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Line Items */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Package size={20} className="text-indigo-400" />
                            Order Lines
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">
                                        <th className="pb-3">Item</th>
                                        <th className="pb-3 text-center">Ordered</th>
                                        <th className="pb-3 text-center">Received</th>
                                        <th className="pb-3 text-right">Unit Price</th>
                                        <th className="pb-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {po.po_lines?.map((line) => {
                                        const isFullyReceived = line.received_quantity >= line.quantity;
                                        const isPartiallyReceived = line.received_quantity > 0 && line.received_quantity < line.quantity;

                                        return (
                                            <tr key={line.id} className="border-b border-slate-800/50">
                                                <td className="py-3">
                                                    <span className="text-white font-medium">{line.items?.name || line.description}</span>
                                                    {line.items?.sku && (
                                                        <span className="block text-xs text-slate-500 font-mono">{line.items.sku}</span>
                                                    )}
                                                </td>
                                                <td className="py-3 text-center text-slate-300">{line.quantity}</td>
                                                <td className="py-3 text-center">
                                                    <span className={`font-medium ${isFullyReceived ? 'text-emerald-400' : isPartiallyReceived ? 'text-amber-400' : 'text-slate-500'}`}>
                                                        {line.received_quantity || 0}
                                                    </span>
                                                    {isFullyReceived && (
                                                        <CheckCircle size={14} className="inline ml-1 text-emerald-400" />
                                                    )}
                                                </td>
                                                <td className="py-3 text-right text-slate-300">
                                                    {formatters.formatCurrency(line.unit_price)}
                                                </td>
                                                <td className="py-3 text-right font-bold text-white">
                                                    {formatters.formatCurrency(line.quantity * line.unit_price)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-slate-700">
                                        <td colSpan={4} className="py-4 text-right font-bold text-slate-400">
                                            Grand Total:
                                        </td>
                                        <td className="py-4 text-right font-black text-xl text-white">
                                            {formatters.formatCurrency(totalAmount)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            {po.status === 'sent' && (
                                <button
                                    onClick={() => navigate('/procurement/grn')}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                >
                                    <Package size={16} />
                                    Record GRN
                                </button>
                            )}
                            <button
                                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                            >
                                <FileText size={16} />
                                Print PO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PODetailPage;

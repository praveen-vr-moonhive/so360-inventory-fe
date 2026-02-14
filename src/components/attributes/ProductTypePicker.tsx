import React, { useState, useEffect } from 'react';
import { Cpu, Shirt, Armchair, Monitor, Tv, Smartphone, UtensilsCrossed, Car, Hammer, Paperclip, Package, LucideIcon } from 'lucide-react';
import { ProductType } from '../../types/productTypes';
import { productTypeService } from '../../services/productTypeService';

const ICON_MAP: Record<string, LucideIcon> = {
    Cpu, Shirt, Armchair, Monitor, Tv, Smartphone, UtensilsCrossed, Car, Hammer, Paperclip,
};

interface ProductTypePickerProps {
    value: string;
    onChange: (id: string) => void;
}

const ProductTypePicker: React.FC<ProductTypePickerProps> = ({ value, onChange }) => {
    const [types, setTypes] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTypes();
    }, []);

    const loadTypes = async () => {
        try {
            const data = await productTypeService.getAll();
            setTypes(data);
        } catch {
            // Silently fail — product types are optional
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-sm text-slate-500 animate-pulse">Loading product types...</div>;
    }

    if (types.length === 0) {
        return <p className="text-sm text-slate-500">No product types available. Create them in Settings.</p>;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* None option */}
            <button
                type="button"
                onClick={() => onChange('')}
                className={`
                    p-3 rounded-xl border text-left transition-all
                    ${!value
                        ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                    }
                `}
            >
                <div className="flex items-center gap-2 mb-1">
                    <Package size={16} className={!value ? 'text-blue-400' : 'text-slate-500'} />
                    <span className={`text-sm font-semibold ${!value ? 'text-blue-300' : 'text-slate-300'}`}>None</span>
                </div>
                <p className="text-xs text-slate-500 leading-tight">No product type</p>
            </button>

            {types.map(pt => {
                const Icon = (pt.icon && ICON_MAP[pt.icon]) || Package;
                const isSelected = value === pt.id;
                return (
                    <button
                        key={pt.id}
                        type="button"
                        onClick={() => onChange(pt.id)}
                        className={`
                            p-3 rounded-xl border text-left transition-all
                            ${isSelected
                                ? 'border-blue-500 bg-blue-500/10 ring-1 ring-blue-500/30'
                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800'
                            }
                        `}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Icon size={16} className={isSelected ? 'text-blue-400' : 'text-slate-500'} />
                            <span className={`text-sm font-semibold ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>{pt.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-tight line-clamp-2">{pt.description || pt.code}</p>
                        {pt.is_system && (
                            <span className="inline-block mt-1.5 text-[10px] text-slate-600 uppercase tracking-wider">System</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ProductTypePicker;

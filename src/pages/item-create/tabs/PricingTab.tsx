import React from 'react';
import FormSection from '../components/FormSection';

interface PricingTabProps {
    price: string;
    cost: string;
    tax_class: string;
    hsn_code: string;
    updateField: (field: string, value: any) => void;
    currencySymbol?: string;
}

const inputClass = 'w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600';
const labelClass = 'block text-sm font-medium text-slate-400 mb-1.5';

const PricingTab: React.FC<PricingTabProps> = ({ price, cost, tax_class, hsn_code, updateField, currencySymbol = '$' }) => {
    return (
        <div className="space-y-8">
            <FormSection title="Pricing">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Selling Price ({currencySymbol})</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={price}
                            onChange={e => updateField('price', e.target.value)}
                            className={inputClass}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Cost Price ({currencySymbol})</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={cost}
                            onChange={e => updateField('cost', e.target.value)}
                            className={inputClass}
                            placeholder="0.00"
                        />
                    </div>
                </div>
                {price && cost && parseFloat(price) > 0 && parseFloat(cost) > 0 && (
                    <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">Margin</span>
                            <span className="text-emerald-400 font-semibold">
                                {(((parseFloat(price) - parseFloat(cost)) / parseFloat(price)) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                )}
            </FormSection>

            <FormSection title="Tax Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>Tax Class</label>
                        <input
                            type="text"
                            value={tax_class}
                            onChange={e => updateField('tax_class', e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Standard, Reduced, Zero-rated"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>HSN / SAC Code</label>
                        <input
                            type="text"
                            value={hsn_code}
                            onChange={e => updateField('hsn_code', e.target.value)}
                            className={inputClass}
                            placeholder="e.g. 8471"
                        />
                    </div>
                </div>
            </FormSection>
        </div>
    );
};

export default PricingTab;

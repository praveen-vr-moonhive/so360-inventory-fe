import React from 'react';
import FormSection from '../components/FormSection';
import CategoryPicker from '../../../components/categories/CategoryPicker';
import { ItemCategory } from '../../../types/inventory';

interface CategoryTabProps {
    category_id: string;
    categories: ItemCategory[];
    updateField: (field: string, value: any) => void;
    onQuickAddCategory: (name: string) => Promise<void>;
}

const CategoryTab: React.FC<CategoryTabProps> = ({
    category_id, categories, updateField, onQuickAddCategory,
}) => {
    return (
        <div className="space-y-6">
            <FormSection title="Item Category" description="Assign this item to a category for organization and filtering. Categories support hierarchy.">
                <CategoryPicker
                    categories={categories}
                    value={category_id}
                    onChange={(id) => updateField('category_id', id)}
                    onQuickAdd={onQuickAddCategory}
                />

                {category_id && (
                    <div className="mt-4 p-3 bg-slate-800/30 border border-slate-700/50 rounded-lg">
                        <p className="text-xs text-slate-500">
                            Selected: <span className="text-slate-300 font-medium">{categories.find(c => c.id === category_id)?.name || 'Unknown'}</span>
                        </p>
                    </div>
                )}
            </FormSection>
        </div>
    );
};

export default CategoryTab;

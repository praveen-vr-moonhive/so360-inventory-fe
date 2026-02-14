import React from 'react';

interface FormSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ title, description, children }) => {
    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{title}</h3>
                {description && (
                    <p className="text-xs text-slate-500 mt-1">{description}</p>
                )}
            </div>
            {children}
        </div>
    );
};

export default FormSection;

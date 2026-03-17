export type AttributeFieldType = 'text' | 'number' | 'select' | 'boolean' | 'date' | 'textarea';

export interface ProductTypeAttribute {
    id: string;
    product_type_id: string;
    field_name: string;
    label: string;
    field_type: AttributeFieldType;
    options?: string[];
    default_value?: string;
    is_required: boolean;
    sort_order: number;
    unit?: string;
    placeholder?: string;
    validation?: Record<string, any>;
}

export interface ProductType {
    id: string;
    org_id?: string;
    name: string;
    code: string;
    description?: string;
    icon?: string;
    is_system: boolean;
    is_active: boolean;
    created_at: string;
    product_type_attributes?: ProductTypeAttribute[];
}

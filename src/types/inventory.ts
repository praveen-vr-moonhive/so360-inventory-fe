export interface User {
    id: string;
    full_name: string;
    avatar_url?: string;
    email: string;
    role?: 'Inventory Admin' | 'Inventory User' | 'View Only';
}

export type ItemType = 'Product' | 'Service';
export type ItemStatus = 'Active' | 'Inactive';

export interface Item {
    id: string;
    sku: string;
    name: string;
    type: ItemType;
    unit_of_measure: string;
    cost_price: number;
    selling_price: number;
    status: ItemStatus;
    created_at: string;
}

export interface StockLocation {
    id: string;
    name: string;
    address?: string;
    is_default: boolean;
}

export interface StockLevel {
    id: string;
    item_id: string;
    item_name: string;
    sku: string;
    location_id: string;
    location_name: string;
    available_quantity: number;
    unit: string;
    last_updated_at: string;
}

export type AdjustmentType = 'Increase' | 'Decrease';

export interface StockAdjustment {
    id: string;
    item_id: string;
    item_name: string;
    location_id: string;
    location_name: string;
    type: AdjustmentType;
    quantity: number;
    reason: string;
    date: string;
    created_by_name: string;
}

export type TransferStatus = 'Draft' | 'Completed';

export interface StockTransfer {
    id: string;
    from_location_id: string;
    from_location_name: string;
    to_location_id: string;
    to_location_name: string;
    item_id: string;
    item_name: string;
    quantity: number;
    status: TransferStatus;
    date: string;
    created_by_name: string;
}

export interface LedgerEntry {
    id: string;
    date: string;
    movement_type: string;
    quantity_change: number; // Positive for increase, negative for decrease
    location_name: string;
    reference: string;
    created_by_name: string;
}

export interface InventorySettings {
    uoms: string[];
    categories: string[];
}

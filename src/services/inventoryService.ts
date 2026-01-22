import {
    Item,
    StockLocation,
    StockLevel,
    StockAdjustment,
    StockTransfer,
    LedgerEntry,
    User
} from '../types/inventory';

const MOCK_USER: User = {
    id: 'u1',
    full_name: 'Inventory Manager',
    email: 'inventory@so360.com',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Inventory',
    role: 'Inventory Admin'
};

const MOCK_ITEMS: Item[] = [
    {
        id: 'p1',
        sku: 'LAP-001',
        name: 'MacBook Pro 14"',
        type: 'Product',
        unit_of_measure: 'Units',
        cost_price: 1800,
        selling_price: 2200,
        status: 'Active',
        created_at: '2024-01-15T10:00:00Z'
    },
    {
        id: 'p2',
        sku: 'SRV-001',
        name: 'On-site Installation',
        type: 'Service',
        unit_of_measure: 'Hours',
        cost_price: 50,
        selling_price: 150,
        status: 'Active',
        created_at: '2024-01-18T14:30:00Z'
    },
    {
        id: 'p3',
        sku: 'MON-042',
        name: 'Dell UltraSharp 27"',
        type: 'Product',
        unit_of_measure: 'Units',
        cost_price: 450,
        selling_price: 600,
        status: 'Active',
        created_at: '2024-01-20T09:00:00Z'
    }
];

const MOCK_LOCATIONS: StockLocation[] = [
    { id: 'w1', name: 'Main Warehouse', address: 'Dubai South, Logistics District', is_default: true },
    { id: 'w2', name: 'Express Hub', address: 'Dubai Marina, Retail Zone', is_default: false }
];

const MOCK_STOCK_LEVELS: StockLevel[] = [
    {
        id: 'sl1',
        item_id: 'p1',
        item_name: 'MacBook Pro 14"',
        sku: 'LAP-001',
        location_id: 'w1',
        location_name: 'Main Warehouse',
        available_quantity: 25,
        unit: 'Units',
        last_updated_at: '2024-01-21T08:00:00Z'
    },
    {
        id: 'sl2',
        item_id: 'p1',
        item_name: 'MacBook Pro 14"',
        sku: 'LAP-001',
        location_id: 'w2',
        location_name: 'Express Hub',
        available_quantity: 5,
        unit: 'Units',
        last_updated_at: '2024-01-21T09:30:00Z'
    },
    {
        id: 'sl3',
        item_id: 'p3',
        item_name: 'Dell UltraSharp 27"',
        sku: 'MON-042',
        location_id: 'w1',
        location_name: 'Main Warehouse',
        available_quantity: 3,
        unit: 'Units',
        last_updated_at: '2024-01-21T10:00:00Z'
    }
];

const MOCK_ADJUSTMENTS: StockAdjustment[] = [
    {
        id: 'adj1',
        item_id: 'p1',
        item_name: 'MacBook Pro 14"',
        location_id: 'w1',
        location_name: 'Main Warehouse',
        type: 'Decrease',
        quantity: 2,
        reason: 'Damaged during transit',
        date: '2024-01-19T11:00:00Z',
        created_by_name: 'Sarah Storekeeper'
    }
];

const MOCK_TRANSFERS: StockTransfer[] = [
    {
        id: 'tr1',
        from_location_id: 'w1',
        from_location_name: 'Main Warehouse',
        to_location_id: 'w2',
        to_location_name: 'Express Hub',
        item_id: 'p1',
        item_name: 'MacBook Pro 14"',
        quantity: 10,
        status: 'Completed',
        date: '2024-01-20T14:00:00Z',
        created_by_name: 'Inventory Manager'
    }
];

const MOCK_LEDGER: Record<string, LedgerEntry[]> = {
    'p1': [
        {
            id: 'l1',
            date: '2024-01-15T10:00:00Z',
            movement_type: 'Initial Stock',
            quantity_change: 40,
            location_name: 'Main Warehouse',
            reference: 'PO-001',
            created_by_name: 'System'
        },
        {
            id: 'l2',
            date: '2024-01-20T14:00:00Z',
            movement_type: 'Transfer Out',
            quantity_change: -10,
            location_name: 'Main Warehouse',
            reference: 'TR-101',
            created_by_name: 'Inventory Manager'
        },
        {
            id: 'l3',
            date: '2024-01-20T14:00:00Z',
            movement_type: 'Transfer In',
            quantity_change: 10,
            location_name: 'Express Hub',
            reference: 'TR-101',
            created_by_name: 'Inventory Manager'
        }
    ]
};

export const inventoryService = {
    // Items
    getItems: async (): Promise<Item[]> => {
        await new Promise(r => setTimeout(r, 600));
        return MOCK_ITEMS;
    },
    getItemById: async (id: string): Promise<Item | undefined> => {
        await new Promise(r => setTimeout(r, 400));
        return MOCK_ITEMS.find(i => i.id === id);
    },
    createItem: async (item: Partial<Item>): Promise<Item> => {
        await new Promise(r => setTimeout(r, 800));
        return { ...item, id: `p${Date.now()}`, created_at: new Date().toISOString() } as Item;
    },

    // Locations
    getLocations: async (): Promise<StockLocation[]> => {
        await new Promise(r => setTimeout(r, 500));
        return MOCK_LOCATIONS;
    },
    createLocation: async (location: Partial<StockLocation>): Promise<StockLocation> => {
        await new Promise(r => setTimeout(r, 700));
        return { ...location, id: `w${Date.now()}` } as StockLocation;
    },

    // Stock Overview
    getStockOverview: async (): Promise<StockLevel[]> => {
        await new Promise(r => setTimeout(r, 700));
        return MOCK_STOCK_LEVELS;
    },

    // Adjustments
    getAdjustments: async (): Promise<StockAdjustment[]> => {
        await new Promise(r => setTimeout(r, 600));
        return MOCK_ADJUSTMENTS;
    },
    createAdjustment: async (adjustment: Partial<StockAdjustment>): Promise<StockAdjustment> => {
        await new Promise(r => setTimeout(r, 1000));
        return { ...adjustment, id: `adj${Date.now()}`, created_by_name: MOCK_USER.full_name } as StockAdjustment;
    },

    // Transfers
    getTransfers: async (): Promise<StockTransfer[]> => {
        await new Promise(r => setTimeout(r, 600));
        return MOCK_TRANSFERS;
    },
    createTransfer: async (transfer: Partial<StockTransfer>): Promise<StockTransfer> => {
        await new Promise(r => setTimeout(r, 1000));
        return { ...transfer, id: `tr${Date.now()}`, created_by_name: MOCK_USER.full_name, date: new Date().toISOString() } as StockTransfer;
    },

    // Ledger
    getLedger: async (itemId: string): Promise<LedgerEntry[]> => {
        await new Promise(r => setTimeout(r, 500));
        return MOCK_LEDGER[itemId] || [];
    }
};

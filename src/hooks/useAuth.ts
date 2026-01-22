import { useState, useEffect } from 'react';

export type Role = 'Inventory Admin' | 'Inventory User' | 'View Only';

export interface AuthContext {
    user: {
        id: string;
        name: string;
        role: Role;
    };
    tenant_id: string;
    org_id: string;
}

export const useAuth = () => {
    // In a real MFE, this would come from the Shell Context
    // For standalone MVP, we mock it
    const [auth] = useState<AuthContext>({
        user: {
            id: 'u1',
            name: 'Inventory Manager',
            role: 'Inventory Admin' // Change this to test different roles
        },
        tenant_id: 't1',
        org_id: 'o1'
    });

    const can = (action: string) => {
        if (auth.user.role === 'Inventory Admin') return true;

        switch (action) {
            case 'view_stock':
            case 'view_items':
                return true;
            case 'create_transfer':
                return auth.user.role === 'Inventory User';
            case 'create_item':
            case 'manage_locations':
            case 'create_adjustment':
                return false; // Only admin
            default:
                return false;
        }
    };

    return { ...auth, can };
};

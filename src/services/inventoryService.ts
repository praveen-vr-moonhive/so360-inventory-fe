class InventoryService {
    private orgId: string | null = null;
    private tenantId: string | null = null;
    private accessToken: string | null = null;
    private inventoryOrigin: string;
    private coreOrigin: string;
    private baseUrl: string;

    constructor() {
        const win = typeof window !== 'undefined' ? (window as any) : undefined;
        const env = (import.meta as any)?.env || {};

        const invOrigin =
            (win && win.VITE_SO360_INVENTORY_API) ||
            env.VITE_SO360_INVENTORY_API ||
            env.VITE_API_BASE_URL ||
            'http://localhost:3006';

        const coreOrigin =
            (win && win.VITE_SO360_CORE_API) ||
            env.VITE_SO360_CORE_API ||
            env.VITE_API_BASE_URL ||
            'http://localhost:3000';

        this.inventoryOrigin = String(invOrigin).replace(/\/$/, '');
        this.coreOrigin = String(coreOrigin).replace(/\/$/, '');
        this.baseUrl = `${this.inventoryOrigin}/v1/inventory`;
    }

    setOrgId(id: string) {
        this.orgId = id;
    }

    setTenantId(id: string) {
        this.tenantId = id;
    }

    setAccessToken(token: string) {
        this.accessToken = token;
    }

    getOrgId() {
        return this.orgId;
    }

    public async request(endpoint: string, options: RequestInit = {}) {
        if (!this.orgId) throw new Error('OrgId not set');

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`,
            'X-Tenant-Id': this.tenantId || '',
            'X-Org-Id': this.orgId || '',
            ...options.headers,
        };

        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || 'API Request failed');
        }

        return response.json();
    }

    // Items
    async getItems(params?: {
        search?: string;
        categoryId?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }) {
        const query = new URLSearchParams();
        if (params?.search) query.append('search', params.search);
        if (params?.categoryId) query.append('category_id', params.categoryId);
        if (params?.sortBy) query.append('sort_by', params.sortBy);
        if (params?.sortOrder) query.append('sort_order', params.sortOrder);
        if (params?.page) query.append('page', params.page.toString());
        if (params?.limit) query.append('limit', params.limit.toString());
        const queryStr = query.toString();
        return this.request(`/items/${this.orgId}${queryStr ? `?${queryStr}` : ''}`);
    }

    async getItemsLegacy() {
        // Legacy method for backward compatibility - returns all items
        const result = await this.getItems({ limit: 10000 });
        return result.data || result; // Handle both old and new response format
    }

    async getItem(id: string) {
        return this.request(`/items/detail/${id}`);
    }

    async createItem(dto: any) {
        return this.request('/items', {
            method: 'POST',
            body: JSON.stringify({ ...dto, org_id: this.orgId }),
        });
    }

    async updateItem(id: string, dto: any) {
        return this.request(`/items/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dto),
        });
    }

    async deleteItem(id: string) {
        return this.request(`/items/${id}`, {
            method: 'DELETE',
        });
    }

    // Warehouses/Locations
    async getLocations() {
        return this.request(`/warehouses/${this.orgId}`);
    }

    async getWarehouse(id: string) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses/detail/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            }
        });
        if (!response.ok) throw new Error('Failed to load warehouse');
        return response.json();
    }

    async createWarehouse(dto: any) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create warehouse' }));
            throw new Error(error.message);
        }
        return response.json();
    }

    async updateWarehouse(id: string, dto: any) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            },
            body: JSON.stringify(dto),
        });
        if (!response.ok) throw new Error('Failed to update warehouse');
        return response.json();
    }

    async deleteWarehouse(id: string) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to delete warehouse' }));
            throw new Error(error.message);
        }
        return response.json();
    }

    // Storage Locations
    async createLocation(warehouseId: string, dto: { name: string; code: string }) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses/${warehouseId}/locations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to create location' }));
            throw new Error(error.message);
        }
        return response.json();
    }

    async updateLocation(locationId: string, dto: { name?: string; code?: string; is_active?: boolean }) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses/locations/${locationId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            },
            body: JSON.stringify(dto),
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to update location' }));
            throw new Error(error.message);
        }
        return response.json();
    }

    async deleteLocation(locationId: string) {
        const response = await fetch(`${this.inventoryOrigin}/v1/warehouses/locations/${locationId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            },
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Failed to delete location' }));
            throw new Error(error.message);
        }
        return response.json();
    }

    // Stock Overview
    async getStockOverview() {
        return this.request(`/stock-overview/${this.orgId}`);
    }

    // Adjustments
    async createAdjustment(dto: any) {
        return this.request('/adjust', {
            method: 'POST',
            body: JSON.stringify({ ...dto, org_id: this.orgId }),
        });
    }

    // Transfers
    async createTransfer(dto: any) {
        return this.request('/transfer', {
            method: 'POST',
            body: JSON.stringify({ ...dto, org_id: this.orgId }),
        });
    }

    // Ledger
    async getLedger(itemId: string) {
        return this.request(`/movements/${this.orgId}/${itemId}`);
    }

    // Simple getItems for Master Catalog (if separate)
    async getCatalogItems() {
        const response = await fetch(`${this.coreOrigin}/v1/products/${this.orgId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            }
        });
        return response.json();
    }

    // ==================== Business Settings (Core Backend) ====================

    async getBusinessSettings() {
        if (!this.orgId) throw new Error('OrgId not set');
        const response = await fetch(`${this.coreOrigin}/v1/business-settings/${this.orgId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'X-Tenant-Id': this.tenantId || '',
                'X-Org-Id': this.orgId || '',
            },
        });
        if (!response.ok) throw new Error('Failed to fetch business settings');
        return response.json();
    }

    // ==================== Settings ====================

    async getSettings() {
        return this.request(`/settings/${this.orgId}`);
    }

    async createUom(name: string, abbreviation: string) {
        return this.request(`/settings/${this.orgId}/uoms`, {
            method: 'POST',
            body: JSON.stringify({ name, abbreviation }),
        });
    }

    async deleteUom(id: string) {
        return this.request(`/settings/${this.orgId}/uoms/${id}`, {
            method: 'DELETE',
        });
    }

    async createCategory(name: string, description?: string, parentId?: string) {
        const body: Record<string, any> = { name };
        if (description) body.description = description;
        if (parentId) body.parent_id = parentId;
        return this.request(`/settings/${this.orgId}/categories`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    async updateCategory(id: string, data: { name?: string; description?: string; parent_id?: string | null }) {
        return this.request(`/settings/${this.orgId}/categories/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteCategory(id: string) {
        return this.request(`/settings/${this.orgId}/categories/${id}`, {
            method: 'DELETE',
        });
    }

    // ==================== Movement History ====================

    async getAdjustmentHistory(itemId?: string) {
        const query = itemId ? `?item_id=${itemId}` : '';
        return this.request(`/adjustments/${this.orgId}${query}`);
    }

    async getTransferHistory(itemId?: string) {
        const query = itemId ? `?item_id=${itemId}` : '';
        return this.request(`/transfers/${this.orgId}${query}`);
    }

    // ==================== Product Lifecycle ====================

    async getOnlineProducts() {
        return this.request(`/items/${this.orgId}/online`);
    }

    async transitionLifecycle(itemId: string, transitionCode: string, comment?: string) {
        return this.request(`/items/${itemId}/lifecycle/transition`, {
            method: 'POST',
            body: JSON.stringify({ transition_code: transitionCode, comment }),
        });
    }

    async getLifecycleGates(itemId: string) {
        return this.request(`/items/${itemId}/lifecycle/gates`);
    }
}

export const inventoryService = new InventoryService();

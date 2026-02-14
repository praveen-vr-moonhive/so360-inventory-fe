import { inventoryService } from './inventoryService';

class VendorService {
    private baseUrl = '/v1/vendors';
    private userId: string | null = null;

    setUserId(id: string) {
        this.userId = id;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const orgId = inventoryService.getOrgId();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(inventoryService as any).accessToken}`,
                'x-org-id': orgId || '',
                'x-user-id': this.userId || '',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || 'API Request failed');
        }

        return response.json();
    }

    async getVendors() {
        return this.request(`/${inventoryService.getOrgId()}`);
    }

    async createVendor(dto: any) {
        return this.request('', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    }

    async getVendorDetail(id: string) {
        return this.request(`/detail/${id}`);
    }

    async updateVendor(id: string, dto: any) {
        return this.request(`/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(dto),
        });
    }

    async deleteVendor(id: string) {
        return this.request(`/${id}`, {
            method: 'DELETE',
        });
    }

    async getContracts() {
        return this.request(`/contracts/${inventoryService.getOrgId()}`);
    }

    async createContract(dto: any) {
        return this.request('/contracts', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    }

    async rateVendor(vendorId: string, rating: number) {
        return this.request(`/${vendorId}/rate`, {
            method: 'POST',
            body: JSON.stringify({ rating }),
        });
    }

    async getVendorRating(vendorId: string) {
        return this.request(`/${vendorId}/rating`);
    }
}

export const vendorService = new VendorService();

import { inventoryService } from './inventoryService';

class ProcurementService {
    private baseUrl = '/v1/procurement';

    private async request(endpoint: string, options: RequestInit = {}) {
        const orgId = inventoryService.getOrgId();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(inventoryService as any).accessToken}`,
                'X-Tenant-Id': (inventoryService as any).tenantId || '',
                'X-Org-Id': orgId || '',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'API Request failed' }));
            throw new Error(error.message || 'API Request failed');
        }

        return response.json();
    }

    // Purchase Requisitions
    async getPRs() {
        return this.request(`/pr/${inventoryService.getOrgId()}`);
    }

    async createPR(dto: any) {
        return this.request('/pr', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    }

    async getPRDetail(id: string) {
        return this.request(`/pr/detail/${id}`);
    }

    async approvePR(id: string, approvalDto: any) {
        return this.request(`/pr/${id}/approve`, {
            method: 'PATCH',
            body: JSON.stringify(approvalDto),
        });
    }

    async getConversionPayload(prId: string) {
        return this.request(`/pr/${prId}/convert-to-po`, { method: 'POST' });
    }

    async closePR(prId: string) {
        return this.request(`/pr/${prId}/close`, { method: 'PATCH' });
    }

    async deletePR(prId: string) {
        return this.request(`/pr/${prId}`, { method: 'DELETE' });
    }

    // Purchase Orders
    async getPOs() {
        return this.request(`/po/${inventoryService.getOrgId()}`);
    }

    async createPO(dto: any) {
        return this.request('/po', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    }

    async getPODetail(id: string) {
        return this.request(`/po/detail/${id}`);
    }

    // Goods Receipt
    async createGRN(dto: any) {
        return this.request('/grn', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    }

    async getGRNs() {
        return this.request(`/grn/${inventoryService.getOrgId()}`);
    }

    async getGRNDetail(id: string) {
        return this.request(`/grn/${id}`);
    }

    // Vendor Invoices
    async createVendorInvoice(dto: {
        vendor_id: string;
        invoice_number: string;
        invoice_date: string;
        due_date?: string;
        total_amount: number;
        po_id?: string;
        attachment_url?: string;
    }) {
        return this.request('/vendor-invoice', {
            method: 'POST',
            body: JSON.stringify(dto),
        });
    }

    // Analytics
    async getAnalytics() {
        return this.request(`/analytics/${inventoryService.getOrgId()}`);
    }
}

export const procurementService = new ProcurementService();

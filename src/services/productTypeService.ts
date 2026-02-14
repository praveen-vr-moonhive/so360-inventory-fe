import { inventoryService } from './inventoryService';

class ProductTypeService {
    private get orgId() {
        return inventoryService.getOrgId();
    }

    private get baseUrl() {
        return `/v1/inventory/product-types`;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        // Reuse the inventoryService's request infrastructure
        return inventoryService.request(`/product-types${endpoint}`, options);
    }

    async getAll() {
        return this.request(`/${this.orgId}`);
    }

    async getOne(id: string) {
        return this.request(`/${this.orgId}/${id}`);
    }

    async create(data: { name: string; code: string; description?: string; icon?: string }) {
        return this.request(`/${this.orgId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async update(id: string, data: Partial<{ name: string; code: string; description: string; icon: string; is_active: boolean }>) {
        return this.request(`/${this.orgId}/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete(id: string) {
        return this.request(`/${this.orgId}/${id}`, {
            method: 'DELETE',
        });
    }

    async addAttribute(typeId: string, data: any) {
        return this.request(`/${this.orgId}/${typeId}/attributes`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateAttribute(typeId: string, attrId: string, data: any) {
        return this.request(`/${this.orgId}/${typeId}/attributes/${attrId}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async deleteAttribute(typeId: string, attrId: string) {
        return this.request(`/${this.orgId}/${typeId}/attributes/${attrId}`, {
            method: 'DELETE',
        });
    }
}

export const productTypeService = new ProductTypeService();

/**
 * Formatting utilities for the Inventory MFE.
 *
 * Currency, date, and number formatters use the shared @so360/formatters package
 * with dynamic currency, locale, and timezone from org business settings.
 */

import { useBusinessSettings } from '@so360/shell-context';
import { useFormatters as useFormattersBase } from '@so360/formatters';

/**
 * React hook that returns formatters bound to organization's business settings.
 * Usage:
 *   const formatters = useInventoryFormatters();
 *   <span>{formatters.formatCurrency(item.price)}</span>
 */
export function useInventoryFormatters() {
    const { settings } = useBusinessSettings();

    return useFormattersBase({
        currency: settings?.base_currency || 'USD',
        locale: settings?.document_language || 'en-US',
        timezone: settings?.timezone || 'UTC',
    });
}

/**
 * React hook that returns only the currency symbol for the org's base currency.
 * Usage:
 *   const currencySymbol = useInventoryCurrencySymbol();
 *   <label>Selling Price ({currencySymbol})</label>
 */
export function useInventoryCurrencySymbol(): string {
    const { settings } = useBusinessSettings();
    if (!settings?.base_currency) return '$';
    try {
        return new Intl.NumberFormat('en', { style: 'currency', currency: settings.base_currency })
            .formatToParts(0)
            .find(p => p.type === 'currency')?.value || settings.base_currency;
    } catch {
        return settings.base_currency;
    }
}

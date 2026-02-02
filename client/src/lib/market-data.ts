import { WasteListing, WasteCategory } from './types';

export interface PriceDataPoint {
    date: string;
    price: number;
}

export interface CategoryMarketData {
    category: WasteCategory;
    currentPrice: number;
    priceHistory: PriceDataPoint[];
    trend: number; // Percentage change from previous period
    volume: number; // Total kg available
}

/**
 * Calculate average price per kg for a specific waste category from listings
 */
export function calculateCategoryPrice(listings: WasteListing[], category: WasteCategory): number {
    const categoryListings = listings.filter(
        l => l.category === category && l.status === 'approved' && l.pricePerKg
    );

    if (categoryListings.length === 0) return 0;

    const totalPrice = categoryListings.reduce((sum, listing) => {
        return sum + (listing.pricePerKg || 0);
    }, 0);

    return Math.round((totalPrice / categoryListings.length) * 100) / 100;
}

/**
 * Generate simulated historical price data based on current price
 * In production, this would fetch from a time-series database
 */
export function generatePriceHistory(currentPrice: number, days: number = 14): PriceDataPoint[] {
    const history: PriceDataPoint[] = [];
    const today = new Date();

    // Generate realistic price fluctuations (±5-15% variance)
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        // Create some variance but trend toward current price
        const variance = (Math.random() - 0.5) * 0.15; // ±7.5%
        const trendFactor = (days - i) / days; // Gradually approach current price
        const historicalPrice = currentPrice * (1 + variance * (1 - trendFactor * 0.5));

        history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(historicalPrice * 100) / 100
        });
    }

    return history;
}

/**
 * Calculate trend percentage (change from previous period)
 */
export function calculateTrend(priceHistory: PriceDataPoint[]): number {
    if (priceHistory.length < 2) return 0;

    const current = priceHistory[priceHistory.length - 1].price;
    const previous = priceHistory[priceHistory.length - 2].price;

    if (previous === 0) return 0;

    const change = ((current - previous) / previous) * 100;
    return Math.round(change * 10) / 10; // Round to 1 decimal
}

/**
 * Calculate total volume (kg) available for a category
 */
export function calculateCategoryVolume(listings: WasteListing[], category: WasteCategory): number {
    const categoryListings = listings.filter(
        l => l.category === category && l.status === 'approved'
    );

    return categoryListings.reduce((sum, listing) => {
        let qty = listing.quantity;
        if (listing.unit === 'ton') qty *= 1000;
        return sum + qty;
    }, 0);
}

/**
 * Get market data for all major categories
 */
export function getMarketData(listings: WasteListing[]): CategoryMarketData[] {
    const categories: WasteCategory[] = [
        WasteCategory.PLASTIC,
        WasteCategory.METAL,
        WasteCategory.PAPER,
        WasteCategory.GLASS,
        WasteCategory.E_WASTE
    ];

    return categories.map(category => {
        const currentPrice = calculateCategoryPrice(listings, category);
        const priceHistory = generatePriceHistory(currentPrice, 14);
        const trend = calculateTrend(priceHistory);
        const volume = calculateCategoryVolume(listings, category);

        return {
            category,
            currentPrice,
            priceHistory,
            trend,
            volume
        };
    });
}

/**
 * Get display name for category
 */
export function getCategoryDisplayName(category: WasteCategory): string {
    const names: Record<WasteCategory, string> = {
        [WasteCategory.PLASTIC]: 'Plastic',
        [WasteCategory.METAL]: 'Metal',
        [WasteCategory.PAPER]: 'Paper',
        [WasteCategory.GLASS]: 'Glass',
        [WasteCategory.E_WASTE]: 'E-Waste',
        [WasteCategory.CHEMICAL]: 'Chemical',
        [WasteCategory.ORGANIC]: 'Organic',
        [WasteCategory.OTHER]: 'Other'
    };
    return names[category];
}

/**
 * Get icon/emoji for category
 */
export function getCategoryIcon(category: WasteCategory): string {
    const icons: Record<WasteCategory, string> = {
        [WasteCategory.PLASTIC]: '♻️',
        [WasteCategory.METAL]: '🔩',
        [WasteCategory.PAPER]: '📄',
        [WasteCategory.GLASS]: '🥃',
        [WasteCategory.E_WASTE]: '💻',
        [WasteCategory.CHEMICAL]: '🧪',
        [WasteCategory.ORGANIC]: '🌱',
        [WasteCategory.OTHER]: '📦'
    };
    return icons[category];
}

'use client';

import { CategoryMarketData, getCategoryDisplayName, getCategoryIcon } from '@/lib/market-data';
import PriceChart from './PriceChart';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CategoryPriceCardProps {
    data: CategoryMarketData;
}

export default function CategoryPriceCard({ data }: CategoryPriceCardProps) {
    const { category, currentPrice, priceHistory, trend, volume } = data;
    const displayName = getCategoryDisplayName(category);
    const icon = getCategoryIcon(category);

    // Determine trend direction and color
    const isPositive = trend > 0;
    const isNegative = trend < 0;
    const trendColor = isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500';
    const trendBgColor = isPositive ? 'bg-green-50' : isNegative ? 'bg-red-50' : 'bg-gray-50';
    const chartColor = isPositive ? '#10b981' : isNegative ? '#ef4444' : '#6b7280';

    const TrendIcon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus;

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="text-3xl">{icon}</div>
                    <div>
                        <h3 className="font-bold text-gray-900">{displayName}</h3>
                        <p className="text-xs text-gray-500">Estimated Market Price</p>
                    </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${trendBgColor}`}>
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <span className={`text-sm font-semibold ${trendColor}`}>
                        {Math.abs(trend).toFixed(1)}%
                    </span>
                </div>
            </div>

            {/* Current Price */}
            <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">
                    ₹{currentPrice.toFixed(2)}
                    <span className="text-lg text-gray-500 font-normal">/kg</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {volume > 0 ? `${volume.toLocaleString()} kg available` : 'No listings available'}
                </p>
            </div>

            {/* Price Chart */}
            <div className="mt-4">
                <PriceChart data={priceHistory} color={chartColor} height={100} />
            </div>

            {/* Footer Info */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                    Based on {priceHistory.length} days of market data
                </p>
            </div>
        </div>
    );
}

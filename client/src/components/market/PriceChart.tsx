'use client';

import { PriceDataPoint } from '@/lib/market-data';

interface PriceChartProps {
    data: PriceDataPoint[];
    color?: string;
    height?: number;
}

export default function PriceChart({ data, color = '#10b981', height = 120 }: PriceChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                No data available
            </div>
        );
    }

    const width = 100; // Percentage
    const padding = 10;

    // Find min and max prices for scaling
    const prices = data.map(d => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

    // Generate SVG path points
    const points = data.map((point, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = ((maxPrice - point.price) / priceRange) * (height - padding * 2) + padding;
        return `${x},${y}`;
    });

    const pathData = `M ${points.join(' L ')}`;

    // Create area fill path
    const areaPath = `${pathData} L 100,${height} L 0,${height} Z`;

    return (
        <div className="w-full" style={{ height: `${height}px` }}>
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 100 ${height}`}
                preserveAspectRatio="none"
                className="overflow-visible"
            >
                {/* Gradient for area fill */}
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.05" />
                    </linearGradient>
                </defs>

                {/* Area fill */}
                <path
                    d={areaPath}
                    fill={`url(#gradient-${color})`}
                    className="transition-all duration-300"
                />

                {/* Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all duration-300"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Data points */}
                {points.map((point, index) => {
                    const [x, y] = point.split(',').map(Number);
                    return (
                        <circle
                            key={index}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill={color}
                            className="transition-all duration-300"
                            vectorEffect="non-scaling-stroke"
                        />
                    );
                })}
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>{data[0]?.date.slice(5)}</span>
                <span className="text-gray-400">14 days</span>
                <span>{data[data.length - 1]?.date.slice(5)}</span>
            </div>
        </div>
    );
}

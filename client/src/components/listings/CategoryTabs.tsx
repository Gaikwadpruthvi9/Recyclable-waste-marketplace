'use client';

import { WasteCategory } from '@/lib/types';
import { useState } from 'react';

interface CategoryTabsProps {
    onCategoryChange: (category: WasteCategory | null) => void;
}

const categories = [
    { value: null, label: 'All Categories', icon: '🌐' },
    { value: WasteCategory.PLASTIC, label: 'Plastic', icon: '♻️' },
    { value: WasteCategory.METAL, label: 'Metal', icon: '🔩' },
    { value: WasteCategory.E_WASTE, label: 'E-Waste', icon: '💻' },
    { value: WasteCategory.PAPER, label: 'Paper', icon: '📄' },
    { value: WasteCategory.GLASS, label: 'Glass', icon: '🍾' },
    { value: WasteCategory.CHEMICAL, label: 'Chemical', icon: '⚗️' },
    { value: WasteCategory.ORGANIC, label: 'Organic', icon: '🌿' },
];

export default function CategoryTabs({ onCategoryChange }: CategoryTabsProps) {
    const [activeCategory, setActiveCategory] = useState<WasteCategory | null>(null);

    const handleCategoryClick = (category: WasteCategory | null) => {
        setActiveCategory(category);
        onCategoryChange(category);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-2 mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {categories.map((cat) => (
                    <button
                        key={cat.label}
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${activeCategory === cat.value
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

'use client';

import { useState } from 'react';
import { Search, MapPin, Package } from 'lucide-react';
import { FilterOptions } from '@/lib/types';

interface FilterBarProps {
    onFilterChange: (filters: FilterOptions) => void;
}

export default function FilterBar({ onFilterChange }: FilterBarProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [minQuantity, setMinQuantity] = useState('');
    const [maxQuantity, setMaxQuantity] = useState('');

    const handleFilterChange = () => {
        const filters: FilterOptions = {
            searchTerm: searchTerm || undefined,
            location: location || undefined,
            minQuantity: minQuantity ? parseFloat(minQuantity) : undefined,
            maxQuantity: maxQuantity ? parseFloat(maxQuantity) : undefined,
        };
        onFilterChange(filters);
    };

    const handleReset = () => {
        setSearchTerm('');
        setLocation('');
        setMinQuantity('');
        setMaxQuantity('');
        onFilterChange({});
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-primary-600" />
                Filter Listings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyUp={handleFilterChange}
                            placeholder="Search waste..."
                            className="input pl-11"
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                    </label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyUp={handleFilterChange}
                            placeholder="City or area..."
                            className="input pl-11"
                        />
                    </div>
                </div>

                {/* Min Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Quantity
                    </label>
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            value={minQuantity}
                            onChange={(e) => setMinQuantity(e.target.value)}
                            onKeyUp={handleFilterChange}
                            placeholder="Min..."
                            className="input pl-11"
                        />
                    </div>
                </div>

                {/* Max Quantity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Quantity
                    </label>
                    <div className="relative">
                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="number"
                            value={maxQuantity}
                            onChange={(e) => setMaxQuantity(e.target.value)}
                            onKeyUp={handleFilterChange}
                            placeholder="Max..."
                            className="input pl-11"
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button onClick={handleFilterChange} className="btn btn-primary">
                    Apply Filters
                </button>
                <button onClick={handleReset} className="btn btn-outline">
                    Reset
                </button>
            </div>
        </div>
    );
}

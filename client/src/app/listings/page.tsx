'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { WasteCategory, FilterOptions } from '@/lib/types';
import { useListings } from '@/hooks/useListings';
import WasteGrid from '@/components/listings/WasteGrid';
import CategoryTabs from '@/components/listings/CategoryTabs';
import FilterBar from '@/components/listings/FilterBar';
import { Package } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/I18nProvider';

export default function ListingsPage() {
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const [filters, setFilters] = useState<FilterOptions>({});
    const { listings, loading } = useListings(filters);

    // Filter only approved listings
    const approvedListings = listings.filter(l => l.status === 'approved');

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setFilters({ category: category as WasteCategory });
        }
    }, [searchParams]);

    const handleCategoryChange = (category: WasteCategory | null) => {
        setFilters({ ...filters, category: category || undefined });
    };

    const handleFilterChange = (newFilters: FilterOptions) => {
        setFilters({ ...filters, ...newFilters });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Package className="w-10 h-10 text-primary-600" />
                        {t.listings.title}
                    </h1>
                    <p className="text-lg text-gray-600">
                        {t.listings.subtitle}
                    </p>
                </div>

                {/* Category Tabs */}
                <CategoryTabs onCategoryChange={handleCategoryChange} />

                {/* Filters */}
                <FilterBar onFilterChange={handleFilterChange} />

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        {t.common.view} <span className="font-semibold text-gray-900">{approvedListings.length}</span> {t.home.stats.activeListings}
                    </p>
                </div>

                {/* Listings Grid */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="spinner"></div>
                    </div>
                ) : (
                    <WasteGrid
                        listings={approvedListings}
                        emptyMessage={t.listings.noListings}
                    />
                )}
            </div>
        </div>
    );
}

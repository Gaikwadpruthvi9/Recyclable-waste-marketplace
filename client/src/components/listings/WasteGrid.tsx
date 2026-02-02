'use client';

import { WasteListing } from '@/lib/types';
import WasteCard from './WasteCard';

interface WasteGridProps {
    listings: WasteListing[];
    emptyMessage?: string;
    showEditButton?: boolean;
}

export default function WasteGrid({ listings, emptyMessage = 'No listings found', showEditButton = false }: WasteGridProps) {
    if (listings.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
                <WasteCard key={listing.id} listing={listing} showEditButton={showEditButton} />
            ))}
        </div>
    );
}

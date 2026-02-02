'use client';

import { useState, useEffect } from 'react';
import { WasteListing, FilterOptions, ListingStatus } from '@/lib/types';
import { getListings, addListing, updateListing, deleteListing, getListingById } from '@/lib/storage';

export const useListings = (filters?: FilterOptions) => {
    const [listings, setListings] = useState<WasteListing[]>([]);
    const [loading, setLoading] = useState(true);

    const loadListings = () => {
        let allListings = getListings();

        // Apply filters
        if (filters) {
            if (filters.category) {
                allListings = allListings.filter(l => l.category === filters.category);
            }
            if (filters.location) {
                allListings = allListings.filter(l =>
                    l.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
                    l.location.area.toLowerCase().includes(filters.location!.toLowerCase())
                );
            }
            if (filters.minQuantity !== undefined) {
                allListings = allListings.filter(l => l.quantity >= filters.minQuantity!);
            }
            if (filters.maxQuantity !== undefined) {
                allListings = allListings.filter(l => l.quantity <= filters.maxQuantity!);
            }
            if (filters.searchTerm) {
                const term = filters.searchTerm.toLowerCase();
                allListings = allListings.filter(l =>
                    l.title.toLowerCase().includes(term) ||
                    l.description.toLowerCase().includes(term)
                );
            }
        }

        setListings(allListings);
        setLoading(false);
    };

    useEffect(() => {
        loadListings();
    }, [filters]);

    const createListing = (listing: WasteListing) => {
        addListing(listing);
        loadListings();
    };

    const updateListingData = (id: string, updates: Partial<WasteListing>) => {
        updateListing(id, updates);
        loadListings();
    };

    const removeListing = (id: string) => {
        deleteListing(id);
        loadListings();
    };

    const approveListing = (id: string) => {
        updateListing(id, { status: ListingStatus.APPROVED });
        loadListings();
    };

    const rejectListing = (id: string, reason: string) => {
        updateListing(id, { status: ListingStatus.REJECTED, rejectionReason: reason });
        loadListings();
    };

    return {
        listings,
        loading,
        createListing,
        updateListing: updateListingData,
        deleteListing: removeListing,
        approveListing,
        rejectListing,
        refreshListings: loadListings,
        getListing: getListingById,
    };
};

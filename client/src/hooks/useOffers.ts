// Custom hook for offer system
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    createOffer as createOfferInStorage,
    updateOfferStatus,
    counterOffer as counterOfferInStorage,
    getReceivedOffers,
    getSentOffers,
    getListingOffers,
    getOfferById
} from '@/lib/offer-storage';
import { Offer, OfferStatus } from '@/lib/offer-types';

export const useOffers = (userId?: string) => {
    const [receivedOffers, setReceivedOffers] = useState<Offer[]>([]);
    const [sentOffers, setSentOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshOffers = useCallback(() => {
        if (!userId) {
            setReceivedOffers([]);
            setSentOffers([]);
            setLoading(false);
            return;
        }

        setReceivedOffers(getReceivedOffers(userId));
        setSentOffers(getSentOffers(userId));
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        refreshOffers();
    }, [refreshOffers]);

    const createOffer = useCallback((
        listingId: string,
        buyerId: string,
        buyerName: string,
        buyerCompany: string | undefined,
        pricePerKg: number,
        quantity: number,
        message?: string
    ) => {
        const offer = createOfferInStorage(listingId, buyerId, buyerName, buyerCompany, pricePerKg, quantity, message);
        refreshOffers();
        return offer;
    }, [refreshOffers]);

    const respondToOffer = useCallback((offerId: string, status: OfferStatus) => {
        const offer = updateOfferStatus(offerId, status);
        refreshOffers();
        return offer;
    }, [refreshOffers]);

    const makeCounterOffer = useCallback((
        offerId: string,
        pricePerKg: number,
        quantity: number,
        message?: string
    ) => {
        const offer = counterOfferInStorage(offerId, pricePerKg, quantity, message);
        refreshOffers();
        return offer;
    }, [refreshOffers]);

    const getOffersForListing = useCallback((listingId: string) => {
        return getListingOffers(listingId);
    }, []);

    return {
        receivedOffers,
        sentOffers,
        loading,
        createOffer,
        respondToOffer,
        makeCounterOffer,
        getOffersForListing,
        refreshOffers,
        getOfferById
    };
};

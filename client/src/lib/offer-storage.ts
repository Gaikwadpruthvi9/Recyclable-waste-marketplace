// Offer Storage Layer
import { Offer, OfferSummary, OfferStatus } from './offer-types';
import { getListingById } from './storage';

const OFFERS_KEY = 'scrapify_offers';

/**
 * Get all offers from localStorage
 */
export const getOffers = (): Offer[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(OFFERS_KEY);
    return data ? JSON.parse(data) : [];
};

/**
 * Save offers to localStorage
 */
const saveOffers = (offers: Offer[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(OFFERS_KEY, JSON.stringify(offers));
};

/**
 * Create a new offer
 */
export const createOffer = (
    listingId: string,
    buyerId: string,
    buyerName: string,
    buyerCompany: string | undefined,
    pricePerKg: number,
    quantity: number,
    message?: string
): Offer => {
    const listing = getListingById(listingId);
    if (!listing) {
        throw new Error('Listing not found');
    }

    const offers = getOffers();
    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setDate(expiresAt.getDate() + 7); // Default 7 day expiry

    const newOffer: Offer = {
        id: `off_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        listingId,
        listingTitle: listing.title,
        listingImage: listing.images && listing.images.length > 0 ? listing.images[0] : undefined,
        sellerId: listing.sellerId,
        sellerName: listing.contactName, // Use contact name as seller name
        buyerId,
        buyerName,
        buyerCompany,
        pricePerKg,
        quantity,
        totalAmount: pricePerKg * quantity,
        message,
        status: 'pending',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString()
    };

    offers.push(newOffer);
    saveOffers(offers);

    return newOffer;
};

/**
 * Update offer status (Accept, Reject, Withdraw)
 */
export const updateOfferStatus = (offerId: string, status: OfferStatus): Offer => {
    const offers = getOffers();
    const index = offers.findIndex(o => o.id === offerId);

    if (index === -1) {
        throw new Error('Offer not found');
    }

    const offer = offers[index];
    offer.status = status;
    offer.updatedAt = new Date().toISOString();

    offers[index] = offer;
    saveOffers(offers);

    return offer;
};

/**
 * Counter an offer
 */
export const counterOffer = (
    offerId: string,
    pricePerKg: number,
    quantity: number,
    message?: string
): Offer => {
    const offers = getOffers();
    const index = offers.findIndex(o => o.id === offerId);

    if (index === -1) {
        throw new Error('Offer not found');
    }

    const offer = offers[index];
    offer.status = 'countered';
    offer.counterOffer = {
        pricePerKg,
        quantity,
        totalAmount: pricePerKg * quantity,
        message,
        createdAt: new Date().toISOString()
    };
    offer.updatedAt = new Date().toISOString();

    offers[index] = offer;
    saveOffers(offers);

    return offer;
};

/**
 * Get offers for a specific listing (for Seller view)
 */
export const getListingOffers = (listingId: string): Offer[] => {
    const offers = getOffers();
    return offers.filter(o => o.listingId === listingId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get offers received by a seller
 */
export const getReceivedOffers = (sellerId: string): Offer[] => {
    const offers = getOffers();
    return offers.filter(o => o.sellerId === sellerId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get offers sent by a buyer
 */
export const getSentOffers = (buyerId: string): Offer[] => {
    const offers = getOffers();
    return offers.filter(o => o.buyerId === buyerId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get offer by ID
 */
export const getOfferById = (offerId: string): Offer | null => {
    const offers = getOffers();
    return offers.find(o => o.id === offerId) || null;
};

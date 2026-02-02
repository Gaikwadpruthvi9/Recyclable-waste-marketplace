// Offer/Bid System Type Definitions

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'countered' | 'expired' | 'withdrawn';

export interface CounterOffer {
    pricePerKg: number;
    quantity: number;
    totalAmount: number;
    message?: string;
    createdAt: string;
}

export interface Offer {
    id: string;
    listingId: string;
    listingTitle: string;
    listingImage?: string; // Preview image
    sellerId: string;
    sellerName: string;
    buyerId: string;
    buyerName: string;
    buyerCompany?: string;

    // Offer Details
    pricePerKg: number;
    quantity: number; // in kg
    totalAmount: number; // calculated
    message?: string;

    // Status
    status: OfferStatus;
    counterOffer?: CounterOffer;

    // Metadata
    createdAt: string;
    updatedAt: string;
    expiresAt: string; // usually 3-7 days from creation
}

export interface OfferSummary {
    id: string;
    listingId: string;
    listingTitle: string;
    otherPartyId: string;
    otherPartyName: string;
    amount: number;
    status: OfferStatus;
    date: string;
    isInbox: boolean; // true if received (seller), false if sent (buyer)
}

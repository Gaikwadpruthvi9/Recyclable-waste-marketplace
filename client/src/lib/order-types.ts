// Transaction/Order Management Type Definitions

export enum OrderStatus {
    CONFIRMED = 'confirmed',
    PICKUP_SCHEDULED = 'pickup_scheduled',
    IN_TRANSIT = 'in_transit',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
    DISPUTED = 'disputed'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PARTIAL = 'partial',
    COMPLETED = 'completed',
    REFUNDED = 'refunded'
}

export interface OrderEvent {
    status: OrderStatus;
    timestamp: string;
    note?: string;
    updatedBy: string; // userId
    updatedByName: string;
}

export interface Order {
    id: string;

    // Related entities
    listingId: string;
    listingTitle: string;
    offerId?: string; // If created from an accepted offer

    // Parties
    buyerId: string;
    buyerName: string;
    buyerCompany?: string;
    sellerId: string;
    sellerName: string;
    sellerCompany?: string;

    // Order details
    wasteCategory: string;
    quantity: number; // in kg
    unit: string;
    pricePerKg: number;
    totalAmount: number;

    // Logistics
    pickupAddress: string;
    pickupCity: string;
    pickupDate?: string;
    deliveryAddress?: string;
    deliveryCity?: string;

    // Status
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    paymentMethod?: string;

    // Notes
    notes?: string;
    buyerNotes?: string;
    sellerNotes?: string;

    // Timeline
    timeline: OrderEvent[];
    createdAt: string;
    updatedAt: string;
    completedAt?: string;
}

export interface OrderSummary {
    id: string;
    listingTitle: string;
    otherPartyName: string;
    amount: number;
    status: OrderStatus;
    date: string;
    isBuyer: boolean;
}

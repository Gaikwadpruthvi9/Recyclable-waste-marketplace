// Notification System Type Definitions

export enum NotificationType {
    NEW_MESSAGE = 'new_message',
    NEW_OFFER = 'new_offer',
    OFFER_ACCEPTED = 'offer_accepted',
    OFFER_REJECTED = 'offer_rejected',
    ORDER_CREATED = 'order_created',
    ORDER_STATUS_UPDATE = 'order_status_update',
    PAYMENT_RECEIVED = 'payment_received',
    LISTING_APPROVED = 'listing_approved',
    LISTING_REJECTED = 'listing_rejected'
}

export interface Notification {
    id: string;
    userId: string; // Recipient
    type: NotificationType;
    title: string;
    message: string;

    // Related entities
    relatedId?: string; // ID of related offer, order, message, etc.
    relatedType?: 'offer' | 'order' | 'message' | 'listing';

    // Metadata
    read: boolean;
    createdAt: string;
    readAt?: string;

    // Optional action link
    actionUrl?: string;
    actionLabel?: string;
}

export interface NotificationSummary {
    total: number;
    unread: number;
    recent: Notification[];
}

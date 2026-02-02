// Notification Storage Layer
import { Notification, NotificationType } from './notification-types';

const NOTIFICATIONS_KEY = 'scrapify_notifications';

/**
 * Get all notifications from localStorage
 */
export const getNotifications = (): Notification[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    return data ? JSON.parse(data) : [];
};

/**
 * Save notifications to localStorage
 */
const saveNotifications = (notifications: Notification[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
};

/**
 * Create a new notification
 */
export const createNotification = (
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string,
    relatedType?: 'offer' | 'order' | 'message' | 'listing',
    actionUrl?: string,
    actionLabel?: string
): Notification => {
    const notifications = getNotifications();
    const now = new Date();

    const newNotification: Notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type,
        title,
        message,
        relatedId,
        relatedType,
        read: false,
        createdAt: now.toISOString(),
        actionUrl,
        actionLabel
    };

    notifications.push(newNotification);
    saveNotifications(notifications);

    return newNotification;
};

/**
 * Get notifications for a user
 */
export const getUserNotifications = (userId: string, limit?: number): Notification[] => {
    const notifications = getNotifications();
    const userNotifications = notifications
        .filter(n => n.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return limit ? userNotifications.slice(0, limit) : userNotifications;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = (userId: string): number => {
    const notifications = getNotifications();
    return notifications.filter(n => n.userId === userId && !n.read).length;
};

/**
 * Mark notification as read
 */
export const markAsRead = (notificationId: string): Notification | null => {
    const notifications = getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);

    if (index === -1) return null;

    notifications[index].read = true;
    notifications[index].readAt = new Date().toISOString();

    saveNotifications(notifications);
    return notifications[index];
};

/**
 * Mark all notifications as read for a user
 */
export const markAllAsRead = (userId: string): void => {
    const notifications = getNotifications();
    const now = new Date().toISOString();

    const updated = notifications.map(n => {
        if (n.userId === userId && !n.read) {
            return { ...n, read: true, readAt: now };
        }
        return n;
    });

    saveNotifications(updated);
};

/**
 * Delete a notification
 */
export const deleteNotification = (notificationId: string): void => {
    const notifications = getNotifications();
    const filtered = notifications.filter(n => n.id !== notificationId);
    saveNotifications(filtered);
};

/**
 * Delete all notifications for a user
 */
export const deleteAllNotifications = (userId: string): void => {
    const notifications = getNotifications();
    const filtered = notifications.filter(n => n.userId !== userId);
    saveNotifications(filtered);
};

// Helper functions to create specific notification types

export const notifyNewMessage = (
    recipientId: string,
    senderName: string,
    conversationId: string
): Notification => {
    return createNotification(
        recipientId,
        NotificationType.NEW_MESSAGE,
        'New Message',
        `${senderName} sent you a message`,
        conversationId,
        'message',
        `/messages?conversation=${conversationId}`,
        'View Message'
    );
};

export const notifyNewOffer = (
    sellerId: string,
    buyerName: string,
    listingTitle: string,
    offerId: string
): Notification => {
    return createNotification(
        sellerId,
        NotificationType.NEW_OFFER,
        'New Offer Received',
        `${buyerName} made an offer on "${listingTitle}"`,
        offerId,
        'offer',
        '/offers',
        'View Offer'
    );
};

export const notifyOfferAccepted = (
    buyerId: string,
    sellerName: string,
    listingTitle: string,
    orderId: string
): Notification => {
    return createNotification(
        buyerId,
        NotificationType.OFFER_ACCEPTED,
        'Offer Accepted!',
        `${sellerName} accepted your offer for "${listingTitle}"`,
        orderId,
        'order',
        `/orders/${orderId}`,
        'View Order'
    );
};

export const notifyOfferRejected = (
    buyerId: string,
    sellerName: string,
    listingTitle: string,
    offerId: string
): Notification => {
    return createNotification(
        buyerId,
        NotificationType.OFFER_REJECTED,
        'Offer Rejected',
        `${sellerName} rejected your offer for "${listingTitle}"`,
        offerId,
        'offer',
        '/offers',
        'View Offers'
    );
};

export const notifyOrderCreated = (
    userId: string,
    listingTitle: string,
    orderId: string
): Notification => {
    return createNotification(
        userId,
        NotificationType.ORDER_CREATED,
        'New Order Created',
        `Order created for "${listingTitle}"`,
        orderId,
        'order',
        `/orders/${orderId}`,
        'View Order'
    );
};

export const notifyOrderStatusUpdate = (
    userId: string,
    listingTitle: string,
    newStatus: string,
    orderId: string
): Notification => {
    return createNotification(
        userId,
        NotificationType.ORDER_STATUS_UPDATE,
        'Order Status Updated',
        `Order for "${listingTitle}" is now ${newStatus}`,
        orderId,
        'order',
        `/orders/${orderId}`,
        'View Order'
    );
};

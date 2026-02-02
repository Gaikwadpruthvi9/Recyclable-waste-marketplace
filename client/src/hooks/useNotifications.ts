// Custom hook for notifications
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    getUserNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead as markAllAsReadStorage,
    deleteNotification as deleteNotificationStorage
} from '@/lib/notification-storage';
import { Notification } from '@/lib/notification-types';

export const useNotifications = (userId?: string) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const refreshNotifications = useCallback(() => {
        if (!userId) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        const userNotifications = getUserNotifications(userId, 50); // Get last 50
        const unread = getUnreadCount(userId);

        setNotifications(userNotifications);
        setUnreadCount(unread);
        setLoading(false);
    }, [userId]);

    useEffect(() => {
        refreshNotifications();

        // Refresh notifications every 30 seconds
        const interval = setInterval(refreshNotifications, 30000);

        return () => clearInterval(interval);
    }, [refreshNotifications]);

    const markNotificationAsRead = useCallback((notificationId: string) => {
        markAsRead(notificationId);
        refreshNotifications();
    }, [refreshNotifications]);

    const markAllAsRead = useCallback(() => {
        if (userId) {
            markAllAsReadStorage(userId);
            refreshNotifications();
        }
    }, [userId, refreshNotifications]);

    const deleteNotification = useCallback((notificationId: string) => {
        deleteNotificationStorage(notificationId);
        refreshNotifications();
    }, [refreshNotifications]);

    return {
        notifications,
        unreadCount,
        loading,
        markNotificationAsRead,
        markAllAsRead,
        deleteNotification,
        refreshNotifications
    };
};

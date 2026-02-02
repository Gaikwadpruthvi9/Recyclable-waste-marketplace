// Custom hook for order management
'use client';

import { useState, useCallback, useEffect } from 'react';
import {
    createOrderFromOffer as createOrderFromOfferStorage,
    updateOrderStatus as updateOrderStatusStorage,
    updatePaymentStatus as updatePaymentStatusStorage,
    getBuyerOrders,
    getSellerOrders,
    getOrderById,
    addOrderNote as addOrderNoteStorage
} from '@/lib/order-storage';
import { Order, OrderStatus, PaymentStatus } from '@/lib/order-types';

export const useOrders = (userId?: string, userRole?: string) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshOrders = useCallback(() => {
        if (!userId) {
            setOrders([]);
            setLoading(false);
            return;
        }

        // Get orders based on role
        const userOrders = userRole === 'buyer'
            ? getBuyerOrders(userId)
            : getSellerOrders(userId);

        setOrders(userOrders);
        setLoading(false);
    }, [userId, userRole]);

    useEffect(() => {
        refreshOrders();
    }, [refreshOrders]);

    const createOrderFromOffer = useCallback((
        offerId: string,
        userId: string,
        userName: string,
        pickupDate?: string,
        notes?: string
    ) => {
        const order = createOrderFromOfferStorage(offerId, userId, userName, pickupDate, notes);
        refreshOrders();
        return order;
    }, [refreshOrders]);

    const updateOrderStatus = useCallback((
        orderId: string,
        status: OrderStatus,
        userId: string,
        userName: string,
        note?: string
    ) => {
        const order = updateOrderStatusStorage(orderId, status, userId, userName, note);
        refreshOrders();
        return order;
    }, [refreshOrders]);

    const updatePaymentStatus = useCallback((
        orderId: string,
        paymentStatus: PaymentStatus,
        paymentMethod?: string
    ) => {
        const order = updatePaymentStatusStorage(orderId, paymentStatus, paymentMethod);
        refreshOrders();
        return order;
    }, [refreshOrders]);

    const addOrderNote = useCallback((
        orderId: string,
        note: string,
        userId: string,
        isBuyer: boolean
    ) => {
        const order = addOrderNoteStorage(orderId, note, userId, isBuyer);
        refreshOrders();
        return order;
    }, [refreshOrders]);

    return {
        orders,
        loading,
        createOrderFromOffer,
        updateOrderStatus,
        updatePaymentStatus,
        addOrderNote,
        refreshOrders,
        getOrderById
    };
};

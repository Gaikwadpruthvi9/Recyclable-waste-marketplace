// Order Storage Layer
import { Order, OrderStatus, PaymentStatus, OrderEvent } from './order-types';
import { getOfferById } from './offer-storage';
import { getListingById } from './storage';

const ORDERS_KEY = 'scrapify_orders';

/**
 * Get all orders from localStorage
 */
export const getOrders = (): Order[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
};

/**
 * Save orders to localStorage
 */
const saveOrders = (orders: Order[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

/**
 * Create an order from an accepted offer
 */
export const createOrderFromOffer = (
    offerId: string,
    userId: string,
    userName: string,
    pickupDate?: string,
    notes?: string
): Order => {
    const offer = getOfferById(offerId);
    if (!offer) {
        throw new Error('Offer not found');
    }

    const listing = getListingById(offer.listingId);
    if (!listing) {
        throw new Error('Listing not found');
    }

    const orders = getOrders();
    const now = new Date();

    const initialEvent: OrderEvent = {
        status: OrderStatus.CONFIRMED,
        timestamp: now.toISOString(),
        note: 'Order created from accepted offer',
        updatedBy: userId,
        updatedByName: userName
    };

    const newOrder: Order = {
        id: `ord_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        listingId: offer.listingId,
        listingTitle: offer.listingTitle,
        offerId: offer.id,
        buyerId: offer.buyerId,
        buyerName: offer.buyerName,
        buyerCompany: offer.buyerCompany,
        sellerId: offer.sellerId,
        sellerName: offer.sellerName,
        sellerCompany: listing.contactCompany,
        wasteCategory: listing.category,
        quantity: offer.quantity,
        unit: listing.unit,
        pricePerKg: offer.pricePerKg,
        totalAmount: offer.totalAmount,
        pickupAddress: listing.location.address || `${listing.location.area}, ${listing.location.city}`,
        pickupCity: listing.location.city,
        pickupDate,
        status: OrderStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PENDING,
        notes,
        timeline: [initialEvent],
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
    };

    orders.push(newOrder);
    saveOrders(orders);

    return newOrder;
};

/**
 * Update order status
 */
export const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    userId: string,
    userName: string,
    note?: string
): Order => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) {
        throw new Error('Order not found');
    }

    const order = orders[index];
    const now = new Date();

    const event: OrderEvent = {
        status,
        timestamp: now.toISOString(),
        note,
        updatedBy: userId,
        updatedByName: userName
    };

    order.status = status;
    order.timeline.push(event);
    order.updatedAt = now.toISOString();

    if (status === OrderStatus.COMPLETED) {
        order.completedAt = now.toISOString();
    }

    orders[index] = order;
    saveOrders(orders);

    return order;
};

/**
 * Update payment status
 */
export const updatePaymentStatus = (
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentMethod?: string
): Order => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) {
        throw new Error('Order not found');
    }

    const order = orders[index];
    order.paymentStatus = paymentStatus;
    if (paymentMethod) {
        order.paymentMethod = paymentMethod;
    }
    order.updatedAt = new Date().toISOString();

    orders[index] = order;
    saveOrders(orders);

    return order;
};

/**
 * Get orders for a buyer
 */
export const getBuyerOrders = (buyerId: string): Order[] => {
    const orders = getOrders();
    return orders.filter(o => o.buyerId === buyerId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get orders for a seller
 */
export const getSellerOrders = (sellerId: string): Order[] => {
    const orders = getOrders();
    return orders.filter(o => o.sellerId === sellerId).sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
};

/**
 * Get order by ID
 */
export const getOrderById = (orderId: string): Order | null => {
    const orders = getOrders();
    return orders.find(o => o.id === orderId) || null;
};

/**
 * Add note to order
 */
export const addOrderNote = (
    orderId: string,
    note: string,
    userId: string,
    isBuyer: boolean
): Order => {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === orderId);

    if (index === -1) {
        throw new Error('Order not found');
    }

    const order = orders[index];

    if (isBuyer) {
        order.buyerNotes = note;
    } else {
        order.sellerNotes = note;
    }

    order.updatedAt = new Date().toISOString();

    orders[index] = order;
    saveOrders(orders);

    return order;
};

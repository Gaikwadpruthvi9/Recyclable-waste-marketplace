'use client';

import { useAuth } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OrderCard from '@/components/orders/OrderCard';
import { Package, ShoppingBag, Truck } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
    const { user } = useAuth();
    const { orders, loading } = useOrders(user?.id, user?.role);

    const isBuyer = user?.role === 'buyer';

    // Categorize orders
    const activeOrders = orders.filter(o =>
        o.status !== 'completed' && o.status !== 'cancelled'
    );
    const completedOrders = orders.filter(o =>
        o.status === 'completed'
    );

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <Package className="w-10 h-10 text-primary-600" />
                            My Orders
                        </h1>
                        <p className="text-lg text-gray-600">
                            Track your {isBuyer ? 'purchases' : 'sales'} and order status
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-600 mb-4">
                                {isBuyer
                                    ? 'Start making offers on listings to create orders'
                                    : 'Accept offers from buyers to create orders'
                                }
                            </p>
                            <Link href={isBuyer ? "/listings" : "/offers"} className="btn btn-primary">
                                {isBuyer ? 'Browse Listings' : 'View Offers'}
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Active Orders */}
                            {activeOrders.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <Truck className="w-5 h-5 text-primary-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Active Orders
                                        </h2>
                                        <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full text-sm font-semibold">
                                            {activeOrders.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {activeOrders.map(order => (
                                            <OrderCard
                                                key={order.id}
                                                order={order}
                                                isBuyer={isBuyer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completed Orders */}
                            {completedOrders.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <ShoppingBag className="w-5 h-5 text-green-600" />
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Completed Orders
                                        </h2>
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-sm font-semibold">
                                            {completedOrders.length}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {completedOrders.map(order => (
                                            <OrderCard
                                                key={order.id}
                                                order={order}
                                                isBuyer={isBuyer}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

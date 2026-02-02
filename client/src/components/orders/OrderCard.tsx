'use client';

import { Order, OrderStatus } from '@/lib/order-types';
import { format } from 'date-fns';
import { Package, Clock, CheckCircle, Truck, XCircle, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
    order: Order;
    isBuyer: boolean;
}

export default function OrderCard({ order, isBuyer }: OrderCardProps) {

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-800 border-blue-200';
            case OrderStatus.PICKUP_SCHEDULED: return 'bg-purple-100 text-purple-800 border-purple-200';
            case OrderStatus.IN_TRANSIT: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800 border-green-200';
            case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
            case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
            case OrderStatus.DISPUTED: return 'bg-orange-100 text-orange-800 border-orange-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.CONFIRMED: return <CheckCircle className="w-4 h-4" />;
            case OrderStatus.PICKUP_SCHEDULED: return <Clock className="w-4 h-4" />;
            case OrderStatus.IN_TRANSIT: return <Truck className="w-4 h-4" />;
            case OrderStatus.DELIVERED: return <Package className="w-4 h-4" />;
            case OrderStatus.COMPLETED: return <CheckCircle className="w-4 h-4" />;
            case OrderStatus.CANCELLED: return <XCircle className="w-4 h-4" />;
            case OrderStatus.DISPUTED: return <AlertCircle className="w-4 h-4" />;
            default: return null;
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <Link href={`/orders/${order.id}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md hover:border-primary-300 cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                {getStatusIcon(order.status)}
                                {getStatusLabel(order.status)}
                            </span>
                            <span className="text-xs text-gray-500">
                                {format(new Date(order.createdAt), 'MMM d, yyyy')}
                            </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-1">{order.listingTitle}</h3>
                        <p className="text-sm text-gray-600">
                            {isBuyer ? 'Seller:' : 'Buyer:'} {isBuyer ? order.sellerName : order.buyerName}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-primary-600">₹{order.totalAmount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                            {order.quantity} {order.unit}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div>
                            <span className="text-gray-500">Payment:</span>
                            <span className={`ml-1 font-medium ${order.paymentStatus === 'completed' ? 'text-green-600' : 'text-yellow-600'
                                }`}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                        </div>
                        {order.pickupDate && (
                            <div>
                                <span className="text-gray-500">Pickup:</span>
                                <span className="ml-1 font-medium">
                                    {format(new Date(order.pickupDate), 'MMM d')}
                                </span>
                            </div>
                        )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
            </div>
        </Link>
    );
}

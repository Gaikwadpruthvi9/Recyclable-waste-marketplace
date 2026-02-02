'use client';

import { Offer } from '@/lib/offer-types';
import { format } from 'date-fns';
import { DollarSign, Package, Calendar, User, Building2, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

interface OfferCardProps {
    offer: Offer;
    isReceived: boolean;
    onAccept?: (offerId: string) => void;
    onReject?: (offerId: string) => void;
    onWithdraw?: (offerId: string) => void;
}

export default function OfferCard({ offer, isReceived, onAccept, onReject, onWithdraw }: OfferCardProps) {
    const totalAmount = offer.pricePerKg * offer.quantity;

    const getStatusBadge = () => {
        switch (offer.status) {
            case 'pending':
                return <span className="badge badge-warning flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
            case 'accepted':
                return <span className="badge badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Accepted</span>;
            case 'rejected':
                return <span className="badge badge-error flex items-center gap-1"><XCircle className="w-3 h-3" /> Rejected</span>;
            case 'withdrawn':
                return <span className="badge badge-secondary flex items-center gap-1"><XCircle className="w-3 h-3" /> Withdrawn</span>;
            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary-50 to-primary-100 border-b border-primary-200">
                <div className="flex items-start justify-between mb-2">
                    <Link href={`/listings/${offer.listingId}`} className="hover:underline">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{offer.listingTitle}</h3>
                    </Link>
                    {getStatusBadge()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(offer.createdAt), 'MMM dd, yyyy')}
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Buyer/Seller Info */}
                <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                        {isReceived ? 'From:' : 'To:'} <span className="font-medium text-gray-900">{offer.buyerName}</span>
                    </span>
                </div>

                {offer.buyerCompany && (
                    <div className="flex items-center gap-2 text-sm">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{offer.buyerCompany}</span>
                    </div>
                )}

                {/* Offer Details */}
                <div className="grid grid-cols-2 gap-3 py-3 border-t border-gray-200">
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Price per kg</div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                            <DollarSign className="w-4 h-4 text-primary-600" />
                            ₹{offer.pricePerKg.toFixed(2)}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs text-gray-500 mb-1">Quantity</div>
                        <div className="font-semibold text-gray-900 flex items-center gap-1">
                            <Package className="w-4 h-4 text-primary-600" />
                            {offer.quantity} kg
                        </div>
                    </div>
                </div>

                {/* Total Amount */}
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-xs text-green-700 mb-1">Total Offer Amount</div>
                    <div className="text-xl font-bold text-green-900">
                        ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                </div>

                {/* Message */}
                {offer.message && (
                    <div className="pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Message</div>
                        <p className="text-sm text-gray-700 line-clamp-3">{offer.message}</p>
                    </div>
                )}

                {/* Actions */}
                {offer.status === 'pending' && (
                    <div className="pt-3 border-t border-gray-200">
                        {isReceived ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onAccept?.(offer.id)}
                                    className="btn btn-primary flex-1 text-sm py-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Accept
                                </button>
                                <button
                                    onClick={() => onReject?.(offer.id)}
                                    className="btn btn-secondary flex-1 text-sm py-2"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => onWithdraw?.(offer.id)}
                                className="btn btn-secondary w-full text-sm py-2"
                            >
                                <XCircle className="w-4 h-4" />
                                Withdraw Offer
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

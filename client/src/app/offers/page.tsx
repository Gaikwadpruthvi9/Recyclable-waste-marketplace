'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useOffers } from '@/hooks/useOffers';
import { useOrders } from '@/hooks/useOrders';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import OfferCard from '@/components/offers/OfferCard';
import { DollarSign, Inbox, Send } from 'lucide-react';
import Link from 'next/link';
import { notifyOfferAccepted, notifyOfferRejected, notifyOrderCreated } from '@/lib/notification-storage';
import { getOfferById } from '@/lib/offer-storage';

export default function OffersPage() {
    const { user } = useAuth();
    const { receivedOffers, sentOffers, loading, respondToOffer, createOffer } = useOffers(user?.id);
    const { createOrderFromOffer } = useOrders(user?.id, user?.role);
    const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

    // Simple handler to withdraw an offer - essentially marking it as withdrawn by the buyer
    const handleWithdraw = (offerId: string) => {
        if (confirm('Are you sure you want to withdraw this offer?')) {
            respondToOffer(offerId, 'withdrawn');
        }
    };

    const handleAccept = (offerId: string) => {
        if (confirm('Accept this offer? This will create an order and notify the buyer.')) {
            const offer = getOfferById(offerId);
            if (!offer) return;

            // Accept the offer
            respondToOffer(offerId, 'accepted');

            // Create an order from the accepted offer
            if (user) {
                try {
                    const order = createOrderFromOffer(offerId, user.id, user.name);

                    // Notify buyer that offer was accepted
                    notifyOfferAccepted(offer.buyerId, user.name, offer.listingTitle, order.id);

                    // Notify seller that order was created
                    notifyOrderCreated(user.id, offer.listingTitle, order.id);

                    alert('Offer accepted! An order has been created. Check your Orders page.');
                } catch (error) {
                    console.error('Error creating order:', error);
                    alert('Offer accepted, but there was an error creating the order.');
                }
            }
        }
    };

    const handleReject = (offerId: string) => {
        if (confirm('Reject this offer?')) {
            const offer = getOfferById(offerId);
            if (!offer || !user) return;

            respondToOffer(offerId, 'rejected');

            // Notify buyer that offer was rejected
            notifyOfferRejected(offer.buyerId, user.name, offer.listingTitle, offerId);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="container-custom">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                            <DollarSign className="w-10 h-10 text-primary-600" />
                            Offers
                        </h1>
                        <p className="text-lg text-gray-600">
                            Manage your buying and selling offers
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                        <div className="flex border-b border-gray-200">
                            <button
                                onClick={() => setActiveTab('received')}
                                className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center gap-2 relative ${activeTab === 'received'
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Inbox className="w-4 h-4" />
                                Received Offers
                                <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {receivedOffers.length}
                                </span>
                                {activeTab === 'received' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('sent')}
                                className={`flex-1 py-4 text-center font-medium text-sm flex items-center justify-center gap-2 relative ${activeTab === 'sent'
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <Send className="w-4 h-4" />
                                Sent Offers
                                <span className="ml-1 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                                    {sentOffers.length}
                                </span>
                                {activeTab === 'sent' && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"></div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <div>
                            {activeTab === 'received' ? (
                                receivedOffers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {receivedOffers.map(offer => (
                                            <OfferCard
                                                key={offer.id}
                                                offer={offer}
                                                isReceived={true}
                                                onAccept={handleAccept}
                                                onReject={handleReject}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                                        <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">No received offers</h3>
                                        <p className="text-gray-500">You haven't received any offers yet.</p>
                                    </div>
                                )
                            ) : (
                                sentOffers.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {sentOffers.map(offer => (
                                            <OfferCard
                                                key={offer.id}
                                                offer={offer}
                                                isReceived={false}
                                                onWithdraw={handleWithdraw}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 border-dashed">
                                        <Send className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-lg font-medium text-gray-900">No sent offers</h3>
                                        <p className="text-gray-500 mb-4">You haven't made any offers yet.</p>
                                        <Link href="/listings" className="btn btn-primary">
                                            Browse Listings
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WasteListing } from '@/lib/types';
import { getListingById } from '@/lib/storage';
import { MapPin, Package, Calendar, Phone, Building, ArrowLeft, MessageCircle, Shield, Edit, Mail } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import VerificationBadge from '@/components/listings/VerificationBadge';
import { useAuth } from '@/hooks/useAuth';
import { useMessages } from '@/hooks/useMessages';
import { useOffers } from '@/hooks/useOffers';
import MakeOfferModal from '@/components/offers/MakeOfferModal';
import { notifyNewOffer } from '@/lib/notification-storage';

const LocationMap = dynamic(() => import('@/components/map/LocationMap'), { ssr: false });

export default function ListingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const { startConversation } = useMessages(user?.id);
    const { createOffer } = useOffers(user?.id);

    const [listing, setListing] = useState<WasteListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

    useEffect(() => {
        const id = params.id as string;
        const foundListing = getListingById(id);
        setListing(foundListing || null);
        setLoading(false);
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
                    <Link href="/listings" className="btn btn-primary">
                        Browse Listings
                    </Link>
                </div>
            </div>
        );
    }

    const getCategoryClass = (category: string) => {
        const categoryMap: Record<string, string> = {
            'Plastic': 'category-plastic',
            'Metal': 'category-metal',
            'E-Waste': 'category-ewaste',
            'Paper': 'category-paper',
            'Glass': 'category-glass',
            'Chemical': 'category-chemical',
            'Organic': 'category-organic',
        };
        return categoryMap[category] || 'badge-info';
    };

    const getStatusBadge = () => {
        if (listing.status === 'approved') return <span className="badge badge-success">Approved</span>;
        if (listing.status === 'pending') return <span className="badge badge-warning">Pending Approval</span>;
        if (listing.status === 'rejected') return <span className="badge badge-error">Rejected</span>;
    };

    const handleWhatsApp = () => {
        const message = `Hi, I'm interested in your waste listing: ${listing.title}`;
        window.open(`https://wa.me/${listing.contactPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    };

    const handleCall = () => {
        window.location.href = `tel:${listing.contactPhone}`;
    };

    const handleContactSeller = () => {
        if (!user) {
            router.push('/login?redirect=/listings/' + listing.id);
            return;
        }

        // Create or get conversation
        const conversation = startConversation(
            listing.id,
            listing.title,
            user.id,
            user.name,
            listing.sellerId,
            listing.contactName
        );

        // Redirect to messages page with this conversation
        router.push(`/messages?conversation=${conversation.id}`);
    };

    const handleMakeOffer = () => {
        if (!user) {
            router.push('/login?redirect=/listings/' + listing.id);
            return;
        }
        setIsOfferModalOpen(true);
    };

    const handleOfferSubmit = (pricePerKg: number, quantity: number, message: string) => {
        if (!user || !listing) return;

        const offer = createOffer(
            listing.id,
            user.id,
            user.name,
            user.company,
            pricePerKg,
            quantity,
            message
        );

        // Notify seller about new offer
        notifyNewOffer(listing.sellerId, user.name, listing.title, offer.id);

        alert('Offer submitted successfully! The seller has been notified.');
        router.push('/offers');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header with Back and Edit buttons */}
                <div className="flex items-center justify-between mb-6">
                    <Link href="/listings" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Listings
                    </Link>

                    {/* Edit Button - Only visible to listing owner */}
                    {user && listing && user.id === listing.sellerId && (
                        <Link href={`/listings/${listing.id}/edit`}>
                            <button className="btn btn-primary">
                                <Edit className="w-5 h-5" />
                                Edit Listing
                            </button>
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="relative h-96 bg-gray-200">
                                {listing.images && listing.images.length > 0 ? (
                                    <>
                                        <img
                                            src={listing.images[currentImageIndex]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {listing.images.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                {listing.images.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                                        <Package className="w-24 h-24 text-white opacity-50" />
                                    </div>
                                )}
                            </div>

                            {listing.images && listing.images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {listing.images.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImageIndex(index)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${index === currentImageIndex ? 'border-primary-600' : 'border-gray-200'
                                                }`}
                                        >
                                            <img src={img} alt={`${listing.title} ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Details */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${getCategoryClass(listing.category)}`}>
                                            {listing.category}
                                        </span>
                                        {getStatusBadge()}
                                    </div>
                                </div>
                            </div>

                            <div className="prose max-w-none mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700 whitespace-pre-wrap">{listing.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-gray-200">
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Quantity</div>
                                        <div className="font-semibold text-gray-900">{listing.quantity} {listing.unit}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Building className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Type</div>
                                        <div className="font-semibold text-gray-900">{listing.type}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Location</div>
                                        <div className="font-semibold text-gray-900">{listing.location.city}, {listing.location.area}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Calendar className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Posted</div>
                                        <div className="font-semibold text-gray-900">{format(new Date(listing.createdAt), 'MMM dd, yyyy')}</div>
                                    </div>
                                </div>

                                {/* Verification Status */}
                                <div className="flex items-center gap-3">
                                    <Shield className="w-5 h-5 text-primary-600" />
                                    <div>
                                        <div className="text-sm text-gray-500">Verification</div>
                                        <div className="font-semibold text-gray-900">
                                            <VerificationBadge
                                                status={(listing.verificationStatus || 'self-reported') as any}
                                                distanceFromListing={listing.distanceFromListing}
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Verification Details */}
                            {listing.verificationStatus === 'verified-onsite' && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-green-900 mb-1">✅ Verified On-Site</h4>
                                            <p className="text-sm text-green-800">
                                                This listing has been verified with GPS location and timestamp.
                                                Photos were taken on-site at the listed location.
                                            </p>
                                            {listing.distanceFromListing !== undefined && listing.distanceFromListing < 999 && (
                                                <p className="text-xs text-green-700 mt-2">
                                                    Photo location: {listing.distanceFromListing.toFixed(1)} km from listing address
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(!listing.verificationStatus || listing.verificationStatus === 'self-reported') && (
                                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-yellow-900 mb-1">📸 Self-Reported</h4>
                                            <p className="text-sm text-yellow-800">
                                                This listing has not been verified with location data.
                                                Please verify waste availability with the seller before visiting.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Map */}
                        {listing.location.latitude && listing.location.longitude && (
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
                                <div className="h-64 rounded-lg overflow-hidden">
                                    <LocationMap
                                        latitude={listing.location.latitude}
                                        longitude={listing.location.longitude}
                                        title={listing.title}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Seller</h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <div className="text-sm text-gray-500">Contact Person</div>
                                    <div className="font-semibold text-gray-900">{listing.contactName}</div>
                                </div>

                                {listing.contactCompany && (
                                    <div>
                                        <div className="text-sm text-gray-500">Company</div>
                                        <div className="font-semibold text-gray-900">{listing.contactCompany}</div>
                                    </div>
                                )}

                                <div>
                                    <div className="text-sm text-gray-500">Phone Number</div>
                                    <div className="font-semibold text-gray-900">{listing.contactPhone}</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {/* Actions for non-owners */}
                                {user && user.id !== listing.sellerId && (
                                    <>
                                        <button
                                            onClick={handleMakeOffer}
                                            className="btn w-full bg-green-600 hover:bg-green-700 text-white shadow-md border-transparent"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span>💰</span>
                                                Make an Offer
                                            </div>
                                        </button>

                                        <button onClick={handleContactSeller} className="btn btn-primary w-full">
                                            <Mail className="w-5 h-5" />
                                            Contact Seller
                                        </button>
                                    </>
                                )}

                                <button onClick={handleCall} className="btn btn-primary w-full">
                                    <Phone className="w-5 h-5" />
                                    Call Now
                                </button>

                                <button onClick={handleWhatsApp} className="btn btn-secondary w-full">
                                    <MessageCircle className="w-5 h-5" />
                                    WhatsApp
                                </button>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <p className="text-xs text-gray-500 text-center">
                                    Contact the seller directly to negotiate and finalize the deal
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {listing && (
                    <MakeOfferModal
                        isOpen={isOfferModalOpen}
                        onClose={() => setIsOfferModalOpen(false)}
                        onSubmit={handleOfferSubmit}
                        listingTitle={listing.title}
                        listingUnit={listing.unit}
                        currentPrice={listing.pricePerKg || 0}
                        maxQuantity={listing.quantity}
                    />
                )}
            </div>
        </div>
    );
}

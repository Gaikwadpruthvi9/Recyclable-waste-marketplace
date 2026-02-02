'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WasteListing } from '@/lib/types';
import { MapPin, Package, Calendar, Edit } from 'lucide-react';
import { format } from 'date-fns';
import VerificationBadge from './VerificationBadge';

interface WasteCardProps {
    listing: WasteListing;
    showEditButton?: boolean;
}

export default function WasteCard({ listing, showEditButton = false }: WasteCardProps) {
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
        if (listing.status === 'pending') return <span className="badge badge-warning">Pending</span>;
        if (listing.status === 'rejected') return <span className="badge badge-error">Rejected</span>;
    };

    return (
        <Link href={`/listings/${listing.id}`}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden card-hover cursor-pointer h-full">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                    {listing.images && listing.images.length > 0 ? (
                        <img
                            src={listing.images[0]}
                            alt={listing.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                            <Package className="w-16 h-16 text-white opacity-50" />
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span className={`badge ${getCategoryClass(listing.category)}`}>
                            {listing.category}
                        </span>
                    </div>

                    {/* Verification Badge - Always show */}
                    <div className="absolute bottom-3 left-3">
                        <VerificationBadge
                            status={(listing.verificationStatus || 'self-reported') as any}
                            distanceFromListing={listing.distanceFromListing}
                            size="sm"
                        />
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                        {getStatusBadge()}
                    </div>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {listing.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {listing.description}
                    </p>

                    <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-primary-600" />
                            <span className="font-medium text-gray-900">
                                {listing.quantity} {listing.unit}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{listing.type}</span>
                        </div>

                        {/* Pricing */}
                        {listing.pricePerKg && (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-primary-700">
                                    ₹{listing.pricePerKg}/kg
                                </span>
                                {listing.negotiable && (
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                        Negotiable
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary-600" />
                            <span>{listing.location.city}, {listing.location.area}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary-600" />
                            <span>{format(new Date(listing.createdAt), 'MMM dd, yyyy')}</span>
                        </div>

                        {/* Verification Status Text */}
                        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                            <span className="text-xs font-medium text-gray-700">
                                {listing.verificationStatus === 'verified-onsite' ? '✅ Verified On-Site' :
                                    listing.verificationStatus === 'self-reported' ? '📸 Self-Reported' :
                                        '📸 Self-Reported'}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-500">
                            Contact: <span className="font-medium text-gray-700">{listing.contactName}</span>
                        </p>
                    </div>


                    {/* Edit Button - Only shown in seller dashboard */}
                    {showEditButton && (
                        <div className="mt-3">
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    window.location.href = `/listings/${listing.id}/edit`;
                                }}
                                className="w-full btn btn-outline btn-sm flex items-center justify-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}

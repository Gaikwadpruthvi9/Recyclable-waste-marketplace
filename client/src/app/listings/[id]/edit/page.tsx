'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getListingById, deleteListing } from '@/lib/storage';
import { WasteListing } from '@/lib/types';
import MultiStepListingForm from '@/components/listings/MultiStepListingForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function EditListingPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [listing, setListing] = useState<WasteListing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const id = params.id as string;
        const foundListing = getListingById(id);

        if (!foundListing) {
            setError('Listing not found');
            setLoading(false);
            return;
        }

        // Verify ownership
        if (user && foundListing.sellerId !== user.id) {
            setError('You do not have permission to edit this listing');
            setLoading(false);
            return;
        }

        setListing(foundListing);
        setLoading(false);
    }, [params.id, user]);

    const handleDeleteListing = async () => {
        if (!listing) return;

        setIsDeleting(true);
        try {
            deleteListing(listing.id);
            // Redirect to seller dashboard after deletion
            router.push('/dashboard/seller?deleted=true');
        } catch (error) {
            console.error('Error deleting listing:', error);
            alert('Failed to delete listing. Please try again.');
            setIsDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading listing...</p>
                </div>
            </div>
        );
    }

    if (error || !listing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Cannot Edit Listing</h1>
                    <p className="text-gray-600 mb-6">{error || 'Listing not found'}</p>
                    <button onClick={() => router.back()} className="btn btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={[UserRole.SELLER]}>
            <div className="relative">
                {/* Delete Button - Fixed Position */}
                <div className="container-custom py-4">
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="btn bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        Delete Listing
                    </button>
                </div>

                {/* Form */}
                <MultiStepListingForm editMode={true} existingListing={listing} />

                {/* Delete Confirmation Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
                            {/* Close Button */}
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                                disabled={isDeleting}
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Icon */}
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>

                            {/* Content */}
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                                Delete Listing?
                            </h2>
                            <p className="text-gray-600 mb-6 text-center">
                                Are you sure you want to delete "<strong>{listing.title}</strong>"?
                                This action cannot be undone.
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 btn btn-outline"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteListing}
                                    className="flex-1 btn bg-red-600 text-white hover:bg-red-700"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-5 h-5" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

'use client';

import { ArrowLeft, Check, MapPin, Package, DollarSign, Phone, Image as ImageIcon, Clock } from 'lucide-react';

interface ReviewStepProps {
    formData: any;
    onSubmit: () => void;
    onBack: () => void;
}

export default function ReviewStep({ formData, onSubmit }: ReviewStepProps) {
    const estimatedTotal = formData.pricePerKg && formData.quantity
        ? (parseFloat(formData.pricePerKg) * parseFloat(formData.quantity)).toFixed(2)
        : null;

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Publish</h2>
            <p className="text-gray-600 mb-6">Review your listing before publishing</p>

            <div className="space-y-6">
                {/* Basic Details */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary-600" />
                        Basic Details
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Title</p>
                            <p className="font-semibold text-gray-900">{formData.title}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Category</p>
                                <p className="font-semibold text-gray-900">{formData.category}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Type</p>
                                <p className="font-semibold text-gray-900">{formData.type}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Quantity</p>
                            <p className="font-semibold text-gray-900">{formData.quantity} {formData.unit}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Description</p>
                            <p className="text-gray-900">{formData.description}</p>
                        </div>
                    </div>
                </div>

                {/* Photos */}
                {formData.images.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary-600" />
                            Photos ({formData.images.length})
                        </h3>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {formData.images.map((image: string, index: number) => (
                                <img
                                    key={index}
                                    src={image}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-20 object-cover rounded border border-gray-300"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Location & Availability */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-600" />
                        Location & Availability
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Location</p>
                            <p className="font-semibold text-gray-900">{formData.area}, {formData.city}</p>
                            {formData.address && <p className="text-sm text-gray-700 mt-1">{formData.address}</p>}
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Availability
                            </p>
                            <p className="font-semibold text-gray-900">{formData.availability}</p>
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-primary-50 rounded-lg p-6 border border-primary-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary-600" />
                        Pricing
                    </h3>
                    <div className="space-y-3">
                        {formData.pricePerKg ? (
                            <>
                                <div>
                                    <p className="text-sm text-gray-600">Price per Kilogram</p>
                                    <p className="text-2xl font-bold text-primary-900">₹{formData.pricePerKg}/kg</p>
                                </div>
                                {estimatedTotal && (
                                    <div>
                                        <p className="text-sm text-gray-600">Estimated Total Value</p>
                                        <p className="text-xl font-semibold text-primary-800">₹{estimatedTotal}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-gray-600">Negotiable</p>
                                    <p className="font-semibold text-gray-900">
                                        {formData.negotiable ? 'Yes - Open to negotiation' : 'No - Fixed price'}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-600 italic">Price not disclosed</p>
                        )}
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary-600" />
                        Contact Information
                    </h3>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-600">Contact Person</p>
                            <p className="font-semibold text-gray-900">{formData.contactName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Phone Number</p>
                            <p className="font-semibold text-gray-900">{formData.contactPhone}</p>
                        </div>
                        {formData.contactCompany && (
                            <div>
                                <p className="text-sm text-gray-600">Company</p>
                                <p className="font-semibold text-gray-900">{formData.contactCompany}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submission Notice */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Before You Publish</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Your listing will be reviewed by our team (usually within 24 hours)</li>
                        <li>• Once approved, it will be visible to all buyers on the platform</li>
                        <li>• You can edit or delete your listing anytime from your dashboard</li>
                        <li>• Make sure all information is accurate to avoid delays in approval</li>
                    </ul>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
                <button onClick={() => window.history.back()} className="btn btn-outline">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Edit
                </button>
                <button onClick={onSubmit} className="btn bg-green-600 hover:bg-green-700 text-white">
                    <Check className="w-5 h-5" />
                    Publish Listing
                </button>
            </div>
        </div>
    );
}

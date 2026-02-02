'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface MakeOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (pricePerKg: number, quantity: number, message: string) => void;
    listingTitle: string;
    listingUnit: string;
    currentPrice?: number;
    maxQuantity: number;
}

export default function MakeOfferModal({
    isOpen,
    onClose,
    onSubmit,
    listingTitle,
    listingUnit,
    currentPrice = 0,
    maxQuantity,
}: MakeOfferModalProps) {
    const [pricePerKg, setPricePerKg] = useState(currentPrice || 0);
    const [quantity, setQuantity] = useState(0);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    if (!isOpen) return null;

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (pricePerKg <= 0) {
            newErrors.pricePerKg = 'Price must be greater than 0';
        }

        if (quantity <= 0) {
            newErrors.quantity = 'Quantity must be greater than 0';
        }

        if (quantity > maxQuantity) {
            newErrors.quantity = `Quantity cannot exceed ${maxQuantity} ${listingUnit}`;
        }

        if (!message.trim()) {
            newErrors.message = 'Please add a message with your offer';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit(pricePerKg, quantity, message);
            // Reset form
            setPricePerKg(currentPrice || 0);
            setQuantity(0);
            setMessage('');
            setErrors({});
        }
    };

    const totalAmount = pricePerKg * quantity;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Make an Offer</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Listing Info */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-semibold text-gray-900 mb-1">{listingTitle}</h3>
                        <p className="text-sm text-gray-600">
                            Available: {maxQuantity} {listingUnit}
                        </p>
                        {currentPrice > 0 && (
                            <p className="text-sm text-gray-600">
                                Listed Price: ₹{currentPrice}/{listingUnit}
                            </p>
                        )}
                    </div>

                    {/* Price Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Offer Price (per {listingUnit})
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                            <input
                                type="number"
                                value={pricePerKg || ''}
                                onChange={(e) => setPricePerKg(parseFloat(e.target.value) || 0)}
                                className={`input pl-8 w-full ${errors.pricePerKg ? 'border-red-500' : ''}`}
                                placeholder="0.00"
                                step="0.01"
                                min="0"
                            />
                        </div>
                        {errors.pricePerKg && (
                            <p className="text-red-500 text-sm mt-1">{errors.pricePerKg}</p>
                        )}
                    </div>

                    {/* Quantity Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quantity ({listingUnit})
                        </label>
                        <input
                            type="number"
                            value={quantity || ''}
                            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                            className={`input w-full ${errors.quantity ? 'border-red-500' : ''}`}
                            placeholder="0"
                            step="0.01"
                            min="0"
                            max={maxQuantity}
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                        )}
                    </div>

                    {/* Total Amount Display */}
                    {pricePerKg > 0 && quantity > 0 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-green-900">Total Offer Amount:</span>
                                <span className="text-xl font-bold text-green-700">
                                    ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Message Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message to Seller
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className={`input w-full min-h-[100px] ${errors.message ? 'border-red-500' : ''}`}
                            placeholder="Add any additional details about your offer..."
                            rows={4}
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm mt-1">{errors.message}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                        >
                            Submit Offer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

'use client';

import { ArrowRight, ArrowLeft, DollarSign, TrendingUp, Info } from 'lucide-react';

interface PricingStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PricingStep({ formData, updateFormData, onNext, onBack }: PricingStepProps) {
    const handleNext = () => {
        if (formData.pricePerKg && parseFloat(formData.pricePerKg) <= 0) {
            alert('Please enter a valid price');
            return;
        }
        onNext();
    };

    const estimatedTotal = formData.pricePerKg && formData.quantity
        ? (parseFloat(formData.pricePerKg) * parseFloat(formData.quantity)).toFixed(2)
        : '0';

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pricing Expectations</h2>
            <p className="text-gray-600 mb-6">Set your expected price to help buyers make informed decisions</p>

            <div className="space-y-6">
                {/* Price Per Kg */}
                <div>
                    <label className="label flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price per Kilogram (₹/kg)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
                        <input
                            type="number"
                            className="input pl-10"
                            placeholder="e.g., 25.50"
                            value={formData.pricePerKg}
                            onChange={(e) => updateFormData({ pricePerKg: e.target.value })}
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Leave empty if you prefer not to disclose pricing upfront
                    </p>
                </div>

                {/* Negotiable Toggle */}
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">Price is Negotiable</div>
                            <div className="text-sm text-gray-600">
                                Allow buyers to negotiate the final price
                            </div>
                        </div>
                        <div className="ml-4">
                            <input
                                type="checkbox"
                                className="toggle"
                                checked={formData.negotiable}
                                onChange={(e) => updateFormData({ negotiable: e.target.checked })}
                            />
                        </div>
                    </label>
                </div>

                {/* Estimated Total */}
                {formData.pricePerKg && formData.quantity && (
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-primary-700 mb-1">Estimated Total Value</p>
                                <p className="text-3xl font-bold text-primary-900">₹{estimatedTotal}</p>
                                <p className="text-xs text-primary-600 mt-1">
                                    Based on {formData.quantity} {formData.unit} @ ₹{formData.pricePerKg}/kg
                                </p>
                            </div>
                            <TrendingUp className="w-12 h-12 text-primary-400" />
                        </div>
                    </div>
                )}

                {/* Pricing Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Pricing Tips
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span><strong>Market Rate:</strong> Research current market rates for similar waste materials</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span><strong>Quality Matters:</strong> Higher quality waste commands better prices</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span><strong>Quantity Discount:</strong> Larger quantities often get better rates</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span><strong>Transparency:</strong> Listings with prices get 2x more buyer interest</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span><strong>Negotiable:</strong> Marking as negotiable increases buyer inquiries by 40%</span>
                        </li>
                    </ul>
                </div>

                {/* Market Insights Link */}
                <div className="text-center">
                    <a href="/services/market-insights" className="text-primary-600 hover:text-primary-700 font-semibold text-sm inline-flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        View Market Insights & Pricing Trends
                        <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="btn btn-outline">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button onClick={handleNext} className="btn btn-primary">
                    Continue to Contact
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

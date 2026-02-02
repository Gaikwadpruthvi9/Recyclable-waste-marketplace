'use client';

import { ArrowRight, ArrowLeft, Phone, User, Building } from 'lucide-react';

interface ContactStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function ContactStep({ formData, updateFormData, onNext, onBack }: ContactStepProps) {
    const handleNext = () => {
        if (!formData.contactName || !formData.contactPhone) {
            alert('Please fill in contact name and phone number');
            return;
        }

        // Basic phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.contactPhone.replace(/\s/g, ''))) {
            alert('Please enter a valid 10-digit phone number');
            return;
        }

        onNext();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Information</h2>
            <p className="text-gray-600 mb-6">Confirm your contact details for interested buyers</p>

            <div className="space-y-6">
                {/* Contact Name */}
                <div>
                    <label className="label flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Contact Person Name *
                    </label>
                    <input
                        type="text"
                        className="input"
                        placeholder="e.g., Rajesh Kumar"
                        value={formData.contactName}
                        onChange={(e) => updateFormData({ contactName: e.target.value })}
                    />
                </div>

                {/* Contact Phone */}
                <div>
                    <label className="label flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Contact Phone Number *
                    </label>
                    <input
                        type="tel"
                        className="input"
                        placeholder="e.g., 9876543210"
                        value={formData.contactPhone}
                        onChange={(e) => updateFormData({ contactPhone: e.target.value })}
                        maxLength={10}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        10-digit mobile number without country code
                    </p>
                </div>

                {/* Company Name */}
                <div>
                    <label className="label flex items-center gap-2">
                        <Building className="w-4 h-4" />
                        Company Name (Optional)
                    </label>
                    <input
                        type="text"
                        className="input"
                        placeholder="e.g., ABC Industries Pvt. Ltd."
                        value={formData.contactCompany}
                        onChange={(e) => updateFormData({ contactCompany: e.target.value })}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Adding company name builds trust with buyers
                    </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Privacy & Communication</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>• Your contact details will only be visible to verified buyers</li>
                        <li>• Buyers can reach you directly via phone or through the platform</li>
                        <li>• You can update contact information anytime from your dashboard</li>
                        <li>• We never share your information with third parties</li>
                    </ul>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="btn btn-outline">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button onClick={handleNext} className="btn btn-primary">
                    Review Listing
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

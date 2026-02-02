'use client';

import { ArrowRight, ArrowLeft, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LocationStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function LocationStep({ formData, updateFormData, onNext, onBack }: LocationStepProps) {
    const [isAutoFilled, setIsAutoFilled] = useState(false);
    const [reverseGeocodingError, setReverseGeocodingError] = useState<string | null>(null);

    // Reverse geocode GPS coordinates to get address
    useEffect(() => {
        const reverseGeocode = async () => {
            // Only auto-fill if we have GPS coordinates but no city/area yet
            if (formData.location?.latitude && formData.location?.longitude && !formData.city && !formData.area) {
                try {
                    const { latitude, longitude } = formData.location;

                    // Use Nominatim reverse geocoding (free, no API key required)
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'Scrapify-WasteTradingPlatform'
                            }
                        }
                    );

                    if (!response.ok) {
                        throw new Error('Reverse geocoding failed');
                    }

                    const data = await response.json();
                    const address = data.address;

                    // Extract city and area from the response
                    const city = address.city || address.town || address.village || address.county || '';
                    const area = address.suburb || address.neighbourhood || address.road || '';
                    const fullAddress = data.display_name || '';

                    // Auto-fill the form
                    updateFormData({
                        city: city,
                        area: area,
                        address: fullAddress
                    });

                    setIsAutoFilled(true);
                    console.log('Auto-filled location from GPS:', { city, area });
                } catch (error) {
                    console.error('Reverse geocoding error:', error);
                    setReverseGeocodingError('Could not auto-fill address from GPS. Please enter manually.');
                }
            }
        };

        reverseGeocode();
    }, [formData.location, formData.city, formData.area, updateFormData]);

    const handleNext = () => {
        if (!formData.city || !formData.area) {
            alert('Please fill in city and area');
            return;
        }
        onNext();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Location & Availability</h2>
            <p className="text-gray-600 mb-6">Where is the waste located and when is it available?</p>

            <div className="space-y-6">
                {/* Auto-fill Success Message */}
                {isAutoFilled && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-900 mb-1">📍 Location Auto-Detected!</h3>
                                <p className="text-sm text-green-800">
                                    We've automatically filled in your location from the photo GPS coordinates.
                                    Please verify and adjust if needed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reverse Geocoding Error */}
                {reverseGeocodingError && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800">⚠️ {reverseGeocodingError}</p>
                    </div>
                )}

                {/* City */}
                <div>
                    <label className="label">City *</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="e.g., Mumbai"
                        value={formData.city}
                        onChange={(e) => updateFormData({ city: e.target.value })}
                    />
                </div>

                {/* Area */}
                <div>
                    <label className="label">Area/Locality *</label>
                    <input
                        type="text"
                        className="input"
                        placeholder="e.g., Andheri East"
                        value={formData.area}
                        onChange={(e) => updateFormData({ area: e.target.value })}
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="label">Full Address (Optional)</label>
                    <textarea
                        className="textarea"
                        rows={3}
                        placeholder="Enter complete address for pickup (will be shared only with interested buyers)"
                        value={formData.address}
                        onChange={(e) => updateFormData({ address: e.target.value })}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Full address helps buyers plan logistics better
                    </p>
                </div>

                {/* Availability */}
                <div>
                    <label className="label flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Availability *
                    </label>
                    <select
                        className="input"
                        value={formData.availability}
                        onChange={(e) => updateFormData({ availability: e.target.value })}
                    >
                        <option value="Immediate">Immediate (Available now)</option>
                        <option value="Within 7 days">Within 7 days</option>
                        <option value="Within 15 days">Within 15 days</option>
                        <option value="Within 30 days">Within 30 days</option>
                        <option value="On request">On request</option>
                    </select>
                </div>

                {/* Info Box */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location Privacy
                    </h3>
                    <p className="text-sm text-green-800">
                        Your exact address will only be shared with verified buyers who express interest.
                        City and area will be visible to all users.
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex justify-between">
                <button onClick={onBack} className="btn btn-outline">
                    <ArrowLeft className="w-5 h-5" />
                    Back
                </button>
                <button onClick={handleNext} className="btn btn-primary">
                    Continue to Pricing
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

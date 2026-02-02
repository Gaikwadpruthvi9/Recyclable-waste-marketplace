'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WasteCategory, WasteType, WasteListing } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { addListing, updateListing } from '@/lib/storage';
import { ArrowRight, ArrowLeft, Check, Upload, MapPin, DollarSign, Phone, Eye } from 'lucide-react';

// Step components
import BasicDetailsStep from './steps/BasicDetailsStep';
import PhotoUploadStep from './steps/PhotoUploadStep';
import LocationStep from './steps/LocationStep';
import PricingStep from './steps/PricingStep';
import ContactStep from './steps/ContactStep';
import ReviewStep from './steps/ReviewStep';

interface FormData {
    // Basic Details
    title: string;
    description: string;
    category: WasteCategory | '';
    type: WasteType | '';
    quantity: string;
    unit: 'kg' | 'ton' | 'pieces';

    // Photos
    images: string[];

    // Location & Availability
    city: string;
    area: string;
    address: string;
    availability: string;

    // Pricing
    pricePerKg: string;
    negotiable: boolean;

    // Contact
    contactName: string;
    contactPhone: string;
    contactCompany: string;
}

const STEPS = [
    { id: 1, name: 'Basic Details', icon: Upload },
    { id: 2, name: 'Photos', icon: Upload },
    { id: 3, name: 'Location', icon: MapPin },
    { id: 4, name: 'Pricing', icon: DollarSign },
    { id: 5, name: 'Contact', icon: Phone },
    { id: 6, name: 'Review', icon: Eye },
];

interface MultiStepListingFormProps {
    editMode?: boolean;
    existingListing?: WasteListing | null;
}

export default function MultiStepListingForm({ editMode = false, existingListing = null }: MultiStepListingFormProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);

    // Pre-fill form data from existing listing in edit mode
    const getInitialFormData = (): FormData => {
        if (editMode && existingListing) {
            return {
                title: existingListing.title,
                description: existingListing.description,
                category: existingListing.category,
                type: existingListing.type,
                quantity: existingListing.quantity.toString(),
                unit: existingListing.unit,
                images: existingListing.images || [],
                city: existingListing.location.city,
                area: existingListing.location.area,
                address: existingListing.location.address || '',
                availability: existingListing.availability,
                pricePerKg: existingListing.pricePerKg?.toString() || '',
                negotiable: existingListing.negotiable || false,
                contactName: existingListing.contactName,
                contactPhone: existingListing.contactPhone,
                contactCompany: existingListing.contactCompany || '',
            };
        }

        // Default form data for create mode
        return {
            title: '',
            description: '',
            category: '',
            type: '',
            quantity: '',
            unit: 'kg',
            images: [],
            city: '',
            area: '',
            address: '',
            availability: 'Immediate',
            pricePerKg: '',
            negotiable: false,
            contactName: user?.name || '',
            contactPhone: user?.phone || '',
            contactCompany: user?.company || '',
        };
    };

    const [formData, setFormData] = useState<FormData>(getInitialFormData());

    const updateFormData = (data: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...data }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        if (!user) return;

        // Extract verification data from verified photos
        const verifiedPhotos = (formData as any).verifiedPhotos || [];
        const bestVerificationStatus = verifiedPhotos.length > 0
            ? verifiedPhotos.reduce((best: any, photo: any) => {
                // Prioritize verified-onsite > self-reported > unverified
                if (photo.verificationResult?.status === 'verified-onsite') return photo;
                if (best.verificationResult?.status === 'verified-onsite') return best;
                if (photo.verificationResult?.status === 'self-reported' && best.verificationResult?.status !== 'verified-onsite') return photo;
                return best;
            }, verifiedPhotos[0])
            : null;

        if (editMode && existingListing) {
            // Update existing listing
            const updates: Partial<WasteListing> = {
                title: formData.title,
                description: formData.description,
                category: formData.category as WasteCategory,
                type: formData.type as WasteType,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                pricePerKg: formData.pricePerKg ? parseFloat(formData.pricePerKg) : undefined,
                negotiable: formData.negotiable,
                availability: formData.availability,
                location: {
                    city: formData.city,
                    area: formData.area,
                    address: formData.address || '',
                    latitude: (formData as any).location?.latitude,
                    longitude: (formData as any).location?.longitude,
                },
                images: formData.images,
                contactName: formData.contactName,
                contactPhone: formData.contactPhone,
                contactCompany: formData.contactCompany || '',

                // Add verification data if photos changed
                verificationStatus: bestVerificationStatus?.verificationResult?.status,
                photoMetadata: verifiedPhotos.map((p: any) => p.metadata),
                lastVerifiedAt: bestVerificationStatus ? new Date().toISOString() : undefined,
                locationVerified: bestVerificationStatus?.verificationResult?.locationMatch,
                distanceFromListing: bestVerificationStatus?.verificationResult?.distanceFromListing,
            };

            console.log('Updating listing:', existingListing.id, updates);
            updateListing(existingListing.id, updates);
            router.push(`/listings/${existingListing.id}?success=listing_updated`);
        } else {
            // Create new listing
            const listing: WasteListing = {
                id: Date.now().toString(),
                title: formData.title,
                description: formData.description,
                category: formData.category as WasteCategory,
                type: formData.type as WasteType,
                quantity: parseFloat(formData.quantity),
                unit: formData.unit,
                pricePerKg: formData.pricePerKg ? parseFloat(formData.pricePerKg) : undefined,
                negotiable: formData.negotiable,
                availability: formData.availability,
                location: {
                    city: formData.city,
                    area: formData.area,
                    address: formData.address || '',
                    latitude: (formData as any).location?.latitude,
                    longitude: (formData as any).location?.longitude,
                },
                images: formData.images,
                contactName: formData.contactName,
                contactPhone: formData.contactPhone,
                contactCompany: formData.contactCompany || '',
                sellerId: user.id,
                status: 'pending' as any,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),

                // Add verification data
                verificationStatus: bestVerificationStatus?.verificationResult?.status,
                photoMetadata: verifiedPhotos.map((p: any) => p.metadata),
                lastVerifiedAt: bestVerificationStatus ? new Date().toISOString() : undefined,
                locationVerified: bestVerificationStatus?.verificationResult?.locationMatch,
                distanceFromListing: bestVerificationStatus?.verificationResult?.distanceFromListing,
            };

            console.log('Submitting listing with verification:', {
                verificationStatus: listing.verificationStatus,
                locationVerified: listing.locationVerified,
                distanceFromListing: listing.distanceFromListing
            });

            addListing(listing);
            router.push('/dashboard/seller?success=listing_created');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <BasicDetailsStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />;
            case 2:
                return <PhotoUploadStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 3:
                return <LocationStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 4:
                return <PricingStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 5:
                return <ContactStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onBack={prevStep} />;
            case 6:
                return <ReviewStep formData={formData} onSubmit={handleSubmit} onBack={prevStep} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom max-w-4xl">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep > step.id
                                            ? 'bg-green-500 text-white'
                                            : currentStep === step.id
                                                ? 'bg-primary-600 text-white'
                                                : 'bg-gray-200 text-gray-500'
                                            }`}
                                    >
                                        {currentStep > step.id ? (
                                            <Check className="w-6 h-6" />
                                        ) : (
                                            <step.icon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span className={`text-xs mt-2 font-medium hidden md:block ${currentStep === step.id ? 'text-primary-600' : 'text-gray-500'
                                        }`}>
                                        {step.name}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`h-1 flex-1 mx-2 transition-all ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    {renderStep()}
                </div>

                {/* Mobile Step Indicator */}
                <div className="md:hidden mt-4 text-center text-sm text-gray-600">
                    Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].name}
                </div>
            </div>
        </div>
    );
}

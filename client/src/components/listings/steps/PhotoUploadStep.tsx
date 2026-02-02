'use client';

import { useState } from 'react';
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import CameraCapture from '../CameraCapture';
import VerificationBadge from '../VerificationBadge';
import { PhotoVerificationService } from '@/lib/services/photoVerificationService';
import { CaptureMethod, VerificationStatus, Coordinates, type VerifiedPhoto } from '@/lib/types/verification';

interface PhotoUploadStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function PhotoUploadStep({ formData, updateFormData, onNext, onBack }: PhotoUploadStepProps) {
    const [uploading, setUploading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const [verifiedPhotos, setVerifiedPhotos] = useState<VerifiedPhoto[]>([]);
    const [processingVerification, setProcessingVerification] = useState(false);

    // Process photo with verification
    const processPhoto = async (file: File, captureMethod: CaptureMethod, browserLocation?: Coordinates) => {
        setProcessingVerification(true);

        try {
            // Extract metadata
            const metadata = await PhotoVerificationService.extractPhotoMetadata(file, captureMethod);

            // Use browser location as fallback if EXIF GPS is missing
            if (!metadata.gpsCoordinates && browserLocation) {
                console.log('Using browser location as fallback:', browserLocation);
                metadata.gpsCoordinates = browserLocation;
            }

            // Verify location if listing location is available
            let verificationResult;
            if (formData.location?.latitude && formData.location?.longitude) {
                verificationResult = PhotoVerificationService.verifyPhotoLocation(
                    metadata,
                    {
                        lat: formData.location.latitude,
                        lng: formData.location.longitude
                    }
                );
            } else {
                // No location set yet, mark as self-reported
                verificationResult = {
                    status: VerificationStatus.SELF_REPORTED,
                    locationMatch: false,
                    distanceFromListing: 999,
                    photoAge: 0,
                    requiresReverification: false,
                    verificationDetails: 'Location not set yet - will be verified after location is added'
                };
            }

            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                const verifiedPhoto: VerifiedPhoto = {
                    url: reader.result as string,
                    metadata,
                    verificationResult
                };

                setVerifiedPhotos(prev => [...prev, verifiedPhoto]);
                updateFormData({
                    images: [...formData.images, reader.result as string],
                    verifiedPhotos: [...(formData.verifiedPhotos || []), verifiedPhoto]
                });

                // Auto-fill location from first photo with GPS coordinates
                if (metadata.gpsCoordinates && !formData.location?.latitude) {
                    console.log('Auto-filling location from photo GPS:', metadata.gpsCoordinates);

                    const newLocation = {
                        ...formData.location,
                        latitude: metadata.gpsCoordinates.lat,
                        longitude: metadata.gpsCoordinates.lng
                    };

                    updateFormData({
                        location: newLocation
                    });

                    // Re-verify this photo with the new location
                    const updatedVerificationResult = PhotoVerificationService.verifyPhotoLocation(
                        metadata,
                        {
                            lat: metadata.gpsCoordinates.lat,
                            lng: metadata.gpsCoordinates.lng
                        }
                    );

                    // Update the verified photo with new verification result
                    verifiedPhoto.verificationResult = updatedVerificationResult;

                    // Show success message
                    alert(`📍 Location detected from photo!\n\n✅ Your listing location has been automatically set from the photo GPS.\n🏆 Photo verified as "On-Site" - ${updatedVerificationResult.verificationDetails}\n\nYou can adjust the location in the next step if needed.`);
                }

                setProcessingVerification(false);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Error processing photo:', error);
            setProcessingVerification(false);
        }
    };

    // Handle camera capture
    const handleCameraCapture = async (file: File, captureMethod: CaptureMethod, browserLocation?: Coordinates) => {
        setShowCamera(false);
        await processPhoto(file, captureMethod, browserLocation);
    };

    // Handle file upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        setUploading(true);

        for (const file of Array.from(files)) {
            await processPhoto(file, CaptureMethod.UPLOAD);
        }

        setUploading(false);
    };

    const removeImage = (index: number) => {
        const newImages = formData.images.filter((_: any, i: number) => i !== index);
        const newVerifiedPhotos = verifiedPhotos.filter((_, i) => i !== index);
        setVerifiedPhotos(newVerifiedPhotos);
        updateFormData({
            images: newImages,
            verifiedPhotos: newVerifiedPhotos
        });
    };

    const handleNext = () => {
        if (formData.images.length === 0) {
            const confirm = window.confirm('No photos added. Continue anyway? (Photos help buyers trust your listing)');
            if (!confirm) return;
        }
        onNext();
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Photos</h2>
            <p className="text-gray-600 mb-6">Add verified photos of your waste material</p>

            <div className="space-y-6">
                {/* Camera Capture Button (Primary) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={() => setShowCamera(true)}
                        disabled={uploading || formData.images.length >= 5}
                        className="btn btn-primary flex items-center justify-center gap-2 py-6"
                    >
                        <Camera className="w-6 h-6" />
                        <div className="text-left">
                            <div className="font-semibold">Capture with Camera</div>
                            <div className="text-xs opacity-90">Recommended for verification</div>
                        </div>
                        <CheckCircle className="w-5 h-5 ml-auto" />
                    </button>

                    {/* Upload from Device (Secondary) */}
                    <div className="relative">
                        <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            disabled={uploading || formData.images.length >= 5}
                        />
                        <label
                            htmlFor="image-upload"
                            className={`btn btn-outline flex items-center justify-center gap-2 py-6 w-full cursor-pointer ${uploading || formData.images.length >= 5 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            <Upload className="w-6 h-6" />
                            <div className="text-left">
                                <div className="font-semibold">Upload from Device</div>
                                <div className="text-xs opacity-70">Self-reported</div>
                            </div>
                            <AlertCircle className="w-5 h-5 ml-auto text-yellow-600" />
                        </label>
                    </div>
                </div>

                {/* Verification Info */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Photo Verification
                    </h3>
                    <ul className="text-sm text-green-800 space-y-1">
                        <li>✅ Camera photos include GPS location and timestamp</li>
                        {formData.location?.latitude ? (
                            <li>📍 Location will be verified against your listing address</li>
                        ) : (
                            <li>📍 Photos will be verified after you set location in the next step</li>
                        )}
                        <li>🏆 Verified photos build buyer trust and get more views</li>
                        <li>⚠️ Uploaded photos are marked as "Self-Reported"</li>
                    </ul>
                </div>

                {/* Processing Indicator */}
                {processingVerification && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-blue-800">Verifying photo metadata...</span>
                    </div>
                )}

                {/* Image Preview Grid */}
                {formData.images.length > 0 && (
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">
                            Uploaded Photos ({formData.images.length}/5)
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {formData.images.map((image: string, index: number) => {
                                const verifiedPhoto = verifiedPhotos[index];
                                return (
                                    <div key={index} className="relative group">
                                        <img
                                            src={image}
                                            alt={`Upload ${index + 1}`}
                                            className="w-full h-40 object-cover rounded-lg border-2 border-gray-200"
                                        />
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Verification Badge */}
                                        {verifiedPhoto && (
                                            <div className="absolute bottom-2 left-2">
                                                <VerificationBadge
                                                    status={verifiedPhoto.verificationResult.status as VerificationStatus}
                                                    distanceFromListing={verifiedPhoto.verificationResult.distanceFromListing}
                                                    photoAge={verifiedPhoto.verificationResult.photoAge}
                                                    showDetails={true}
                                                    size="sm"
                                                />
                                            </div>
                                        )}

                                        {index === 0 && (
                                            <div className="absolute top-2 left-2 bg-primary-600 text-white text-xs px-2 py-1 rounded">
                                                Cover Photo
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5" />
                        Photo Tips
                    </h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Use camera capture for automatic verification</li>
                        <li>• Take clear, well-lit photos from multiple angles</li>
                        <li>• Show the overall quantity and close-up details</li>
                        <li>• First photo will be used as the cover image</li>
                        <li>• Verified photos increase buyer interest by 3x!</li>
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
                    Continue to Location
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Camera Capture Modal */}
            {showCamera && (
                <CameraCapture
                    onCapture={handleCameraCapture}
                    onCancel={() => setShowCamera(false)}
                />
            )}
        </div>
    );
}

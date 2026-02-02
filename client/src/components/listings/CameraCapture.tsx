'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, RotateCcw, Check, MapPin } from 'lucide-react';
import { CaptureMethod, Coordinates } from '@/lib/types/verification';

interface CameraCaptureProps {
    onCapture: (file: File, captureMethod: CaptureMethod, browserLocation?: Coordinates) => void;
    onCancel: () => void;
}

export default function CameraCapture({ onCapture, onCancel }: CameraCaptureProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [browserLocation, setBrowserLocation] = useState<Coordinates | null>(null);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [requestingLocation, setRequestingLocation] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Request browser geolocation
    const requestLocation = useCallback(async () => {
        setRequestingLocation(true);
        setLocationError(null);

        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const coords: Coordinates = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            setBrowserLocation(coords);
            console.log('Browser location obtained:', coords);
        } catch (err: any) {
            console.error('Geolocation error:', err);
            setLocationError('Location access denied. Photo will be marked as Self-Reported.');
        } finally {
            setRequestingLocation(false);
        }
    }, []);

    // Start camera
    const startCamera = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment', // Use rear camera on mobile
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });

            setStream(mediaStream);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }

            // Request location after camera starts
            requestLocation();
        } catch (err) {
            console.error('Camera access error:', err);
            setError('Unable to access camera. Please check permissions and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [requestLocation]);

    // Stop camera
    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    // Capture photo
    const capturePhoto = useCallback(() => {
        if (!videoRef.current || !canvasRef.current) return;

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        if (!context) return;

        // Set canvas size to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                setCapturedImage(imageUrl);
                stopCamera();
            }
        }, 'image/jpeg', 0.95);
    }, [stopCamera]);

    // Confirm and save captured photo
    const confirmCapture = useCallback(() => {
        if (!canvasRef.current || !capturedImage) return;

        canvasRef.current.toBlob((blob) => {
            if (blob) {
                const file = new File(
                    [blob],
                    `camera-capture-${Date.now()}.jpg`,
                    { type: 'image/jpeg' }
                );
                // Pass browser location along with the file
                onCapture(file, CaptureMethod.CAMERA, browserLocation || undefined);
            }
        }, 'image/jpeg', 0.95);
    }, [capturedImage, onCapture, browserLocation]);

    // Retake photo
    const retake = useCallback(() => {
        if (capturedImage) {
            URL.revokeObjectURL(capturedImage);
        }
        setCapturedImage(null);
        startCamera();
    }, [capturedImage, startCamera]);

    // Cancel and cleanup
    const handleCancel = useCallback(() => {
        stopCamera();
        if (capturedImage) {
            URL.revokeObjectURL(capturedImage);
        }
        onCancel();
    }, [stopCamera, capturedImage, onCancel]);

    // Auto-start camera on mount
    useEffect(() => {
        startCamera();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Camera className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-bold text-white">
                            {capturedImage ? 'Review Photo' : 'Capture Photo'}
                        </h2>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-800 text-sm">{error}</p>
                            <button
                                onClick={startCamera}
                                className="mt-2 text-red-600 hover:text-red-700 font-medium text-sm"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Camera Preview or Captured Image */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                        {!capturedImage ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover"
                                />
                                {isLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                        <div className="text-white text-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
                                            <p>Starting camera...</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Hidden canvas for capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Location Status */}
                    <div className={`border rounded-lg p-4 mb-4 ${browserLocation ? 'bg-green-50 border-green-200' :
                            locationError ? 'bg-yellow-50 border-yellow-200' :
                                'bg-blue-50 border-blue-200'
                        }`}>
                        <div className="flex items-start gap-3">
                            <MapPin className={`w-5 h-5 mt-0.5 ${browserLocation ? 'text-green-600' :
                                    locationError ? 'text-yellow-600' :
                                        'text-blue-600'
                                }`} />
                            <div className="flex-1">
                                {requestingLocation ? (
                                    <p className="text-blue-800 text-sm">
                                        <strong>Requesting location...</strong> Please allow location access for verification.
                                    </p>
                                ) : browserLocation ? (
                                    <>
                                        <p className="text-green-800 text-sm font-semibold mb-1">
                                            ✅ Location Verified
                                        </p>
                                        <p className="text-green-700 text-xs">
                                            GPS coordinates captured. This photo will be marked as "Verified On-Site" if location matches your listing.
                                        </p>
                                    </>
                                ) : locationError ? (
                                    <>
                                        <p className="text-yellow-800 text-sm font-semibold mb-1">
                                            📸 Location Not Available
                                        </p>
                                        <p className="text-yellow-700 text-xs">
                                            {locationError}
                                        </p>
                                        <button
                                            onClick={requestLocation}
                                            className="mt-2 text-yellow-700 hover:text-yellow-800 font-medium text-xs underline"
                                        >
                                            Try Again
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-blue-800 text-sm">
                                        <strong>📍 Location Verification:</strong> Requesting GPS coordinates to verify photo location...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        {!capturedImage ? (
                            <>
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 btn btn-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={capturePhoto}
                                    disabled={!stream || isLoading}
                                    className="flex-1 btn btn-primary"
                                >
                                    <Camera className="w-5 h-5" />
                                    Capture Photo
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={retake}
                                    className="flex-1 btn btn-outline"
                                >
                                    <RotateCcw className="w-5 h-5" />
                                    Retake
                                </button>
                                <button
                                    onClick={confirmCapture}
                                    className="flex-1 btn btn-primary"
                                >
                                    <Check className="w-5 h-5" />
                                    Use This Photo
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

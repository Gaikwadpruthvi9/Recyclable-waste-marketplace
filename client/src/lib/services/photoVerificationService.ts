import { getDistance } from 'geolib';
import { parse } from 'exifr';
import {
    PhotoMetadata,
    VerificationResult,
    VerificationStatus,
    Coordinates,
    CaptureMethod,
    VERIFICATION_CONFIG
} from '@/lib/types/verification';

/**
 * Photo Verification Service
 * Handles EXIF extraction, location verification, and status determination
 */
export class PhotoVerificationService {
    /**
     * Extract metadata from a photo file
     */
    static async extractPhotoMetadata(
        file: File,
        captureMethod: CaptureMethod
    ): Promise<PhotoMetadata> {
        try {
            const exifData = await parse(file, true);

            const metadata: PhotoMetadata = {
                gpsCoordinates: this.extractGPSCoordinates(exifData),
                timestamp: this.extractTimestamp(exifData),
                deviceInfo: this.extractDeviceInfo(exifData),
                captureMethod,
                fileName: file.name
            };

            return metadata;
        } catch (error) {
            console.error('Error extracting EXIF data:', error);
            return {
                gpsCoordinates: null,
                timestamp: null,
                deviceInfo: null,
                captureMethod,
                fileName: file.name
            };
        }
    }

    /**
     * Extract GPS coordinates from EXIF data
     */
    private static extractGPSCoordinates(exifData: any): Coordinates | null {
        if (!exifData || !exifData.latitude || !exifData.longitude) {
            return null;
        }

        return {
            lat: exifData.latitude,
            lng: exifData.longitude
        };
    }

    /**
     * Extract timestamp from EXIF data
     */
    private static extractTimestamp(exifData: any): Date | null {
        if (!exifData) return null;

        // Try different EXIF date fields
        const dateFields = [
            'DateTimeOriginal',
            'DateTime',
            'CreateDate',
            'ModifyDate'
        ];

        for (const field of dateFields) {
            if (exifData[field]) {
                const date = new Date(exifData[field]);
                if (!isNaN(date.getTime())) {
                    return date;
                }
            }
        }

        return null;
    }

    /**
     * Extract device information from EXIF data
     */
    private static extractDeviceInfo(exifData: any): string | null {
        if (!exifData) return null;

        const make = exifData.Make || '';
        const model = exifData.Model || '';

        if (make || model) {
            return `${make} ${model}`.trim();
        }

        return null;
    }

    /**
     * Verify photo location against listing location
     */
    static verifyPhotoLocation(
        metadata: PhotoMetadata,
        listingLocation: Coordinates
    ): VerificationResult {
        const now = new Date();
        // If no timestamp, treat as current photo (0 days old) for camera captures
        // This is because browser-captured photos don't have EXIF timestamp
        const photoAge = metadata.timestamp
            ? Math.floor((now.getTime() - metadata.timestamp.getTime()) / (1000 * 60 * 60 * 24))
            : (metadata.captureMethod === CaptureMethod.CAMERA ? 0 : 999);

        // Calculate distance if GPS data available
        let distanceKm = 999;
        let locationMatch = false;

        if (metadata.gpsCoordinates) {
            distanceKm = this.calculateDistance(
                metadata.gpsCoordinates,
                listingLocation
            );
            locationMatch = distanceKm <= VERIFICATION_CONFIG.LOCATION_TOLERANCE_KM;
        }

        // Determine verification status
        const status = this.determineVerificationStatus(
            metadata,
            locationMatch,
            photoAge
        );

        // Check if re-verification required
        const requiresReverification = photoAge > VERIFICATION_CONFIG.EXPIRY_AGE_DAYS;

        // Generate verification details message
        const verificationDetails = this.generateVerificationDetails(
            status,
            distanceKm,
            photoAge,
            metadata
        );

        return {
            status,
            locationMatch,
            distanceFromListing: distanceKm,
            photoAge,
            requiresReverification,
            verificationDetails
        };
    }

    /**
     * Calculate distance between two coordinates in kilometers
     */
    static calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
        const distanceMeters = getDistance(
            { latitude: coord1.lat, longitude: coord1.lng },
            { latitude: coord2.lat, longitude: coord2.lng }
        );
        return distanceMeters / 1000; // Convert to km
    }

    /**
     * Determine verification status based on criteria
     */
    private static determineVerificationStatus(
        metadata: PhotoMetadata,
        locationMatch: boolean,
        photoAge: number
    ): VerificationStatus {
        // Expired if too old
        if (photoAge > VERIFICATION_CONFIG.EXPIRY_AGE_DAYS) {
            return VerificationStatus.EXPIRED;
        }

        // Unverified if no GPS or uploaded file
        if (!metadata.gpsCoordinates) {
            return metadata.captureMethod === CaptureMethod.CAMERA
                ? VerificationStatus.SELF_REPORTED
                : VerificationStatus.UNVERIFIED;
        }

        // Verified on-site if camera + GPS + location match + recent
        if (
            metadata.captureMethod === CaptureMethod.CAMERA &&
            locationMatch &&
            photoAge <= VERIFICATION_CONFIG.WARNING_AGE_DAYS
        ) {
            return VerificationStatus.VERIFIED_ONSITE;
        }

        // Self-reported if location doesn't match or uploaded
        if (!locationMatch || metadata.captureMethod === CaptureMethod.UPLOAD) {
            return VerificationStatus.SELF_REPORTED;
        }

        return VerificationStatus.SELF_REPORTED;
    }

    /**
     * Generate human-readable verification details
     */
    private static generateVerificationDetails(
        status: VerificationStatus,
        distance: number,
        age: number,
        metadata: PhotoMetadata
    ): string {
        switch (status) {
            case VerificationStatus.VERIFIED_ONSITE:
                return `Verified on-site photo taken ${age} day${age !== 1 ? 's' : ''} ago, ${distance.toFixed(1)} km from listing location`;

            case VerificationStatus.SELF_REPORTED:
                if (!metadata.gpsCoordinates) {
                    return 'Self-reported - No location data available';
                }
                if (distance > VERIFICATION_CONFIG.LOCATION_TOLERANCE_KM) {
                    return `Self-reported - Photo location ${distance.toFixed(1)} km from listing`;
                }
                return 'Self-reported - Uploaded from device';

            case VerificationStatus.UNVERIFIED:
                return 'Unverified - No metadata available';

            case VerificationStatus.EXPIRED:
                return `Expired - Photo is ${age} days old, requires re-verification`;

            default:
                return 'Unknown verification status';
        }
    }

    /**
     * Check if listing requires re-verification
     */
    static checkReverificationRequired(lastVerifiedDate: Date): boolean {
        const now = new Date();
        const daysSinceVerification = Math.floor(
            (now.getTime() - lastVerifiedDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        return daysSinceVerification > VERIFICATION_CONFIG.EXPIRY_AGE_DAYS;
    }

    /**
     * Get verification badge info
     */
    static getVerificationBadgeInfo(status: VerificationStatus): {
        label: string;
        color: string;
        icon: string;
        description: string;
    } {
        // Define a mapping for colors to avoid lint errors for hardcoded strings if needed elsewhere
        const colorClasses: Record<string, string> = {
            green: 'green',
            yellow: 'yellow',
            red: 'red',
            orange: 'orange',
            gray: 'gray',
        };

        switch (status) {
            case VerificationStatus.VERIFIED_ONSITE:
                return {
                    label: 'Verified On-Site',
                    color: colorClasses.green,
                    icon: '✅',
                    description: 'Photo captured on-site with verified location'
                };

            case VerificationStatus.SELF_REPORTED:
                return {
                    label: 'Self-Reported',
                    color: 'yellow',
                    icon: '📸',
                    description: 'Photo uploaded by seller without location verification'
                };

            case VerificationStatus.UNVERIFIED:
                return {
                    label: 'Unverified',
                    color: 'red',
                    icon: '⚠️',
                    description: 'No verification data available'
                };

            case VerificationStatus.EXPIRED:
                return {
                    label: 'Expired',
                    color: 'orange',
                    icon: '🔄',
                    description: 'Verification expired, requires update'
                };

            default:
                return {
                    label: 'Unknown',
                    color: 'gray',
                    icon: '❓',
                    description: 'Unknown verification status'
                };
        }
    }
}

// Photo verification types and enums

export enum VerificationStatus {
    VERIFIED_ONSITE = 'verified-onsite',
    SELF_REPORTED = 'self-reported',
    UNVERIFIED = 'unverified',
    EXPIRED = 'expired'
}

export enum CaptureMethod {
    CAMERA = 'camera',
    UPLOAD = 'upload'
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface PhotoMetadata {
    gpsCoordinates: Coordinates | null;
    timestamp: Date | null;
    deviceInfo: string | null;
    captureMethod: CaptureMethod;
    fileName: string;
}

export interface VerificationResult {
    status: VerificationStatus;
    locationMatch: boolean;
    distanceFromListing: number; // in km
    photoAge: number; // in days
    requiresReverification: boolean;
    verificationDetails: string;
}

export interface VerifiedPhoto {
    url: string;
    metadata: PhotoMetadata;
    verificationResult: VerificationResult;
}

// Configuration constants
export const VERIFICATION_CONFIG = {
    LOCATION_TOLERANCE_KM: 5,
    WARNING_AGE_DAYS: 30,
    EXPIRY_AGE_DAYS: 60,
    MIN_ACCURACY_METERS: 100
};

// Type Definitions for Waste Trading Platform

export enum UserRole {
    SELLER = 'seller',
    BUYER = 'buyer',
    ADMIN = 'admin',
}

export enum WasteCategory {
    PLASTIC = 'Plastic',
    METAL = 'Metal',
    E_WASTE = 'E-Waste',
    PAPER = 'Paper',
    GLASS = 'Glass',
    CHEMICAL = 'Chemical',
    ORGANIC = 'Organic',
    OTHER = 'Other',
}

export enum WasteType {
    INDUSTRIAL = 'Industrial',
    COMMERCIAL = 'Commercial',
    MANUFACTURING = 'Manufacturing Scrap',
}

export enum ListingStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export interface User {
    id: string;
    email: string;
    password: string; // Base64 encoded for demo
    role: UserRole;
    name: string;
    phone: string;
    company?: string;
    createdAt: string;
    blocked?: boolean;
    profilePicture?: string; // Base64 or URL
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string; // Mock secret for demo
    isVerified?: boolean;
}

export interface Location {
    city: string;
    area: string;
    latitude?: number;
    longitude?: number;
    address?: string;
}

export interface WasteListing {
    id: string;
    title: string;
    description: string;
    category: WasteCategory;
    type: WasteType;
    quantity: number;
    unit: 'kg' | 'ton' | 'pieces';
    pricePerKg?: number; // Price in ₹ per kg
    negotiable: boolean; // Whether price is negotiable
    availability?: string; // e.g., "Immediate", "Within 7 days"
    location: Location;
    images: string[]; // Base64 or URLs
    contactName: string;
    contactPhone: string;
    contactCompany?: string;
    sellerId: string;
    status: ListingStatus;
    createdAt: string;
    updatedAt: string;
    rejectionReason?: string;

    // Photo Verification Fields
    verificationStatus?: string; // VerificationStatus enum value
    photoMetadata?: any[]; // PhotoMetadata array
    lastVerifiedAt?: string;
    verificationExpiry?: string;
    locationVerified?: boolean;
    distanceFromListing?: number;
}

export interface FilterOptions {
    category?: WasteCategory;
    location?: string;
    minQuantity?: number;
    maxQuantity?: number;
    searchTerm?: string;
}

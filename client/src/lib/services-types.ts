// Service-related type definitions

export enum ServiceCategory {
    LOGISTICS = 'logistics',
    AUDIT = 'audit',
    COMPLIANCE = 'compliance',
    HAZARDOUS = 'hazardous',
    INSIGHTS = 'insights',
    REPORTING = 'reporting'
}

export interface PricingTier {
    name: string;
    price: number;
    unit: string;
    features: string[];
    popular?: boolean;
}

export interface Service {
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    icon: string;
    category: ServiceCategory;
    features: string[];
    benefits: string[];
    pricing: PricingTier[];
    active: boolean;
}

export enum RequestStatus {
    REQUESTED = 'requested',
    IN_REVIEW = 'in_review',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface ServiceRequest {
    id: string;
    userId: string;
    serviceId: string;
    companyName?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    requirements?: string;
    status: RequestStatus;
    data?: any; // For dynamic form data (e.g., location, document type)
    quotedPrice?: number;
    notes?: string; // Admin notes
    assignedTo?: string; // Transporter or Auditor name
    createdAt: string;
    updatedAt: string;
}

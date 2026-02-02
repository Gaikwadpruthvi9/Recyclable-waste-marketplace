'use client';

import { VerificationStatus } from '@/lib/types/verification';
import { PhotoVerificationService } from '@/lib/services/photoVerificationService';
import { CheckCircle, Camera, AlertTriangle, RotateCw } from 'lucide-react';

interface VerificationBadgeProps {
    status: VerificationStatus;
    distanceFromListing?: number;
    photoAge?: number;
    showDetails?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function VerificationBadge({
    status,
    distanceFromListing,
    photoAge,
    showDetails = false,
    size = 'md'
}: VerificationBadgeProps) {
    const badgeInfo = PhotoVerificationService.getVerificationBadgeInfo(status);

    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2'
    };

    const iconSizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const colorClasses = {
        green: 'bg-green-100 text-green-800 border-green-200',
        yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        red: 'bg-red-100 text-red-800 border-red-200',
        orange: 'bg-orange-100 text-orange-800 border-orange-200',
        gray: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const getIcon = () => {
        const iconClass = iconSizes[size];
        switch (status) {
            case VerificationStatus.VERIFIED_ONSITE:
                return <CheckCircle className={iconClass} />;
            case VerificationStatus.SELF_REPORTED:
                return <Camera className={iconClass} />;
            case VerificationStatus.UNVERIFIED:
                return <AlertTriangle className={iconClass} />;
            case VerificationStatus.EXPIRED:
                return <RotateCw className={iconClass} />;
            default:
                return null;
        }
    };

    const getDetailsText = () => {
        if (!showDetails) return null;

        const parts = [];
        if (photoAge !== undefined) {
            parts.push(`${photoAge} day${photoAge !== 1 ? 's' : ''} ago`);
        }
        if (distanceFromListing !== undefined && distanceFromListing < 999) {
            parts.push(`${distanceFromListing.toFixed(1)} km away`);
        }

        return parts.length > 0 ? parts.join(' • ') : null;
    };

    const detailsText = getDetailsText();

    return (
        <div className="inline-block group relative">
            <div
                className={`
                    inline-flex items-center gap-2 rounded-full border font-medium
                    ${sizeClasses[size]}
                    ${colorClasses[badgeInfo.color as keyof typeof colorClasses]}
                    transition-all duration-200
                    hover:shadow-md
                `}
            >
                {getIcon()}
                <span>{badgeInfo.label}</span>
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <div className="font-medium mb-1">{badgeInfo.description}</div>
                {detailsText && (
                    <div className="text-gray-300">{detailsText}</div>
                )}
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                </div>
            </div>
        </div>
    );
}

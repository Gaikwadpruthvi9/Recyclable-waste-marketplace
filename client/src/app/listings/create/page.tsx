'use client';

import { UserRole } from '@/lib/types';
import MultiStepListingForm from '@/components/listings/MultiStepListingForm';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function CreateListingPage() {
    return (
        <ProtectedRoute allowedRoles={[UserRole.SELLER]}>
            <MultiStepListingForm />
        </ProtectedRoute>
    );
}

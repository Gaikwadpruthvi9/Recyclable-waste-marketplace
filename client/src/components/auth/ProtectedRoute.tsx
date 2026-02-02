'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { UserRole } from '@/lib/types';
import { AlertTriangle, Lock } from 'lucide-react';
import Link from 'next/link';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    requireAuth?: boolean;
}

export default function ProtectedRoute({
    children,
    allowedRoles,
    requireAuth = true
}: ProtectedRouteProps) {
    const { user, isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Wait for loading to complete before checking auth
        if (loading) return;

        // Redirect to login if authentication is required but user is not authenticated
        if (requireAuth && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, requireAuth, router]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if not authenticated (will redirect)
    if (requireAuth && !isAuthenticated) {
        return null;
    }

    // Check role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
                    <p className="text-gray-600 mb-6">
                        You don't have permission to access this page. This page is only available to {allowedRoles.join(', ')} users.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Current role: <strong>{user.role}</strong></span>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/" className="flex-1 btn btn-outline">
                            Go Home
                        </Link>
                        <Link
                            href={
                                user.role === 'admin' ? '/dashboard/admin' :
                                    user.role === 'seller' ? '/dashboard/seller' :
                                        '/dashboard/buyer'
                            }
                            className="flex-1 btn btn-primary"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Render children if all checks pass
    return <>{children}</>;
}

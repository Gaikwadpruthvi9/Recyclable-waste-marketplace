'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getAuthUser, login as authLogin, logout as authLogout, signup as authSignup, SignupData } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check for existing session
        const currentUser = getAuthUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const result = authLogin(email, password);
        if (result.success && result.user) {
            setUser(result.user);

            // Redirect based on role
            if (result.user.role === 'admin') {
                router.push('/dashboard/admin');
            } else if (result.user.role === 'seller') {
                router.push('/dashboard/seller');
            } else {
                router.push('/dashboard/buyer');
            }
        }
        return result;
    };

    const signup = async (data: SignupData) => {
        const result = authSignup(data);
        if (result.success) {
            router.push('/login');
        }
        return result;
    };

    const logout = () => {
        authLogout();
        setUser(null);
        router.push('/');
    };

    return {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
    };
};

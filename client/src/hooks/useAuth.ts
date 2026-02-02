'use client';

import { useState, useEffect } from 'react';
import { User } from '@/lib/types';
import { getAuthUser, login as authLogin, logout as authLogout, signup as authSignup, SignupData } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
    // Initialize user state synchronously from localStorage to avoid loading delay
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window !== 'undefined') {
            return getAuthUser();
        }
        return null;
    });
    const [loading, setLoading] = useState(false); // Changed to false since we load synchronously
    const router = useRouter();

    // No need for useEffect since we load synchronously in useState initializer

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

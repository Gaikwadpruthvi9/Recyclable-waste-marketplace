// Authentication utilities
import { User, UserRole } from './types';
import { getUserByEmail, addUser, getCurrentUser, setCurrentUser, initializeStorage } from './storage';

export interface SignupData {
    email: string;
    password: string;
    name: string;
    phone: string;
    role: UserRole;
    company?: string;
}

export const signup = (data: SignupData): { success: boolean; error?: string; user?: User } => {
    // Check if user already exists
    const existingUser = getUserByEmail(data.email);
    if (existingUser) {
        return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser: User = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        email: data.email,
        password: btoa(data.password), // Base64 encode for demo
        role: data.role,
        name: data.name,
        phone: data.phone,
        company: data.company,
        createdAt: new Date().toISOString(),
    };

    addUser(newUser);
    return { success: true, user: newUser };
};

export const login = (email: string, password: string): { success: boolean; error?: string; user?: User } => {
    const user = getUserByEmail(email);

    if (!user) {
        return { success: false, error: 'Invalid email or password' };
    }

    if (user.blocked) {
        return { success: false, error: 'Your account has been blocked' };
    }

    // Verify password (decode base64 and compare)
    try {
        const decodedPassword = atob(user.password);
        if (decodedPassword !== password) {
            return { success: false, error: 'Invalid email or password' };
        }
    } catch (error) {
        // If password is not properly base64 encoded, try direct comparison
        // This handles legacy data or corrupted passwords
        if (user.password !== password) {
            return { success: false, error: 'Invalid email or password' };
        }
    }

    // Set current user session
    setCurrentUser(user);
    return { success: true, user };
};

export const logout = (): void => {
    setCurrentUser(null);
};

export const isAuthenticated = (): boolean => {
    return getCurrentUser() !== null;
};

export const getAuthUser = (): User | null => {
    return getCurrentUser();
};

export const requireAuth = (allowedRoles?: UserRole[]): User | null => {
    const user = getCurrentUser();

    if (!user) {
        return null;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return null;
    }

    return user;
};

// Initialize storage on import
if (typeof window !== 'undefined') {
    initializeStorage();
}

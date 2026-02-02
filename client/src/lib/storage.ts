// localStorage wrapper for data persistence
import { User, WasteListing } from './types';

const STORAGE_KEYS = {
    USERS: 'waste_platform_users',
    LISTINGS: 'waste_platform_listings',
    CURRENT_USER: 'waste_platform_current_user',
};

// Users
export const getUsers = (): User[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
};

export const saveUsers = (users: User[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: User): void => {
    const users = getUsers();
    users.push(user);
    saveUsers(users);
};

export const getUserById = (id: string): User | undefined => {
    if (typeof window === 'undefined') return undefined;
    const users = getUsers();
    return users.find(u => u.id === id);
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
    if (typeof window === 'undefined') return null;
    const users = getUsers();
    const index = users.findIndex(u => u.id === userId);

    if (index !== -1) {
        // Prevent changing immutable fields
        const { id, email, ...safeUpdates } = updates as any;

        users[index] = { ...users[index], ...safeUpdates };
        saveUsers(users);

        // Update current user session if it matches
        const currentUserStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (currentUserStr) {
            const currentUser = JSON.parse(currentUserStr);
            if (currentUser.id === userId) {
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(users[index]));
                // Trigger storage event for cross-tab or hook updates
                window.dispatchEvent(new Event('storage'));
            }
        }

        return users[index];
    }
    return null;
};

export const getUserByEmail = (email: string): User | undefined => {
    return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
};

// Listings
export const getListings = (): WasteListing[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.LISTINGS);
    return data ? JSON.parse(data) : [];
};

export const saveListings = (listings: WasteListing[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
};

export const addListing = (listing: WasteListing): void => {
    const listings = getListings();
    listings.push(listing);
    saveListings(listings);
};

export const updateListing = (listingId: string, updates: Partial<WasteListing>): void => {
    const listings = getListings();
    const index = listings.findIndex(l => l.id === listingId);
    if (index !== -1) {
        const original = listings[index];

        // Detect sensitive field changes that require re-verification
        const sensitiveFieldsChanged =
            (updates.images && JSON.stringify(updates.images) !== JSON.stringify(original.images)) ||
            (updates.category && updates.category !== original.category) ||
            (updates.location && (
                updates.location.city !== original.location.city ||
                updates.location.area !== original.location.area ||
                updates.location.latitude !== original.location.latitude ||
                updates.location.longitude !== original.location.longitude
            ));

        // If sensitive fields changed, reset to pending review
        if (sensitiveFieldsChanged) {
            updates.status = 'pending' as any;
            updates.verificationStatus = undefined; // Clear verification
            console.log('Sensitive fields changed - resetting to pending review');
        }

        listings[index] = {
            ...original,
            ...updates,
            updatedAt: new Date().toISOString()
        };
        saveListings(listings);
    }
};

export const deleteListing = (listingId: string): void => {
    const listings = getListings();
    const filtered = listings.filter(l => l.id !== listingId);
    saveListings(filtered);
};

export const getListingById = (id: string): WasteListing | undefined => {
    return getListings().find(l => l.id === id);
};

// Session
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
    if (typeof window === 'undefined') return;
    if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
};

// Initialize with admin user if no users exist
export const initializeStorage = (): void => {
    if (typeof window === 'undefined') return;

    const users = getUsers();
    if (users.length === 0) {
        // Create default admin user
        const adminUser: User = {
            id: 'admin-001',
            email: 'admin@waste.com',
            password: btoa('admin123'), // Base64 encoded
            role: 'admin' as any,
            name: 'Admin User',
            phone: '+1234567890',
            company: 'Waste Platform',
            createdAt: new Date().toISOString(),
        };
        addUser(adminUser);
    }
};

// Clear all storage and reinitialize (useful for fixing corrupted data)
export const clearStorage = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.LISTINGS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    initializeStorage();
};

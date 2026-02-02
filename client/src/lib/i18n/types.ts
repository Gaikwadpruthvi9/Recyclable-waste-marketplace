// Language types and configuration

export type Language = 'en' | 'mr' | 'hi';

export interface LanguageOption {
    code: Language;
    name: string;
    nativeName: string;
    flag: string;
}

export const LANGUAGES: LanguageOption[] = [
    {
        code: 'en',
        name: 'English',
        nativeName: 'English',
        flag: '🇬🇧'
    },
    {
        code: 'mr',
        name: 'Marathi',
        nativeName: 'मराठी',
        flag: '🇮🇳'
    },
    {
        code: 'hi',
        name: 'Hindi',
        nativeName: 'हिन्दी',
        flag: '🇮🇳'
    }
];

export const DEFAULT_LANGUAGE: Language = 'en';

// Translation interface structure
export interface Translations {
    // Header & Navigation
    header: {
        home: string;
        browseWaste: string;
        services: string;
        dashboard: string;
        login: string;
        signup: string;
        logout: string;
        profile: string;
        settings: string;
    };

    // Homepage
    home: {
        hero: {
            badge: string;
            title: string;
            subtitle: string;
            description: string;
            primaryCTA: string;
            secondaryCTA: string;
            features: {
                verified: string;
                secure: string;
                activeUsers: string;
            };
        };
        stats: {
            activeListings: string;
            registeredUsers: string;
            wasteCategories: string;
            ecoFriendly: string;
        };
        categories: {
            title: string;
            description: string;
            viewAll: string;
            plastic: { name: string; desc: string; };
            metal: { name: string; desc: string; };
            ewaste: { name: string; desc: string; };
            paper: { name: string; desc: string; };
            glass: { name: string; desc: string; };
            chemical: { name: string; desc: string; };
            organic: { name: string; desc: string; };
            other: { name: string; desc: string; };
        };
        howItWorks: {
            title: string;
            description: string;
            step1Title: string;
            step1Desc: string;
            step2Title: string;
            step2Desc: string;
            step3Title: string;
            step3Desc: string;
        };
        whyChoose: {
            title: string;
            description: string;
        };
        services: {
            title: string;
            description: string;
            exploreAll: string;
        };
    };

    // Common
    common: {
        submit: string;
        cancel: string;
        save: string;
        delete: string;
        edit: string;
        view: string;
        search: string;
        filter: string;
        loading: string;
        error: string;
        success: string;
        confirm: string;
        close: string;
        next: string;
        back: string;
        continue: string;
    };

    // Forms
    forms: {
        email: string;
        password: string;
        name: string;
        phone: string;
        company: string;
        city: string;
        area: string;
        address: string;
        category: string;
        quantity: string;
        description: string;
        price: string;
        negotiable: string;
    };

    // Messages
    messages: {
        loginSuccess: string;
        logoutSuccess: string;
        listingCreated: string;
        listingUpdated: string;
        listingDeleted: string;
        error: string;
        required: string;
    };

    // Categories
    categories: {
        plastic: string;
        metal: string;
        ewaste: string;
        paper: string;
        glass: string;
        chemical: string;
        organic: string;
        other: string;
    };

    // Listings Page
    listings: {
        title: string;
        subtitle: string;
        filters: string;
        sortBy: string;
        noListings: string;
        searchPlaceholder: string;
        contactSeller: string;
        viewDetails: string;
    };

    // Services Page
    servicesPage: {
        title: string;
        subtitle: string;
        logistics: { title: string; desc: string; };
        recycling: { title: string; desc: string; };
        consulting: { title: string; desc: string; };
        cta: string;
    };

    // Profile Page
    profilePage: {
        title: string;
        editProfile: string;
        contactInfo: string;
        accountType: string;
        memberSince: string;
        companyDetails: string;
        verifiedAccount: string;
        activeListings: string;
        totalSales: string;
        impactScore: string;
        completedOrders: string;
        totalRecycled: string;
    };

    // Settings Page
    settingsPage: {
        title: string;
        profile: string;
        notifications: string;
        security: string;
        saveChanges: string;
        changePassword: string;
        twoFactor: string;
    };

    // Dashboard
    dashboard: {
        title: string;
        overview: string;
        myListings: string;
        messages: string;
        analytics: string;
        recentActivity: string;
        welcomeBack: string;
        createListing: string;
        totalListings: string;
        pending: string;
        approved: string;
        rejected: string;
        noListings: string;
        createFirst: string;
        confirmDelete: string;
        tabs: {
            listings: string;
            services: string;
        };
        services: {
            title: string;
            id: string;
            type: string;
            status: string;
            date: string;
            actions: string;
            noServices: string;
            browseServices: string;
        };
    };
}

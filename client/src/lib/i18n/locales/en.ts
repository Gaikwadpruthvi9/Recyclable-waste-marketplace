import { Translations } from '../types';

export const en: Translations = {
    header: {
        home: 'Home',
        browseWaste: 'Browse Waste',
        services: 'Services',
        dashboard: 'Dashboard',
        login: 'Login',
        signup: 'Sign Up',
        logout: 'Logout',
        profile: 'Profile',
        settings: 'Settings'
    },


    home: {
        hero: {
            badge: 'Trusted Waste Trading Platform',
            title: 'Connect Industries with',
            subtitle: 'Recyclers Instantly',
            description: 'The modern marketplace for recyclable industrial waste. List your waste, find buyers, and contribute to a sustainable circular economy—all in one platform.',
            primaryCTA: 'Post Your Waste',
            secondaryCTA: 'Find Recyclables',
            features: {
                verified: 'Verified Listings',
                secure: 'Secure Platform',
                activeUsers: 'Active Users'
            }
        },
        stats: {
            activeListings: 'Active Listings',
            registeredUsers: 'Registered Users',
            wasteCategories: 'Waste Categories',
            ecoFriendly: 'Eco-Friendly'
        },
        categories: {
            title: 'Browse by Category',
            description: 'Find the exact type of recyclable waste you\'re looking for',
            viewAll: 'View All Listings',
            plastic: { name: 'Plastic', desc: 'All types' },
            metal: { name: 'Metal', desc: 'Scrap & more' },
            ewaste: { name: 'E-Waste', desc: 'Electronics' },
            paper: { name: 'Paper', desc: 'Cardboard' },
            glass: { name: 'Glass', desc: 'Bottles & more' },
            chemical: { name: 'Chemical', desc: 'Industrial' },
            organic: { name: 'Organic', desc: 'Compostable' },
            other: { name: 'Other', desc: 'Miscellaneous' }
        },
        howItWorks: {
            title: 'How It Works',
            description: 'Simple, transparent, and efficient waste trading in three easy steps',
            step1Title: 'List Your Waste',
            step1Desc: 'Upload photos, describe your recyclable waste, and set your location. Quick and easy listing process.',
            step2Title: 'Connect with Traders',
            step2Desc: 'Buyers browse listings, filter by category and location, then contact you directly via phone or WhatsApp.',
            step3Title: 'Complete the Deal',
            step3Desc: 'Negotiate terms, arrange pickup or delivery, and complete the transaction. Turn your waste into value!'
        },
        whyChoose: {
            title: 'Why Choose Scrapify?',
            description: 'The most trusted platform for recyclable waste trading'
        },
        services: {
            title: 'Beyond Waste Trading',
            description: 'Comprehensive services to support your entire recycling journey',
            exploreAll: 'Explore All Services'
        }
    },


    common: {
        submit: 'Submit',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        view: 'View',
        search: 'Search',
        filter: 'Filter',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        confirm: 'Confirm',
        close: 'Close',
        next: 'Next',
        back: 'Back',
        continue: 'Continue'
    },

    forms: {
        email: 'Email',
        password: 'Password',
        name: 'Name',
        phone: 'Phone',
        company: 'Company',
        city: 'City',
        area: 'Area',
        address: 'Address',
        category: 'Category',
        quantity: 'Quantity',
        description: 'Description',
        price: 'Price',
        negotiable: 'Negotiable'
    },

    messages: {
        loginSuccess: 'Login successful',
        logoutSuccess: 'Logged out successfully',
        listingCreated: 'Listing created successfully',
        listingUpdated: 'Listing updated successfully',
        listingDeleted: 'Listing deleted successfully',
        error: 'An error occurred',
        required: 'This field is required'
    },

    categories: {
        plastic: 'Plastic',
        metal: 'Metal',
        ewaste: 'E-Waste',
        paper: 'Paper',
        glass: 'Glass',
        chemical: 'Chemical',
        organic: 'Organic',
        other: 'Other'
    },

    listings: {
        title: 'Browse Waste Listings',
        subtitle: 'Find available recyclable materials from verified sellers',
        filters: 'Filters',
        sortBy: 'Sort By',
        noListings: 'No listings found matching your criteria',
        searchPlaceholder: 'Search by material, location...',
        contactSeller: 'Contact Seller',
        viewDetails: 'View Details'
    },

    servicesPage: {
        title: 'Our Services',
        subtitle: 'Comprehensive waste management solutions for your business',
        logistics: {
            title: 'Logistics & Transport',
            desc: 'Reliable pickup and delivery services for bulk waste transport.'
        },
        recycling: {
            title: 'Recycling Processing',
            desc: 'Certified recycling partners ensuring responsible waste processing.'
        },
        consulting: {
            title: 'Waste Audits & Consulting',
            desc: 'Expert advice to optimize your waste management strategy.'
        },
        cta: 'Request a Service'
    },

    profilePage: {
        title: 'My Profile',
        editProfile: 'Edit Profile',
        contactInfo: 'Contact Information',
        accountType: 'Account Type',
        memberSince: 'Member Since',
        companyDetails: 'Business Details',
        verifiedAccount: 'Verified Account',
        activeListings: 'Active Listings',
        totalSales: 'Total Sales',
        impactScore: 'Impact Score',
        completedOrders: 'Completed Orders',
        totalRecycled: 'Total Recycled'
    },

    settingsPage: {
        title: 'Settings',
        profile: 'Profile Settings',
        notifications: 'Notification Preferences',
        security: 'Security Settings',
        saveChanges: 'Save Changes',
        changePassword: 'Change Password',
        twoFactor: 'Two-Factor Authentication'
    },

    dashboard: {
        title: 'Dashboard',
        overview: 'Overview',
        myListings: 'My Listings',
        messages: 'Messages',
        analytics: 'Analytics',
        recentActivity: 'Recent Activity',
        welcomeBack: 'Welcome back',
        createListing: 'Create New Listing',
        totalListings: 'Total Listings',
        pending: 'Pending',
        approved: 'Approved',
        rejected: 'Rejected',
        noListings: "You haven't created any listings yet",
        createFirst: 'Create Your First Listing',
        confirmDelete: 'Are you sure you want to delete this listing?',
        tabs: {
            listings: 'My Listings',
            services: 'Service Requests'
        },
        services: {
            title: 'My Service Requests',
            id: 'Request ID',
            type: 'Service Type',
            status: 'Status',
            date: 'Date',
            actions: 'Actions',
            noServices: "You haven't made any service requests yet",
            browseServices: 'Browse Services'
        }
    }
};

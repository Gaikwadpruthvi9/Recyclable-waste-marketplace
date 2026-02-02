import { Translations } from '../types';

export const hi: Translations = {
    header: {
        home: 'होम',
        browseWaste: 'कचरा ब्राउज़ करें',
        services: 'सेवाएं',
        dashboard: 'डैशबोर्ड',
        login: 'लॉगिन',
        signup: 'साइन अप',
        logout: 'लॉगआउट',
        profile: 'प्रोफ़ाइल',
        settings: 'सेटिंग्स'
    },


    home: {
        hero: {
            badge: 'विश्वसनीय कचरा व्यापार प्लेटफ़ॉर्म',
            title: 'उद्योगों को',
            subtitle: 'रीसाइक्लर्स से तुरंत जोड़ें',
            description: 'पुनर्चक्रण योग्य औद्योगिक कचरे के लिए आधुनिक बाज़ार। अपना कचरा सूचीबद्ध करें, खरीदार खोजें, और एक स्थायी चक्रीय अर्थव्यवस्था में योगदान करें—सब एक ही प्लेटफ़ॉर्म पर।',
            primaryCTA: 'अपना कचरा पोस्ट करें',
            secondaryCTA: 'पुनर्चक्रण योग्य खोजें',
            features: {
                verified: 'सत्यापित सूचियां',
                secure: 'सुरक्षित प्लेटफ़ॉर्म',
                activeUsers: 'सक्रिय उपयोगकर्ता'
            }
        },
        stats: {
            activeListings: 'सक्रिय सूचियां',
            registeredUsers: 'पंजीकृत उपयोगकर्ता',
            wasteCategories: 'कचरा श्रेणियां',
            ecoFriendly: 'पर्यावरण के अनुकूल'
        },
        categories: {
            title: 'श्रेणी के अनुसार ब्राउज़ करें',
            description: 'वह सटीक प्रकार का पुनर्चक्रण योग्य कचरा खोजें जिसकी आप तलाश कर रहे हैं',
            viewAll: 'सभी सूचियां देखें',
            plastic: { name: 'प्लास्टिक', desc: 'सभी प्रकार' },
            metal: { name: 'धातु', desc: 'स्क्रैप और अधिक' },
            ewaste: { name: 'ई-कचरा', desc: 'इलेक्ट्रॉनिक्स' },
            paper: { name: 'कागज', desc: 'कार्डबोर्ड' },
            glass: { name: 'कांच', desc: 'बोतलें और अधिक' },
            chemical: { name: 'रासायनिक', desc: 'औद्योगिक' },
            organic: { name: 'जैविक', desc: 'कंपोस्ट योग्य' },
            other: { name: 'अन्य', desc: 'विविध' }
        },
        howItWorks: {
            title: 'यह कैसे काम करता है',
            description: 'तीन आसान चरणों में सरल, पारदर्शी और कुशल कचरा व्यापार',
            step1Title: 'अपना कचरा सूचीबद्ध करें',
            step1Desc: 'फोटो अपलोड करें, अपने पुनर्चक्रण योग्य कचरे का वर्णन करें, और अपना स्थान सेट करें. तेज़ और आसान सूची प्रक्रिया.',
            step2Title: 'व्यापारियों से जुड़ें',
            step2Desc: 'खरीदार सूचियां ब्राउज़ करते हैं, श्रेणी और स्थान के अनुसार फ़िल्टर करते हैं, फिर फ़ोन या WhatsApp के जरिए सीधे आपसे संपर्क करते हैं.',
            step3Title: 'सौदा पूरा करें',
            step3Desc: 'शर्तों पर बातचीत करें, पिकअप या डिलीवरी की व्यवस्था करें, और लेनदेन पूरा करें. अपने कचरे को मूल्य में बदलें!'
        },
        whyChoose: {
            title: 'Scrapify क्यों चुनें?',
            description: 'पुनर्चक्रण योग्य कचरा व्यापार के लिए सबसे विश्वसनीय प्लेटफ़ॉर्म'
        },
        services: {
            title: 'कचरा व्यापार से परे',
            description: 'आपकी संपूर्ण पुनर्चक्रण यात्रा का समर्थन करने के लिए व्यापक सेवाएं',
            exploreAll: 'सभी सेवाओं का अन्वेषण करें'
        }
    },


    common: {
        submit: 'जमा करें',
        cancel: 'रद्द करें',
        save: 'सहेजें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        view: 'देखें',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        success: 'सफलता',
        confirm: 'पुष्टि करें',
        close: 'बंद करें',
        next: 'अगला',
        back: 'पीछे',
        continue: 'जारी रखें'
    },

    forms: {
        email: 'ईमेल',
        password: 'पासवर्ड',
        name: 'नाम',
        phone: 'फ़ोन',
        company: 'कंपनी',
        city: 'शहर',
        area: 'क्षेत्र',
        address: 'पता',
        category: 'श्रेणी',
        quantity: 'मात्रा',
        description: 'विवरण',
        price: 'कीमत',
        negotiable: 'परक्राम्य'
    },

    messages: {
        loginSuccess: 'लॉगिन सफल',
        logoutSuccess: 'सफलतापूर्वक लॉग आउट हुआ',
        listingCreated: 'सूची सफलतापूर्वक बनाई गई',
        listingUpdated: 'सूची सफलतापूर्वक अपडेट की गई',
        listingDeleted: 'सूची सफलतापूर्वक हटाई गई',
        error: 'एक त्रुटि हुई',
        required: 'यह फ़ील्ड आवश्यक है'
    },

    categories: {
        plastic: 'प्लास्टिक',
        metal: 'धातु',
        ewaste: 'ई-कचरा',
        paper: 'कागज',
        glass: 'कांच',
        chemical: 'रासायनिक',
        organic: 'जैविक',
        other: 'अन्य'
    },

    listings: {
        title: 'कचरा सूचियां देखें',
        subtitle: 'सत्यापित विक्रेताओं से उपलब्ध पुनर्चक्रण योग्य सामग्री खोजें',
        filters: 'फ़िल्टर',
        sortBy: 'क्रमबद्ध करें',
        noListings: 'आपकी कसौटी से मेल खाने वाली कोई सूची नहीं मिली',
        searchPlaceholder: 'सामग्री, स्थान द्वारा खोजें...',
        contactSeller: 'विक्रेता से संपर्क करें',
        viewDetails: 'विवरण देखें'
    },

    servicesPage: {
        title: 'हमारी सेवाएं',
        subtitle: 'आपके व्यवसाय के लिए व्यापक कचरा प्रबंधन समाधान',
        logistics: {
            title: 'रसद और परिवहन',
            desc: 'थोक कचरा परिवहन के लिए विश्वसनीय पिकअप और डिलीवरी सेवाएं।'
        },
        recycling: {
            title: 'पुनर्चक्रण प्रसंस्करण',
            desc: 'जिम्मेदार कचरा प्रसंस्करण सुनिश्चित करने वाले प्रमाणित पुनर्चक्रण भागीदार।'
        },
        consulting: {
            title: 'कचरा ऑडिट और परामर्श',
            desc: 'अपनी कचरा प्रबंधन रणनीति को अनुकूलित करने के लिए विशेषज्ञ सलाह।'
        },
        cta: 'सेवा का अनुरोध करें'
    },

    profilePage: {
        title: 'मेरी प्रोफ़ाइल',
        editProfile: 'प्रोफ़ाइल संपादित करें',
        contactInfo: 'संपर्क जानकारी',
        accountType: 'खाता प्रकार',
        memberSince: 'सदस्यता तिथि',
        companyDetails: 'कंपनी विवरण',
        verifiedAccount: 'सत्यापित खाता',
        activeListings: 'सक्रिय सूचियां',
        totalSales: 'कुल बिक्री',
        impactScore: 'प्रभाव स्कोर',
        completedOrders: 'पूरे किए गए ऑर्डर',
        totalRecycled: 'कुल रीसायकल'
    },

    settingsPage: {
        title: 'सेटिंग्स',
        profile: 'प्रोफ़ाइल सेटिंग्स',
        notifications: 'अधिसूचना प्राथमिकताएं',
        security: 'सुरक्षा सेटिंग्स',
        saveChanges: 'परिवर्तन सहेजें',
        changePassword: 'पासवर्ड बदलें',
        twoFactor: 'दो-कारक प्रमाणीकरण'
    },

    dashboard: {
        title: 'डैशबोर्ड',
        overview: 'अवलोकन',
        myListings: 'मेरी सूचियां',
        messages: 'संदेश',
        analytics: 'एनालिटिक्स',
        recentActivity: 'हाल की गतिविधि',
        welcomeBack: 'वापसी पर स्वागत है',
        createListing: 'नई सूची बनाएं',
        totalListings: 'कुल सूचियां',
        pending: 'लंबित',
        approved: 'स्वीकृत',
        rejected: 'अस्वीकृत',
        noListings: 'आपने अभी तक कोई सूची नहीं बनाई है',
        createFirst: 'अपनी पहली सूची बनाएं',
        confirmDelete: 'क्या आप वाकई इस सूची को हटाना चाहते हैं?',
        tabs: {
            listings: 'मेरी सूचियां',
            services: 'सेवा अनुरोध'
        },
        services: {
            title: 'मेरे सेवा अनुरोध',
            id: 'अनुरोध आईडी',
            type: 'सेवा प्रकार',
            status: 'स्थिति',
            date: 'दिनांक',
            actions: 'कार्रवाई',
            noServices: 'आपने अभी तक कोई सेवा अनुरोध नहीं किया है',
            browseServices: 'सेवाएं देखें'
        }
    }
};

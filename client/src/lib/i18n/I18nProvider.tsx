'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, DEFAULT_LANGUAGE, Translations } from './types';
import { en } from './locales/en';
import { mr } from './locales/mr';
import { hi } from './locales/hi';

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = 'scrapify_language';

const translations: Record<Language, Translations> = {
    en,
    mr,
    hi
};

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

    // Load language from localStorage on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY) as Language;
            if (saved && translations[saved]) {
                setLanguageState(saved);
            }
        }
    }, []);

    // Save language to localStorage when it changes
    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, lang);
        }
    };

    const value: I18nContextType = {
        language,
        setLanguage,
        t: translations[language] || translations[DEFAULT_LANGUAGE]
    };

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }
    return context;
}

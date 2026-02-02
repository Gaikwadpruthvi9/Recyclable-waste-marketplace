'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, User, LogOut, Settings, LayoutDashboard, ChevronDown, Globe, MessageCircle, DollarSign } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { Language } from '@/lib/i18n/types';
import { useMessages } from '@/hooks/useMessages';
import { useOffers } from '@/hooks/useOffers';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

    const { user, logout } = useAuth();
    const { t, language, setLanguage } = useTranslation();
    const { unreadCount } = useMessages(user?.id);
    const { receivedOffers } = useOffers(user?.id);

    const pendingOffersCount = receivedOffers.filter(o => o.status === 'pending').length;

    const dropdownRef = useRef<HTMLDivElement>(null);
    const langDropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsProfileDropdownOpen(false);
            }
            if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout();
        setIsProfileDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
        setIsLangDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 relative overflow-hidden rounded-lg">
                            <img
                                src="/images/scrapify-logo.png"
                                alt="Scrapify Logo"
                                className="w-full h-full object-cover scale-110"
                                style={{ objectPosition: 'center center' }}
                            />
                        </div>
                        <span className="text-xl font-bold text-primary-600">Scrapify</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            {t.header.home}
                        </Link>
                        <Link href="/listings" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            {t.header.browseWaste}
                        </Link>
                        <Link href="/services" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
                            {t.header.services}
                        </Link>

                        {user && (
                            <>
                                <Link href="/offers" className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative">
                                    Offers
                                    {pendingOffersCount > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {pendingOffersCount}
                                        </span>
                                    )}
                                </Link>
                                <Link href="/messages" className="text-gray-600 hover:text-primary-600 font-medium transition-colors relative">
                                    Messages
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        {user && (user.role === 'seller' || user.role === 'admin') && (
                            <Link
                                href={user.role === 'admin' ? "/dashboard/admin" : "/dashboard/seller"}
                                className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                            >
                                {t.header.dashboard}
                            </Link>
                        )}
                    </nav>

                    {/* Auth Buttons / Profile / Language */}
                    <div className="hidden md:flex items-center gap-4">

                        {/* Language Switcher */}
                        <div className="relative" ref={langDropdownRef}>
                            <button
                                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                                className="flex items-center gap-1 text-gray-600 hover:text-primary-600 mr-2 px-2 py-1 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm font-medium">{currentLang.label}</span>
                                <ChevronDown className="w-3 h-3 opacity-50" />
                            </button>

                            {isLangDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100 origin-top-right z-50">
                                    {LANGUAGES.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => handleLanguageChange(lang.code)}
                                            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-gray-50 transition-colors ${language === lang.code ? 'text-primary-600 font-medium bg-primary-50' : 'text-gray-700'}`}
                                        >
                                            <span className="text-lg">{lang.flag}</span>
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-gray-200 hover:border-gray-300 transition-colors"
                                >
                                    {user.profilePicture ? (
                                        <img
                                            src={user.profilePicture}
                                            alt={user.name}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                                            {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="text-left">
                                        <p className="text-xs font-semibold text-gray-900 leading-none mb-0.5">{user.name}</p>
                                        <p className="text-[10px] text-gray-500 uppercase leading-none">{user.role}</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                        <div className="px-4 py-3 border-b border-gray-50 mb-1">
                                            {user.profilePicture ? (
                                                <div className="w-10 h-10 rounded-full mb-2 overflow-hidden">
                                                    <img src={user.profilePicture} alt={user.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold mb-2">
                                                    {user.name.charAt(0).toUpperCase()}{user.name.split(' ')[1]?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                            <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-primary-50 text-primary-700 uppercase tracking-wider">
                                                {user.role}
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href={user.role === 'admin' ? "/dashboard/admin" : user.role === 'seller' ? "/dashboard/seller" : "/listings"}
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                                {t.header.dashboard}
                                            </Link>
                                            <Link
                                                href="/profile"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <User className="w-4 h-4 text-gray-400" />
                                                {t.header.profile}
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                onClick={() => setIsProfileDropdownOpen(false)}
                                            >
                                                <Settings className="w-4 h-4 text-gray-400" />
                                                {t.header.settings}
                                            </Link>

                                        </div>

                                        <div className="border-t border-gray-50 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                {t.header.logout}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link href="/login">
                                    <button className="text-gray-700 hover:text-primary-600 font-medium px-4 py-2 transition-colors">
                                        {t.header.login}
                                    </button>
                                </Link>
                                <Link href="/signup">
                                    <button className="btn btn-primary">
                                        {t.header.signup}
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-700"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="container-custom py-4 space-y-4">
                        <Link
                            href="/"
                            className="block text-gray-600 font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.header.home}
                        </Link>
                        <Link
                            href="/listings"
                            className="block text-gray-600 font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.header.browseWaste}
                        </Link>
                        <Link
                            href="/services"
                            className="block text-gray-600 font-medium py-2"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {t.header.services}
                        </Link>

                        {user && (
                            <>
                                <Link
                                    href="/offers"
                                    className="block text-gray-600 font-medium py-2 flex items-center justify-between"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Offers
                                    {pendingOffersCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                                            {pendingOffersCount}
                                        </span>
                                    )}
                                </Link>
                                <Link
                                    href="/messages"
                                    className="block text-gray-600 font-medium py-2 flex items-center justify-between"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Messages
                                    {unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
                                </Link>
                            </>
                        )}

                        {/* Mobile Language Switcher */}
                        <div className="py-2 border-t border-gray-100 mt-2">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Language</p>
                            <div className="flex gap-2">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`px-3 py-1.5 rounded-lg text-sm border ${language === lang.code ? 'bg-primary-50 border-primary-200 text-primary-700 font-medium' : 'border-gray-200 text-gray-600'}`}
                                    >
                                        <span className="mr-1">{lang.flag}</span> {lang.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {user ? (
                            <>
                                <div className="border-t border-gray-100 pt-4 mt-2">
                                    <div className="flex items-center gap-3 mb-4">
                                        {user.profilePicture ? (
                                            <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>

                                    <Link
                                        href={user.role === 'admin' ? "/dashboard/admin" : "/dashboard/seller"}
                                        className="flex items-center gap-3 text-gray-600 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        {t.header.dashboard}
                                    </Link>
                                    <Link
                                        href="/profile"
                                        className="flex items-center gap-3 text-gray-600 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        {t.header.profile}
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 text-gray-600 py-2"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        {t.header.settings}
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 text-red-600 py-2 mt-2"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        {t.header.logout}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="border-t border-gray-100 pt-4 mt-2 flex flex-col gap-3">
                                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full btn btn-outline justify-center">{t.header.login}</button>
                                </Link>
                                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="w-full btn btn-primary justify-center">{t.header.signup}</button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

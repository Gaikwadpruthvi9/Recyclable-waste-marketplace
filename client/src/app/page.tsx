'use client';

import Link from 'next/link';
import { ArrowRight, Recycle, Users, Shield, MapPin, Package, CheckCircle, TrendingUp, Leaf, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getListings, getUsers } from '@/lib/storage';
import { SERVICES } from '@/lib/services-data';
import { useTranslation } from '@/lib/i18n/I18nProvider';

export default function HomePage() {
    const { t } = useTranslation();
    const [stats, setStats] = useState({ listings: 0, users: 0 });

    useEffect(() => {
        const listings = getListings();
        const users = getUsers();
        setStats({
            listings: listings.filter(l => l.status === 'approved').length,
            users: users.length,
        });
    }, []);

    return (
        <div className="bg-white">
            {/* Hero Section - With Background Image */}
            <section
                className="relative overflow-hidden py-16 md:py-20"
                style={{
                    backgroundImage: 'url(/images/hero-background.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'repeat'
                }}
            >
                {/* Light overlay for text readability */}
                <div className="absolute inset-0 bg-white/70"></div>

                {/* Content */}
                <div className="container-custom relative z-10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center animate-fade-in">
                            {/* Trust Badge */}
                            <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-primary-100 mb-8">
                                <CheckCircle className="w-4 h-4 text-primary-600" />
                                <span className="text-sm font-semibold text-gray-700">{t.home.hero.badge}</span>
                            </div>

                            {/* Main Headline */}
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                                {t.home.hero.title}
                                <br />
                                <span className="text-primary-600">{t.home.hero.subtitle}</span>
                            </h1>

                            {/* Subheadline */}
                            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                                {t.home.hero.description}
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                                <Link href="/signup?role=seller" className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                                    <Package className="w-5 h-5" />
                                    {t.home.hero.primaryCTA}
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link href="/listings" className="btn bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 text-lg px-8 py-4 shadow-md">
                                    <MapPin className="w-5 h-5" />
                                    {t.home.hero.secondaryCTA}
                                </Link>
                            </div>

                            {/* Trust Indicators */}
                            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-primary-600" />
                                    <span>{t.home.hero.features.verified}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-secondary-600" />
                                    <span>{t.home.hero.features.secure}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary-600" />
                                    <span>{stats.users}+ {t.home.hero.features.activeUsers}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-1">{stats.listings}+</div>
                                <div className="text-sm text-gray-600 font-medium">{t.home.stats.activeListings}</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-1">{stats.users}+</div>
                                <div className="text-sm text-gray-600 font-medium">{t.home.stats.registeredUsers}</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-1">8</div>
                                <div className="text-sm text-gray-600 font-medium">{t.home.stats.wasteCategories}</div>
                            </div>
                            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
                                <div className="text-4xl font-bold text-primary-600 mb-1">100%</div>
                                <div className="text-sm text-gray-600 font-medium">{t.home.stats.ecoFriendly}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section - Moved Higher for Better UX */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.home.categories.title}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t.home.categories.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {[
                            { key: 'plastic', icon: '♻️', color: 'from-blue-500 to-blue-600' },
                            { key: 'metal', icon: '🔩', color: 'from-gray-500 to-gray-600' },
                            { key: 'ewaste', icon: '💻', color: 'from-purple-500 to-purple-600' },
                            { key: 'paper', icon: '📄', color: 'from-amber-500 to-amber-600' },
                            { key: 'glass', icon: '🍾', color: 'from-cyan-500 to-cyan-600' },
                            { key: 'chemical', icon: '⚗️', color: 'from-red-500 to-red-600' },
                            { key: 'organic', icon: '🌿', color: 'from-green-500 to-green-600' },
                            { key: 'other', icon: '📦', color: 'from-gray-500 to-gray-600' },
                        ].map((category) => {
                            const catData = t.home.categories[category.key as keyof typeof t.home.categories] as { name: string; desc: string };
                            return (
                                <Link
                                    key={category.key}
                                    href={`/listings?category=${catData.name}`}
                                    className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                                >
                                    <div className={`bg-gradient-to-br ${category.color} p-6 text-center`}>
                                        <div className="text-5xl mb-2">{category.icon}</div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                                            {catData.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">{catData.desc}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link href="/listings" className="btn btn-outline text-lg px-8">
                            {t.home.categories.viewAll}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.home.howItWorks.title}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t.home.howItWorks.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl p-8 shadow-md text-center relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                                1
                            </div>
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                                <Package className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.howItWorks.step1Title}</h3>
                            <p className="text-gray-600">
                                {t.home.howItWorks.step1Desc}
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl p-8 shadow-md text-center relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                                2
                            </div>
                            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                                <Users className="w-8 h-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.howItWorks.step2Title}</h3>
                            <p className="text-gray-600">
                                {t.home.howItWorks.step2Desc}
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl p-8 shadow-md text-center relative">
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                                3
                            </div>
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 mt-4">
                                <CheckCircle className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.home.howItWorks.step3Title}</h3>
                            <p className="text-gray-600">
                                {t.home.howItWorks.step3Desc}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value-Added Services Section */}
            <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-primary-100 mb-6">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-gray-700">Complete Ecosystem</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {t.home.services.title}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t.home.services.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
                        {SERVICES.slice(0, 3).map((service) => (
                            <Link
                                key={service.id}
                                href={`/services/${service.slug}`}
                                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border border-gray-100"
                            >
                                <div className="text-5xl mb-4">{service.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {service.shortDescription}
                                </p>
                                <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                                    <span>Learn More</span>
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="text-center">
                        <Link href="/services" className="btn btn-primary text-lg px-8 shadow-lg hover:shadow-xl">
                            <Sparkles className="w-5 h-5" />
                            {t.home.services.exploreAll}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t.home.whyChoose.title}</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t.home.whyChoose.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Shield,
                                title: 'Verified & Secure',
                                description: 'All listings are reviewed and approved by our admin team for quality and authenticity.',
                                color: 'text-secondary-600',
                                bg: 'bg-secondary-50'
                            },
                            {
                                icon: MapPin,
                                title: 'Location-Based Search',
                                description: 'Find waste near you to save on transportation costs and reduce your carbon footprint.',
                                color: 'text-primary-600',
                                bg: 'bg-primary-50'
                            },
                            {
                                icon: Users,
                                title: 'Direct Connection',
                                description: 'No middlemen. Connect directly with waste providers and traders for transparent deals.',
                                color: 'text-secondary-600',
                                bg: 'bg-secondary-50'
                            },
                            {
                                icon: TrendingUp,
                                title: 'Easy to Use',
                                description: 'Simple, intuitive interface designed for both technical and non-technical users.',
                                color: 'text-primary-600',
                                bg: 'bg-primary-50'
                            },
                            {
                                icon: Recycle,
                                title: 'Eco-Friendly Impact',
                                description: 'Contribute to sustainability by ensuring waste is recycled properly and efficiently.',
                                color: 'text-primary-600',
                                bg: 'bg-primary-50'
                            },
                            {
                                icon: Package,
                                title: 'Multiple Categories',
                                description: 'Trade all types of recyclable waste from plastic to e-waste, metal to organic materials.',
                                color: 'text-secondary-600',
                                bg: 'bg-secondary-50'
                            },
                        ].map((feature, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
                                <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section - Improved */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                </div>

                <div className="container-custom text-center relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Start Trading?</h2>
                    <p className="text-xl mb-10 text-primary-100 max-w-2xl mx-auto leading-relaxed">
                        Join hundreds of businesses and traders making waste valuable.
                        Start listing or browsing recyclable materials today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link href="/signup?role=seller" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-10 py-4 shadow-xl">
                            <Package className="w-5 h-5" />
                            I Have Waste to Sell
                        </Link>
                        <Link href="/signup?role=buyer" className="btn bg-primary-800 text-white hover:bg-primary-900 border-2 border-white text-lg px-10 py-4 shadow-xl">
                            <MapPin className="w-5 h-5" />
                            I Want to Buy Waste
                        </Link>
                    </div>

                    <p className="mt-8 text-primary-100 text-sm">
                        Already have an account? <Link href="/login" className="underline font-semibold hover:text-white">Sign in here</Link>
                    </p>
                </div>
            </section>
        </div>
    );
}

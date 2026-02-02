'use client';

import { SERVICES } from '@/lib/services-data';
import ServiceCard from '@/components/services/ServiceCard';
import { Sparkles, CheckCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/I18nProvider';

export default function ServicesPage() {
    const { t } = useTranslation();

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="gradient-hero py-20">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-sm border border-primary-100 mb-6">
                            <Sparkles className="w-4 h-4 text-primary-600" />
                            <span className="text-sm font-semibold text-gray-700">Complete Recycling Ecosystem</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            {t.home.services.title}
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                            {t.servicesPage.subtitle}
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>Expert Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>Flexible Pricing</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>Proven Results</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-20 bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            {t.servicesPage.title}
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            {t.servicesPage.subtitle}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {SERVICES.map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 bg-white">
                <div className="container-custom">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose Our Services?
                            </h2>
                            <p className="text-lg text-gray-600">
                                Transform your waste management with our comprehensive solutions
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                {
                                    icon: '💰',
                                    title: 'Cost Savings',
                                    description: 'Reduce operational costs by up to 40% with optimized logistics and waste management strategies'
                                },
                                {
                                    icon: '⚡',
                                    title: 'Time Efficiency',
                                    description: 'Save hours of manual work with automated compliance documentation and reporting'
                                },
                                {
                                    icon: '🎯',
                                    title: 'Expert Guidance',
                                    description: 'Access industry experts and certified professionals for specialized waste handling'
                                },
                                {
                                    icon: '📊',
                                    title: 'Data-Driven Insights',
                                    description: 'Make informed decisions with real-time market data and analytics'
                                },
                                {
                                    icon: '🌍',
                                    title: 'Sustainability Impact',
                                    description: 'Track and report your environmental impact with comprehensive ESG metrics'
                                },
                                {
                                    icon: '✅',
                                    title: 'Regulatory Compliance',
                                    description: 'Stay compliant with all environmental regulations and avoid penalties'
                                }
                            ].map((benefit, index) => (
                                <div key={index} className="flex gap-4 p-6 bg-gray-50 rounded-xl">
                                    <div className="text-4xl">{benefit.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                                        <p className="text-gray-600">{benefit.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="container-custom text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-6 opacity-90" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Transform Your Waste Management?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
                        Get started with our services today and join hundreds of businesses optimizing their recycling operations
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/services/logistics" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4 shadow-xl">
                            {t.servicesPage.cta}
                        </Link>
                        <Link href="/signup" className="btn bg-primary-800 text-white hover:bg-primary-900 border-2 border-white text-lg px-8 py-4 shadow-xl">
                            {t.header.signup}
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

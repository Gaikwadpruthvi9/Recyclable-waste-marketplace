'use client';

import { Service } from '@/lib/services-types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
    service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
    return (
        <Link
            href={`/services/${service.slug}`}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
            <div className="p-8">
                {/* Icon */}
                <div className="text-6xl mb-4">{service.icon}</div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed">
                    {service.shortDescription}
                </p>

                {/* Features Preview */}
                <ul className="space-y-2 mb-6">
                    {service.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-primary-600 mt-0.5">✓</span>
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                    <span>Learn More</span>
                    <ArrowRight className="w-5 h-5" />
                </div>
            </div>
        </Link>
    );
}

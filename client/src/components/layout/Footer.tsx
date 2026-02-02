'use client';

import Link from 'next/link';
import { Recycle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-primary-900 to-primary-800 text-gray-100 mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Recycle className="w-8 h-8 text-primary-300" />
                            <span className="text-2xl font-bold text-white">Scrapify</span>
                        </div>
                        <p className="text-gray-200 max-w-xs">
                            Connecting industries with recyclers for a sustainable future. Making waste valuable.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/" className="hover:text-primary-300 transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link href="/listings" className="hover:text-primary-300 transition-colors">Browse Waste</Link>
                            </li>
                            <li>
                                <Link href="/signup" className="hover:text-primary-300 transition-colors">Sign Up</Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-primary-300 transition-colors">Login</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-primary-300 transition-colors cursor-pointer">Plastic Waste</li>
                            <li className="hover:text-primary-300 transition-colors cursor-pointer">Metal Scrap</li>
                            <li className="hover:text-primary-300 transition-colors cursor-pointer">E-Waste</li>
                            <li className="hover:text-primary-300 transition-colors cursor-pointer">Paper & Cardboard</li>
                            <li className="hover:text-primary-300 transition-colors cursor-pointer">Glass</li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary-300" />
                                <span>support@scrapify.com</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary-300" />
                                <span>+1 (555) 123-4567</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary-300" />
                                <span>Global Platform</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-700 mt-8 pt-8 text-center text-sm text-gray-200">
                    <p>&copy; {new Date().getFullYear()} Scrapify. All rights reserved. Built for sustainability.</p>
                </div>
            </div>
        </footer>
    );
}

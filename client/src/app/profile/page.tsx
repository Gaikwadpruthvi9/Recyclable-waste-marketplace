'use client';

import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { User, Shield, MapPin, Building, Phone, Mail, Package, Edit, Award } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/I18nProvider';

export default function ProfilePage() {
    const { user } = useAuth();
    const { t } = useTranslation();

    // Mock stats based on role
    const getStats = () => {
        if (!user) return null;

        if (user.role === UserRole.SELLER) {
            return [
                { label: t.profilePage.activeListings, value: '12', icon: Package },
                { label: t.profilePage.totalSales, value: '156 kg', icon: Award },
                { label: t.profilePage.impactScore, value: '98', icon: Shield },
            ];
        } else if (user.role === UserRole.BUYER) {
            return [
                { label: t.profilePage.completedOrders, value: '8', icon: Package },
                { label: t.profilePage.totalRecycled, value: '450 kg', icon: Award },
                { label: t.profilePage.impactScore, value: '92', icon: Shield },
            ];
        }
        return [];
    };

    const stats = getStats();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.profilePage.title}</h1>

                    {/* Profile Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800"></div>
                        <div className="px-8 pb-8">
                            <div className="relative flex justify-between items-end -mt-12 mb-6">
                                <div className="flex items-end">
                                    <div className="w-24 h-24 bg-white rounded-xl p-1 shadow-md overflow-hidden">
                                        {user?.profilePicture ? (
                                            <img
                                                src={user.profilePicture}
                                                alt={user.name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                                <User className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-6 mb-1">
                                        <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="capitalize px-2 py-0.5 bg-gray-100 rounded text-sm font-medium">
                                                {user?.role}
                                            </span>
                                            {user?.isVerified && (
                                                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                                                    <Shield className="w-4 h-4" />
                                                    {t.profilePage.verifiedAccount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <Link href="/settings">
                                    <button className="btn btn-outline flex items-center gap-2">
                                        <Edit className="w-4 h-4" />
                                        {t.profilePage.editProfile}
                                    </button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">{t.profilePage.contactInfo}</h3>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="w-5 h-5 text-gray-400" />
                                        <span>{user?.email}</span>
                                    </div>
                                    {user?.phone && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <span>{user.phone}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-gray-900 mb-4">{t.profilePage.companyDetails}</h3>
                                    {user?.company && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <Building className="w-5 h-5 text-gray-400" />
                                            <span>{user.company}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5 text-gray-400" />
                                        <span>Mumbai, India</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    {stats && stats.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">{stat.label}</p>
                                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

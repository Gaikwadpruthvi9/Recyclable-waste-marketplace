'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import { Plus, Package, Clock, CheckCircle, XCircle, FileText, Download } from 'lucide-react';
import Link from 'next/link';
import WasteGrid from '@/components/listings/WasteGrid';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { UserRole } from '@/lib/types';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import { getServiceRequests, getServiceById } from '@/lib/services-data';
import { ServiceRequest, RequestStatus } from '@/lib/services-types';

function SellerDashboardContent() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const { listings, deleteListing, refreshListings } = useListings();
    const [myListings, setMyListings] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'listings' | 'services'>('listings');
    const [myServices, setMyServices] = useState<ServiceRequest[]>([]);

    useEffect(() => {
        if (user) {
            // Listings
            const userListings = listings.filter(l => l.sellerId === user.id);
            setMyListings(userListings);

            // Service Requests
            const allRequests = getServiceRequests();
            const userRequests = allRequests.filter(r => r.userId === user.id);
            setMyServices(userRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        }
    }, [listings, user]);

    const stats = {
        total: myListings.length,
        pending: myListings.filter(l => l.status === 'pending').length,
        approved: myListings.filter(l => l.status === 'approved').length,
        rejected: myListings.filter(l => l.status === 'rejected').length,
    };

    const handleDelete = (id: string) => {
        if (confirm(t.dashboard.confirmDelete)) {
            deleteListing(id);
            refreshListings();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case RequestStatus.COMPLETED: return 'bg-green-100 text-green-800';
            case RequestStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
            case RequestStatus.IN_REVIEW: return 'bg-yellow-100 text-yellow-800';
            case RequestStatus.CANCELLED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Seller {t.dashboard.title}</h1>
                        <p className="text-lg text-gray-600">{t.dashboard.welcomeBack}, {user?.name}!</p>
                    </div>
                    {activeTab === 'listings' ? (
                        <Link href="/listings/create" className="btn btn-primary">
                            <Plus className="w-5 h-5" />
                            {t.dashboard.createListing}
                        </Link>
                    ) : (
                        <Link href="/services" className="btn btn-primary">
                            <Plus className="w-5 h-5" />
                            {t.dashboard.services.browseServices}
                        </Link>
                    )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t.dashboard.totalListings}</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Package className="w-12 h-12 text-primary-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t.dashboard.pending}</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                            </div>
                            <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t.dashboard.approved}</p>
                                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{t.dashboard.rejected}</p>
                                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                            </div>
                            <XCircle className="w-12 h-12 text-red-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`pb-3 px-1 font-medium text-lg transition-colors relative ${activeTab === 'listings' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        {t.dashboard.tabs.listings}
                        {activeTab === 'listings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('services')}
                        className={`pb-3 px-1 font-medium text-lg transition-colors relative ${activeTab === 'services' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-900'
                            }`}
                    >
                        {t.dashboard.tabs.services}
                        {activeTab === 'services' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600"></div>}
                    </button>
                </div>

                {/* Content */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {activeTab === 'listings' ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.myListings}</h2>
                            {myListings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-4">{t.dashboard.noListings}</p>
                                    <Link href="/listings/create" className="btn btn-primary">
                                        <Plus className="w-5 h-5" />
                                        {t.dashboard.createFirst}
                                    </Link>
                                </div>
                            ) : (
                                <WasteGrid listings={myListings} showEditButton={true} />
                            )}
                        </>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.dashboard.services.title}</h2>
                            {myServices.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500 text-lg mb-4">{t.dashboard.services.noServices}</p>
                                    <Link href="/services" className="btn btn-primary">
                                        <Plus className="w-5 h-5" />
                                        {t.dashboard.services.browseServices}
                                    </Link>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-gray-100 text-gray-500 text-sm">
                                                <th className="py-3 px-4">{t.dashboard.services.type}</th>
                                                <th className="py-3 px-4">{t.dashboard.services.status}</th>
                                                <th className="py-3 px-4">{t.dashboard.services.date}</th>
                                                <th className="py-3 px-4">{t.dashboard.services.actions}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myServices.map((req) => {
                                                const service = getServiceById(req.serviceId);
                                                return (
                                                    <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50">
                                                        <td className="py-4 px-4 font-medium text-gray-900">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-2xl">{service?.icon}</span>
                                                                {service?.name}
                                                            </div>
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(req.status)}`}>
                                                                {req.status.replace('_', ' ')}
                                                            </span>
                                                        </td>
                                                        <td className="py-4 px-4 text-gray-600">
                                                            {new Date(req.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="py-4 px-4">
                                                            {req.status === RequestStatus.COMPLETED && (
                                                                <button
                                                                    className="text-primary-600 hover:text-primary-800 flex items-center gap-1 text-sm font-medium"
                                                                    onClick={() => alert('Downloading report... (Simulated)')}
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                    Download
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function SellerDashboard() {
    return (
        <ProtectedRoute allowedRoles={[UserRole.SELLER]}>
            <SellerDashboardContent />
        </ProtectedRoute>
    );
}

'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import { getUsers, updateUser } from '@/lib/storage';
import { Users, Package, CheckCircle, XCircle, Clock, Shield, Ban } from 'lucide-react';
import { User, WasteListing, UserRole } from '@/lib/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { getServiceRequests, updateServiceRequest, getServiceById } from '@/lib/services-data';
import { ServiceRequest, RequestStatus } from '@/lib/services-types';

function AdminDashboardContent() {
    const { user } = useAuth();
    const { listings, approveListing, rejectListing, refreshListings } = useListings();
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'analytics' | 'services'>('listings');

    useEffect(() => {
        setAllUsers(getUsers());
        setServiceRequests(getServiceRequests().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }, []);

    const refreshRequests = () => {
        setServiceRequests(getServiceRequests().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };

    const handleUpdateServiceStatus = (id: string, status: RequestStatus) => {
        const updates: Partial<ServiceRequest> = { status };

        // Simulate assigning partner if moving to In Progress
        if (status === RequestStatus.IN_PROGRESS) {
            const partner = prompt("Enter assigned partner name (e.g. EcoTransporters):", "WasteLogistics Pvt Ltd");
            if (partner) {
                updates.assignedTo = partner;
            }
        }

        updateServiceRequest(id, updates);
        refreshRequests();
    };

    const pendingListings = listings.filter(l => l.status === 'pending');
    const approvedListings = listings.filter(l => l.status === 'approved');
    const rejectedListings = listings.filter(l => l.status === 'rejected');

    const handleApprove = (id: string) => {
        approveListing(id);
        refreshListings();
    };

    const handleReject = (id: string) => {
        const reason = prompt('Enter rejection reason:');
        if (reason) {
            rejectListing(id, reason);
            refreshListings();
        }
    };

    const handleBlockUser = (userId: string) => {
        const userToBlock = allUsers.find(u => u.id === userId);
        if (userToBlock && confirm(`Block user ${userToBlock.name}?`)) {
            updateUser(userId, { blocked: !userToBlock.blocked });
            setAllUsers(getUsers());
        }
    };

    const stats = {
        totalUsers: allUsers.length,
        totalListings: listings.length,
        pendingListings: pendingListings.length,
        approvedListings: approvedListings.length,
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container-custom">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                        <Shield className="w-10 h-10 text-primary-600" />
                        Admin Dashboard
                    </h1>
                    <p className="text-lg text-gray-600">Manage users, listings, and platform analytics</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                            </div>
                            <Users className="w-12 h-12 text-primary-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Total Listings</p>
                                <p className="text-3xl font-bold text-gray-900">{stats.totalListings}</p>
                            </div>
                            <Package className="w-12 h-12 text-primary-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Pending Approval</p>
                                <p className="text-3xl font-bold text-yellow-600">{stats.pendingListings}</p>
                            </div>
                            <Clock className="w-12 h-12 text-yellow-600 opacity-20" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Approved</p>
                                <p className="text-3xl font-bold text-green-600">{stats.approvedListings}</p>
                            </div>
                            <CheckCircle className="w-12 h-12 text-green-600 opacity-20" />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-md mb-6">
                    <div className="flex border-b overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('listings')}
                            className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'listings'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Listing Approval
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'users'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'services'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Service Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-6 py-4 font-semibold transition-colors whitespace-nowrap ${activeTab === 'analytics'
                                ? 'text-primary-600 border-b-2 border-primary-600'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Listing Approval Tab */}
                {activeTab === 'listings' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Listings ({pendingListings.length})</h2>

                        {pendingListings.length === 0 ? (
                            <div className="text-center py-12">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No pending listings to review</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {pendingListings.map((listing) => (
                                    <div key={listing.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.title}</h3>
                                                <p className="text-gray-600 text-sm mb-3">{listing.description.substring(0, 150)}...</p>
                                                <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                                                    <span className="badge category-plastic">{listing.category}</span>
                                                    <span>•</span>
                                                    <span>{listing.quantity} {listing.unit}</span>
                                                    <span>•</span>
                                                    <span>{listing.location.city}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => handleApprove(listing.id)}
                                                    className="btn bg-green-600 text-white hover:bg-green-700 px-4 py-2"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(listing.id)}
                                                    className="btn bg-red-600 text-white hover:bg-red-700 px-4 py-2"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* User Management Tab */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">User Management ({allUsers.length})</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allUsers.map((u) => (
                                        <tr key={u.id} className={u.blocked ? 'bg-red-50' : ''}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="font-medium text-gray-900">{u.name}</div>
                                                {u.company && <div className="text-sm text-gray-500">{u.company}</div>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="badge badge-info capitalize">{u.role}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {u.blocked ? (
                                                    <span className="badge badge-error">Blocked</span>
                                                ) : (
                                                    <span className="badge badge-success">Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleBlockUser(u.id)}
                                                        className={`btn ${u.blocked ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 text-xs`}
                                                    >
                                                        <Ban className="w-3 h-3" />
                                                        {u.blocked ? 'Unblock' : 'Block'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Service Requests Tab */}
                {activeTab === 'services' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Requests</h2>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {serviceRequests.map((req) => {
                                        const service = getServiceById(req.serviceId);
                                        return (
                                            <tr key={req.id}>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{service?.name}</div>
                                                    <div className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{req.contactName || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{req.companyName}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${req.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        req.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {req.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {req.assignedTo || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                                    <select
                                                        className="text-xs border rounded p-1"
                                                        value={req.status}
                                                        onChange={(e) => handleUpdateServiceStatus(req.id, e.target.value as any)}
                                                    >
                                                        <option value="requested">Requested</option>
                                                        <option value="in_review">In Review</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {serviceRequests.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                No service requests found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Analytics</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Listings by Status</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Pending</span>
                                        <span className="font-semibold text-yellow-600">{pendingListings.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Approved</span>
                                        <span className="font-semibold text-green-600">{approvedListings.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Rejected</span>
                                        <span className="font-semibold text-red-600">{rejectedListings.length}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Sellers</span>
                                        <span className="font-semibold text-primary-600">
                                            {allUsers.filter(u => u.role === 'seller').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Buyers</span>
                                        <span className="font-semibold text-primary-600">
                                            {allUsers.filter(u => u.role === 'buyer').length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Admins</span>
                                        <span className="font-semibold text-primary-600">
                                            {allUsers.filter(u => u.role === 'admin').length}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
            <AdminDashboardContent />
        </ProtectedRoute>
    );
}

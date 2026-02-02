'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { updateUser } from '@/lib/storage';
import { User, Building, Phone, Mail, Bell, Shield, LogOut, Check, Save, Edit } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/I18nProvider';

export default function SettingsPage() {
    const router = useRouter();
    const { user, logout } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        company: '',
        profilePicture: '',
    });

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
    const [passwordError, setPasswordError] = useState('');

    const [showTwoFactorModal, setShowTwoFactorModal] = useState(false);
    const [twoFactorStep, setTwoFactorStep] = useState(false); // false = QR, true = Verify

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                phone: user.phone || '',
                company: user.company || '',
                profilePicture: user.profilePicture || '',
            });
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert('File size too large. Please upload an image under 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (passwordForm.new !== passwordForm.confirm) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.new.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (user && user.password === btoa(passwordForm.current) || user?.password === passwordForm.current) {
            const updated = updateUser(user.id, { password: passwordForm.new });
        }

        const success = updateUser(user!.id, { password: passwordForm.new });

        setLoading(false);
        if (success) {
            setShowPasswordModal(false);
            setSuccess(t.common.success);
            setPasswordForm({ current: '', new: '', confirm: '' });
            window.scrollTo(0, 0);
        } else {
            setPasswordError(t.messages.error);
        }
    };

    const handleToggle2FA = async (enable: boolean) => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        const success = updateUser(user!.id, { twoFactorEnabled: enable });

        setLoading(false);
        if (success) {
            setShowTwoFactorModal(false);
            setTwoFactorStep(false);
            setSuccess(enable ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled.');
            window.location.reload();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess('');

        try {
            if (user) {
                // Fake delay for realistic feel
                await new Promise(resolve => setTimeout(resolve, 800));

                const updatedUser = updateUser(user.id, {
                    name: formData.name,
                    phone: formData.phone,
                    company: formData.company,
                    profilePicture: formData.profilePicture,
                });

                if (updatedUser) {
                    setSuccess(t.common.success);
                    // Force a simple reload to refresh context
                    window.location.reload();
                } else {
                    console.error('Update failed');
                }
            }
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-4xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.settingsPage.title}</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-fit">
                            <nav className="space-y-1">
                                <a href="#profile" className="flex items-center gap-3 px-4 py-3 bg-primary-50 text-primary-700 rounded-lg font-medium">
                                    <User className="w-5 h-5" />
                                    {t.settingsPage.profile}
                                </a>
                                <a href="#notifications" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                                    <Bell className="w-5 h-5" />
                                    {t.settingsPage.notifications}
                                </a>
                                <a href="#security" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
                                    <Shield className="w-5 h-5" />
                                    {t.settingsPage.security}
                                </a>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors mt-4"
                                >
                                    <LogOut className="w-5 h-5" />
                                    {t.header.logout}
                                </button>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Edit Profile Section */}
                            <div id="profile" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-gray-400" />
                                    {t.profilePage.editProfile}
                                </h2>

                                {success && (
                                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
                                        <Check className="w-5 h-5" />
                                        {success}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Profile Picture Upload */}
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className="relative">
                                            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                                {formData.profilePicture ? (
                                                    <img
                                                        src={formData.profilePicture}
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-10 h-10 text-gray-400" />
                                                )}
                                            </div>
                                            <label
                                                htmlFor="profile-upload"
                                                className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-primary-700 shadow-md transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </label>
                                            <input
                                                id="profile-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileChange}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900">{t.header.profile} Picture</h3>
                                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.forms.name}
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.forms.phone}
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.forms.company}
                                            </label>
                                            <div className="relative">
                                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                    placeholder="Acme Recycling Co."
                                                />
                                            </div>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t.forms.email}
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="email"
                                                    value={user?.email || ''}
                                                    disabled
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                                                    Read-only
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="btn btn-primary flex items-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                                    {t.common.loading}
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    {t.settingsPage.saveChanges}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            {/* Notifications Section */}
                            <div id="notifications" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-gray-400" />
                                    {t.settingsPage.notifications}
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                            <p className="text-sm text-gray-500">Receive updates about your listings and orders</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">New Message Alerts</h3>
                                            <p className="text-sm text-gray-500">Get notified when someone messages you</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" defaultChecked className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">Marketing & Updates</h3>
                                            <p className="text-sm text-gray-500">Receive news about platform features</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Security Section */}
                            <div id="security" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-gray-400" />
                                    {t.settingsPage.security}
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{t.settingsPage.changePassword}</h3>
                                            <p className="text-sm text-gray-500">Update your password regularly to keep your account safe</p>
                                        </div>
                                        <button
                                            onClick={() => setShowPasswordModal(true)}
                                            className="btn btn-outline text-sm"
                                        >
                                            {t.settingsPage.changePassword}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{t.settingsPage.twoFactor}</h3>
                                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                        </div>
                                        {user?.twoFactorEnabled ? (
                                            <button
                                                onClick={() => handleToggle2FA(false)}
                                                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm font-medium transition-colors"
                                            >
                                                Disable 2FA
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => setShowTwoFactorModal(true)}
                                                className="btn btn-outline text-sm"
                                            >
                                                Enable 2FA
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Change Password Modal */}
                {showPasswordModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.settingsPage.changePassword}</h3>
                            <p className="text-gray-500 text-sm mb-6">Enter your current password and a new strong password.</p>

                            {passwordError && (
                                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    {passwordError}
                                </div>
                            )}

                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        value={passwordForm.current}
                                        onChange={e => setPasswordForm(prev => ({ ...prev, current: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        value={passwordForm.new}
                                        onChange={e => setPasswordForm(prev => ({ ...prev, new: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        value={passwordForm.confirm}
                                        onChange={e => setPasswordForm(prev => ({ ...prev, confirm: e.target.value }))}
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                    >
                                        {t.common.cancel}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 btn btn-primary"
                                    >
                                        {loading ? t.common.loading : t.common.save}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* 2FA Setup Modal */}
                {showTwoFactorModal && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{t.settingsPage.twoFactor}</h3>

                            {!twoFactorStep ? (
                                <>
                                    <p className="text-gray-500 text-sm mb-6">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc).</p>

                                    <div className="flex justify-center mb-6">
                                        <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-white shadow-inner">
                                            {/* Mock QR Code */}
                                            <div className="w-40 h-40 grid grid-cols-6 grid-rows-6 gap-0.5">
                                                {Array.from({ length: 36 }).map((_, i) => (
                                                    <div key={i} className={`bg-gray-900 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center mb-6">
                                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Backup Key</p>
                                        <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono text-gray-800">ABCD-EFGH-IJKL-MNOP</code>
                                    </div>

                                    <button
                                        onClick={() => setTwoFactorStep(true)}
                                        className="w-full btn btn-primary"
                                    >
                                        {t.common.next}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-500 text-sm mb-6">Enter the 6-digit code from your authenticator app to verify setup.</p>

                                    <form onSubmit={(e) => { e.preventDefault(); handleToggle2FA(true); }}>
                                        <input
                                            type="text"
                                            placeholder="000 000"
                                            maxLength={6}
                                            className="w-full text-center text-2xl tracking-widest px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-6 font-mono"
                                            required
                                        />
                                        <div className="flex gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setTwoFactorStep(false)}
                                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                            >
                                                {t.common.back}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 btn btn-primary"
                                            >
                                                {loading ? t.common.loading : t.common.confirm}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
}

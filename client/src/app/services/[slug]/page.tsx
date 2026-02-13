'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getServiceById, addServiceRequest } from '@/lib/services-data';
import { ServiceCategory, RequestStatus, ServiceRequest } from '@/lib/services-types';
import { useAuth } from '@/hooks/useAuth';
import { useListings } from '@/hooks/useListings';
import { useTranslation } from '@/lib/i18n/I18nProvider';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { CheckCircle, AlertTriangle, ArrowLeft, Loader2, Calendar, MapPin, FileText, Truck, BarChart2, Download } from 'lucide-react';
import Link from 'next/link';
import { getMarketData } from '@/lib/market-data';
import CategoryPriceCard from '@/components/market/CategoryPriceCard';

export default function ServiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { listings } = useListings();
    const { t } = useTranslation();
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [generatingPdf, setGeneratingPdf] = useState(false);

    const service = getServiceById(params.slug as string);

    // Initial form data setup
    useEffect(() => {
        // Pre-fill user data if available
        if (service && user) {
            setFormData((prev: any) => ({
                ...prev,
                companyName: user.company || '',
                contactName: user.name || '',
                email: user.email || ''
            }));
        }
    }, [service, user]);

    // Calculate Real Stats for Sustainability Report
    const reportStats = useMemo(() => {
        // Return zeros if no user or listings
        if (!user || !listings) return { totalWeight: 0, totalCO2: 0, totalRevenue: 0, breakdown: {} };

        // Filter listings for the current user and only 'approved' ones for the report
        const userListings = listings.filter(l => l.sellerId === user.id && l.status === 'approved');

        let totalWeight = 0;
        let totalRevenue = 0;
        const breakdown: Record<string, number> = {};

        userListings.forEach(item => {
            // Normalize quantity to kg
            let qty = Number(item.quantity) || 0;
            if (item.unit === 'ton') qty *= 1000;

            totalWeight += qty;

            // Calculate revenue: pricePerKg * quantity (in kg)
            // If item.pricePerKg is undefined, assume 0
            const price = Number(item.pricePerKg) || 0;
            totalRevenue += price * qty;

            // Breakdown by category
            const cat = item.category || 'Other';
            breakdown[cat] = (breakdown[cat] || 0) + qty;
        });

        // CO2 Factors (kg CO2e saved per kg waste recycled)
        const co2Factors: Record<string, number> = {
            'Plastic': 1.5,
            'Paper': 1.0,
            'Metal': 4.0,
            'Glass': 0.3,
            'E-Waste': 12.0,
            'Organic': 0.5,
            'Chemical': 2.0
        };

        let totalCO2 = 0;
        Object.entries(breakdown).forEach(([cat, qty]) => {
            // Simple fuzzy matching for category
            const key = Object.keys(co2Factors).find(k => cat.includes(k) || k.includes(cat));
            const factor = key ? co2Factors[key] : 1.0;
            totalCO2 += qty * factor;
        });

        return {
            totalWeight, // total kg
            totalCO2: totalCO2 / 1000, // convert kg CO2 to Tons
            totalRevenue,
            breakdown
        };
    }, [listings, user]);

    // Calculate market data from listings (always call hooks at top level)
    const marketData = useMemo(() => {
        if (!listings) return [];
        return getMarketData(listings);
    }, [listings]);


    const handleDownloadPDF = async () => {
        setGeneratingPdf(true);
        try {
            // Dynamic imports to prevent SSR issues
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();
            const period = formData.reportPeriod || 'All Time';
            const userName = user?.company || user?.name || 'N/A';

            // Header Background
            doc.setFillColor(21, 128, 61); // Green-700
            doc.rect(0, 0, 210, 40, 'F');

            // Header Text
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.text("Sustainability Impact Report", 14, 20);

            doc.setFontSize(11);
            doc.text(`Generated for: ${userName}`, 14, 32);
            doc.text(`Period: ${period}`, 150, 32);

            // Executive Summary Section
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.text("Executive Summary", 14, 55);

            const summaryData = [
                ['Total Waste Recycled', `${reportStats.totalWeight.toLocaleString()} kg`],
                ['CO2 Emissions Saved', `${reportStats.totalCO2.toFixed(3)} Tons`],
                ['Revenue Generated', `INR ${reportStats.totalRevenue.toLocaleString()}`]
            ];

            autoTable(doc, {
                startY: 60,
                head: [['Metric', 'Value']],
                body: summaryData,
                theme: 'grid',
                headStyles: { fillColor: [22, 163, 74] }, // Green-600
                styles: { fontSize: 12, cellPadding: 6 }
            });

            // Detailed Breakdown Section
            const finalY = (doc as any).lastAutoTable?.finalY || 60;

            doc.setFontSize(16);
            doc.text("Detailed Breakdown by Category", 14, finalY + 15);

            const breakdownData = Object.entries(reportStats.breakdown).map(([cat, qty]) => [
                cat,
                `${qty.toLocaleString()} kg`,
                `${((qty / (reportStats.totalWeight || 1)) * 100).toFixed(1)}%`
            ]);

            autoTable(doc, {
                startY: finalY + 25,
                head: [['Category', 'Quantity', 'Percentage']],
                body: breakdownData,
                theme: 'striped',
                headStyles: { fillColor: [37, 99, 235] } // Blue-600
            });

            // Footer
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(9);
            doc.setTextColor(100);
            doc.text("Generated by Scrapify - Waste Trading Platform", 14, pageHeight - 10);
            const dateStr = new Date().toISOString().slice(0, 10);
            doc.text(dateStr, 150, pageHeight - 10);

            doc.save(`Sustainability_Report_${dateStr}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Failed to generate PDF. Please ensure you are using a supported browser.");
        } finally {
            setGeneratingPdf(false);
        }
    };

    if (authLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin" /></div>;

    if (!isAuthenticated) {
        if (typeof window !== 'undefined') router.push(`/login?redirect=/services/${params.slug}`);
        return null;
    }

    if (!service) return <div className="text-center py-20">Service not found</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const request: ServiceRequest = {
            id: crypto.randomUUID(),
            userId: user!.id,
            serviceId: service.id,
            status: RequestStatus.REQUESTED,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Snapshot stats if reporting
            data: service.category === ServiceCategory.REPORTING ? reportStats : formData,
            companyName: user?.company || '',
            contactName: user?.name || '',
            contactEmail: user?.email || '',
            contactPhone: user?.phone || '',
        };

        addServiceRequest(request);

        setSubmitting(false);
        setSuccess(true);
        window.scrollTo(0, 0);
    };

    // Render Success State (with Report View for Reporting Service)
    if (success) {
        if (service.category === ServiceCategory.REPORTING) {
            return (
                <div className="min-h-screen bg-gray-50 py-12">
                    <div className="container-custom max-w-4xl">
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="bg-green-700 text-white p-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <BarChart2 className="w-8 h-8" />
                                    </div>
                                    <h1 className="text-3xl font-bold">Sustainability Impact Report</h1>
                                </div>
                                <p className="text-green-100">Generated for {user?.company || user?.name} • Period: {formData.reportPeriod || 'All Time'}</p>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 text-center">
                                        <div className="text-3xl font-bold text-green-700 mb-1">{reportStats.totalWeight.toLocaleString()} kg</div>
                                        <div className="text-sm text-green-800">Total Waste Recycled</div>
                                    </div>
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                                        <div className="text-3xl font-bold text-blue-700 mb-1">{reportStats.totalCO2.toFixed(3)} Tons</div>
                                        <div className="text-sm text-blue-800">CO2 Emissions Saved</div>
                                    </div>
                                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 text-center">
                                        <div className="text-3xl font-bold text-purple-700 mb-1">INR {reportStats.totalRevenue.toLocaleString()}</div>
                                        <div className="text-sm text-purple-800">Revenue from Waste</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Category Breakdown</h3>
                                    <div className="space-y-4">
                                        {Object.entries(reportStats.breakdown).length > 0 ? (
                                            Object.entries(reportStats.breakdown).map(([cat, qty]) => (
                                                <div key={cat}>
                                                    <div className="flex justify-between text-sm mb-1">
                                                        <span className="font-medium">{cat}</span>
                                                        <span>{qty.toLocaleString()} kg</span>
                                                    </div>
                                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                                        <div
                                                            className="bg-green-600 h-2.5 rounded-full"
                                                            style={{ width: `${(qty / (reportStats.totalWeight || 1)) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No approved waste listings found to calculate breakdown.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-center gap-4">
                                    <button
                                        className="btn btn-primary flex items-center gap-2"
                                        onClick={handleDownloadPDF}
                                        disabled={generatingPdf}
                                    >
                                        {generatingPdf ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Download className="w-4 h-4" />
                                        )}
                                        {generatingPdf ? 'Generating PDF...' : 'Download PDF Report'}
                                    </button>
                                    <Link href="/dashboard/seller" className="btn btn-outline">
                                        Back to Dashboard
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-2xl text-center">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Your request for <strong>{service.name}</strong> has been submitted successfully.
                            Our team will review it and update the status shortly.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Link href="/dashboard/seller" className="btn btn-primary">
                                Go to Dashboard
                            </Link>
                            <Link href="/services" className="btn btn-outline">
                                Browse More Services
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderForm = () => {
        switch (service.category) {
            case ServiceCategory.LOGISTICS:
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                                <input required type="text" name="pickupAddress" className="input-field" placeholder="Full address" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                                <input required type="date" name="preferredDate" className="input-field" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Waste Type</label>
                                <select required name="wasteType" className="input-field" onChange={handleChange}>
                                    <option value="">Select Type</option>
                                    <option value="Plastic">Plastic</option>
                                    <option value="Metal">Metal</option>
                                    <option value="Paper">Paper</option>
                                    <option value="E-Waste">E-Waste</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity (kg)</label>
                                <input required type="number" name="quantity" className="input-field" placeholder="e.g. 500" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Instuctions</label>
                            <textarea name="requirements" rows={3} className="input-field" placeholder="Access restrictions, vehicle requirements, etc." onChange={handleChange}></textarea>
                        </div>
                    </div>
                );

            case ServiceCategory.AUDIT:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Facility Size (sq ft)</label>
                            <input required type="number" name="facilitySize" className="input-field" placeholder="e.g. 5000" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Waste Streams</label>
                            <input required type="text" name="wasteStreams" className="input-field" placeholder="e.g. Plastic, Cardboard, Organic" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Audit Goals</label>
                            <textarea required name="auditGoals" rows={3} className="input-field" placeholder="What are you hoping to achieve? (e.g. Zero Waste certification, cost reduction)" onChange={handleChange}></textarea>
                        </div>
                    </div>
                );

            case ServiceCategory.COMPLIANCE:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type Needed</label>
                            <select required name="documentType" className="input-field" onChange={handleChange}>
                                <option value="">Select Document</option>
                                <option value="Waste Manifest">Waste Manifest</option>
                                <option value="Recycling Certificate">Recycling Certificate</option>
                                <option value="EPR Certificate">EPR Certificate</option>
                                <option value="Pollution Control Clearance">Pollution Control Clearance</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Period / Date Range</label>
                            <input type="text" name="period" className="input-field" placeholder="e.g. FY 2025-26" onChange={handleChange} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Specific Requirements</label>
                            <textarea name="requirements" rows={3} className="input-field" placeholder="Any specific format or authority requirements?" onChange={handleChange}></textarea>
                        </div>
                    </div>
                );

            case ServiceCategory.HAZARDOUS:
                return (
                    <div className="space-y-6">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="font-semibold text-red-900">Important Safety Notice</h4>
                                <p className="text-sm text-red-700">Hazardous waste requests require strict verification and manual approval. A licensed partner will contact you directly.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hazard Class / Type</label>
                                <input required type="text" name="hazardType" className="input-field" placeholder="e.g. Chemical Sludge, Medical Waste" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input required type="text" name="quantity" className="input-field" placeholder="e.g. 5 Drums / 200kg" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location & Condition</label>
                            <textarea required name="storageDetails" rows={3} className="input-field" placeholder="Describe where and how the waste is currently stored" onChange={handleChange}></textarea>
                        </div>
                    </div>
                );

            case ServiceCategory.REPORTING:
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Period</label>
                            <select required name="reportPeriod" className="input-field" onChange={handleChange}>
                                <option value="">Select Period</option>
                                <option value="Last Month">Last Month</option>
                                <option value="Last Quarter">Last Quarter</option>
                                <option value="Last Year">Last Year</option>
                                <option value="Custom Range">Custom Range</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Report Format</label>
                            <div className="flex gap-4 mt-2">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="format" value="PDF" defaultChecked onChange={handleChange} /> <span>PDF Summary</span>
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="format" value="Excel" onChange={handleChange} /> <span>Detailed Excel</span>
                                </label>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <p className="text-gray-500">Please contact support to request this service.</p>;
        }
    };

    // Special Case: Market Insights (Read Only)
    if (service.category === ServiceCategory.INSIGHTS) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom">
                    <Link href="/services" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Services
                    </Link>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-primary-900 text-white p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-4xl">{service.icon}</div>
                                <div>
                                    <h1 className="text-3xl font-bold">{service.name}</h1>
                                    <p className="text-primary-200 text-sm mt-1">Live market price trends updated daily</p>
                                </div>
                            </div>
                            <p className="text-primary-100 max-w-2xl">{service.description}</p>
                        </div>

                        <div className="p-8">
                            {/* Disclaimer */}
                            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-800">
                                    <strong>Note:</strong> All prices shown are estimated market prices based on recent platform listings.
                                    Actual prices may vary based on quality, quantity, and location.
                                </p>
                            </div>

                            {/* Market Overview */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <BarChart2 className="w-5 h-5" />
                                    Market Price Trends
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    Track real-time price movements for major recyclable waste categories over the past 14 days.
                                </p>
                            </div>

                            {/* Category Price Cards */}
                            {marketData.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {marketData.map((data) => (
                                        <CategoryPriceCard key={data.category} data={data} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 mb-4">
                                        <BarChart2 className="w-16 h-16 mx-auto" />
                                    </div>
                                    <p className="text-gray-600">No market data available yet.</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Market insights will appear once listings are added to the platform.
                                    </p>
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="mt-12 pt-8 border-t border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-4">How We Calculate Prices</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 font-bold">1</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Real Listings</h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                We analyze approved listings on the platform
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 font-bold">2</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Average Calculation</h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Calculate average price per kg for each category
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <span className="text-purple-600 font-bold">3</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 text-sm">Daily Updates</h4>
                                            <p className="text-xs text-gray-600 mt-1">
                                                Prices update as new listings are added
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container-custom max-w-4xl">
                    <Link href="/services" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Services
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{service.icon}</div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-gray-900">{service.name}</h1>
                                            <p className="text-gray-500 text-sm mt-1">{service.shortDescription}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleSubmit}>
                                        {renderForm()}

                                        <div className="mt-8">
                                            <button
                                                type="submit"
                                                disabled={submitting}
                                                className="btn btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
                                            >
                                                {submitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Submitting Request...
                                                    </>
                                                ) : (
                                                    <>
                                                        Submit Request
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500 text-center mt-3">
                                                By submitting this request, you agree to our service terms and conditions.
                                            </p>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                                <h3 className="font-bold text-gray-900 mb-4">Service Features</h3>
                                <ul className="space-y-3 mb-8">
                                    {service.features.slice(0, 5).map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <CheckCircle className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <h3 className="font-bold text-gray-900 mb-4">Why Choose Us?</h3>
                                <ul className="space-y-3">
                                    {service.benefits.slice(0, 4).map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0"></div>
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <p className="text-xs text-gray-400">Need help? Support is available 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}

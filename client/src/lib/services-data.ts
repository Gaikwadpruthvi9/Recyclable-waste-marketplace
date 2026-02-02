import { Service, ServiceCategory, ServiceRequest } from './services-types';

// Sample services data
export const SERVICES: Service[] = [
    {
        id: 'logistics',
        name: 'Logistics Assistance',
        slug: 'logistics',
        description: 'End-to-end logistics support for waste collection, transportation, and delivery with real-time tracking and route optimization.',
        shortDescription: 'Pickup scheduling, transportation, and tracking services',
        icon: '🚚',
        category: ServiceCategory.LOGISTICS,
        features: [
            'Scheduled pickup coordination',
            'Fleet management integration',
            'Real-time GPS tracking',
            'Multi-point route optimization',
            'Cost estimation calculator',
            'Partner transporter network'
        ],
        benefits: [
            'Save time on logistics coordination',
            'Reduce transportation costs by 30%',
            'Real-time visibility of shipments',
            'Reliable pickup schedules'
        ],
        pricing: [
            {
                name: 'Per Pickup',
                price: 500,
                unit: 'per pickup',
                features: ['Single location', 'Standard vehicle', 'Basic tracking']
            },
            {
                name: 'Monthly',
                price: 15000,
                unit: 'per month',
                features: ['Up to 20 pickups', 'Priority scheduling', 'Advanced tracking', 'Dedicated support'],
                popular: true
            },
            {
                name: 'Enterprise',
                price: 0,
                unit: 'custom',
                features: ['Unlimited pickups', 'Custom routes', 'API integration', 'Account manager']
            }
        ],
        active: true
    },
    {
        id: 'audit',
        name: 'Waste Audits',
        slug: 'waste-audits',
        description: 'Professional on-site waste assessment and analysis to identify recycling opportunities and cost savings.',
        shortDescription: 'On-site waste assessment and recycling analysis',
        icon: '📊',
        category: ServiceCategory.AUDIT,
        features: [
            'On-site inspection by experts',
            'Waste stream categorization',
            'Volume and composition analysis',
            'Recycling potential evaluation',
            'Cost-benefit analysis',
            'Detailed PDF report with recommendations'
        ],
        benefits: [
            'Identify hidden recycling opportunities',
            'Reduce waste disposal costs',
            'Improve sustainability metrics',
            'Data-driven decision making'
        ],
        pricing: [
            {
                name: 'Basic Audit',
                price: 10000,
                unit: 'one-time',
                features: ['Single facility', '1-day assessment', 'Basic report']
            },
            {
                name: 'Comprehensive',
                price: 25000,
                unit: 'one-time',
                features: ['Multiple facilities', '2-day assessment', 'Detailed report', 'Action plan'],
                popular: true
            },
            {
                name: 'Annual Package',
                price: 100000,
                unit: 'per year',
                features: ['Quarterly audits', 'Ongoing monitoring', 'Priority support', 'Trend analysis']
            }
        ],
        active: true
    },
    {
        id: 'compliance',
        name: 'Compliance Documentation',
        slug: 'compliance',
        description: 'Regulatory compliance tracking, certificate generation, and documentation management for environmental regulations.',
        shortDescription: 'Regulatory compliance and documentation management',
        icon: '📋',
        category: ServiceCategory.COMPLIANCE,
        features: [
            'Regulatory requirement tracking',
            'Auto-generated certificates',
            'Waste manifest creation',
            'Environmental permit management',
            'Compliance calendar and alerts',
            'Audit trail maintenance'
        ],
        benefits: [
            'Stay compliant with regulations',
            'Avoid penalties and fines',
            'Automated documentation',
            'Peace of mind'
        ],
        pricing: [
            {
                name: 'Per Document',
                price: 1000,
                unit: 'per document',
                features: ['Single certificate', 'Standard processing', '7-day delivery']
            },
            {
                name: 'Monthly Package',
                price: 5000,
                unit: 'per month',
                features: ['Up to 10 documents', 'Priority processing', 'Compliance alerts'],
                popular: true
            },
            {
                name: 'Annual Compliance',
                price: 50000,
                unit: 'per year',
                features: ['Unlimited documents', 'Dedicated compliance officer', 'Audit support', 'Training']
            }
        ],
        active: true
    },
    {
        id: 'hazardous',
        name: 'Hazardous Waste Handling',
        slug: 'hazardous-waste',
        description: 'Specialized handling and disposal of hazardous waste with licensed partners and safety protocols.',
        shortDescription: 'Safe disposal of hazardous and dangerous waste',
        icon: '⚠️',
        category: ServiceCategory.HAZARDOUS,
        features: [
            'Licensed disposal partner network',
            'Safety assessment and protocols',
            'Emergency response services',
            'Staff training programs',
            'Incident reporting and tracking',
            'Regulatory compliance support'
        ],
        benefits: [
            'Ensure worker safety',
            'Proper hazardous waste disposal',
            'Regulatory compliance',
            'Risk mitigation'
        ],
        pricing: [
            {
                name: 'Consultation',
                price: 15000,
                unit: 'one-time',
                features: ['Safety assessment', 'Protocol development', 'Basic training']
            },
            {
                name: 'Per Ton Disposal',
                price: 35000,
                unit: 'per ton',
                features: ['Licensed disposal', 'Transportation', 'Documentation', 'Tracking'],
                popular: true
            },
            {
                name: 'Annual Contract',
                price: 0,
                unit: 'custom',
                features: ['Ongoing disposal', 'Emergency response', 'Regular training', 'Compliance management']
            }
        ],
        active: true
    },
    {
        id: 'insights',
        name: 'Market Insights',
        slug: 'market-insights',
        description: 'Real-time market data, pricing trends, and analytics to help you make informed trading decisions.',
        shortDescription: 'Pricing trends and market analytics',
        icon: '📈',
        category: ServiceCategory.INSIGHTS,
        features: [
            'Real-time price trend analysis',
            'Supply and demand forecasting',
            'Competitor benchmarking',
            'Custom analytics dashboards',
            'Weekly market reports',
            'Historical data access'
        ],
        benefits: [
            'Optimize pricing strategies',
            'Identify market opportunities',
            'Stay ahead of trends',
            'Data-driven decisions'
        ],
        pricing: [
            {
                name: 'Basic Insights',
                price: 0,
                unit: 'free',
                features: ['Weekly reports', 'Basic trends', 'Limited history']
            },
            {
                name: 'Premium',
                price: 10000,
                unit: 'per month',
                features: ['Daily updates', 'Advanced analytics', 'Custom dashboards', 'API access'],
                popular: true
            },
            {
                name: 'Enterprise',
                price: 50000,
                unit: 'per month',
                features: ['Real-time data', 'Predictive analytics', 'Dedicated analyst', 'White-label reports']
            }
        ],
        active: true
    },
    {
        id: 'reporting',
        name: 'Sustainability Reporting',
        slug: 'sustainability-reporting',
        description: 'Comprehensive ESG metrics tracking, carbon footprint calculation, and sustainability report generation.',
        shortDescription: 'ESG metrics and sustainability reports',
        icon: '🌱',
        category: ServiceCategory.REPORTING,
        features: [
            'Carbon footprint calculation',
            'ESG metrics dashboard',
            'Impact visualization',
            'Certification support (ISO, LEED)',
            'Annual sustainability report generation',
            'Stakeholder communication tools'
        ],
        benefits: [
            'Demonstrate environmental commitment',
            'Attract eco-conscious investors',
            'Meet ESG requirements',
            'Improve brand reputation'
        ],
        pricing: [
            {
                name: 'Basic Report',
                price: 15000,
                unit: 'one-time',
                features: ['Annual report', 'Basic metrics', 'PDF format']
            },
            {
                name: 'Quarterly Reporting',
                price: 50000,
                unit: 'per quarter',
                features: ['Quarterly reports', 'Advanced metrics', 'Interactive dashboard', 'Trend analysis'],
                popular: true
            },
            {
                name: 'Full ESG Suite',
                price: 200000,
                unit: 'per year',
                features: ['Monthly reporting', 'Certification support', 'Stakeholder portal', 'Dedicated consultant']
            }
        ],
        active: true
    }
];

// Storage functions for service requests
const STORAGE_KEY = 'scrapify_service_requests';

export const getServiceRequests = (): ServiceRequest[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
};

export const saveServiceRequests = (requests: ServiceRequest[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const addServiceRequest = (request: ServiceRequest): void => {
    const requests = getServiceRequests();
    requests.push(request);
    saveServiceRequests(requests);
};

export const updateServiceRequest = (id: string, updates: Partial<ServiceRequest>): void => {
    const requests = getServiceRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...updates, updatedAt: new Date().toISOString() };
        saveServiceRequests(requests);
    }
};

export const getServiceById = (id: string): Service | undefined => {
    return SERVICES.find(s => s.id === id || s.slug === id);
};

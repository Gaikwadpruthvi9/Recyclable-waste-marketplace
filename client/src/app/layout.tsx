import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { I18nProvider } from '@/lib/i18n/I18nProvider';

export const metadata: Metadata = {
    title: 'Scrapify - Recyclable Waste Trading Platform',
    description: 'Connect industries with recyclers. Trade recyclable waste efficiently and sustainably on Scrapify.',
    icons: {
        icon: '/images/scrapify-icon.png',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            </head>
            <body className="flex flex-col min-h-screen">
                <I18nProvider>
                    <Header />
                    <main className="flex-1">
                        {children}
                    </main>
                    <Footer />
                </I18nProvider>
            </body>
        </html>
    );
}

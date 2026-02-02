'use client';

import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon not appearing
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMapProps {
    latitude: number;
    longitude: number;
    title?: string;
}

export default function LocationMap({ latitude, longitude, title }: LocationMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Create map
        const map = L.map(mapContainerRef.current).setView([latitude, longitude], 13);
        mapRef.current = map;

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Cleanup
        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []); // Run once on mount

    // Update view when coordinates change
    useEffect(() => {
        if (!mapRef.current) return;

        mapRef.current.setView([latitude, longitude], 13);

        // Clear existing markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current?.removeLayer(layer);
            }
        });

        const marker = L.marker([latitude, longitude]).addTo(mapRef.current);
        if (title) {
            marker.bindPopup(title).openPopup();
        }
    }, [latitude, longitude, title]);

    return <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: '300px' }} />;
}

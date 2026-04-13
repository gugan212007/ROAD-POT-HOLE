import { useEffect, useRef, useState, Suspense } from 'react';
import { Report, statusLabel, timeAgo } from '@/lib/demo-data';
import { useApp } from '@/context/AppContext';

interface Props {
    reports: Report[];
    isAdmin?: boolean;
}

const statusColors: Record<string, string> = {
    pending: '#e64a52',
    in_progress: '#e07b5a',
    resolved: '#16a34a',
};

// Lazy-loaded real map that uses react-leaflet
const LeafletMap = ({ reports, isAdmin }: Props) => {
    const { viewReport } = useApp();
    const [leafletReady, setLeafletReady] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        let cancelled = false;

        const initMap = async () => {
            try {
                const L = (await import('leaflet')).default;
                await import('leaflet/dist/leaflet.css');

                if (cancelled || !mapContainerRef.current) return;
                if (mapInstanceRef.current) return; // prevent double-init

                const center: [number, number] = reports.length > 0
                    ? [
                        reports.reduce((s, r) => s + r.latitude, 0) / reports.length,
                        reports.reduce((s, r) => s + r.longitude, 0) / reports.length,
                    ]
                    : [28.6139, 77.2090];

                const map = L.map(mapContainerRef.current, {
                    center,
                    zoom: 12,
                    scrollWheelZoom: true,
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(map);

                // Create colored marker icons
                const createIcon = (color: string) => {
                    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="40" viewBox="0 0 28 40">
                        <path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 26 14 26s14-15.5 14-26C28 6.27 21.73 0 14 0z" fill="${color}" stroke="white" stroke-width="2"/>
                        <circle cx="14" cy="14" r="6" fill="white"/>
                    </svg>`;
                    return L.divIcon({
                        html: svg,
                        className: '',
                        iconSize: [28, 40],
                        iconAnchor: [14, 40],
                        popupAnchor: [0, -42],
                    });
                };

                // Add markers
                const markers: L.Marker[] = [];
                reports.forEach(r => {
                    const marker = L.marker([r.latitude, r.longitude], {
                        icon: createIcon(statusColors[r.status]),
                    }).addTo(map);

                    const popupHtml = `
                        <div style="min-width:200px;font-family:inherit;">
                            <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                                <span style="display:inline-block;padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;color:white;background:${statusColors[r.status]};">
                                    ${statusLabel(r.status)}
                                </span>
                                <span style="font-size:10px;color:#888;margin-left:auto;">${timeAgo(r.created_at)}</span>
                            </div>
                            ${r.image_url ? `<img src="${r.image_url}" style="width:100%;height:90px;object-fit:cover;border-radius:6px;margin-bottom:6px;" alt="Report" />` : ''}
                            <p style="font-size:12px;line-height:1.4;margin:0 0 4px;color:#333;">${r.description}</p>
                            <div style="font-size:10px;color:#999;">📍 ${r.location_name}</div>
                        </div>`;

                    marker.bindPopup(popupHtml);
                    marker.on('click', () => viewReport(r));
                    markers.push(marker);
                });

                // Fit bounds to show all markers
                if (reports.length > 0) {
                    const bounds = L.latLngBounds(reports.map(r => [r.latitude, r.longitude] as [number, number]));
                    map.fitBounds(bounds.pad(0.3));
                }

                mapInstanceRef.current = map;
                setLeafletReady(true);
            } catch (err) {
                console.error('Failed to load map:', err);
                setError('Failed to load map. Please try again.');
            }
        };

        initMap();

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [reports, viewReport]);

    if (error) {
        return (
            <div className="text-center py-16">
                <span className="text-[52px] block mb-3.5">⚠️</span>
                <div className="text-[17px] font-bold text-muted-foreground mb-2">{error}</div>
            </div>
        );
    }

    return (
        <div
            ref={mapContainerRef}
            className="rounded-xl border border-border overflow-hidden shadow-card-sm"
            style={{ height: '420px', position: 'relative' }}
        >
            {!leafletReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
                        <span className="text-xs text-muted-foreground font-medium">Loading map…</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const MapView = ({ reports, isAdmin }: Props) => {
    const { viewReport } = useApp();

    if (reports.length === 0) {
        return (
            <div className="text-center py-16">
                <span className="text-[52px] block mb-3.5">🗺️</span>
                <div className="text-[17px] font-bold text-muted-foreground mb-2">No locations to display</div>
                <div className="text-[13px] text-muted-foreground">Submit reports to see them on the map</div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Legend */}
            <div className="flex items-center gap-4 flex-wrap">
                {(['pending', 'in_progress', 'resolved'] as const).map(status => {
                    const count = reports.filter(r => r.status === status).length;
                    return (
                        <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[status] }} />
                            <span className="font-medium">{statusLabel(status)}</span>
                            <span className="opacity-60">({count})</span>
                        </div>
                    );
                })}
                <span className="text-[11px] text-muted-foreground ml-auto">
                    {isAdmin ? '🔐 All citizen reports' : `📍 ${reports.length} location${reports.length !== 1 ? 's' : ''}`}
                </span>
            </div>

            {/* Map - using vanilla Leaflet instead of react-leaflet for React 18 compatibility */}
            <LeafletMap reports={reports} isAdmin={isAdmin} />

            {/* Location list */}
            <div className="space-y-2">
                <h3 className="text-sm font-bold text-foreground">📍 Report Locations</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {reports.map(r => (
                        <button
                            key={r.id}
                            onClick={() => viewReport(r)}
                            className="flex items-center gap-3 p-3 rounded-lg border text-left transition-all duration-200 border-border bg-card hover:border-accent/20 hover:shadow-sm"
                        >
                            <div className="w-3 h-3 rounded-full shrink-0" style={{ background: statusColors[r.status] }} />
                            <div className="min-w-0 flex-1">
                                <div className="text-[12px] font-semibold text-foreground truncate">{r.location_name}</div>
                                <div className="text-[11px] text-muted-foreground truncate">{r.description}</div>
                            </div>
                            <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(r.created_at)}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MapView;

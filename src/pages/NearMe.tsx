import { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Report, statusLabel, timeAgo, statusClass } from '@/lib/demo-data';
import ReportCard from '@/components/ReportCard';

/** Haversine distance in km */
const haversine = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatDist = (km: number) => {
    if (km < 1) return `${Math.round(km * 1000)}m away`;
    return `${km.toFixed(1)}km away`;
};

const statusColors: Record<string, string> = {
    pending: '#e64a52',
    in_progress: '#e07b5a',
    resolved: '#16a34a',
};

const radiusOptions = [
    { label: '1 km', value: 1 },
    { label: '5 km', value: 5 },
    { label: '10 km', value: 10 },
    { label: '25 km', value: 25 },
    { label: 'All', value: Infinity },
];

const NearMe = () => {
    const { user, reports, viewReport } = useApp();
    const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [radius, setRadius] = useState(10); // default 10km
    const [mapLoaded, setMapLoaded] = useState(false);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    // Get user location
    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLoading(false);
            },
            (err) => {
                setError(`Location access denied. ${err.message}`);
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, []);

    // Calculate distances and sort
    const sortedReports: (Report & { distance: number })[] = userPos
        ? reports
            .map((r) => ({
                ...r,
                distance: haversine(userPos.lat, userPos.lng, r.latitude, r.longitude),
            }))
            .filter((r) => radius === Infinity || r.distance <= radius)
            .sort((a, b) => a.distance - b.distance)
        : [];

    // Initialize map when position is ready
    useEffect(() => {
        if (!userPos || !mapContainerRef.current) return;
        let cancelled = false;

        const initMap = async () => {
            try {
                const L = (await import('leaflet')).default;
                await import('leaflet/dist/leaflet.css');

                if (cancelled || !mapContainerRef.current) return;
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                }

                const map = L.map(mapContainerRef.current, {
                    center: [userPos.lat, userPos.lng],
                    zoom: 13,
                    scrollWheelZoom: true,
                });

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                }).addTo(map);

                // User position marker (blue pulsing dot)
                const userIcon = L.divIcon({
                    html: `<div style="position:relative;width:20px;height:20px;">
            <div style="position:absolute;inset:0;background:rgba(59,130,246,0.25);border-radius:50%;animation:pulse-ring 2s ease-out infinite;"></div>
            <div style="position:absolute;inset:4px;background:#3b82f6;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>
          </div>`,
                    className: '',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                });
                L.marker([userPos.lat, userPos.lng], { icon: userIcon })
                    .addTo(map)
                    .bindPopup('<b>📍 Your Location</b>');

                // Radius circle
                if (radius !== Infinity) {
                    L.circle([userPos.lat, userPos.lng], {
                        radius: radius * 1000,
                        color: '#7c4dba',
                        fillColor: '#7c4dba',
                        fillOpacity: 0.06,
                        weight: 2,
                        dashArray: '6, 6',
                    }).addTo(map);
                }

                // Report markers
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

                sortedReports.forEach((r) => {
                    const marker = L.marker([r.latitude, r.longitude], {
                        icon: createIcon(statusColors[r.status]),
                    }).addTo(map);

                    marker.bindPopup(`
            <div style="min-width:180px;font-family:inherit;">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <span style="padding:2px 8px;border-radius:20px;font-size:10px;font-weight:700;text-transform:uppercase;color:white;background:${statusColors[r.status]};">
                  ${statusLabel(r.status)}
                </span>
                <span style="font-size:10px;color:#888;margin-left:auto;">${formatDist(r.distance)}</span>
              </div>
              <p style="font-size:12px;line-height:1.4;margin:0 0 4px;color:#333;">${r.description}</p>
              <div style="font-size:10px;color:#999;">📍 ${r.location_name}</div>
            </div>`);

                    marker.on('click', () => viewReport(r));
                });

                // Fit bounds
                if (sortedReports.length > 0) {
                    const allPoints: [number, number][] = [
                        [userPos.lat, userPos.lng],
                        ...sortedReports.map((r) => [r.latitude, r.longitude] as [number, number]),
                    ];
                    map.fitBounds(L.latLngBounds(allPoints).pad(0.2));
                }

                mapInstanceRef.current = map;
                setMapLoaded(true);
            } catch (err) {
                console.error('Map error:', err);
            }
        };

        initMap();

        return () => {
            cancelled = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
            setMapLoaded(false);
        };
    }, [userPos, sortedReports.length, radius]);

    if (!user) return null;

    return (
        <>


            {/* Header */}
            <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
                <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">
                    Damages Near Me 📍
                </h1>
                <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed max-w-[520px] max-[768px]:text-[12.5px]">
                    {loading
                        ? 'Getting your location to find nearby road damage reports…'
                        : error
                            ? error
                            : `Found ${sortedReports.length} report${sortedReports.length !== 1 ? 's' : ''} within ${radius === Infinity ? 'all areas' : `${radius}km`} of your location.`}
                </p>
            </div>

            {/* Radius filter */}
            {userPos && (
                <div className="flex items-center gap-2 px-8 py-3 border-b border-border max-[768px]:px-4 max-[768px]:overflow-x-auto max-[480px]:px-3" style={{ scrollbarWidth: 'none' }}>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0 mr-1">Radius:</span>
                    {radiusOptions.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => setRadius(opt.value)}
                            className={`py-1.5 px-4 rounded-[10px] text-[12px] font-semibold whitespace-nowrap transition-all duration-200 border max-[480px]:px-3 ${radius === opt.value
                                ? 'text-white border-white/10 shadow-md'
                                : 'text-muted-foreground bg-secondary/60 border-border hover:bg-secondary hover:text-foreground hover:border-accent/20'
                                }`}
                            style={
                                radius === opt.value
                                    ? {
                                        background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)',
                                        boxShadow: '0 4px 14px rgba(107,63,160,0.25)',
                                    }
                                    : undefined
                            }
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
                {loading ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                            style={{ background: 'linear-gradient(135deg, rgba(124,77,186,0.15), rgba(194,83,122,0.15))' }}>
                            <div className="w-8 h-8 border-[3px] border-accent/20 border-t-accent rounded-full animate-spin" />
                        </div>
                        <div className="text-[17px] font-bold text-muted-foreground mb-2">Finding your location…</div>
                        <div className="text-[13px] text-muted-foreground">Please allow location access when prompted</div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <span className="text-[52px] block mb-3.5">📍</span>
                        <div className="text-[17px] font-bold text-muted-foreground mb-2">Location Unavailable</div>
                        <div className="text-[13px] text-muted-foreground mb-5 max-w-[380px] mx-auto">{error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white border border-white/10"
                            style={{ background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)', boxShadow: '0 4px 16px rgba(107,63,160,0.30)' }}
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {/* Map */}
                        <div className="relative rounded-xl border border-border overflow-hidden shadow-card-sm" style={{ height: '360px' }}>
                            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
                            {!mapLoaded && (
                                <div className="absolute inset-0 flex items-center justify-center bg-secondary/30">
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-3 border-accent/20 border-t-accent rounded-full animate-spin" />
                                        <span className="text-xs text-muted-foreground font-medium">Loading map…</span>
                                    </div>
                                </div>
                            )}
                            {/* Floating legend */}
                            <div className="absolute top-3 right-3 z-[400] rounded-lg px-3 py-2 text-[11px] border border-border shadow-md bg-card/90 backdrop-blur-md">
                                <div className="flex items-center gap-1.5 mb-1">
                                    <div className="w-3 h-3 rounded-full bg-[#3b82f6] border-2 border-white shadow-sm" />
                                    <span className="font-medium">You</span>
                                </div>
                                {(['pending', 'in_progress', 'resolved'] as const).map(s => (
                                    <div key={s} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: statusColors[s] }} />
                                        <span>{statusLabel(s)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Nearby reports list */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-base font-bold">
                                    🚨 Nearby Reports
                                    <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-pill bg-accent/10 text-accent border border-accent/20">
                                        {sortedReports.length}
                                    </span>
                                </h2>
                            </div>

                            {sortedReports.length === 0 ? (
                                <div className="text-center py-12 rounded-xl border border-dashed border-border bg-secondary/20">
                                    <span className="text-[42px] block mb-3">🎉</span>
                                    <div className="text-[15px] font-bold text-muted-foreground mb-1">No damages found nearby!</div>
                                    <div className="text-[13px] text-muted-foreground">
                                        Try increasing the search radius or check back later.
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {sortedReports.map((r, i) => (
                                        <button
                                            key={r.id}
                                            onClick={() => viewReport(r)}
                                            className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200 border-border bg-card hover:border-accent/20 hover:shadow-md hover:-translate-y-px animate-fade-up"
                                            style={{ animationDelay: `${i * 60}ms` }}
                                        >
                                            {/* Rank */}
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                                                style={{
                                                    background: i < 3
                                                        ? `linear-gradient(135deg, ${statusColors[r.status]}, ${statusColors[r.status]}dd)`
                                                        : '#94a3b8',
                                                }}
                                            >
                                                {i + 1}
                                            </div>

                                            {/* Info */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <span className="text-[13px] font-bold text-foreground truncate">{r.location_name}</span>
                                                    <span
                                                        className="shrink-0 text-[9px] font-bold uppercase px-2 py-0.5 rounded-pill text-white"
                                                        style={{ background: statusColors[r.status] }}
                                                    >
                                                        {statusLabel(r.status)}
                                                    </span>
                                                </div>
                                                <div className="text-[12px] text-muted-foreground truncate">{r.description}</div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[11px] text-muted-foreground/70">🕐 {timeAgo(r.created_at)}</span>
                                                </div>
                                            </div>

                                            {/* Distance badge */}
                                            <div className="shrink-0 text-right">
                                                <div
                                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border"
                                                    style={{
                                                        background: r.distance < 1
                                                            ? 'rgba(239,68,68,0.08)'
                                                            : r.distance < 5
                                                                ? 'rgba(245,158,11,0.08)'
                                                                : 'rgba(107,63,160,0.08)',
                                                        color: r.distance < 1 ? '#ef4444' : r.distance < 5 ? '#d97706' : '#7c4dba',
                                                        borderColor: r.distance < 1 ? 'rgba(239,68,68,0.2)' : r.distance < 5 ? 'rgba(245,158,11,0.2)' : 'rgba(107,63,160,0.2)',
                                                    }}
                                                >
                                                    📍 {formatDist(r.distance)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* CSS for pulse animation */}
            <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
        </>
    );
};

export default NearMe;

import { useApp } from '@/context/AppContext';
import { statusLabel, statusClass, timeAgo } from '@/lib/demo-data';

const badgeColors: Record<string, string> = {
    pending: 'bg-status-pending-bg text-status-pending-fg border-status-pending-bd',
    progress: 'bg-status-progress-bg text-status-progress-fg border-status-progress-bd',
    resolved: 'bg-status-resolved-bg text-status-resolved-fg border-status-resolved-bd',
};

const ReportDetailModal = () => {
    const { selectedReport: r, viewReport, updateStatus, user } = useApp();
    if (!r) return null;

    const sc = statusClass(r.status);
    const isAdmin = user?.is_admin;

    return (
        <div
            className="fixed inset-0 bg-foreground/50 backdrop-blur-[10px] z-[500] flex items-center justify-center p-3 sm:p-6 animate-fade-up"
            onClick={e => e.target === e.currentTarget && viewReport(null)}
        >
            <div className="w-full max-w-[580px] rounded-[18px] overflow-hidden animate-modal-in max-h-[90vh] overflow-y-auto bg-card shadow-card-xl">
                {/* Image or placeholder */}
                {r.image_url ? (
                    <div className="relative">
                        <img src={r.image_url} className="w-full max-h-[320px] object-cover block" alt="Report photo" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.3) 0%, transparent 40%)' }} />
                    </div>
                ) : (
                    <div
                        className="w-full h-[160px] flex flex-col items-center justify-center relative border-0"
                        style={{ background: 'linear-gradient(135deg, #ede9f9, #f9e8f0)' }}
                    >
                        <span className="text-[50px] leading-none mb-2 block">🛣️</span>
                        <div className="text-xs text-muted-foreground/60 font-medium">
                            No photo uploaded
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="px-6 pt-5 pb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-pill text-[11px] font-bold tracking-[0.04em] uppercase border ${badgeColors[sc] || ''}`}>
                            {statusLabel(r.status)}
                        </span>
                        <span className="text-[12px] text-muted-foreground font-mono">📍 {r.location_name}</span>
                    </div>
                    <button
                        onClick={() => viewReport(null)}
                        className="w-[30px] h-[30px] rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all text-[17px] shrink-0"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-5">
                    {/* Time */}
                    <div className="text-[11px] text-muted-foreground mb-3 flex items-center gap-2">
                        <span>🕓 Submitted {timeAgo(r.created_at)}</span>
                        <span className="opacity-40">·</span>
                        <span>{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    {/* Description */}
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">🚧 Damage Description</h3>
                        <p className="text-[14px] text-foreground leading-relaxed">{r.description}</p>
                    </div>

                    {/* Live Map View */}
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">🗺️ Road Location Map</h3>
                        <div className="rounded-xl overflow-hidden border border-border" style={{ height: '220px' }}>
                            <iframe
                                title="Report Location Map"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=${r.longitude - 0.005}%2C${r.latitude - 0.003}%2C${r.longitude + 0.005}%2C${r.latitude + 0.003}&layer=mapnik&marker=${r.latitude}%2C${r.longitude}`}
                            />
                        </div>
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${r.latitude}&mlon=${r.longitude}#map=16/${r.latitude}/${r.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 mt-2 text-[11px] text-accent hover:underline font-medium"
                        >
                            📍 Open in full map
                        </a>
                    </div>

                    {/* Location details */}
                    <div className="mb-4">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">📐 GPS Coordinates</h3>
                        <div className="grid grid-cols-2 gap-2 text-[12px]">
                            <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
                                <div className="text-muted-foreground text-[10px] uppercase font-bold mb-0.5">Latitude</div>
                                <div className="font-mono font-semibold">{r.latitude.toFixed(6)}</div>
                            </div>
                            <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
                                <div className="text-muted-foreground text-[10px] uppercase font-bold mb-0.5">Longitude</div>
                                <div className="font-mono font-semibold">{r.longitude.toFixed(6)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Admin controls */}
                    {isAdmin && (
                        <div className="mb-2">
                            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">🔧 Update Repair Status</h3>
                            <div className="flex gap-2 flex-wrap">
                                {(['pending', 'in_progress', 'resolved'] as const).map(status => (
                                    <button
                                        key={status}
                                        onClick={() => updateStatus(r.id, status)}
                                        className={`px-3.5 py-1.5 rounded-[10px] text-[12px] font-semibold border transition-all duration-200 ${r.status === status
                                            ? 'text-white border-white/10'
                                            : 'text-muted-foreground bg-secondary/60 border-border hover:border-accent/20'
                                            }`}
                                        style={r.status === status ? {
                                            background: status === 'pending' ? '#e64a52' : status === 'in_progress' ? '#e07b5a' : '#16a34a',
                                        } : undefined}
                                    >
                                        {statusLabel(status)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-5 pt-2 flex justify-end border-t border-border">
                    <button
                        onClick={() => viewReport(null)}
                        className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white border border-white/10 transition-all hover:-translate-y-px"
                        style={{ background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)', boxShadow: '0 4px 16px rgba(107,63,160,0.30)' }}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReportDetailModal;

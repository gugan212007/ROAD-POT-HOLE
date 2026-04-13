import { Report, statusLabel, timeAgo } from '@/lib/demo-data';

interface Props {
    reports: Report[];
    isAdmin?: boolean;
}

const statusColors: Record<string, { dot: string; line: string; bg: string; badge: string }> = {
    pending: {
        dot: '#e64a52',
        line: 'rgba(230, 74, 82, 0.25)',
        bg: 'rgba(230, 74, 82, 0.08)',
        badge: 'bg-status-pending-bg text-status-pending-fg border-status-pending-bd',
    },
    in_progress: {
        dot: '#e07b5a',
        line: 'rgba(224, 123, 90, 0.25)',
        bg: 'rgba(224, 123, 90, 0.08)',
        badge: 'bg-status-progress-bg text-status-progress-fg border-status-progress-bd',
    },
    resolved: {
        dot: '#16a34a',
        line: 'rgba(22, 163, 74, 0.25)',
        bg: 'rgba(22, 163, 74, 0.08)',
        badge: 'bg-status-resolved-bg text-status-resolved-fg border-status-resolved-bd',
    },
};

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const groupByDate = (reports: Report[]) => {
    const sorted = [...reports].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const groups: { date: string; label: string; reports: Report[] }[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const r of sorted) {
        const d = new Date(r.created_at);
        d.setHours(0, 0, 0, 0);
        const dateKey = d.toISOString().split('T')[0];

        let label: string;
        if (d.getTime() === today.getTime()) label = 'Today';
        else if (d.getTime() === yesterday.getTime()) label = 'Yesterday';
        else label = formatDate(r.created_at);

        const existing = groups.find(g => g.date === dateKey);
        if (existing) {
            existing.reports.push(r);
        } else {
            groups.push({ date: dateKey, label, reports: [r] });
        }
    }
    return groups;
};

const TimelineView = ({ reports }: Props) => {
    if (reports.length === 0) {
        return (
            <div className="text-center py-16">
                <span className="text-[52px] block mb-3.5">📅</span>
                <div className="text-[17px] font-bold text-muted-foreground mb-2">No timeline data</div>
                <div className="text-[13px] text-muted-foreground">Submit reports to see them on the timeline</div>
            </div>
        );
    }

    const groups = groupByDate(reports);

    return (
        <div className="space-y-6">
            {/* Summary bar */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Activity Timeline</div>
                <div className="flex-1 h-px bg-border" />
                <div className="text-xs text-muted-foreground">
                    {reports.length} report{reports.length !== 1 ? 's' : ''} · {groups.length} day{groups.length !== 1 ? 's' : ''}
                </div>
            </div>

            {/* Timeline */}
            <div className="relative">
                {groups.map((group, gi) => (
                    <div key={group.date} className="mb-6 last:mb-0">
                        {/* Date header */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="px-3 py-1 rounded-lg bg-secondary border border-border text-[12px] font-bold text-foreground">
                                📅 {group.label}
                            </div>
                            <div className="flex-1 h-px bg-border" />
                            <div className="text-[11px] text-muted-foreground">
                                {group.reports.length} report{group.reports.length !== 1 ? 's' : ''}
                            </div>
                        </div>

                        {/* Items */}
                        <div className="relative ml-4">
                            {/* Vertical line */}
                            <div className="absolute left-[7px] top-2 bottom-2 w-[2px] rounded-full bg-border" />

                            {group.reports.map((r, ri) => {
                                const colors = statusColors[r.status];
                                return (
                                    <div
                                        key={r.id}
                                        className="relative pl-8 pb-4 last:pb-0 animate-fade-up"
                                        style={{ animationDelay: `${(gi * group.reports.length + ri) * 0.04}s` }}
                                    >
                                        {/* Dot */}
                                        <div
                                            className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-[3px] border-card z-10"
                                            style={{ background: colors.dot, boxShadow: `0 0 0 3px ${colors.line}` }}
                                        />

                                        {/* Card */}
                                        <div
                                            className="border border-border rounded-lg p-3.5 transition-all duration-200 hover:shadow-card-sm hover:border-accent/20"
                                            style={{ background: `linear-gradient(135deg, ${colors.bg}, transparent)` }}
                                        >
                                            <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-wide border ${colors.badge}`}>
                                                    {statusLabel(r.status)}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground ml-auto font-mono">
                                                    🕐 {formatTime(r.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-foreground leading-relaxed line-clamp-2 mb-2">
                                                {r.description}
                                            </p>
                                            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <span className="text-accent">📍</span>
                                                    {r.location_name}
                                                </span>
                                                <span className="ml-auto opacity-60">{timeAgo(r.created_at)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimelineView;

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import StatCard from '@/components/StatCard';
import ReportCard from '@/components/ReportCard';
import FilterStrip from '@/components/FilterStrip';
import MapView from '@/components/MapView';
import TimelineView from '@/components/TimelineView';

type Tab = 'reports' | 'map' | 'analytics';
const TABS: { key: Tab; label: string }[] = [
  { key: 'reports', label: '📋 All Reports' },
  { key: 'map', label: '🗺 Map View' },
  { key: 'analytics', label: '📊 Analytics' },
];

const AdminDashboard = () => {
  const { reports, filter, setFilter, navigate } = useApp();
  const [tab, setTab] = useState<Tab>('reports');
  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const pending = reports.filter(r => r.status === 'pending').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const rate = reports.length ? Math.round((resolved / reports.length) * 100) : 0;

  const counts: Record<string, number> = {
    all: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    in_progress: reports.filter(r => r.status === 'in_progress').length,
    resolved,
  };

  return (
    <>


      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">Admin Dashboard</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-[768px]:text-[12.5px]">
          Manage all road damage reports. Update statuses, assign teams, track resolution.
        </p>
      </div>

      <div className="flex gap-2 px-8 py-3 border-b border-border max-[768px]:px-4 max-[768px]:overflow-x-auto max-[480px]:px-3 max-[480px]:gap-1.5" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-2 px-5 rounded-[10px] text-[13px] font-semibold whitespace-nowrap transition-all duration-200 border max-[768px]:text-[12px] max-[768px]:px-4 max-[480px]:px-3 ${tab === t.key
              ? 'text-white border-white/10 shadow-md hover:-translate-y-px'
              : 'text-muted-foreground bg-secondary/60 border-border hover:bg-secondary hover:text-foreground hover:border-accent/20'
              }`}
            style={tab === t.key ? {
              background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)',
              boxShadow: '0 4px 14px rgba(107,63,160,0.25)',
            } : undefined}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
        {tab === 'reports' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-7 max-[768px]:gap-2.5 max-[480px]:grid-cols-1 max-[480px]:gap-2.5">
              <StatCard label="Total Reports" value={reports.length} hint="All submissions" icon="📂" variant="progress" delay={0} onClick={() => setFilter('all')} />
              <StatCard label="Action Required" value={pending} hint="Needs assignment" icon="⚠️" variant="high" delay={1} onClick={() => setFilter('pending')} />
              <StatCard label="Resolution Rate" value={`${rate}%`} hint={`${resolved} roads fixed`} icon="📈" variant="resolved" delay={2} onClick={() => setFilter('resolved')} />
            </div>

            <FilterStrip counts={counts} />

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-[52px] block mb-3.5">🎉</span>
                <div className="text-[17px] font-bold text-muted-foreground mb-2">All clear!</div>
                <div className="text-[13px] text-muted-foreground">No reports in this category</div>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[1400px]:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
                {filtered.map((r, i) => <ReportCard key={r.id} report={r} isAdmin delay={i} />)}
              </div>
            )}
          </>
        )}

        {tab === 'map' && <MapView reports={reports} isAdmin />}

        {tab === 'analytics' && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-7 max-[768px]:gap-2.5 max-[480px]:grid-cols-1 max-[480px]:gap-2.5">
              <StatCard label="Total Reports" value={reports.length} hint="All submissions" icon="📂" variant="progress" delay={0} />
              <StatCard label="Action Required" value={pending} hint="Needs assignment" icon="⚠️" variant="high" delay={1} />
              <StatCard label="Resolution Rate" value={`${rate}%`} hint={`${resolved} roads fixed`} icon="📈" variant="resolved" delay={2} />
            </div>

            <TimelineView reports={reports} isAdmin />

            {/* Analytics summary */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-5 bg-card">
                <h3 className="text-sm font-bold mb-3">📊 Status Breakdown</h3>
                <div className="space-y-3">
                  {(['pending', 'in_progress', 'resolved'] as const).map(status => {
                    const count = reports.filter(r => r.status === status).length;
                    const pct = reports.length ? Math.round((count / reports.length) * 100) : 0;
                    const color = status === 'pending' ? '#e64a52' : status === 'in_progress' ? '#e07b5a' : '#16a34a';
                    return (
                      <div key={status}>
                        <div className="flex justify-between text-[12px] mb-1">
                          <span className="font-medium text-foreground capitalize">{status.replace('_', ' ')}</span>
                          <span className="text-muted-foreground">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border border-border rounded-lg p-5 bg-card">
                <h3 className="text-sm font-bold mb-3">📍 Top Locations</h3>
                <div className="space-y-2">
                  {Object.entries(
                    reports.reduce((acc, r) => {
                      acc[r.location_name] = (acc[r.location_name] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([loc, count], i) => (
                      <div key={loc} className="flex items-center gap-2.5 text-[12px]">
                        <span className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: `hsl(${270 - i * 30} 50% 55%)` }}>
                          {i + 1}
                        </span>
                        <span className="font-medium text-foreground truncate flex-1">{loc}</span>
                        <span className="text-muted-foreground font-mono">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;

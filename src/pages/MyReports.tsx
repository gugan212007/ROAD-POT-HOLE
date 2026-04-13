import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { statusLabel } from '@/lib/demo-data';
import ReportCard from '@/components/ReportCard';
import FilterStrip from '@/components/FilterStrip';
import MapView from '@/components/MapView';
import TimelineView from '@/components/TimelineView';

type Tab = 'reports' | 'map' | 'timeline';
const TABS: { key: Tab; label: string }[] = [
  { key: 'reports', label: '📋 All Reports' },
  { key: 'map', label: '🗺 Map' },
  { key: 'timeline', label: '📅 Timeline' },
];

const MyReports = () => {
  const { user, reports, filter, openModal } = useApp();
  const [tab, setTab] = useState<Tab>('reports');
  if (!user) return null;

  const mine = reports.filter(r => r.user_id === user.id);
  const filtered = filter === 'all' ? mine : mine.filter(r => r.status === filter);
  const counts: Record<string, number> = {
    all: mine.length,
    pending: mine.filter(r => r.status === 'pending').length,
    in_progress: mine.filter(r => r.status === 'in_progress').length,
    resolved: mine.filter(r => r.status === 'resolved').length,
  };

  return (
    <>
      <div className="flex items-center justify-between px-8 pt-5 pb-0 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:pt-3.5 max-[768px]:pl-[62px] max-[480px]:pl-[58px] max-[480px]:px-3">
        <div className="text-xs text-muted-foreground">📍 {mine.length} report{mine.length !== 1 ? 's' : ''} submitted</div>
      </div>

      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">My Reports</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-[768px]:text-[12.5px]">
          {mine.filter(r => r.status === 'resolved').length} of {mine.length} reports resolved · Keep reporting to keep your city safe.
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
            <FilterStrip counts={counts} />
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-[52px] block mb-3.5">{filter === 'resolved' ? '🎉' : '🔍'}</span>
                <div className="text-[17px] font-bold text-muted-foreground mb-2">No {filter === 'all' ? '' : statusLabel(filter).toLowerCase()} reports</div>
                <div className="text-[13px] text-muted-foreground">Try a different filter or submit a new report</div>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[1400px]:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
                {filtered.map((r, i) => <ReportCard key={r.id} report={r} delay={i} />)}
              </div>
            )}
          </>
        )}

        {tab === 'map' && <MapView reports={mine} />}
        {tab === 'timeline' && <TimelineView reports={mine} />}
      </div>
    </>
  );
};

export default MyReports;

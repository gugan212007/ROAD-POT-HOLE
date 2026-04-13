import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import StatCard from '@/components/StatCard';
import ReportCard from '@/components/ReportCard';
import MapView from '@/components/MapView';
import TimelineView from '@/components/TimelineView';

type Tab = 'overview' | 'map' | 'timeline';
const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: '📋 Overview' },
  { key: 'map', label: '🗺 Map View' },
  { key: 'timeline', label: '📊 Timeline' },
];

const Dashboard = () => {
  const { user, reports, openModal, navigate, setFilter } = useApp();
  const [tab, setTab] = useState<Tab>('overview');
  if (!user) return null;

  const mine = reports.filter(r => r.user_id === user.id);
  const pending = mine.filter(r => r.status === 'pending').length;
  const inProg = mine.filter(r => r.status === 'in_progress').length;
  const resolved = mine.filter(r => r.status === 'resolved').length;

  const goToFiltered = (status: string) => {
    navigate('myreports');
    setTimeout(() => setFilter(status), 0);
  };

  return (
    <>


      {/* Page head */}
      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <div className="flex items-start justify-between gap-4 max-[768px]:flex-col max-[768px]:gap-3">
          <div>
            <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">Welcome back 👋</h1>
            <p className="text-[13.5px] text-muted-foreground mt-1.5 leading-relaxed max-w-[480px] max-[768px]:text-[12.5px]">
              Track your submitted road damage reports and monitor real-time repair progress across the city.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 max-[768px]:self-start">
            <div className="flex items-center">
              {['A', 'B', 'C'].map((l, i) => (
                <div key={l} className={`w-[34px] h-[34px] max-[768px]:w-7 max-[768px]:h-7 rounded-full border-[2.5px] border-card flex items-center justify-center text-sm max-[768px]:text-xs font-bold text-white shadow-xs ${i > 0 ? '-ml-2 max-[768px]:-ml-1.5' : ''}`}
                  style={{ background: ['linear-gradient(135deg,#7c4dba,#c2537a)', 'linear-gradient(135deg,#c2537a,#e07b5a)', 'linear-gradient(135deg,#e07b5a,#f59e0b)'][i] }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
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

      {/* Content */}
      <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
        {tab === 'overview' && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-7 max-[768px]:gap-2.5 max-[480px]:grid-cols-1 max-[480px]:gap-2.5">
              <StatCard label="Pending" value={pending} hint="Awaiting review" icon="🔴" variant="high" delay={0} onClick={() => goToFiltered('pending')} />
              <StatCard label="In Progress" value={inProg} hint="Being repaired" icon="🔧" variant="progress" delay={1} onClick={() => goToFiltered('in_progress')} />
              <StatCard label="Resolved" value={resolved} hint="Fixed roads" icon="✅" variant="resolved" delay={2} onClick={() => goToFiltered('resolved')} />
            </div>

            {/* Recent reports */}
            <div className="flex items-center justify-between mb-4 max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-2.5">
              <h2 className="text-base font-bold">Recent Reports</h2>
              <button onClick={() => navigate('myreports')} className="px-3.5 py-1.5 rounded-xs border border-border bg-card text-muted-foreground text-[13px] font-semibold shadow-xs hover:border-accent/30 hover:text-accent transition-all">
                View all →
              </button>
            </div>

            {mine.length === 0 ? (
              <div className="text-center py-16">
                <span className="text-[52px] block mb-3.5">🛣️</span>
                <div className="text-[17px] font-bold text-muted-foreground mb-2">No reports yet</div>
                <div className="text-[13px] text-muted-foreground mb-5">Help improve your city by submitting the first report</div>
                <button onClick={openModal} className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)', boxShadow: '0 4px 16px rgba(107,63,160,0.30)' }}>
                  Submit Report
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[1400px]:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
                {mine.slice(0, 6).map((r, i) => (
                  <ReportCard key={r.id} report={r} delay={i} />
                ))}
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

export default Dashboard;

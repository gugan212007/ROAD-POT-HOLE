import { useApp } from '@/context/AppContext';
import StatCard from '@/components/StatCard';
import ReportCard from '@/components/ReportCard';
import FilterStrip from '@/components/FilterStrip';

const AdminDashboard = () => {
  const { reports, filter } = useApp();
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
      <div className="flex items-center justify-between px-8 pt-5 pb-0 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:pt-3.5 max-[768px]:pl-[62px] max-[480px]:pl-[58px] max-[480px]:px-3">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">🔐 Admin Dashboard <span className="text-muted-foreground/50">·</span> All citizen reports</div>
      </div>

      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">Admin Dashboard</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-[768px]:text-[12.5px]">
          Manage all road damage reports. Update statuses, assign teams, track resolution.
        </p>
      </div>

      <div className="flex px-8 border-b border-border max-[768px]:px-4 max-[768px]:overflow-x-auto max-[480px]:px-3" style={{ scrollbarWidth: 'none' }}>
        {['📋 All Reports', '🗺 Map View', '📊 Analytics'].map((t, i) => (
          <button key={t} className={`py-3 px-4.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all max-[768px]:text-[13px] ${
            i === 0 ? 'text-accent font-semibold border-accent' : 'text-muted-foreground border-transparent'
          }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
        <div className="grid grid-cols-3 gap-4 mb-7 max-[768px]:gap-2.5 max-[480px]:grid-cols-1 max-[480px]:gap-2.5">
          <StatCard label="Total Reports" value={reports.length} hint="All submissions" icon="📂" variant="progress" delay={0} />
          <StatCard label="Action Required" value={pending} hint="Needs assignment" icon="⚠️" variant="high" delay={1} />
          <StatCard label="Resolution Rate" value={`${rate}%`} hint={`${resolved} roads fixed`} icon="📈" variant="resolved" delay={2} />
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
      </div>
    </>
  );
};

export default AdminDashboard;

import { useApp } from '@/context/AppContext';
import { statusLabel } from '@/lib/demo-data';
import ReportCard from '@/components/ReportCard';
import FilterStrip from '@/components/FilterStrip';

const MyReports = () => {
  const { user, reports, filter, openModal } = useApp();
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
        <button onClick={openModal} className="px-4 py-2 rounded-[10px] text-[13px] font-semibold text-white border border-white/10 transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)', boxShadow: '0 4px 16px rgba(107,63,160,0.30)' }}>
          + New Report
        </button>
      </div>

      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">My Reports</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-[768px]:text-[12.5px]">
          {mine.filter(r => r.status === 'resolved').length} of {mine.length} reports resolved · Keep reporting to keep your city safe.
        </p>
      </div>

      <div className="flex px-8 border-b border-border max-[768px]:px-4 max-[768px]:overflow-x-auto max-[480px]:px-3" style={{ scrollbarWidth: 'none' }}>
        {['📋 All Reports', '🗺 Map', '📅 Timeline'].map((t, i) => (
          <button key={t} className={`py-3 px-4.5 text-sm font-medium border-b-2 whitespace-nowrap transition-all max-[768px]:text-[13px] ${
            i === 0 ? 'text-accent font-semibold border-accent' : 'text-muted-foreground border-transparent'
          }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
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
      </div>
    </>
  );
};

export default MyReports;

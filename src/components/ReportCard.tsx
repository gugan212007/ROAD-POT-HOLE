import { Report, statusLabel, statusClass, timeAgo } from '@/lib/demo-data';
import { useApp } from '@/context/AppContext';

const thumbBgs = [
  'linear-gradient(135deg,#ede9f9,#f9e8f0)',
  'linear-gradient(135deg,#fef3e2,#fde8f0)',
  'linear-gradient(135deg,#e8f5e9,#e3f2fd)',
  'linear-gradient(135deg,#f3e8ff,#fce7f3)',
  'linear-gradient(135deg,#fff3e0,#ede7f6)',
];
const emojis = ['🕳️', '🚧', '⚠️', '🛣️', '🔴'];

const badgeColors: Record<string, string> = {
  pending: 'bg-status-pending-bg text-status-pending-fg border-status-pending-bd',
  progress: 'bg-status-progress-bg text-status-progress-fg border-status-progress-bd',
  resolved: 'bg-status-resolved-bg text-status-resolved-fg border-status-resolved-bd',
};

interface Props {
  report: Report;
  isAdmin?: boolean;
  delay?: number;
}

const ReportCard = ({ report: r, isAdmin, delay = 0 }: Props) => {
  const { updateStatus } = useApp();
  const idx = parseInt(r.id) % 5;
  const sc = statusClass(r.status);

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden shadow-card-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-card-lg hover:border-accent/20 cursor-pointer animate-fade-up"
      style={{ animationDelay: `${delay * 0.06}s` }}
    >
      {r.image_url ? (
        <img src={r.image_url} className="w-full h-[168px] object-cover block" alt="Report" />
      ) : (
        <div
          className="w-full h-[140px] sm:h-[168px] flex items-center justify-center text-[44px] relative overflow-hidden"
          style={{ background: thumbBgs[idx] }}
        >
          {emojis[idx]}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(255,255,255,0.5) 0%, transparent 60%)' }} />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-pill text-[11px] font-bold tracking-[0.04em] uppercase border ${badgeColors[sc] || ''}`}>
            {statusLabel(r.status)}
          </span>
          {isAdmin && (
            <select
              value={r.status}
              onChange={e => updateStatus(r.id, e.target.value)}
              className="px-2.5 py-1 rounded-xs border border-border bg-secondary/50 text-muted-foreground text-xs cursor-pointer outline-none transition-all hover:border-accent/30 focus:border-accent focus:ring-2 focus:ring-accent/10"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          )}
        </div>
        <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed line-clamp-2">{r.description}</p>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-3 font-mono-code">
          <span className="text-accent">⊙</span>
          <span>{r.location_name || `${r.latitude?.toFixed(4)}, ${r.longitude?.toFixed(4)}`}</span>
          <span className="ml-auto">{timeAgo(r.created_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;

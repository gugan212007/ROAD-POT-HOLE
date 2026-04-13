interface Props {
  label: string;
  value: number | string;
  hint: string;
  icon: string;
  variant: 'high' | 'progress' | 'resolved';
  delay?: number;
  onClick?: () => void;
}

const gradients: Record<string, string> = {
  high: 'linear-gradient(90deg, #e64a52, #f59e0b)',
  progress: 'linear-gradient(90deg, #c2537a, #e07b5a)',
  resolved: 'linear-gradient(90deg, #16a34a, #22d3ee)',
};

const iconBg: Record<string, string> = {
  high: 'bg-status-pending-bg',
  progress: 'bg-status-progress-bg',
  resolved: 'bg-status-resolved-bg',
};

const StatCard = ({ label, value, hint, icon, variant, delay = 0, onClick }: Props) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
    className={`relative bg-card border border-border rounded-lg p-5 shadow-card-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg overflow-hidden animate-fade-up
      max-[480px]:p-3.5
      ${onClick ? 'cursor-pointer active:scale-[0.97] select-none' : ''}`}
    style={{ animationDelay: `${delay * 0.05}s` }}
  >
    {/* Top accent strip */}
    <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg" style={{ background: gradients[variant] }} />
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground max-[480px]:text-[10px]">{label}</div>
        <div className="text-[38px] font-extrabold tracking-tight my-1 max-[480px]:text-2xl max-[480px]:my-0.5 md:max-lg:text-[32px]">{value}</div>
        <div className="text-xs text-muted-foreground max-[480px]:text-[11px]">{hint}</div>
      </div>
      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] shrink-0 ${iconBg[variant]}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default StatCard;

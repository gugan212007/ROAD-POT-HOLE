interface Props {
  label: string;
  value: number | string;
  hint: string;
  icon: string;
  variant: 'high' | 'progress' | 'resolved';
  delay?: number;
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

const StatCard = ({ label, value, hint, icon, variant, delay = 0 }: Props) => (
  <div
    className="relative bg-card border border-border rounded-lg p-5 shadow-card-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-lg overflow-hidden animate-fade-up
      max-[480px]:flex max-[480px]:items-center max-[480px]:gap-3.5 max-[480px]:p-3.5"
    style={{ animationDelay: `${delay * 0.05}s` }}
  >
    {/* Top accent strip - hidden on small phones */}
    <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-lg max-[480px]:hidden" style={{ background: gradients[variant] }} />
    <div className={`absolute top-[18px] right-[18px] w-9 h-9 rounded-[9px] flex items-center justify-center text-[17px] ${iconBg[variant]}
      max-[480px]:static max-[480px]:shrink-0`}>
      {icon}
    </div>
    <div>
      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground max-[480px]:text-[10px]">{label}</div>
      <div className="text-[38px] font-extrabold tracking-tight my-1 max-[480px]:text-2xl max-[480px]:my-0.5 md:max-lg:text-[32px]">{value}</div>
      <div className="text-xs text-muted-foreground max-[480px]:hidden">{hint}</div>
    </div>
  </div>
);

export default StatCard;

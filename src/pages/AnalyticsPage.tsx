import { useApp } from '@/context/AppContext';
import { PROJECTS } from '@/lib/demo-data';

const AnalyticsPage = () => {
  const { reports } = useApp();
  const pending = reports.filter(r => r.status === 'pending').length;
  const inProgress = reports.filter(r => r.status === 'in_progress').length;
  const resolved = reports.filter(r => r.status === 'resolved').length;
  const total = reports.length;
  const rate = total ? Math.round((resolved / total) * 100) : 0;

  const barMax = Math.max(pending, inProgress, resolved, 1);

  return (
    <>


      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">Analytics</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-[768px]:text-[12.5px]">
          Overview of all road damage reports and resolution performance.
        </p>
      </div>

      <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reports', value: total, color: '#7c4dba' },
            { label: 'Pending', value: pending, color: '#e64a52' },
            { label: 'In Progress', value: inProgress, color: '#ea580c' },
            { label: 'Resolved', value: resolved, color: '#16a34a' },
          ].map(s => (
            <div key={s.label} className="bg-card border border-border rounded-lg p-5 shadow-card-sm animate-fade-up">
              <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground">{s.label}</div>
              <div className="text-3xl font-extrabold tracking-tight mt-1" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Bar chart */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card-sm mb-8">
          <h2 className="text-base font-bold mb-5">Status Distribution</h2>
          <div className="space-y-4">
            {[
              { label: 'Pending', value: pending, color: '#e64a52' },
              { label: 'In Progress', value: inProgress, color: '#ea580c' },
              { label: 'Resolved', value: resolved, color: '#16a34a' },
            ].map(b => (
              <div key={b.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{b.label}</span>
                  <span className="text-muted-foreground font-mono-code text-xs">{b.value} reports</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${(b.value / barMax) * 100}%`, background: b.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolution rate */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card-sm mb-8">
          <h2 className="text-base font-bold mb-4">Resolution Rate</h2>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#16a34a" strokeWidth="3"
                  strokeDasharray={`${rate} ${100 - rate}`} strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-lg font-extrabold">{rate}%</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold">{resolved} / {total}</div>
              <div className="text-sm text-muted-foreground">reports resolved</div>
            </div>
          </div>
        </div>

        {/* Projects breakdown */}
        <div className="bg-card border border-border rounded-lg p-6 shadow-card-sm">
          <h2 className="text-base font-bold mb-4">Projects Overview</h2>
          <div className="space-y-3">
            {PROJECTS.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ background: ['#7c4dba', '#c2537a', '#e07b5a', '#16a34a'][i] }} />
                <span className="flex-1 text-sm font-medium">{p.name}</span>
                <span className="text-sm font-mono-code text-muted-foreground">{p.count} reports</span>
                <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{
                    width: `${(p.count / 15) * 100}%`,
                    background: ['#7c4dba', '#c2537a', '#e07b5a', '#16a34a'][i],
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AnalyticsPage;

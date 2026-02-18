import { useApp } from '@/context/AppContext';
import { initials, PROJECTS, PROJECT_COLORS } from '@/lib/demo-data';

const AppSidebar = () => {
  const { user, page, mobileMenu, selectedProject, navigate, signOut, selectProject } = useApp();
  if (!user) return null;

  const items = user.is_admin
    ? [{ ico: '◈', lbl: 'All Reports', pg: 'admin' }, { ico: '◎', lbl: 'Analytics', pg: 'analytics' }]
    : [{ ico: '⬡', lbl: 'Dashboard', pg: 'dashboard' }, { ico: '◉', lbl: 'My Reports', pg: 'myreports' }];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen w-[260px] md:w-[260px] flex flex-col py-7 px-4 gap-0.5 z-[200] md:z-[100] transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-x-0 ${
        mobileMenu ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{
        background: 'linear-gradient(160deg, #6b3fa0 0%, #b24f7a 45%, #d97a58 100%)',
        boxShadow: '4px 0 32px hsl(271 45% 44% / 0.30)',
      }}
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{
        background: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }} />
      {/* Light bloom */}
      <div className="absolute -top-20 -right-[60px] w-[220px] h-[220px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%)' }} />

      {/* Brand */}
      <div className="flex items-center gap-3 px-3 pb-5 mb-1 border-b border-white/[0.14] relative z-10">
        <div className="w-9 h-9 bg-white/[0.22] rounded-[10px] flex items-center justify-center text-lg border border-white/30 backdrop-blur-sm shrink-0">
          🛣️
        </div>
        <div>
          <div className="text-lg font-extrabold text-white tracking-tight">CivicFix</div>
          <div className="text-[10px] text-white/55">Smart Road Reporting</div>
        </div>
      </div>

      {/* Menu */}
      <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/35 px-3 pt-3.5 pb-1 relative z-10">Menu</div>
      {items.map(n => (
        <button
          key={n.pg}
          onClick={() => navigate(n.pg)}
          className={`flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] border border-transparent w-full text-left text-sm font-medium transition-all duration-200 relative z-10 ${
            page === n.pg && !selectedProject
              ? 'bg-white/[0.18] text-white font-semibold border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.15)]'
              : 'text-white/55 hover:bg-white/10 hover:text-white/90 hover:translate-x-0.5'
          }`}
        >
          <span className="w-5 text-center text-sm shrink-0">{n.ico}</span>
          {n.lbl}
        </button>
      ))}

      {/* Projects */}
      <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/35 px-3 pt-5 pb-1 relative z-10">Projects</div>
      {PROJECTS.map((p, i) => (
        <button
          key={p.name}
          onClick={() => selectProject(selectedProject === p.name ? null : p.name)}
          className={`flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] w-full text-left text-sm font-medium transition-all duration-200 relative z-10 ${
            selectedProject === p.name
              ? 'bg-white/[0.18] text-white font-semibold border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.15)]'
              : 'text-white/55 hover:bg-white/10 hover:text-white/90 border border-transparent opacity-90'
          }`}
        >
          <span className="w-5 text-center shrink-0">
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: PROJECT_COLORS[i % PROJECT_COLORS.length] }} />
          </span>
          {p.name}
          <span className="ml-auto text-[11px] font-semibold bg-white/[0.18] text-white/85 px-2 py-px rounded-pill border border-white/15">
            {p.count}
          </span>
        </button>
      ))}

      <div className="flex-1" />

      {user.is_admin && (
        <div className="inline-flex items-center gap-1.5 py-1 px-2.5 rounded-pill bg-white/[0.18] text-white/90 text-[10px] font-bold tracking-[0.08em] uppercase border border-white/[0.22] mb-2.5 w-fit relative z-10">
          🔐 Administrator
        </div>
      )}

      {/* Footer */}
      <div className="pt-4 border-t border-white/[0.14] relative z-10">
        <button
          onClick={signOut}
          className="flex items-center gap-2.5 py-2.5 px-3 rounded-[10px] w-full hover:bg-white/10 transition-colors"
        >
          <div className="w-[34px] h-[34px] rounded-full bg-white/25 flex items-center justify-center text-sm font-bold text-white border-2 border-white/35 shrink-0">
            {initials(user.email)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-white/90 truncate">{user.email}</div>
            <div className="text-[11px] text-white/55">{user.is_admin ? 'Admin' : 'Citizen'} · Sign out</div>
          </div>
          <span className="text-white/55 text-sm">↓</span>
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;

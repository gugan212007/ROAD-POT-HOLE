import { useState } from 'react';
import { useApp } from '@/context/AppContext';

const AuthPage = () => {
  const { login, demoLogin } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  const handleSubmit = () => login(email, pw, mode === 'signup');

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 max-[480px]:p-3"
      style={{ background: 'linear-gradient(160deg, #6b3fa0 0%, #b24f7a 50%, #d97a58 100%)' }}
    >
      <div className="w-full max-w-[420px] bg-card rounded-[20px] p-10 max-[768px]:p-8 max-[480px]:p-7 max-[480px]:rounded-2xl animate-fade-up"
        style={{ boxShadow: '0 24px 80px rgba(107,63,160,0.35), 0 4px 16px rgba(0,0,0,0.10)' }}
      >
        {/* Logo */}
        <div className="w-12 h-12 rounded-[13px] mx-auto mb-6 flex items-center justify-center text-[22px]"
          style={{ background: 'linear-gradient(135deg, #7c4dba, #c2537a)', boxShadow: '0 6px 24px rgba(124,77,186,0.35)' }}>
          🛣️
        </div>
        <div className="text-center mb-7">
          <h1 className="text-[22px] font-extrabold tracking-tight">CivicFix</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Smart Road Damage Reporting</p>
        </div>

        <h2 className="text-[19px] font-bold mb-1">{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h2>
        <p className="text-[13px] text-muted-foreground mb-5">{mode === 'signup' ? 'Join thousands helping fix city roads.' : 'Sign in to track road repair progress.'}</p>

        {/* Demo box */}
        <div className="rounded-[10px] p-3 mb-4.5 border border-accent/[0.18]" style={{ background: 'linear-gradient(135deg, rgba(124,77,186,0.06), rgba(194,83,122,0.04))' }}>
          <div className="text-xs font-bold text-accent mb-0.5">Demo Mode Active</div>
          <div className="text-xs text-muted-foreground">Any email/password works. Use quick-login below.</div>
        </div>

        {/* Form */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-[0.05em] uppercase">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-secondary/50 text-sm outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/10 placeholder:text-muted-foreground/40"
          />
        </div>
        <div className="mb-5">
          <label className="block text-xs font-semibold text-muted-foreground mb-1.5 tracking-[0.05em] uppercase">Password</label>
          <input
            type="password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            className="w-full px-3.5 py-2.5 rounded-[10px] border-[1.5px] border-border bg-secondary/50 text-sm outline-none transition-all focus:border-accent focus:bg-card focus:ring-2 focus:ring-accent/10 placeholder:text-muted-foreground/40"
          />
        </div>

        {/* Demo buttons */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button onClick={() => demoLogin(false)} className="flex-1 min-w-[140px] px-3.5 py-2 rounded-[10px] border border-border bg-card text-muted-foreground text-[13px] font-semibold shadow-xs hover:border-accent/30 hover:text-accent hover:bg-secondary/50 transition-all">
            👤 Citizen Demo
          </button>
          <button onClick={() => demoLogin(true)} className="flex-1 min-w-[140px] px-3.5 py-2 rounded-[10px] border border-border bg-card text-muted-foreground text-[13px] font-semibold shadow-xs hover:border-accent/30 hover:text-accent hover:bg-secondary/50 transition-all">
            🔐 Admin Demo
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 px-6 rounded-lg text-[15px] font-semibold text-white border border-white/10 transition-all hover:-translate-y-px"
          style={{ background: 'linear-gradient(135deg, #7c4dba, #6b3fa0)', boxShadow: '0 4px 16px rgba(107,63,160,0.30)' }}
        >
          {mode === 'signup' ? 'Create Account' : 'Sign In'}
        </button>

        <div className="h-px bg-border my-4" />
        <div className="text-center text-[13px] text-muted-foreground">
          {mode === 'signup' ? 'Already have an account?' : 'New to CivicFix?'}
          <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')} className="bg-transparent border-none text-accent cursor-pointer font-semibold text-[13px] ml-1">
            {mode === 'signup' ? 'Sign in →' : 'Create account →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

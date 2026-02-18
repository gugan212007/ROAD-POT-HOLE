import React, { createContext, useContext, useState, useCallback } from 'react';
import { Report, UserProfile, DEMO_REPORTS, DEMO_CITIZEN, DEMO_ADMIN } from '@/lib/demo-data';
import { toast } from 'sonner';

interface AppState {
  user: UserProfile | null;
  reports: Report[];
  page: string;
  filter: string;
  modal: boolean;
  mobileMenu: boolean;
  gps: { lat: number; lng: number } | null;
}

interface AppContextType extends AppState {
  login: (email: string, password: string, isSignup: boolean) => void;
  demoLogin: (isAdmin: boolean) => void;
  signOut: () => void;
  navigate: (page: string) => void;
  setFilter: (filter: string) => void;
  openModal: () => void;
  closeModal: () => void;
  toggleMenu: () => void;
  submitReport: (description: string, gps: { lat: number; lng: number } | null, photo: File | null) => Promise<void>;
  updateStatus: (id: string, status: string) => void;
  captureGps: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    user: null,
    reports: [],
    page: 'dashboard',
    filter: 'all',
    modal: false,
    mobileMenu: false,
    gps: null,
  });

  const set = useCallback((patch: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...patch }));
  }, []);

  const demoLogin = useCallback((isAdmin: boolean) => {
    const user = isAdmin ? DEMO_ADMIN : DEMO_CITIZEN;
    set({
      user,
      reports: DEMO_REPORTS,
      page: isAdmin ? 'admin' : 'dashboard',
      filter: 'all',
    });
    toast.success(`Signed in as ${isAdmin ? 'Administrator' : 'Citizen'} (Demo)`);
  }, [set]);

  const login = useCallback((email: string, _password: string, _isSignup: boolean) => {
    if (!email) { toast.error('Please fill in all fields'); return; }
    demoLogin(email.includes('admin'));
  }, [demoLogin]);

  const signOut = useCallback(() => {
    set({ user: null, reports: [], page: 'dashboard', mobileMenu: false });
    toast.info('Signed out successfully');
  }, [set]);

  const navigate = useCallback((page: string) => {
    set({ page, filter: 'all', mobileMenu: false });
  }, [set]);

  const submitReport = useCallback(async (description: string, gps: { lat: number; lng: number } | null, _photo: File | null) => {
    if (!description.trim()) { toast.error('Please add a description'); return; }
    await new Promise(r => setTimeout(r, 850));
    const nr: Report = {
      id: Date.now().toString(),
      user_id: state.user!.id,
      image_url: null,
      latitude: gps?.lat || 28.6139,
      longitude: gps?.lng || 77.2090,
      description,
      status: 'pending',
      created_at: new Date().toISOString(),
      location_name: gps ? `${gps.lat.toFixed(4)}, ${gps.lng.toFixed(4)}` : 'Location pending',
    };
    set({ reports: [nr, ...state.reports], modal: false });
    toast.success('Report submitted successfully!');
  }, [state.user, state.reports, set]);

  const updateStatus = useCallback((id: string, status: string) => {
    setState(prev => ({
      ...prev,
      reports: prev.reports.map(r => r.id === id ? { ...r, status: status as Report['status'] } : r),
    }));
    toast.success(`Status updated → ${status === 'pending' ? 'Pending' : status === 'in_progress' ? 'In Progress' : 'Resolved'}`);
  }, []);

  const captureGps = useCallback(() => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return; }
    navigator.geolocation.getCurrentPosition(
      p => set({ gps: { lat: p.coords.latitude, lng: p.coords.longitude } }),
      e => toast.error('Location error: ' + e.message),
    );
  }, [set]);

  return (
    <AppContext.Provider value={{
      ...state,
      login, demoLogin, signOut, navigate,
      setFilter: (f) => set({ filter: f }),
      openModal: () => set({ modal: true, gps: null }),
      closeModal: () => set({ modal: false }),
      toggleMenu: () => set({ mobileMenu: !state.mobileMenu }),
      submitReport, updateStatus, captureGps,
    }}>
      {children}
    </AppContext.Provider>
  );
};

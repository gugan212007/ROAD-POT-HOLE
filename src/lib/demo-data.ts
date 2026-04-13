export interface Report {
  id: string;
  user_id: string;
  image_url: string | null;
  latitude: number;
  longitude: number;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  created_at: string;
  location_name: string;
}

export interface UserProfile {
  id: string;
  email: string;
  is_admin: boolean;
}

export const DEMO_REPORTS: Report[] = [
  { id: '1', user_id: 'u1', image_url: '/pothole_signal.png', latitude: 28.6139, longitude: 77.2090, description: 'Large pothole near Signal 4, causing vehicle damage. Approximately 2ft wide and 6 inches deep. Urgent repair needed.', status: 'pending', created_at: new Date(Date.now() - 172800000).toISOString(), location_name: 'MG Road, Delhi' },
  { id: '2', user_id: 'u1', image_url: '/cracked_asphalt.png', latitude: 28.7041, longitude: 77.1025, description: 'Cracked asphalt causing severe road vibration. 30-metre stretch needs resurfacing before monsoon season.', status: 'in_progress', created_at: new Date(Date.now() - 432000000).toISOString(), location_name: 'NH-48, Gurgaon' },
  { id: '3', user_id: 'u2', image_url: '/water_filled_potholes.png', latitude: 28.5355, longitude: 77.3910, description: 'Multiple potholes clustered — water pools during rain, extremely dangerous for two-wheelers at night.', status: 'resolved', created_at: new Date(Date.now() - 864000000).toISOString(), location_name: 'Noida Sector 18' },
  { id: '4', user_id: 'u1', image_url: '/road_edge_collapsed.png', latitude: 28.6517, longitude: 77.2219, description: 'Road edge collapsed by 40cm. Heavy trucks using this route daily are worsening the damage rapidly.', status: 'pending', created_at: new Date(Date.now() - 3600000).toISOString(), location_name: 'Ring Road, Delhi' },
  { id: '5', user_id: 'u3', image_url: '/faded_speedbreaker.png', latitude: 28.6289, longitude: 77.2065, description: 'Speed breaker marking faded, pothole formed directly after it. Near-zero visibility at night — hazard.', status: 'in_progress', created_at: new Date(Date.now() - 259200000).toISOString(), location_name: 'Connaught Place, Delhi' },
];

export const DEMO_CITIZEN: UserProfile = { id: 'u1', email: 'citizen@demo.com', is_admin: false };
export const DEMO_ADMIN: UserProfile = { id: 'adm1', email: 'admin@civicfix.gov', is_admin: true };

export const PROJECT_COLORS = ['#7c4dba', '#c2537a', '#e07b5a', '#16a34a', '#0ea5e9'];
export const PROJECTS = [
  { name: 'MG Road Zone', count: 12 },
  { name: 'Ring Road', count: 8 },
  { name: 'NH-48', count: 15 },
  { name: 'Noida Sector', count: 6 },
];

export const timeAgo = (iso: string) => {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const statusLabel = (s: string) => ({ pending: 'Pending', in_progress: 'In Progress', resolved: 'Resolved' }[s] || s);
export const statusClass = (s: string) => ({ pending: 'pending', in_progress: 'progress', resolved: 'resolved' }[s] || '');
export const initials = (e: string) => e ? e.slice(0, 2).toUpperCase() : '??';

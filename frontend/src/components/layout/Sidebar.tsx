import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Activity, MessageSquare, ShieldAlert, FileText, Settings, User, Eye, Calculator } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Vision AI', path: '/vision', icon: Eye },
  { name: 'Mission Planner', path: '/planner', icon: Map },
  { name: 'Telemetry', path: '/telemetry', icon: Activity },
  { name: 'AI Chat', path: '/ai-chat', icon: MessageSquare },
  { name: 'Engineering', path: '/engineering', icon: Calculator },
  { name: 'Alerts', path: '/alerts', icon: ShieldAlert },
  { name: 'Reports', path: '/reports', icon: FileText },
];

const bottomItems = [
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen glass-panel fixed left-0 top-0 flex flex-col border-r border-white/5 z-20">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-falcon-blue to-falcon-accent bg-clip-text text-transparent tracking-wider">
          FALCONZ
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-falcon-blue/20 text-falcon-accent border border-falcon-blue/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(0,191,255,0.8)]' : ''} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mb-4 space-y-2 border-t border-white/5">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

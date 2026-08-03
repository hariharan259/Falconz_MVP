import { Bell, Search, Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

export function Topbar() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <header className="h-20 glass-panel border-b border-white/5 flex items-center justify-between px-8 sticky top-0 z-10 w-full backdrop-blur-xl">
      {/* Global Search */}
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search drones, missions, alerts..." 
          className="w-full bg-black/20 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-falcon-blue focus:ring-1 focus:ring-falcon-blue transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        <button 
          onClick={toggleTheme}
          className="p-2 text-gray-400 hover:text-falcon-accent transition-colors rounded-full hover:bg-white/5"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-falcon-blue to-purple-600 flex items-center justify-center border border-white/20 shadow-lg cursor-pointer">
            <span className="text-white font-bold text-sm">OP</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-white">Operator 1</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

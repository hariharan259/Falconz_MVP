import { Activity, ShieldAlert, Plane } from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <p className="text-gray-400">Overview of active fleet and operations.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Active Drones</p>
            <h3 className="text-3xl font-bold text-white">4 / 12</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-falcon-blue/20 flex items-center justify-center border border-falcon-blue/30">
            <Plane className="text-falcon-accent" size={24} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Active Missions</p>
            <h3 className="text-3xl font-bold text-white">2</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30">
            <Activity className="text-purple-400" size={24} />
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">Critical Alerts</p>
            <h3 className="text-3xl font-bold text-red-500">1</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
            <ShieldAlert className="text-red-500" size={24} />
          </div>
        </div>
      </div>

      {/* Placeholder for future map/telemetry */}
      <div className="glass-panel h-96 rounded-xl flex items-center justify-center border-dashed border-2 border-white/20">
        <p className="text-gray-500 font-medium tracking-widest uppercase">Fleet Telemetry Map (Pending Integration)</p>
      </div>
    </div>
  );
}

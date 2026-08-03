import { useTelemetry } from '../hooks/useTelemetry';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Battery, Crosshair, Navigation, Activity, Wifi, WifiOff } from 'lucide-react';

export function Telemetry() {
  const { data, history, isConnected } = useTelemetry('ws://localhost:8000/api/v1/telemetry/ws');

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center flex-col gap-4">
        {isConnected ? (
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-falcon-blue"></div>
        ) : (
          <WifiOff size={48} className="text-red-500 animate-pulse" />
        )}
        <p className="text-gray-400 font-medium">
          {isConnected ? "Awaiting MAVLink stream..." : "Connecting to Ground Control backend..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Telemetry</h1>
          <p className="text-gray-400">Real-time MAVLink stream analysis</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold border ${isConnected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'} flex items-center gap-2`}>
          {isConnected ? <Wifi size={18} /> : <WifiOff size={18} />}
          {isConnected ? 'LINK ACTIVE' : 'LINK OFFLINE'}
        </div>
      </header>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-falcon-blue">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Flight Mode</h3>
            <Navigation className="text-falcon-blue" size={20} />
          </div>
          <p className="text-2xl font-bold text-white tracking-widest">{data.flight_mode}</p>
        </div>

        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-purple-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Altitude (Rel)</h3>
            <Crosshair className="text-purple-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{data.alt_relative.toFixed(1)} <span className="text-sm text-gray-400">m</span></p>
        </div>

        <div className={`glass-panel p-6 rounded-xl border-t-2 ${data.battery_percent > 20 ? 'border-t-green-500' : 'border-t-red-500'}`}>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">Battery</h3>
            <Battery className={data.battery_percent > 20 ? 'text-green-500' : 'text-red-500'} size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{data.battery_percent.toFixed(0)}%</p>
          {/* Progress bar */}
          <div className="w-full bg-black/50 h-2 rounded-full mt-3 overflow-hidden">
            <div className={`h-full ${data.battery_percent > 20 ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`} style={{ width: `${data.battery_percent}%` }}></div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-yellow-500">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-gray-400 font-medium">GPS Sats</h3>
            <Activity className="text-yellow-500" size={20} />
          </div>
          <p className="text-2xl font-bold text-white">{data.gps_satellites}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">Altitude History</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={['auto', 'auto']} stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line type="monotone" dataKey="alt_relative" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <h3 className="text-lg font-bold text-white mb-4">IMU Vibration (Z-Axis)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="timestamp" hide />
                <YAxis domain={[-15, -5]} stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid rgba(255,255,255,0.1)' }}
                  labelStyle={{ display: 'none' }}
                />
                <Line type="monotone" dataKey="imu_accel_z" stroke="#007BFF" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Attitude Indicator (Raw Values) */}
      <div className="glass-panel p-6 rounded-xl">
        <h3 className="text-lg font-bold text-white mb-4">Attitude (Raw)</h3>
        <div className="flex justify-around text-center">
          <div>
            <p className="text-gray-400 text-sm">Roll</p>
            <p className="text-xl font-mono text-white">{data.roll.toFixed(2)}°</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Pitch</p>
            <p className="text-xl font-mono text-white">{data.pitch.toFixed(2)}°</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Yaw</p>
            <p className="text-xl font-mono text-white">{data.yaw.toFixed(2)}°</p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Plane, Shield, Activity, Zap } from 'lucide-react';

export function Landing() {
  return (
    <div className="min-h-screen bg-falcon-dark text-white overflow-hidden relative flex flex-col">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-falcon-blue/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-falcon-accent/20 rounded-full blur-[120px]"></div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-12 py-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-falcon-blue to-white bg-clip-text text-transparent tracking-widest">
          FALCONZ
        </h1>
        <Link to="/login" className="btn-primary">
          Operator Login
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Next-Gen <span className="text-falcon-blue drop-shadow-[0_0_20px_rgba(0,123,255,0.6)]">Autonomous</span> Flight
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mb-12">
          The unified platform for managing drone fleets, real-time AI telemetry, and autonomous missions in complex environments.
        </p>
        
        <div className="flex gap-6">
          <Link to="/login" className="btn-primary px-8 py-3 text-lg font-bold">
            Launch Station
          </Link>
          <a href="#features" className="glass-panel px-8 py-3 rounded-md font-bold text-white hover:bg-white/10 transition-colors">
            Learn More
          </a>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-24 max-w-6xl w-full">
          {[
            { icon: Plane, title: 'Swarm Control', desc: 'Manage hundreds of drones seamlessly.' },
            { icon: Activity, title: 'Real-time Vitals', desc: 'Sub-second telemetry processing.' },
            { icon: Zap, title: 'Edge AI', desc: 'On-board vision and reactive navigation.' },
            { icon: Shield, title: 'Fail-safes', desc: 'Automated geofencing and RTL protocols.' },
          ].map((feat, i) => (
            <div key={i} className="glass-panel p-6 rounded-xl hover:-translate-y-2 transition-transform duration-300">
              <feat.icon className="text-falcon-blue mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">{feat.title}</h3>
              <p className="text-gray-400 text-sm">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

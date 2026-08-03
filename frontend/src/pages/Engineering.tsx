import { useState } from 'react';
import { Calculator, Battery, PenTool as Tool, Scale, Zap } from 'lucide-react';

export function Engineering() {
  // Battery State
  const [capacity, setCapacity] = useState(5000);
  const [cells, setCells] = useState(4);
  const [ampDraw, setAmpDraw] = useState(25);

  // Payload State
  const [emptyWeight, setEmptyWeight] = useState(1500);
  const [maxThrust, setMaxThrust] = useState(4000);

  // Motor/Prop State
  const [kv, setKv] = useState(2300);
  const [propDiameter, setPropDiameter] = useState(5);
  const [propPitch, setPropPitch] = useState(4.5);

  // --- Calculations ---

  // Battery Math
  const nominalVoltage = cells * 3.7;
  const totalWh = (capacity / 1000) * nominalVoltage;
  const totalHoverTimeMins = ((capacity / 1000) / ampDraw) * 60;
  const safeFlightTimeMins = totalHoverTimeMins * 0.8; // 80% discharge rule

  // Payload Math
  // Target TWR is 2:1 for stable flight. So Max Payload = (Max Thrust / 2) - Empty Weight
  const maxSafeWeight = maxThrust / 2;
  const maxPayload = Math.max(0, maxSafeWeight - emptyWeight);
  const currentTwr = maxThrust / emptyWeight;

  // Motor Math (Highly simplified empirical formula for static thrust estimation)
  // RPM = KV * Voltage
  const rpm = kv * nominalVoltage;
  // Thrust (g) approx = (Diameter^3 * Pitch * RPM^2 * 10^-10)
  const estMotorThrust = Math.max(0, (Math.pow(propDiameter, 3) * propPitch * Math.pow(rpm, 2) * 1e-10) * 1.5); 

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="mb-4">
        <h1 className="text-3xl font-bold text-white mb-1">Engineering Lab</h1>
        <p className="text-gray-400">Interactive calculators for mission parameters and hardware limits.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Battery & Flight Time */}
        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-green-500 flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Battery className="text-green-500" /> Battery & Endurance
          </h2>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Capacity (mAh)</span>
                <span className="text-white font-mono">{capacity} mAh</span>
              </label>
              <input type="range" min="1000" max="22000" step="100" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full accent-green-500" />
            </div>
            
            <div>
              <label className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Cell Count (S)</span>
                <span className="text-white font-mono">{cells}S ({nominalVoltage.toFixed(1)}V)</span>
              </label>
              <input type="range" min="1" max="12" step="1" value={cells} onChange={(e) => setCells(Number(e.target.value))} className="w-full accent-green-500" />
            </div>

            <div>
              <label className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Avg Hover Draw (Amps)</span>
                <span className="text-white font-mono">{ampDraw} A</span>
              </label>
              <input type="range" min="5" max="150" step="1" value={ampDraw} onChange={(e) => setAmpDraw(Number(e.target.value))} className="w-full accent-green-500" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Safe Flight Time</p>
              <p className="text-3xl font-bold text-green-400">{safeFlightTimeMins.toFixed(1)} <span className="text-lg">min</span></p>
              <p className="text-xs text-gray-500">80% discharge rule</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Total Energy</p>
              <p className="text-3xl font-bold text-white">{totalWh.toFixed(1)} <span className="text-lg">Wh</span></p>
            </div>
          </div>
        </div>

        {/* Payload & Weight */}
        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-falcon-blue flex flex-col">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Scale className="text-falcon-blue" /> Payload Capacity
          </h2>
          
          <div className="space-y-4 flex-1">
            <div>
              <label className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Empty Frame Weight (grams)</span>
                <span className="text-white font-mono">{emptyWeight} g</span>
              </label>
              <input type="range" min="250" max="15000" step="50" value={emptyWeight} onChange={(e) => setEmptyWeight(Number(e.target.value))} className="w-full accent-falcon-blue" />
            </div>
            
            <div>
              <label className="flex justify-between text-sm text-gray-400 mb-1">
                <span>Total Rig Max Thrust (grams)</span>
                <span className="text-white font-mono">{maxThrust} g</span>
              </label>
              <input type="range" min="500" max="30000" step="100" value={maxThrust} onChange={(e) => setMaxThrust(Number(e.target.value))} className="w-full accent-falcon-blue" />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Max Safe Payload</p>
              <p className="text-3xl font-bold text-falcon-accent">{maxPayload.toFixed(0)} <span className="text-lg">g</span></p>
              <p className="text-xs text-gray-500">Maintaining 2:1 TWR</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">Current Rig TWR</p>
              <p className={`text-3xl font-bold ${currentTwr >= 2 ? 'text-green-500' : 'text-red-500'}`}>{currentTwr.toFixed(2)} : 1</p>
            </div>
          </div>
        </div>

        {/* Motor & Propeller */}
        <div className="glass-panel p-6 rounded-xl border-t-2 border-t-purple-500 xl:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Tool className="text-purple-500" /> Propulsion Estimator
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4 border-r border-white/10 pr-6">
              <h3 className="text-gray-400 font-medium mb-2 border-b border-white/5 pb-2">Motor Specs</h3>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>KV Rating</span>
                  <span className="text-white font-mono">{kv} KV</span>
                </label>
                <input type="range" min="300" max="5000" step="50" value={kv} onChange={(e) => setKv(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>

            <div className="space-y-4 border-r border-white/10 pr-6">
              <h3 className="text-gray-400 font-medium mb-2 border-b border-white/5 pb-2">Propeller</h3>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Diameter (inches)</span>
                  <span className="text-white font-mono">{propDiameter}"</span>
                </label>
                <input type="range" min="3" max="18" step="0.5" value={propDiameter} onChange={(e) => setPropDiameter(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
              <div>
                <label className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>Pitch (inches)</span>
                  <span className="text-white font-mono">{propPitch}"</span>
                </label>
                <input type="range" min="2" max="10" step="0.5" value={propPitch} onChange={(e) => setPropPitch(Number(e.target.value))} className="w-full accent-purple-500" />
              </div>
            </div>

            <div className="flex flex-col justify-center pl-4">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="text-yellow-500" size={24} />
                <p className="text-sm text-gray-400 uppercase tracking-wider">Est. Static Thrust / Motor</p>
              </div>
              <p className="text-5xl font-bold text-white">{estMotorThrust.toFixed(0)} <span className="text-xl text-gray-400">g</span></p>
              <p className="text-xs text-gray-500 mt-2 font-mono">Assumes nominal voltage of {nominalVoltage.toFixed(1)}V (from Battery panel). Theoretical empirical calculation.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

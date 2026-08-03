import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents } from 'react-leaflet';
import { LatLngTuple, Icon } from 'leaflet';
import { Save, Upload, Trash2, Home, MapPin, PlaneTakeoff, Navigation } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Custom icons for the map
const homeIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const wpIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface Waypoint {
  lat: number;
  lng: number;
  alt: number;
}

function MapEvents({ onAddWaypoint }: { onAddWaypoint: (wp: Waypoint) => void }) {
  useMapEvents({
    click(e) {
      onAddWaypoint({ lat: e.latlng.lat, lng: e.latlng.lng, alt: 50 }); // Default 50m alt
    },
  });
  return null;
}

export function MissionPlanner() {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [rtlAltitude, setRtlAltitude] = useState(60);
  const [isSaving, setIsSaving] = useState(false);

  // Default center (e.g., a test field)
  const defaultCenter: LatLngTuple = [37.7749, -122.4194];

  const handleAddWaypoint = useCallback((wp: Waypoint) => {
    setWaypoints((prev) => [...prev, wp]);
  }, []);

  const handleClear = () => {
    if (confirm('Clear all waypoints?')) {
      setWaypoints([]);
    }
  };

  const handleSave = async () => {
    if (waypoints.length < 2) {
      alert("Need at least a Home point and 1 Waypoint to save a mission.");
      return;
    }

    setIsSaving(true);
    try {
      // Structure matches MISSION_PLANNER_SPEC.md
      const payload = {
        drone_id: "00000000-0000-0000-0000-000000000000", // Default mock UUID
        waypoints: waypoints.map((wp, idx) => ({
          sequence_id: idx,
          command: idx === 0 ? "NAV_TAKEOFF" : "NAV_WAYPOINT",
          coordinates: { lat: wp.lat, lon: wp.lng, alt: wp.alt },
          acceptance_radius: 2.0,
          hold_time_sec: 0
        })),
        scheduled_start: new Date().toISOString()
      };

        // We hit the new backend route
      const res = await fetch('http://localhost:8000/api/v1/missions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${useAuthStore.getState().token}`
        },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Mission Saved Successfully!");
      } else {
        alert("Failed to save mission to database. Check backend logs.");
      }
    } catch (e) {
      alert("Network error connecting to Backend.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Mission Planner</h1>
          <p className="text-gray-400">Interactive autonomous flight plotting and boundary management.</p>
        </div>
      </header>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Interactive Map */}
        <div className="flex-[3] glass-panel rounded-xl overflow-hidden relative border-t-2 border-t-falcon-blue z-0">
          <MapContainer 
            center={defaultCenter} 
            zoom={15} 
            className="w-full h-full"
            style={{ background: '#121212' }} // Dark theme fallback before tiles load
          >
            {/* OpenStreetMap Dark/CartoDB Dark Matter equivalent */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <MapEvents onAddWaypoint={handleAddWaypoint} />

            {/* Render Waypoints */}
            {waypoints.map((wp, idx) => (
              <Marker 
                key={idx} 
                position={[wp.lat, wp.lng]} 
                icon={idx === 0 ? homeIcon : wpIcon}
              />
            ))}

            {/* Draw Path */}
            {waypoints.length > 1 && (
              <Polyline 
                positions={waypoints.map(wp => [wp.lat, wp.lng] as LatLngTuple)} 
                color="#00BFFF" 
                weight={3}
                dashArray="5, 10"
              />
            )}
          </MapContainer>

          {/* Map Overlay HUD */}
          <div className="absolute top-4 left-4 z-[1000] bg-black/60 backdrop-blur-md p-3 rounded-lg border border-white/10 text-white pointer-events-none">
            <h3 className="font-bold flex items-center gap-2 mb-2"><PlaneTakeoff size={16} className="text-falcon-blue"/> Flight Status</h3>
            <p className="text-sm text-gray-300">Waypoints: <span className="font-mono text-white">{waypoints.length}</span></p>
            <p className="text-sm text-gray-300">Est. Distance: <span className="font-mono text-white">{(waypoints.length * 125).toFixed(0)}m</span></p>
          </div>
        </div>

        {/* Side Panel: Mission Console */}
        <div className="flex-1 flex flex-col gap-6 min-h-0 z-10">
          
          <div className="glass-panel p-6 rounded-xl shrink-0">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Navigation size={18} className="text-falcon-accent"/> Global Settings</h3>
            <div>
              <label className="flex justify-between text-sm text-gray-400 mb-1">
                <span>RTL Altitude (m)</span>
                <span className="text-white font-mono">{rtlAltitude}m</span>
              </label>
              <input 
                type="range" min="20" max="120" step="5" 
                value={rtlAltitude} onChange={(e) => setRtlAltitude(Number(e.target.value))} 
                className="w-full accent-falcon-accent" 
              />
              <p className="text-xs text-gray-500 mt-2">Drones will ascend to this altitude before returning home to avoid trees/buildings.</p>
            </div>
          </div>

          <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 bg-black/40 border-b border-white/5 shrink-0 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 text-white"><MapPin size={18} className="text-falcon-blue" /> Waypoint Sequence</h3>
              <button onClick={handleClear} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Clear Mission">
                <Trash2 size={16} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {waypoints.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-10">Click on the map to add waypoints.</p>
              ) : (
                waypoints.map((wp, idx) => (
                  <div key={idx} className="flex flex-col p-3 rounded bg-black/30 border border-white/5 gap-2">
                     <div className="flex justify-between items-center">
                       <span className={`text-xs font-bold px-2 py-1 rounded ${idx === 0 ? 'bg-green-500/20 text-green-400' : 'bg-falcon-blue/20 text-falcon-blue'}`}>
                         {idx === 0 ? 'HOME (0)' : `WP (${idx})`}
                       </span>
                       <span className="text-sm font-mono text-gray-400">{wp.alt}m AGL</span>
                     </div>
                     <div className="flex justify-between text-xs text-gray-500 font-mono mt-1">
                       <span>Lat: {wp.lat.toFixed(5)}</span>
                       <span>Lng: {wp.lng.toFixed(5)}</span>
                     </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-black/40 shrink-0 grid grid-cols-2 gap-3">
              <button className="btn-primary bg-gray-700 hover:bg-gray-600 shadow-none flex items-center justify-center gap-2 text-sm" onClick={() => alert("Load from DB functionality coming soon!")}>
                <Upload size={16} /> Load
              </button>
              <button 
                className="btn-primary flex items-center justify-center gap-2 text-sm disabled:opacity-50" 
                onClick={handleSave}
                disabled={isSaving || waypoints.length === 0}
              >
                <Save size={16} /> {isSaving ? 'Saving...' : 'Save Mission'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

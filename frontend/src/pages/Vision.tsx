import { useState, useEffect, useRef } from 'react';
import { Camera, AlertTriangle, Eye, Server, RefreshCw } from 'lucide-react';

interface Detection {
  class: string;
  confidence: number;
  bounding_box: { x_min: number; y_min: number; x_max: number; y_max: number };
}

interface VisionPayload {
  timestamp: string;
  frame_id: number;
  detections: Detection[];
}

export function Vision() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({ totalFrames: 0, plasticCount: 0 });
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/api/v1/vision/ws/detections');

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);

    ws.current.onmessage = (event) => {
      const parsed: VisionPayload = JSON.parse(event.data);
      setDetections(parsed.detections);
      
      const plasticsInFrame = parsed.detections.filter(d => d.class.includes('Plastic')).length;
      
      setStats(prev => ({
        totalFrames: prev.totalFrames + 1,
        plasticCount: prev.plasticCount + plasticsInFrame
      }));
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-8rem)] flex flex-col">
      <header className="flex justify-between items-end shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vision Agent</h1>
          <p className="text-gray-400">Real-time YOLOv8 Inference & Camera Stream</p>
        </div>
        <div className={`px-4 py-2 rounded-full font-bold border ${isConnected ? 'bg-falcon-blue/10 text-falcon-accent border-falcon-blue/30' : 'bg-red-500/10 text-red-400 border-red-500/20'} flex items-center gap-2`}>
          {isConnected ? <Server size={18} /> : <RefreshCw size={18} className="animate-spin" />}
          {isConnected ? 'YOLO INFERENCE ACTIVE' : 'CONNECTING...'}
        </div>
      </header>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Main Video Player */}
        <div className="flex-[2] glass-panel rounded-xl border-t-2 border-t-falcon-blue overflow-hidden relative flex flex-col">
          <div className="p-4 bg-black/40 border-b border-white/5 flex justify-between items-center shrink-0">
            <h3 className="font-bold flex items-center gap-2"><Camera size={18} className="text-falcon-blue" /> Gimbal Camera (Down-facing)</h3>
            <span className="text-xs font-mono text-gray-400">720P / 30FPS / MJPEG</span>
          </div>
          
          <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden">
             {/* We use an img tag connected to the StreamingResponse for MJPEG playback */}
            <img 
              src="http://localhost:8000/api/v1/vision/video_feed" 
              alt="Live Drone Feed" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {!isConnected && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                 <p className="text-gray-500 animate-pulse font-mono tracking-widest">AWAITING VIDEO STREAM...</p>
              </div>
            )}
            
            {/* Draw Overlay Bounding Boxes (Scaled conceptually) */}
            {isConnected && detections.map((det, i) => (
               <div 
                 key={i} 
                 className={`absolute border-2 ${det.class.includes('Plastic') ? 'border-red-500 bg-red-500/10' : 'border-green-500 bg-green-500/10'}`}
                 style={{
                   left: `${(det.bounding_box.x_min / 1280) * 100}%`,
                   top: `${(det.bounding_box.y_min / 720) * 100}%`,
                   width: `${((det.bounding_box.x_max - det.bounding_box.x_min) / 1280) * 100}%`,
                   height: `${((det.bounding_box.y_max - det.bounding_box.y_min) / 720) * 100}%`,
                 }}
               >
                 <span className={`absolute -top-6 left-0 text-xs px-2 py-1 font-bold whitespace-nowrap ${det.class.includes('Plastic') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                   {det.class} ({(det.confidence * 100).toFixed(0)}%)
                 </span>
               </div>
            ))}
          </div>
        </div>

        {/* Side Panel: Detections & KPIs */}
        <div className="flex-1 flex flex-col gap-6 min-h-0">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 shrink-0">
             <div className="glass-panel p-4 rounded-xl border-l-2 border-l-red-500">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Plastic Detected</p>
                <p className="text-2xl font-bold text-white">{stats.plasticCount}</p>
             </div>
             <div className="glass-panel p-4 rounded-xl border-l-2 border-l-purple-500">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Frames Scanned</p>
                <p className="text-2xl font-bold text-white">{stats.totalFrames}</p>
             </div>
          </div>

          {/* Detections Log */}
          <div className="flex-1 glass-panel rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 bg-black/40 border-b border-white/5 shrink-0">
              <h3 className="font-bold flex items-center gap-2"><Eye size={18} className="text-purple-400" /> Live Detection Log</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {detections.length === 0 ? (
                <p className="text-gray-500 text-sm text-center mt-10 font-mono">No objects in current frame...</p>
              ) : (
                detections.map((det, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded bg-black/30 border border-white/5">
                     <div className="flex items-center gap-3">
                       {det.class.includes('Plastic') ? <AlertTriangle className="text-red-500" size={16}/> : <span className="w-4 h-4 rounded-full bg-green-500/50 block"></span>}
                       <span className="font-medium">{det.class}</span>
                     </div>
                     <span className={`text-sm font-mono ${det.confidence > 0.85 ? 'text-green-400' : 'text-yellow-400'}`}>
                       {(det.confidence * 100).toFixed(1)}%
                     </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

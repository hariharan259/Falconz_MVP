import { useState, useEffect, useRef } from 'react';

export interface TelemetryData {
  flight_mode: string;
  battery_percent: number;
  gps_satellites: number;
  alt_relative: number;
  roll: number;
  pitch: number;
  yaw: number;
  imu_accel_z: number;
  timestamp: number; // Added locally for charting
}

export function useTelemetry(url: string) {
  const [data, setData] = useState<TelemetryData | null>(null);
  const [history, setHistory] = useState<TelemetryData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onclose = () => setIsConnected(false);

    ws.current.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      parsed.timestamp = Date.now();
      
      setData(parsed);
      setHistory(prev => {
        const newHistory = [...prev, parsed];
        // Keep last 50 data points for performance (10 seconds at 5Hz)
        if (newHistory.length > 50) return newHistory.slice(newHistory.length - 50);
        return newHistory;
      });
    };

    return () => {
      ws.current?.close();
    };
  }, [url]);

  return { data, history, isConnected };
}

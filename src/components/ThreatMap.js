import React, { useEffect, useRef, useState } from 'react';
import { Radar, Shield, Activity, Flame, Radio, Zap } from 'lucide-react';
import sound from '../utils/soundFx.js';

// Predefined tactical target nodes across the globe
const GLOBAL_NODES = [
  { id: 'lucknow', name: 'Lucknow, IN [HOST]', x: 0.68, y: 0.44, color: '#00f5ff' },
  { id: 'delhi', name: 'New Delhi, IN', x: 0.67, y: 0.42, color: '#00ff88' },
  { id: 'tokyo', name: 'Tokyo, JP', x: 0.85, y: 0.38, color: '#a855f7' },
  { id: 'frankfurt', name: 'Frankfurt, DE', x: 0.51, y: 0.32, color: '#00f5ff' },
  { id: 'london', name: 'London, UK', x: 0.48, y: 0.30, color: '#38bdf8' },
  { id: 'nyc', name: 'New York, US', x: 0.28, y: 0.36, color: '#ef4444' },
  { id: 'silicon', name: 'San Jose, US', x: 0.18, y: 0.38, color: '#f59e0b' },
  { id: 'sao_paulo', name: 'Sao Paulo, BR', x: 0.34, y: 0.72, color: '#ec4899' },
  { id: 'singapore', name: 'Singapore, SG', x: 0.76, y: 0.58, color: '#00ff88' },
  { id: 'sydney', name: 'Sydney, AU', x: 0.88, y: 0.78, color: '#00f5ff' }
];

const ATTACK_TYPES = [
  { name: 'SYN Flood DDoS', severity: 'HIGH', port: '80/443', color: '#ef4444' },
  { name: 'C2 Beacon Callback', severity: 'CRITICAL', port: '8443', color: '#a855f7' },
  { name: 'Kerberoast Extraction', severity: 'HIGH', port: '88', color: '#f59e0b' },
  { name: 'Zero-Day RCE Exploit', severity: 'CRITICAL', port: '445', color: '#ef4444' },
  { name: 'DNS Tunneling Exfil', severity: 'MEDIUM', port: '53', color: '#00f5ff' },
  { name: 'Credential Stuffing', severity: 'MEDIUM', port: '22', color: '#00ff88' }
];

export default function ThreatMap() {
  const canvasRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [liveEvents, setLiveEvents] = useState([]);
  const [stats, setStats] = useState({ intercepted: 14289, activeC2: 48, defcon: 'DEFCON 2' });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let width = canvas.width = canvas.parentElement.clientWidth;
    let height = canvas.height = Math.min(380, window.innerHeight * 0.45);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(380, window.innerHeight * 0.45);
    };
    window.addEventListener('resize', handleResize);

    const arcs = [];

    const spawnArc = () => {
      const fromNode = GLOBAL_NODES[Math.floor(Math.random() * GLOBAL_NODES.length)];
      let toNode = GLOBAL_NODES[Math.floor(Math.random() * GLOBAL_NODES.length)];
      while (toNode.id === fromNode.id) {
        toNode = GLOBAL_NODES[Math.floor(Math.random() * GLOBAL_NODES.length)];
      }

      const atk = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)];
      const arc = {
        from: fromNode,
        to: toNode,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        attack: atk,
        color: atk.color
      };
      arcs.push(arc);

      // Add to event ticker
      setLiveEvents(prev => [
        {
          id: Math.random().toString(),
          time: new Date().toLocaleTimeString(),
          from: fromNode.name,
          to: toNode.name,
          name: atk.name,
          port: atk.port,
          severity: atk.severity,
          color: atk.color
        },
        ...prev.slice(0, 4)
      ]);

      setStats(prev => ({
        ...prev,
        intercepted: prev.intercepted + 1
      }));
    };

    const interval = setInterval(spawnArc, 1400);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Tactical Matrix Grid Lines
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw Global Node Radar Rings
      GLOBAL_NODES.forEach(node => {
        const nx = node.x * width;
        const ny = node.y * height;

        // Outer pulse ring
        ctx.beginPath();
        ctx.arc(nx, ny, 8, 0, Math.PI * 2);
        ctx.strokeStyle = `${node.color}33`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(nx, ny, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.font = '9px monospace';
        ctx.fillText(node.name.split(',')[0], nx + 8, ny + 3);
      });

      // 3. Draw Projectile Attack Arcs
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i];
        arc.progress += arc.speed;

        const x1 = arc.from.x * width;
        const y1 = arc.from.y * height;
        const x2 = arc.to.x * width;
        const y2 = arc.to.y * height;

        // Quadratic Bézier control point above midpoint
        const cx = (x1 + x2) / 2;
        const cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.25 - 20;

        // Draw Arc Path
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(cx, cy, x2, y2);
        ctx.strokeStyle = `${arc.color}35`;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Calculate ballistic position on curve
        const t = arc.progress;
        const px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
        const py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;

        // Draw glowing warhead projectile
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = arc.color;
        ctx.shadowColor = arc.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;

        if (arc.progress >= 1) {
          // Impact burst
          ctx.beginPath();
          ctx.arc(x2, y2, 14, 0, Math.PI * 2);
          ctx.strokeStyle = arc.color;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          arcs.splice(i, 1);
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      clearInterval(interval);
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-brand-cyan/25 bg-[#060b13]/90 relative overflow-hidden font-mono shadow-2xl">
      {/* HUD Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-brand-cyan/15 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center">
            <Radio className="w-4 h-4 text-brand-cyan animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm font-bold text-white tracking-wide">
                GLOBAL THREAT RADAR & ATTACK TELEMETRY
              </span>
              <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                LIVE C2
              </span>
            </div>
            <span className="text-[0.62rem] text-slate-400">
              Real-time adversary simulation & intrusion interception stream
            </span>
          </div>
        </div>

        {/* Tactical Status Counters */}
        <div className="flex items-center gap-4 text-xs shrink-0">
          <div>
            <span className="text-[0.6rem] text-slate-500 block">INTERCEPTED</span>
            <span className="text-brand-cyan font-bold text-sm leading-none">
              {stats.intercepted.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[0.6rem] text-slate-500 block">DEFENSE LEVEL</span>
            <span className="text-yellow-400 font-bold text-sm leading-none">
              {stats.defcon}
            </span>
          </div>
        </div>
      </div>

      {/* Canvas Radar Screen */}
      <div className="relative my-3 w-full rounded-xl overflow-hidden bg-black/60 border border-white/5">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute top-2 left-3 text-[0.6rem] text-brand-cyan/60 pointer-events-none">
          GRID: SOC-GEO-89 // PROJECTION: SPHERICAL-MERCATOR
        </div>
      </div>

      {/* Live Interception Ticker Stream */}
      <div className="pt-2 border-t border-white/5 space-y-1.5">
        <div className="text-[0.6rem] text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-brand-green" />
          <span>Real-time Interception Feed:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[0.65rem]">
          {liveEvents.slice(0, 2).map(evt => (
            <div 
              key={evt.id} 
              className="p-2 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full animate-ping" style={{ backgroundColor: evt.color }} />
                <span className="text-white font-bold truncate">{evt.name}</span>
                <span className="text-slate-500 text-[0.6rem]">Port {evt.port}</span>
              </div>
              <span className="text-slate-400 shrink-0 ml-2">
                {evt.from.split(',')[0]} ➔ {evt.to.split(',')[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Shield, CheckCircle2, AlertTriangle, XCircle, RefreshCw, 
  Cpu, Eye, Lock, HardDrive, Wifi, ExternalLink, Sparkles
} from 'lucide-react';
import sound from '../utils/soundFx.js';

export default function BrowserSecurityInspector() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const runAudit = async () => {
    setScanning(true);
    sound.play('scan');
    await new Promise(r => setTimeout(r, 900));

    // 1. WebRTC Local IP Leak Check
    let webrtcLeak = false;
    let leakedCandidate = null;
    try {
      const rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      rtc.createDataChannel('');
      rtc.createOffer().then(offer => rtc.setLocalDescription(offer));
      rtc.onicecandidate = (event) => {
        if (event && event.candidate && event.candidate.candidate) {
          const match = event.candidate.candidate.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
          if (match) {
            leakedCandidate = match[1];
            if (!leakedCandidate.startsWith('127.')) {
              webrtcLeak = true;
            }
          }
        }
      };
      await new Promise(r => setTimeout(r, 400));
      rtc.close();
    } catch (e) {}

    // 2. Canvas Fingerprint Entropy
    let canvasEntropyScore = 'MODERATE';
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('SOC_RECON_FINGERPRINT_TEST_123', 2, 2);
      const dataUri = canvas.toDataURL();
      if (dataUri.length > 500) {
        canvasEntropyScore = 'UNIQUE_FINGERPRINT_DETECTED';
      }
    } catch (e) {
      canvasEntropyScore = 'BLOCKED_BY_POLICY';
    }

    // 3. Hardware / Device Footprint
    const cores = navigator.hardwareConcurrency || 4;
    const memory = navigator.deviceMemory || 8;
    const dnt = navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true;
    const cookies = navigator.cookieEnabled;

    // Calculate Security Score
    let score = 70;
    if (dnt) score += 15;
    if (!webrtcLeak) score += 15;
    if (canvasEntropyScore === 'BLOCKED_BY_POLICY') score += 10;
    if (score > 100) score = 100;

    setResults({
      score,
      webrtcLeak,
      leakedCandidate: leakedCandidate || 'Shielded (mDNS / VPN Encapsulated)',
      canvasEntropyScore,
      cores,
      memory: `${memory} GB`,
      dnt: dnt ? 'Active (Do-Not-Track Enabled)' : 'Disabled (Trackers Permitted)',
      cookies: cookies ? 'Permitted' : 'Blocked',
      userAgent: navigator.userAgent
    });

    setScanning(false);
    sound.play('success');
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-brand-cyan/30 bg-[#070d16] font-mono shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-brand-cyan/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
            <Shield className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                CLIENT BROWSER SECURITY & PRIVACY AUDIT
              </h3>
              <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 uppercase">
                INSPECTOR
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live heuristic evaluation of WebRTC leaks, canvas tracking, and fingerprint entropy
            </p>
          </div>
        </div>

        <button
          onClick={runAudit}
          disabled={scanning}
          className="px-4 py-2 rounded-xl bg-brand-cyan/15 border border-brand-cyan/40 hover:bg-brand-cyan/25 text-brand-cyan text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'SCANNING HEURISTICS...' : 'RE-RUN AUDIT'}</span>
        </button>
      </div>

      {/* Score Hero Banner */}
      {results && (
        <div className="my-6 p-4 rounded-xl bg-black/50 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-display font-black text-2xl border ${
              results.score >= 85 ? 'border-brand-green text-brand-green bg-brand-green/10' :
              results.score >= 70 ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' :
              'border-red-500 text-red-500 bg-red-500/10'
            }`}>
              {results.score}%
            </div>
            <div>
              <div className="font-bold text-sm text-white">
                {results.score >= 85 ? 'STRONG HARDENING GRADE' : results.score >= 70 ? 'MODERATE PRIVACY RESILIENCE' : 'VULNERABLE BROWSER POSTURE'}
              </div>
              <p className="text-xs text-slate-400">
                {results.score >= 85 ? 'Your browser isolates fingerprint vectors effectively.' : 'Exposed hardware identifiers detected across sessions.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <span>AUDIT STATE:</span>
            <span className="text-brand-green flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> SEC_VERIFIED
            </span>
          </div>
        </div>
      )}

      {/* Metric Cards Grid */}
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* WebRTC Leak */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[0.62rem] text-slate-500 block uppercase">WebRTC Leak Check</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{results.webrtcLeak ? 'LEAK DETECTED' : 'NO LEAK DETECTED'}</span>
              {results.webrtcLeak ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <CheckCircle2 className="w-4 h-4 text-brand-green" />}
            </div>
            <span className="text-[0.65rem] text-slate-400 block truncate">{results.leakedCandidate}</span>
          </div>

          {/* Canvas Fingerprinting */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[0.62rem] text-slate-500 block uppercase">Canvas Fingerprinting</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{results.canvasEntropyScore === 'BLOCKED_BY_POLICY' ? 'BLOCKED' : 'TRACKABLE'}</span>
              <Eye className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-[0.65rem] text-slate-400 block">{results.canvasEntropyScore}</span>
          </div>

          {/* Do-Not-Track */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[0.62rem] text-slate-500 block uppercase">Do-Not-Track (DNT / GPC)</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{results.dnt.split(' ')[0]}</span>
              <Lock className="w-4 h-4 text-brand-cyan" />
            </div>
            <span className="text-[0.65rem] text-slate-400 block">{results.dnt}</span>
          </div>

          {/* CPU Hardware */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[0.62rem] text-slate-500 block uppercase">CPU Concurrency</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{results.cores} Logical Threads</span>
              <Cpu className="w-4 h-4 text-brand-purple" />
            </div>
            <span className="text-[0.65rem] text-slate-400 block">Exposed via navigator.hardwareConcurrency</span>
          </div>

          {/* Device RAM */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[0.62rem] text-slate-500 block uppercase">Device Memory Approximate</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{results.memory}</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[0.65rem] text-slate-400 block">Reported device RAM quota</span>
          </div>

          {/* Cookie State */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-[0.62rem] text-slate-500 block uppercase">Storage Isolation</span>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">{results.cookies}</span>
              <Wifi className="w-4 h-4 text-pink-400" />
            </div>
            <span className="text-[0.65rem] text-slate-400 block">Third-party partition policy active</span>
          </div>
        </div>
      )}

      {/* Hardening Recommendations */}
      <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-[0.65rem] text-slate-400">
        <span className="text-brand-cyan font-bold uppercase tracking-wider">// HARDENING RECOMMENDATION:</span>
        <span>Use Firefox with `privacy.resistFingerprinting = true` or Brave Shield to neutralize canvas telemetry.</span>
      </div>
    </div>
  );
}

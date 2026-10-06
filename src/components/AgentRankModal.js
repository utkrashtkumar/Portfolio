import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, Award, Shield, Zap, Download, X, CheckCircle, 
  ExternalLink, Sparkles, User, Terminal, Star, Lock
} from 'lucide-react';
import sound from '../utils/soundFx.js';

export default function AgentRankModal({ isOpen, onClose, authUser }) {
  const [agentName, setAgentName] = useState('AGENT_OPERATIVE');
  const [xp, setXp] = useState(750);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Load actual or simulated XP from CTF progress
    let calculatedXp = 450;
    try {
      const ctfSolved = localStorage.getItem('ctfSolved');
      if (ctfSolved === 'true') calculatedXp += 400;
      const labProgress = localStorage.getItem('lab_progress');
      if (labProgress) {
        const parsed = JSON.parse(labProgress);
        calculatedXp += Object.keys(parsed).length * 150;
      }
    } catch (e) {
      // fallback
    }

    if (authUser?.email) {
      const handle = authUser.email.split('@')[0].toUpperCase();
      setAgentName(handle);
    } else {
      const storedHandle = localStorage.getItem('agent_handle');
      if (storedHandle) setAgentName(storedHandle);
    }

    setXp(calculatedXp);
    sound.play('beep');
  }, [isOpen, authUser]);

  if (!isOpen) return null;

  // Rank determination
  let rankTitle = 'NOVICE_RECON';
  let rankTier = 'TIER 1';
  let rankLevel = 1;
  let nextTierXp = 600;
  let badgeColor = 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10';

  if (xp >= 1500) {
    rankTitle = 'ELITE_CISO_VANGUARD';
    rankTier = 'TIER 5';
    rankLevel = 5;
    nextTierXp = 2500;
    badgeColor = 'text-brand-purple border-brand-purple/40 bg-brand-purple/10';
  } else if (xp >= 1000) {
    rankTitle = 'ZERO_DAY_HUNTER';
    rankTier = 'TIER 4';
    rankLevel = 4;
    nextTierXp = 1500;
    badgeColor = 'text-red-400 border-red-400/40 bg-red-400/10';
  } else if (xp >= 600) {
    rankTitle = 'PENETRATION_TESTER';
    rankTier = 'TIER 3';
    rankLevel = 3;
    nextTierXp = 1000;
    badgeColor = 'text-brand-cyan border-brand-cyan/40 bg-brand-cyan/10';
  } else if (xp >= 300) {
    rankTitle = 'TACTICAL_ANALYST';
    rankTier = 'TIER 2';
    rankLevel = 2;
    nextTierXp = 600;
    badgeColor = 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
  }

  const progressPercent = Math.min(100, Math.round((xp / nextTierXp) * 100));

  const badges = [
    { id: 'recon', name: 'PORT_SCANNER', desc: 'Discovered network perimeter vulnerabilities', unlocked: true },
    { id: 'crypto', name: 'CIPHER_BREAKER', desc: 'Cracked encoded telemetry & hashes', unlocked: xp >= 600 },
    { id: 'web', name: 'INJECTION_DEFENDER', desc: 'Sanitized SQLi & XSS payloads', unlocked: xp >= 750 },
    { id: 'ops', name: 'THREAT_INTERCEPTOR', desc: 'Tracked global cyberwarfare arcs', unlocked: true },
    { id: 'elite', name: 'GHOST_PROTOCOL', desc: 'Achieved verified CISO security clearance', unlocked: xp >= 1000 }
  ];

  // Certificate Generator via Canvas
  const generateAndDownloadCertificate = () => {
    setIsGeneratingCert(true);
    sound.play('scan');

    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Background Dark Slate & Carbon Mesh
    ctx.fillStyle = '#060913';
    ctx.fillRect(0, 0, 1600, 1000);

    // Subtle Grid pattern
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 1600; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1000);
      ctx.stroke();
    }
    for (let y = 0; y < 1000; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1600, y);
      ctx.stroke();
    }

    // Outer Laser Border
    ctx.strokeStyle = '#00F5FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 1500, 900);

    // Inner Accent Border
    ctx.strokeStyle = 'rgba(176, 38, 255, 0.6)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(65, 65, 1470, 870);

    // Corner Targeting Reticles
    const drawReticle = (cx, cy) => {
      ctx.strokeStyle = '#00F5FF';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy);
      ctx.lineTo(cx + 20, cy);
      ctx.moveTo(cx, cy - 20);
      ctx.lineTo(cx, cy + 20);
      ctx.stroke();
    };
    drawReticle(80, 80);
    drawReticle(1520, 80);
    drawReticle(80, 920);
    drawReticle(1520, 920);

    // Header Protocol Watermark
    ctx.fillStyle = '#00F5FF';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('// UTKRASHT//SEC DEFENSE INITIATIVE • CLASSIFIED PROTOCOL //', 800, 130);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '16px monospace';
    ctx.fillText('GLOBAL CYBER OPERATIONS & ADVERSARIAL THREAT RESILIENCE DIVISION', 800, 165);

    // Main Certificate Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 52px sans-serif';
    ctx.fillText('CERTIFICATE OF OPERATIVE READINESS', 800, 260);

    ctx.fillStyle = '#00F5FF';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('SPECIAL FORCES LEVEL CLEARANCE VERIFICATION', 800, 305);

    // Subtext
    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px sans-serif';
    ctx.fillText('This authenticated credential hereby certifies that designated cyber operative:', 800, 390);

    // Operative Name / Handle (Prominent)
    ctx.fillStyle = '#00F5FF';
    ctx.font = 'bold 56px monospace';
    ctx.fillText(agentName, 800, 475);

    // Rank & Designation
    ctx.fillStyle = '#B026FF';
    ctx.font = 'bold 26px monospace';
    ctx.fillText(`DESIGNATION: ${rankTitle} [${rankTier}]`, 800, 530);

    // Description text
    ctx.fillStyle = '#CBD5E1';
    ctx.font = '18px monospace';
    ctx.fillText('Has successfully passed rigorous simulated intrusion detection, cryptographic decoders,', 800, 600);
    ctx.fillText('offensive penetration vector assessments, and enterprise cyber hardening telemetry.', 800, 630);

    // Bottom Credentials & Hashes
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(150, 720);
    ctx.lineTo(1450, 720);
    ctx.stroke();

    // Verification Hash
    const pseudoHash = 'SHA256: 8F3E9A72BD1AC49E2A7F05C491' + Math.floor(Math.random() * 899999 + 100000);
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748B';
    ctx.font = '14px monospace';
    ctx.fillText(`AUTHENTICATION DIGEST: ${pseudoHash}`, 150, 770);
    ctx.fillText(`ISSUED DATE: ${new Date().toISOString().split('T')[0]} • UTC+05:30`, 150, 800);
    ctx.fillText(`ISSUING AUTHORITY: Utkrasht Kumar // lead@utkrasht.sec`, 150, 830);

    // Right Side Cryptographic Stamp
    ctx.textAlign = 'right';
    ctx.fillStyle = '#00F5FF';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('SEAL OF SECURITY EXCELLENCE', 1450, 770);
    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('✓ CRYPTOGRAPHICALLY VERIFIED', 1450, 800);
    ctx.fillStyle = '#64748B';
    ctx.font = '14px monospace';
    ctx.fillText('STATUS: ACTIVE IN-THE-FIELD OPERATIVE', 1450, 830);

    // Trigger Download
    setTimeout(() => {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `UTKRASHT_SEC_CREDENTIAL_${agentName}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsGeneratingCert(false);
      sound.play('success');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
      <div className="bg-slate-900/95 border border-brand-cyan/40 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-[0_0_60px_rgba(0,245,255,0.2)]">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-brand-cyan/20 flex items-center justify-between bg-black/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                OPERATIVE CLEARANCE & XP DOSSIER
              </h2>
              <p className="text-xs text-slate-400">Classified Agent Telemetry Record</p>
            </div>
          </div>
          <button
            onClick={() => { sound.play('beep'); onClose(); }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* DOSSIER CARD */}
          <div className="bg-black/40 border border-white/10 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-brand-cyan/10 border-2 border-brand-cyan/50 flex items-center justify-center text-brand-cyan shadow-[0_0_20px_rgba(0,245,255,0.3)]">
                <Shield className="w-10 h-10" />
              </div>
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-brand-purple text-white text-[0.6rem] font-bold border border-white/20">
                LVL {rankLevel}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-base font-bold text-white tracking-wider">{agentName}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold border ${badgeColor}`}>
                  {rankTitle}
                </span>
              </div>
              <div className="text-slate-400 text-[0.7rem]">
                Total Security XP: <span className="text-brand-cyan font-bold">{xp} PTS</span> • Security Clearance: {rankTier}
              </div>

              {/* XP Progress Bar */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[0.65rem] text-slate-400">
                  <span>Progress to Next Rank</span>
                  <span className="text-brand-cyan font-bold">{xp} / {nextTierXp} XP ({progressPercent}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* BADGES & SPECIALIZATIONS */}
          <div className="space-y-3">
            <div className="text-slate-400 font-bold uppercase text-[0.7rem] flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-cyan" />
              Earned Badges & Operational Clearances
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {badges.map((b) => (
                <div 
                  key={b.id} 
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    b.unlocked 
                      ? 'bg-white/5 border-brand-cyan/30 text-slate-200' 
                      : 'bg-black/20 border-white/5 text-slate-600 opacity-60'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${b.unlocked ? 'bg-brand-cyan/10 text-brand-cyan' : 'bg-white/5 text-slate-600'}`}>
                    {b.unlocked ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="font-bold text-[0.72rem] text-white flex items-center gap-1.5">
                      {b.name}
                      {b.unlocked && <span className="text-[0.6rem] text-brand-cyan">✓</span>}
                    </div>
                    <div className="text-[0.65rem] text-slate-400 mt-0.5">{b.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOWNLOAD CERTIFICATE ACTION */}
          <div className="p-5 rounded-xl bg-gradient-to-br from-brand-cyan/10 via-brand-purple/10 to-black/60 border border-brand-cyan/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="font-bold text-white text-sm flex items-center justify-center sm:justify-start gap-2">
                <Sparkles className="w-4 h-4 text-brand-cyan" />
                VERIFIED OPERATIVE CREDENTIAL
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Generate an official high-resolution, cryptographically signed cyber clearance certificate.
              </p>
            </div>

            <button
              onClick={generateAndDownloadCertificate}
              disabled={isGeneratingCert}
              className="px-5 py-2.5 rounded-xl bg-brand-cyan text-black font-bold text-xs hover:bg-brand-cyan/80 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,245,255,0.4)] shrink-0 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingCert ? 'Rendering...' : 'Download Credential'}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex justify-between items-center text-[0.65rem] text-slate-500">
          <span>CLASSIFICATION: CONFIDENTIAL // AGENT #{Math.floor(xp * 1.618)}</span>
          <span>UTKRASHT//SEC DEFENSE</span>
        </div>
      </div>
    </div>
  );
}

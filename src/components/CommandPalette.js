import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Terminal, Shield, Wrench, Trophy, Newspaper, User, Mail, 
  Volume2, VolumeX, Eye, Flame, Compass, Hash, Sparkles, X, ChevronRight, Activity, Cpu
} from 'lucide-react';
import sound from '../utils/soundFx.js';

export default function CommandPalette({ 
  isOpen, 
  onClose, 
  onTriggerBreach, 
  isExecutiveMode, 
  onToggleExecutiveMode,
  onOpenBrowserAudit,
  onOpenFieldTools,
  onOpenRankModal
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      sound.play('beep');
    }
  }, [isOpen]);

  const items = [
    // Navigation
    { id: 'nav-home', category: 'Navigation', icon: <Terminal className="w-4 h-4 text-brand-cyan" />, label: 'Home // Root Console', shortcut: 'G H', action: () => navigate('/') },
    { id: 'nav-tools', category: 'Navigation', icon: <Wrench className="w-4 h-4 text-yellow-400" />, label: 'Offensive Arsenal & Tools', shortcut: 'G T', action: () => navigate('/tools') },
    { id: 'nav-labs', category: 'Navigation', icon: <Cpu className="w-4 h-4 text-brand-purple" />, label: 'Interactive Cyber Labs', shortcut: 'G L', action: () => navigate('/labs') },
    { id: 'nav-ctf', category: 'Navigation', icon: <Trophy className="w-4 h-4 text-red-400" />, label: 'CTF Intrusion Arena', shortcut: 'G C', action: () => navigate('/ctf') },
    { id: 'nav-skills', category: 'Navigation', icon: <Activity className="w-4 h-4 text-brand-green" />, label: 'Security Proficiency Skills', shortcut: 'G S', action: () => navigate('/skills') },
    { id: 'nav-projects', category: 'Navigation', icon: <Shield className="w-4 h-4 text-brand-cyan" />, label: 'Offensive Operations & Projects', shortcut: 'G P', action: () => navigate('/projects') },
    { id: 'nav-news', category: 'Navigation', icon: <Newspaper className="w-4 h-4 text-pink-400" />, label: 'Live Threat Intel & CVE News', shortcut: 'G N', action: () => navigate('/news') },
    { id: 'nav-portal', category: 'Navigation', icon: <User className="w-4 h-4 text-brand-cyan" />, label: 'Agent Access Portal // Sign In', shortcut: 'G A', action: () => navigate('/portal') },
    { id: 'nav-contact', category: 'Navigation', icon: <Mail className="w-4 h-4 text-yellow-300" />, label: 'Encrypted Contact Pipeline', shortcut: 'G M', action: () => navigate('/contact') },

    // Tactical Actions & Utilities
    { 
      id: 'act-audit', 
      category: 'Security Actions', 
      icon: <Shield className="w-4 h-4 text-emerald-400" />, 
      label: 'Audit My Browser // Security Hardening Scan', 
      badge: 'NEW', 
      action: () => { onClose(); onOpenBrowserAudit?.(); } 
    },
    { 
      id: 'act-field', 
      category: 'Security Actions', 
      icon: <Wrench className="w-4 h-4 text-brand-cyan" />, 
      label: 'Open Field Utilities (Reverse Shells, Hashes, CIDR)', 
      badge: 'TOOLKIT', 
      action: () => { onClose(); onOpenFieldTools?.(); } 
    },
    { 
      id: 'act-rank', 
      category: 'Security Actions', 
      icon: <Trophy className="w-4 h-4 text-yellow-400" />, 
      label: 'View Agent Rank, XP & Certificate', 
      badge: 'XP', 
      action: () => { onClose(); onOpenRankModal?.(); } 
    },
    { 
      id: 'act-mode', 
      category: 'Security Actions', 
      icon: <Eye className="w-4 h-4 text-brand-purple" />, 
      label: `Switch Mode: ${isExecutiveMode ? 'Cyber Ops HUD' : 'Executive Corporate Mode'}`, 
      badge: isExecutiveMode ? 'EXEC' : 'CYBER',
      action: () => { onToggleExecutiveMode?.(); } 
    },
    { 
      id: 'act-sound', 
      category: 'Security Actions', 
      icon: sound.isEnabled() ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-green-400" />, 
      label: `Tactical Audio: ${sound.isEnabled() ? 'Mute Sound FX' : 'Enable Cyber Sound FX'}`, 
      action: () => { sound.toggle(); } 
    },
    { 
      id: 'act-breach', 
      category: 'Security Actions', 
      icon: <Flame className="w-4 h-4 text-red-500 animate-pulse" />, 
      label: 'Trigger Emergency System Breach Simulation', 
      badge: 'DANGER',
      action: () => { onClose(); sound.play('alarm'); onTriggerBreach?.(true); setTimeout(() => onTriggerBreach?.(false), 5000); } 
    }
  ];

  const filteredItems = items.filter(item => 
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      sound.play('key');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
      sound.play('key');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        sound.play('success');
        filteredItems[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl bg-[#090e17] border border-brand-cyan/40 rounded-2xl shadow-[0_0_60px_rgba(0,245,255,0.25)] overflow-hidden flex flex-col font-mono"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-cyan/20 bg-black/50">
          <Search className="w-5 h-5 text-brand-cyan shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); sound.play('key'); }}
            onKeyDown={handleKeyDown}
            placeholder="Type directive, route, action (e.g. 'audit', 'labs', 'breach', 'hash')..."
            className="w-full bg-transparent text-white text-sm outline-none placeholder:text-slate-500 font-mono"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[0.6rem] text-slate-400">
            ESC to close
          </kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-white sm:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Items List */}
        <div className="max-h-[380px] overflow-y-auto p-2 divide-y divide-white/5 space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              [!] No command directive matches "{query}"
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.play('success');
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/40 shadow-[0_0_15px_rgba(0,245,255,0.15)]' 
                      : 'text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="shrink-0 p-1.5 rounded-lg bg-black/40 border border-white/5">
                      {item.icon}
                    </div>
                    <span className="text-xs truncate font-medium">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[0.55rem] font-bold bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30">
                        {item.badge}
                      </span>
                    )}
                    {item.shortcut && (
                      <span className="text-[0.6rem] text-slate-500 font-mono">
                        {item.shortcut}
                      </span>
                    )}
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-brand-cyan translate-x-0.5' : 'text-slate-600'} transition-transform`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hotkey Tips */}
        <div className="px-4 py-2.5 bg-black/70 border-t border-brand-cyan/15 flex items-center justify-between text-[0.62rem] text-slate-500">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-brand-cyan/70 font-bold uppercase tracking-wider">
            UTKRASHT//SEC SPOTLIGHT v2.0
          </span>
        </div>
      </div>
    </div>
  );
}

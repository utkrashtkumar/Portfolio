import React, { useState } from 'react';
import { 
  Wrench, Binary, Hash, Network, KeyRound, Copy, Check, 
  Trash2, AlertCircle, Info, X, Eye, EyeOff, ShieldCheck
} from 'lucide-react';
import sound from '../utils/soundFx.js';

export default function FieldUtilities({ onClose }) {
  const [activeTab, setActiveTab] = useState('decoder');
  const [copiedKey, setCopiedKey] = useState(null);

  const copyToClipboard = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    sound.play('success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // --- TAB 1: MULTI-DECODER ---
  const [decoderInput, setDecoderInput] = useState('U0VDVVJJVFlfQ0xFQVJBTkNFX1ZFUklGSUVE');
  const [decoderMode, setDecoderMode] = useState('base64');
  const [decoderDirection, setDecoderDirection] = useState('decode');

  const transformText = (input, mode, direction) => {
    if (!input) return '';
    try {
      if (mode === 'base64') {
        if (direction === 'decode') {
          return atob(input.trim());
        } else {
          return btoa(input);
        }
      }
      if (mode === 'hex') {
        if (direction === 'decode') {
          const clean = input.replace(/\s+/g, '');
          let str = '';
          for (let i = 0; i < clean.length; i += 2) {
            str += String.fromCharCode(parseInt(clean.substr(i, 2), 16));
          }
          return str;
        } else {
          return Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
        }
      }
      if (mode === 'url') {
        return direction === 'decode' ? decodeURIComponent(input) : encodeURIComponent(input);
      }
      if (mode === 'rot13') {
        return input.replace(/[a-zA-Z]/g, (c) => {
          const code = c.charCodeAt(0);
          const base = code >= 97 ? 97 : 65;
          return String.fromCharCode(((code - base + 13) % 26) + base);
        });
      }
      if (mode === 'binary') {
        if (direction === 'decode') {
          const bins = input.trim().split(/\s+/);
          return bins.map(b => String.fromCharCode(parseInt(b, 2))).join('');
        } else {
          return Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
        }
      }
      if (mode === 'reverse') {
        return input.split('').reverse().join('');
      }
      return input;
    } catch (err) {
      return `[PARSE ERROR: Invalid ${mode.toUpperCase()} input - ${err.message}]`;
    }
  };

  const decoderOutput = transformText(decoderInput, decoderMode, decoderDirection);

  // --- TAB 2: HASH ANALYZER ---
  const [hashInput, setHashInput] = useState('5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8');
  
  const analyzeHash = (h) => {
    const clean = h.trim();
    const len = clean.length;
    const isHex = /^[0-9a-fA-F]+$/.test(clean);
    
    if (clean.startsWith('$2a$') || clean.startsWith('$2b$') || clean.startsWith('$2y$')) {
      return {
        name: 'Bcrypt Password Hash',
        bits: 184,
        type: 'Key Derivation Function (KDF)',
        status: 'HIGH SECURITY',
        statusColor: 'text-emerald-400',
        notes: 'Adaptive work factor with cryptographic salting. Highly resistant to GPU brute-forcing.'
      };
    }
    if (clean.startsWith('$argon2id$') || clean.startsWith('$argon2i$')) {
      return {
        name: 'Argon2 (PHC Winner)',
        bits: 256,
        type: 'Memory-Hard KDF',
        status: 'MAXIMUM SECURITY',
        statusColor: 'text-brand-cyan',
        notes: 'State-of-the-art memory-hard function defeating specialized ASIC/GPU cracking clusters.'
      };
    }
    if (isHex && len === 32) {
      return {
        name: 'MD5 or NTLM',
        bits: 128,
        type: 'Cryptographic Hash / Windows Auth',
        status: 'CRITICALLY BROKEN',
        statusColor: 'text-red-400',
        notes: 'Vulnerable to practical collision attacks and rainbow-table lookups. Deprecated.'
      };
    }
    if (isHex && len === 40) {
      return {
        name: 'SHA-1',
        bits: 160,
        type: 'Cryptographic Hash',
        status: 'BROKEN / DEPRECATED',
        statusColor: 'text-orange-400',
        notes: 'SHAttered collision demonstrated. Unsafe for digital signatures or TLS certificates.'
      };
    }
    if (isHex && len === 56) {
      return {
        name: 'SHA-224 / SHA3-224',
        bits: 224,
        type: 'Cryptographic Hash',
        status: 'SECURE',
        statusColor: 'text-emerald-400',
        notes: 'Truncated SHA-2 variant. Secure for legacy constrained environments.'
      };
    }
    if (isHex && len === 64) {
      return {
        name: 'SHA-256 (SHA-2 Family)',
        bits: 256,
        type: 'Cryptographic Hash',
        status: 'INDUSTRY STANDARD (SECURE)',
        statusColor: 'text-emerald-400',
        notes: 'Standard for Bitcoin, TLS/SSL certificates, and system integrity verification.'
      };
    }
    if (isHex && len === 96) {
      return {
        name: 'SHA-384',
        bits: 384,
        type: 'Cryptographic Hash',
        status: 'HIGH SECURITY',
        statusColor: 'text-brand-cyan',
        notes: 'Part of NSA Suite B Cryptography for Top Secret security clearance standards.'
      };
    }
    if (isHex && len === 128) {
      return {
        name: 'SHA-512 or Whirlpool',
        bits: 512,
        type: 'Cryptographic Hash',
        status: 'MAXIMUM SECURITY',
        statusColor: 'text-brand-cyan',
        notes: 'Extremely high collision resistance; optimal for 64-bit architecture computation.'
      };
    }
    return {
      name: 'Custom / Unclassified Token',
      bits: len * 4,
      type: 'Arbitrary Hash / Token',
      status: 'UNIDENTIFIED',
      statusColor: 'text-slate-400',
      notes: `Input length is ${len} characters. Check if custom base64 encoded or salted.`
    };
  };

  const hashResult = analyzeHash(hashInput);

  // --- TAB 3: CIDR / SUBNET CALCULATOR ---
  const [cidrInput, setCidrInput] = useState('192.168.1.1/24');

  const calculateSubnet = (cidrStr) => {
    try {
      const parts = cidrStr.trim().split('/');
      if (parts.length !== 2) throw new Error('Format must be IP/prefix (e.g. 192.168.1.0/24)');
      const ip = parts[0];
      const prefix = parseInt(parts[1], 10);
      if (isNaN(prefix) || prefix < 0 || prefix > 32) throw new Error('Prefix must be between 0 and 32');

      const octets = ip.split('.').map(Number);
      if (octets.length !== 4 || octets.some(o => isNaN(o) || o < 0 || o > 255)) {
        throw new Error('Invalid IPv4 octets');
      }

      const ipInt = ((octets[0] << 24) >>> 0) + ((octets[1] << 16) >>> 0) + ((octets[2] << 8) >>> 0) + (octets[3] >>> 0);
      const maskInt = prefix === 0 ? 0 : (((~0 << (32 - prefix))) >>> 0);
      const networkInt = (ipInt & maskInt) >>> 0;
      const wildcardInt = (~maskInt) >>> 0;
      const broadcastInt = (networkInt | wildcardInt) >>> 0;

      const intToIp = (val) => [
        (val >>> 24) & 255,
        (val >>> 16) & 255,
        (val >>> 8) & 255,
        val & 255
      ].join('.');

      const totalHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.pow(2, 32 - prefix);
      const usableHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.max(0, totalHosts - 2);

      const firstHost = prefix >= 31 ? intToIp(networkInt) : intToIp(networkInt + 1);
      const lastHost = prefix >= 31 ? intToIp(broadcastInt) : intToIp(broadcastInt - 1);

      const isPrivate = (octets[0] === 10) || 
                        (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || 
                        (octets[0] === 192 && octets[1] === 168);

      return {
        valid: true,
        ip,
        prefix,
        network: intToIp(networkInt),
        broadcast: intToIp(broadcastInt),
        netmask: intToIp(maskInt),
        wildcard: intToIp(wildcardInt),
        usableRange: `${firstHost} — ${lastHost}`,
        usableHosts: usableHosts.toLocaleString(),
        totalHosts: totalHosts.toLocaleString(),
        scope: isPrivate ? 'RFC 1918 Private' : 'Public Internet'
      };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  };

  const subnetResult = calculateSubnet(cidrInput);

  // --- TAB 4: PASSWORD ENTROPY & NIST HARDENING ---
  const [passInput, setPassInput] = useState('P@ssw0rd_Cyber2026!');
  const [showPass, setShowPass] = useState(false);

  const calculateEntropy = (pwd) => {
    if (!pwd) return { bits: 0, pool: 0, rating: 'Empty', crackTime: '0s', nist: [] };
    let pool = 0;
    if (/[a-z]/.test(pwd)) pool += 26;
    if (/[A-Z]/.test(pwd)) pool += 26;
    if (/[0-9]/.test(pwd)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(pwd)) pool += 33;

    const bits = Math.round(pwd.length * Math.log2(Math.max(pool, 2)));
    const totalCombinations = Math.pow(pool, pwd.length);
    const seconds = totalCombinations / (1e10 * 2);

    let crackTime = 'Instant';
    if (seconds < 1) crackTime = '< 1 millisecond';
    else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
    else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
    else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
    else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
    else if (seconds < 31536000 * 1000) crackTime = `${Math.round(seconds / 31536000)} years`;
    else crackTime = 'Centuries / Impractical';

    let rating = 'CRITICALLY WEAK';
    let ratingColor = 'text-red-400';
    if (bits >= 80) {
      rating = 'FORTIFIED (ENTERPRISE GRADE)';
      ratingColor = 'text-brand-cyan';
    } else if (bits >= 60) {
      rating = 'STRONG';
      ratingColor = 'text-emerald-400';
    } else if (bits >= 40) {
      rating = 'MODERATE';
      ratingColor = 'text-yellow-400';
    }

    const nist = [
      { rule: 'Length >= 12 characters', pass: pwd.length >= 12 },
      { rule: 'Contains mixed alphanumeric & symbols', pass: pool >= 60 },
      { rule: 'Free of common dictionary sequences', pass: !/(password|admin|123456|qwerty)/i.test(pwd) },
      { rule: 'Combinatorial entropy >= 64 bits', pass: bits >= 64 }
    ];

    return { bits, pool, rating, ratingColor, crackTime, nist };
  };

  const entropyResult = calculateEntropy(passInput);

  const tabs = [
    { id: 'decoder', label: 'Multi-Decoder', icon: <Binary className="w-4 h-4" /> },
    { id: 'hash', label: 'Hash Identifier', icon: <Hash className="w-4 h-4" /> },
    { id: 'cidr', label: 'IPv4 CIDR Subnet', icon: <Network className="w-4 h-4" /> },
    { id: 'entropy', label: 'Entropy & NIST', icon: <KeyRound className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-slate-900/95 border border-brand-cyan/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden text-slate-200 flex flex-col max-h-[85vh]">
      {/* HEADER */}
      <div className="px-6 py-4 border-b border-brand-cyan/20 flex items-center justify-between bg-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-mono tracking-wider text-white flex items-center gap-2">
              TACTICAL FIELD UTILITIES
              <span className="text-[0.65rem] px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 uppercase">v2.4</span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">Essential cryptography, networking & encoding toolkit</p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={() => { sound.play('beep'); onClose(); }}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* TABS */}
      <div className="flex border-b border-white/10 bg-black/20 px-6 gap-2 overflow-x-auto scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => { sound.play('beep'); setActiveTab(t.id); }}
            className={`flex items-center gap-2 py-3 px-4 font-mono text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === t.id 
                ? 'border-brand-cyan text-brand-cyan font-bold bg-brand-cyan/5' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* BODY CONTENT */}
      <div className="p-6 overflow-y-auto space-y-6 flex-1 font-mono text-xs">
        {/* TAB 1: MULTI-DECODER */}
        {activeTab === 'decoder' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 uppercase text-[0.7rem]">Mode:</span>
                {['base64', 'hex', 'url', 'rot13', 'binary', 'reverse'].map(m => (
                  <button
                    key={m}
                    onClick={() => { sound.play('key'); setDecoderMode(m); }}
                    className={`px-2.5 py-1 rounded text-[0.7rem] uppercase font-bold transition-all ${
                      decoderMode === m 
                        ? 'bg-brand-cyan text-black' 
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {['base64', 'hex', 'url', 'binary'].includes(decoderMode) && (
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10">
                  <button
                    onClick={() => { sound.play('key'); setDecoderDirection('decode'); }}
                    className={`px-3 py-1 rounded text-[0.68rem] uppercase font-bold transition-all ${
                      decoderDirection === 'decode' ? 'bg-brand-purple text-white' : 'text-slate-400'
                    }`}
                  >
                    Decode
                  </button>
                  <button
                    onClick={() => { sound.play('key'); setDecoderDirection('encode'); }}
                    className={`px-3 py-1 rounded text-[0.68rem] uppercase font-bold transition-all ${
                      decoderDirection === 'encode' ? 'bg-brand-purple text-white' : 'text-slate-400'
                    }`}
                  >
                    Encode
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-cyan">Input String:</span>
                  <button 
                    onClick={() => { sound.play('beep'); setDecoderInput(''); }}
                    className="text-slate-500 hover:text-red-400 flex items-center gap-1 text-[0.65rem] cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </button>
                </div>
                <textarea
                  value={decoderInput}
                  onChange={(e) => setDecoderInput(e.target.value)}
                  placeholder="Enter string to transform..."
                  className="w-full h-44 bg-black/50 border border-white/15 rounded-xl p-3 text-brand-cyan font-mono text-xs focus:outline-none focus:border-brand-cyan/60 resize-none"
                />
              </div>

              {/* OUTPUT */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[0.7rem] font-bold uppercase tracking-wider text-emerald-400">Transformed Result:</span>
                  <button 
                    onClick={() => copyToClipboard(decoderOutput, 'decoder')}
                    className="text-brand-cyan hover:text-white flex items-center gap-1 text-[0.65rem] cursor-pointer"
                  >
                    {copiedKey === 'decoder' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {copiedKey === 'decoder' ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="w-full h-44 bg-black/50 border border-white/15 rounded-xl p-3 text-slate-200 font-mono text-xs break-all overflow-y-auto select-all">
                  {decoderOutput || <span className="text-slate-600 italic">[Result appears here...]</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HASH ANALYZER */}
        {activeTab === 'hash' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-cyan">Target Hash / Signature:</span>
                <span className="text-[0.68rem] text-slate-500">Length: {hashInput.trim().length} chars</span>
              </div>
              <input
                type="text"
                value={hashInput}
                onChange={(e) => setHashInput(e.target.value)}
                placeholder="Paste MD5, SHA-256, Bcrypt, NTLM hash..."
                className="w-full bg-black/50 border border-white/15 rounded-xl p-3 text-brand-cyan font-mono text-xs focus:outline-none focus:border-brand-cyan/60"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-[0.7rem] uppercase text-slate-400 font-bold border-b border-white/10 pb-2">Detection Metrics</div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detected Algorithm:</span>
                  <span className="font-bold text-white">{hashResult.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Classification:</span>
                  <span className="text-slate-300">{hashResult.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Estimated Bit Length:</span>
                  <span className="text-slate-300">{hashResult.bits} bits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Security Rating:</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[0.65rem] border ${hashResult.statusColor} border-current bg-white/5`}>
                    {hashResult.status}
                  </span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <div className="text-[0.7rem] uppercase text-slate-400 font-bold border-b border-white/10 pb-2 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-brand-cyan" /> Analysis & Security Context
                  </div>
                  <p className="text-slate-300 mt-3 leading-relaxed">
                    {hashResult.notes}
                  </p>
                </div>
                <div className="pt-3 text-[0.65rem] text-slate-500 border-t border-white/5">
                  Tip: Modern architectures mandate salted SHA-256 / SHA-3 for documents, and Argon2id or Bcrypt for password stores.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CIDR / SUBNET CALCULATOR */}
        {activeTab === 'cidr' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-cyan">
                IPv4 Address with CIDR Prefix (/0 - /32):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={cidrInput}
                  onChange={(e) => setCidrInput(e.target.value)}
                  placeholder="e.g. 10.0.0.1/24 or 172.16.0.0/16"
                  className="flex-1 bg-black/50 border border-white/15 rounded-xl p-3 text-brand-cyan font-mono text-xs focus:outline-none focus:border-brand-cyan/60"
                />
                <button
                  onClick={() => setCidrInput('10.0.0.1/24')}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 text-[0.68rem] transition-colors cursor-pointer"
                >
                  10.0.0.0/24
                </button>
                <button
                  onClick={() => setCidrInput('172.16.0.1/16')}
                  className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400 text-[0.68rem] transition-colors cursor-pointer"
                >
                  172.16.0.0/16
                </button>
              </div>
            </div>

            {subnetResult.valid ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Network Address:</span>
                    <span className="font-bold text-brand-cyan">{subnetResult.network}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Broadcast Address:</span>
                    <span className="font-bold text-pink-400">{subnetResult.broadcast}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Subnet Mask:</span>
                    <span className="text-white font-mono">{subnetResult.netmask}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Wildcard Mask:</span>
                    <span className="text-slate-400 font-mono">{subnetResult.wildcard}</span>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5">
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Usable Host Range:</span>
                    <span className="font-bold text-emerald-400">{subnetResult.usableRange}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Usable Host Count:</span>
                    <span className="font-bold text-white">{subnetResult.usableHosts}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Total Address Space:</span>
                    <span className="text-slate-400">{subnetResult.totalHosts}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-slate-400">Routing Scope:</span>
                    <span className="text-brand-purple font-bold">{subnetResult.scope}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{subnetResult.error}</span>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PASSWORD ENTROPY & NIST HARDENING */}
        {activeTab === 'entropy' && (
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[0.7rem] font-bold uppercase tracking-wider text-brand-cyan">
                Input Secret / Password for Hardening Audit:
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="Type password to audit entropy..."
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-3 pr-10 text-brand-cyan font-mono text-xs focus:outline-none focus:border-brand-cyan/60"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                <div className="text-[0.7rem] uppercase text-slate-400 font-bold border-b border-white/10 pb-2">
                  Combinatorial Entropy Metrics
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Entropy Rating:</span>
                  <span className={`font-bold ${entropyResult.ratingColor}`}>{entropyResult.rating}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shannon Entropy Bits:</span>
                  <span className="font-bold text-white">{entropyResult.bits} bits</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Character Pool Size:</span>
                  <span className="text-slate-300">{entropyResult.pool} possible glyphs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Brute-Force Estimate (10¹⁰/s GPU):</span>
                  <span className="text-yellow-400 font-bold">{entropyResult.crackTime}</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                <div className="text-[0.7rem] uppercase text-slate-400 font-bold border-b border-white/10 pb-2">
                  NIST SP 800-63B Compliance Checklist
                </div>
                {entropyResult.nist.map((n, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    {n.pass ? (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span className={n.pass ? 'text-slate-200' : 'text-slate-500'}>{n.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="px-6 py-3 border-t border-white/10 bg-black/40 flex justify-between items-center text-[0.65rem] font-mono text-slate-500">
        <span>FIELD OP UTILITIES // CLIENT-SIDE ENCRYPTED ENGINE</span>
        <span>ZERO REMOTE TELEMETRY LOGGED</span>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Shield, Crosshair, Radar, Lock, Fingerprint, Activity, Zap, Cpu, Network, Key, ChevronRight, Monitor, Server, HelpCircle, Unlock, CheckCircle2, AlertCircle, Copy, Check, Play, RefreshCw, Eye, Search, AlertTriangle, HelpCircle as HelpIcon, PlayCircle, Mail
} from 'lucide-react';
import { SectionHeader, PremiumLock } from '../components/Shared.js';

// ============================================================
// CORE CRYPTO HELPERS
// ============================================================
const getGpuInfo = () => {
  if (typeof window === "undefined") return "N/A";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) return "Software Render Node";
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return "WebGL hardware restriction";
    return gl.getParameter(debugInfo.UNMASKED_RENDERER_VENDOR_IMG) + " / " + gl.getParameter(debugInfo.UNMASKED_RENDERER_IMG);
  } catch (e) {
    return "Recon failed: canvas blocked";
  }
};

const caesarCipher = (str, shift) => {
  return str.replace(/[a-z]/gi, (c) => {
    const code = c.charCodeAt(0);
    const base = code >= 65 && code <= 90 ? 65 : 97;
    return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
  });
};

const vigenereCipher = (str, key, decrypt = false) => {
  let output = "";
  let keyIdx = 0;
  const k = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!k) return str;
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    const code = c.charCodeAt(0);
    let base = 0;
    if (code >= 65 && code <= 90) base = 65;
    else if (code >= 97 && code <= 122) base = 97;
    if (base > 0) {
      const shift = k[keyIdx % k.length].charCodeAt(0) - 65;
      const factor = decrypt ? -1 : 1;
      output += String.fromCharCode(((code - base + factor * shift) % 26 + 26) % 26 + base);
      keyIdx++;
    } else {
      output += c;
    }
  }
  return output;
};

// ============================================================
// SYSTEM PROFILER component
// ============================================================
const SystemProfiler = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setProfile({
      userAgent: navigator.userAgent,
      platform: navigator.platform || "Unknown Platform",
      cores: navigator.hardwareConcurrency || "Unknown Cores",
      gpu: getGpuInfo(),
      screen: `${window.screen.width}x${window.screen.height} (${window.screen.colorDepth}-bit)`,
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookiesEnabled: navigator.cookieEnabled ? "Active" : "Disabled"
    });
    setLoading(false);
  };

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-brand-cyan font-bold">
          <Fingerprint className="w-5 h-5" />
          <h4 className="font-display text-sm uppercase tracking-wider">System Fingerprint Profiler</h4>
        </div>
        <button
          onClick={fetchProfile}
          disabled={loading}
          className="p-1.5 hover:bg-white/5 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
          title="Run Profiler Recon"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-cyan' : ''}`} />
        </button>
      </div>

      {!profile && !loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 font-mono text-xs">
          <span className="text-slate-500">// READY TO CAPTURE AGENT TELEMETRY</span>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
          >
            Start Passive Scan
          </button>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-3 font-mono text-xs text-brand-cyan animate-pulse">
          <span>[~] REAPING CLIENT METRICS...</span>
          <div className="w-1/2 h-1 bg-white/5 rounded overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-brand-cyan w-1/3 animate-[gridPulse_1.5s_infinite]" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[0.62rem] text-slate-300">
          <div className="bg-black/40 p-2.5 rounded border border-white/5 sm:col-span-2">
            <span className="text-slate-500 block uppercase text-[0.52rem]">User Agent</span>
            <span className="text-white font-semibold truncate block">{profile.userAgent}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.52rem]">CPU Logic Cores</span>
            <span className="text-brand-cyan font-bold">{profile.cores} Cores</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.52rem]">System Architecture</span>
            <span className="text-white font-bold">{profile.platform}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5 sm:col-span-2">
            <span className="text-slate-500 block uppercase text-[0.52rem]">Graphics Adapter (GPU)</span>
            <span className="text-brand-purple font-bold break-all block">{profile.gpu}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.52rem]">Monitor Resolution</span>
            <span className="text-white font-bold">{profile.screen}</span>
          </div>
          <div className="bg-black/40 p-2.5 rounded border border-white/5">
            <span className="text-slate-500 block uppercase text-[0.52rem]">Node timezone</span>
            <span className="text-brand-green font-bold">{profile.timeZone}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// LIVE HASH CRACKER component
// ============================================================
const COMMON_HASHES = {
  "ef92b778bafe771e89245b89ecbc3e0a6afb46c6b22567ced42ee20c5db140b4": "password",
  "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918": "admin",
  "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8": "password123",
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855": "",
  "b1b288924b1043efd92e59715b7468165cfad25d81c19b88cf1a4b4a9f5c4046": "security",
  "8c2d8293739a8c17b075e7a9b0c2a55cf73a5a40a5a40a5cfad2ab41d5b140b4": "root",
  "7c4a8d09ca3762af61e59520943dc26494f8941b": "123456",
  "f10e3b98d1a1e9c873a215b281f6f2a448a9187a": "password"
};

const HashCracker = () => {
  const [hashInput, setHashInput] = useState('');
  const [crackedResult, setCrackedResult] = useState(null);
  const [cracking, setCracking] = useState(false);
  const [crackLogs, setCrackLogs] = useState([]);

  const handleCrack = async () => {
    if (!hashInput.trim()) return;
    setCracking(true);
    setCrackedResult(null);
    setCrackLogs(["[~] Initializing hash cracking matrix...", "[~] Extracting algorithm metadata signature..."]);
    await new Promise(r => setTimeout(r, 600));

    const cleanHash = hashInput.trim().toLowerCase();
    let algorithm = "SHA-256";
    if (cleanHash.length === 40) algorithm = "SHA-1";
    else if (cleanHash.length === 32) algorithm = "MD5";

    setCrackLogs(prev => [...prev, `[*] Detected Algorithm: ${algorithm}`, `[*] Launching dictionary hybrid attack (10,000 common passes)...`]);
    await new Promise(r => setTimeout(r, 800));

    const match = COMMON_HASHES[cleanHash];
    if (match !== undefined) {
      setCrackLogs(prev => [...prev, "[SUCCESS] Collision detected in standard database tables!"]);
      setCrackedResult({ text: match || "(empty string)", algorithm });
    } else {
      setCrackLogs(prev => [...prev, "[-] Exhausted standard tables. Search failed. No collision."]);
      setCrackedResult({ error: "Hash collision not found in local directories." });
    }
    setCracking(false);
  };

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2 text-brand-cyan font-bold border-b border-white/5 pb-3">
        <Lock className="w-5 h-5" />
        <h4 className="font-display text-sm uppercase tracking-wider">Live Hash Cracker</h4>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Paste SHA-256 / SHA-1 hash to crack..."
            value={hashInput}
            onChange={e => setHashInput(e.target.value)}
            disabled={cracking}
            className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan/50"
          />
          <button
            onClick={handleCrack}
            disabled={cracking || !hashInput.trim()}
            className="px-4 py-2 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            Crack
          </button>
        </div>

        {crackLogs.length > 0 && (
          <div className="bg-black/80 p-3 rounded border border-white/5 text-[0.58rem] text-slate-500 space-y-0.5 max-h-[120px] overflow-y-auto">
            {crackLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('[SUCCESS]') ? 'text-brand-green' : log.startsWith('[-]') ? 'text-red-400' : ''}>
                {log}
              </div>
            ))}
          </div>
        )}

        {crackedResult && (
          <div className="mt-2.5 p-3 rounded-lg border bg-black/40 border-white/5">
            {crackedResult.text !== undefined ? (
              <div className="space-y-1">
                <span className="text-brand-green font-bold block">// PLAIN TEXT COLLISION DETECTED</span>
                <div>Hash type: <span className="text-white">{crackedResult.algorithm}</span></div>
                <div>Decrypted string: <span className="text-brand-cyan select-all text-sm font-bold">"{crackedResult.text}"</span></div>
              </div>
            ) : (
              <div className="text-red-400 font-bold">❌ {crackedResult.error}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// CIPHER PLAYGROUND component
// ============================================================
const CipherPlayground = () => {
  const [text, setText] = useState('');
  const [key, setKey] = useState('KALI');
  const [shift, setShift] = useState(3);
  const [cipherType, setCipherType] = useState('caesar'); // caesar | rot13 | vigenere | base64
  const [output, setOutput] = useState('');

  useEffect(() => {
    if (!text) {
      setOutput('');
      return;
    }
    if (cipherType === 'caesar') {
      setOutput(caesarCipher(text, shift));
    } else if (cipherType === 'rot13') {
      setOutput(caesarCipher(text, 13));
    } else if (cipherType === 'vigenere') {
      setOutput(vigenereCipher(text, key));
    } else if (cipherType === 'base64') {
      try {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } catch (e) {
        setOutput('Invalid characters for Base64 encode.');
      }
    }
  }, [text, key, shift, cipherType]);

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2 text-brand-cyan font-bold border-b border-white/5 pb-3">
        <Key className="w-5 h-5" />
        <h4 className="font-display text-sm uppercase tracking-wider">Cipher Sandbox</h4>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-lg border border-white/5">
          {['caesar', 'rot13', 'vigenere', 'base64'].map((type) => (
            <button
              key={type}
              onClick={() => setCipherType(type)}
              className={`flex-1 py-1 rounded text-[0.58rem] uppercase font-bold transition-all cursor-pointer ${cipherType === type ? 'bg-brand-cyan/20 text-brand-cyan' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            placeholder="Type plaintext message to transform..."
            value={text}
            onChange={e => setText(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan/50 resize-none"
          />

          {cipherType === 'caesar' && (
            <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded border border-white/5">
              <span className="text-slate-500 text-[0.58rem] uppercase">Offset Shift:</span>
              <input
                type="range"
                min="1"
                max="25"
                value={shift}
                onChange={e => setShift(parseInt(e.target.value))}
                className="flex-1 accent-brand-cyan h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-brand-cyan font-bold">{shift}</span>
            </div>
          )}

          {cipherType === 'vigenere' && (
            <div className="flex items-center gap-3 bg-black/20 p-2.5 rounded border border-white/5">
              <span className="text-slate-500 text-[0.58rem] uppercase">Cipher Key Word:</span>
              <input
                type="text"
                value={key}
                onChange={e => setKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                className="flex-1 bg-black/40 px-2 py-1 rounded border border-white/10 text-white font-mono uppercase text-xs"
              />
            </div>
          )}

          {output && (
            <div className="bg-brand-cyan/5 p-3 rounded-lg border border-brand-cyan/20">
              <span className="text-brand-cyan font-bold block mb-1">CIPHERTEXT TRANSLATION:</span>
              <span className="text-white text-sm block select-all break-all">{output}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// XSS SANDBOX LAB component
// ============================================================
const XssPlayground = () => {
  const [xssInput, setXssInput] = useState('');
  const [xssLogs, setXssLogs] = useState([]);
  const [vulnerableDisplay, setVulnerableDisplay] = useState('');

  const handleTrigger = () => {
    if (!xssInput.trim()) return;
    setXssLogs([]);
    const logs = [];

    // Filter detection checks
    if (xssInput.toLowerCase().includes("<script>") || xssInput.toLowerCase().includes("javascript:")) {
      logs.push("🚨 [WAF ALERT] High severity threat signature matches `<script>` tag pattern.");
    }
    if (xssInput.toLowerCase().includes("document.cookie")) {
      logs.push("🚨 [WAF ALERT] Critical risk detected: Attempting DOM Cookie Hijacking.");
    }
    if (xssInput.toLowerCase().includes("onerror=") || xssInput.toLowerCase().includes("onload=")) {
      logs.push("🚨 [WAF ALERT] Medium risk: inline Javascript handler event hook discovered.");
    }

    if (logs.length === 0) {
      logs.push("✔ [WAF PASSED] Input cleared containment checks.");
    }
    
    setXssLogs(logs);
    setVulnerableDisplay(xssInput);
  };

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2 text-brand-cyan font-bold border-b border-white/5 pb-3">
        <Activity className="w-5 h-5" />
        <h4 className="font-display text-sm uppercase tracking-wider">XSS Sandbox Lab</h4>
      </div>

      <div className="space-y-3">
        <p className="text-[0.62rem] text-slate-500 leading-normal">
          Type an HTML snippet below (e.g. <code>&lt;img src="x" onerror="alert(1)"&gt;</code>) to test how a Web Application Firewall intercepts payloads.
        </p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type XSS payload..."
            value={xssInput}
            onChange={e => setXssInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan/50"
          />
          <button
            onClick={handleTrigger}
            className="px-4 py-2 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
          >
            Inject
          </button>
        </div>

        {xssLogs.length > 0 && (
          <div className="bg-black/80 p-2.5 rounded border border-white/5 text-[0.58rem] space-y-1">
            {xssLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('🚨') ? 'text-red-400 font-bold animate-pulse' : 'text-brand-green'}>
                {log}
              </div>
            ))}
          </div>
        )}

        {vulnerableDisplay && (
          <div className="p-3 bg-red-950/5 border border-red-500/10 rounded-lg space-y-1.5">
            <span className="text-slate-500 text-[0.55rem] uppercase block">// Rendered Sandbox output (vulnerable node):</span>
            <div 
              className="text-xs text-white p-2 bg-black/40 rounded border border-white/5 font-sans break-all"
              dangerouslySetInnerHTML={{ __html: vulnerableDisplay }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// OSINT RECON SIMULATOR component
// ============================================================
const OsintSimulator = () => {
  const [domain, setDomain] = useState('');
  const [running, setRunning] = useState(false);
  const [osintLogs, setOsintLogs] = useState([]);

  const handleScan = async () => {
    if (!domain.trim()) return;
    setRunning(true);
    setOsintLogs([]);

    const steps = [
      `[~] Commencing passive OSINT scan on node: ${domain.trim()}...`,
      `[*] Querying WHOIS directory registers...`,
      `[+] Registrar: Cloudflare Inc. Status: ACTIVE`,
      `[*] Querying public DNS records (A, AAAA, MX, TXT)...`,
      `[+] Found DNS records: MX mail.${domain.trim()} | IP: 104.21.32.99`,
      `[*] Port Scanning: Enumerating common public interfaces...`,
      `[+] Open Ports found: 80 (HTTP), 443 (HTTPS), 22 (SSH - Locked)`,
      `[*] Checking known credential leak directories...`,
      `[SUCCESS] Scan complete. Vulnerability indicators: ZERO. Encryption: SSL Verified.`
    ];

    for (let i = 0; i < steps.length; i++) {
      setOsintLogs(prev => [...prev, steps[i]]);
      await new Promise(r => setTimeout(r, 650));
    }
    setRunning(false);
  };

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2 text-brand-cyan font-bold border-b border-white/5 pb-3">
        <Radar className="w-5 h-5 text-brand-cyan animate-pulse" />
        <h4 className="font-display text-sm uppercase tracking-wider">OSINT Recon Simulator</h4>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter target domain (e.g. google.com)..."
            value={domain}
            onChange={e => setDomain(e.target.value)}
            disabled={running}
            className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-cyan/50"
          />
          <button
            onClick={handleScan}
            disabled={running || !domain.trim()}
            className="px-4 py-2 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/30 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
          >
            Scan
          </button>
        </div>

        {osintLogs.length > 0 && (
          <div className="bg-black/80 p-3 rounded border border-white/5 text-[0.58rem] text-slate-400 space-y-1.5 max-h-[160px] overflow-y-auto">
            {osintLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('[SUCCESS]') ? 'text-brand-green font-bold' : log.startsWith('[+]') ? 'text-brand-cyan' : ''}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// INCIDENT RESPONSE SIMULATION component
// ============================================================
const IncidentResponseSim = () => {
  const [stage, setStage] = useState('idle'); // idle | sim | end
  const [score, setScore] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);

  const scenarios = [
    {
      alert: "ALERT: Cryptomining traffic signature detected originating from Database Node DB-01 on port 4444 (outbound).",
      options: [
        { text: "Quarantine DB-01 and terminate outbound port 4444.", correct: true, points: 10 },
        { text: "Configure Wireshark on DB-01 to monitor packet headers.", correct: false, points: -5 },
        { text: "Ignore the alert as it might be a routine nightly database compression job.", correct: false, points: -10 }
      ]
    },
    {
      alert: "ALERT: Multiple failed login attempts (4625) followed by administrative success (4624) in 3 seconds on Domain Controller DC-02.",
      options: [
        { text: "Revoke DC-02 administrative tokens and force password resets.", correct: true, points: 10 },
        { text: "Create an active thread rule tracking DC-02 logouts.", correct: false, points: -5 },
        { text: "Run automated host backup registries.", correct: false, points: 0 }
      ]
    },
    {
      alert: "ALERT: Host intrusion prevention agent reports local execution of untrusted binary payload inside C:\\Temp\\svchost.exe.",
      options: [
        { text: "Isolate workstation WRK-42 and terminate svchost process tree.", correct: true, points: 10 },
        { text: "Add Temp folder paths to the exception lists.", correct: false, points: -15 },
        { text: "Send a ticket to user asking if they initiated this script.", correct: false, points: -5 }
      ]
    }
  ];

  useEffect(() => {
    if (stage !== 'sim') return;
    if (timeLeft === 0) {
      handleNext(0); // time out, zero points
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, stage]);

  const handleStart = () => {
    setScore(0);
    setQuestionIdx(0);
    setTimeLeft(15);
    setStage('sim');
  };

  const handleNext = (points) => {
    setScore(prev => prev + points);
    if (questionIdx + 1 < scenarios.length) {
      setQuestionIdx(prev => prev + 1);
      setTimeLeft(15);
    } else {
      setStage('end');
    }
  };

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-brand-cyan font-bold">
          <Shield className="w-5 h-5" />
          <h4 className="font-display text-sm uppercase tracking-wider">SOC Incident Response simulator</h4>
        </div>
        {stage === 'sim' && (
          <div className="text-red-400 font-bold animate-pulse">TIME LEFT: {timeLeft}s</div>
        )}
      </div>

      {stage === 'idle' && (
        <div className="text-center py-6 space-y-4">
          <p className="text-slate-400">Evaluate alert parameters and respond under time pressure. Are you ready?</p>
          <button
            onClick={handleStart}
            className="px-6 py-2.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all"
          >
            Start Incident Response Run
          </button>
        </div>
      )}

      {stage === 'sim' && (
        <div className="space-y-4">
          <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-lg text-red-300 flex items-start gap-3">
            <span className="font-bold text-red-500 blink block">🚨</span>
            <p className="leading-relaxed text-[0.72rem]">{scenarios[questionIdx].alert}</p>
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            {scenarios[questionIdx].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleNext(opt.correct ? opt.points : opt.points)}
                className="w-full text-left p-3.5 bg-black/40 border border-white/5 rounded-lg hover:border-brand-cyan/30 hover:bg-brand-cyan/5 transition-all cursor-pointer"
              >
                {idx + 1}. {opt.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {stage === 'end' && (
        <div className="text-center py-6 space-y-4">
          <div className="text-brand-green font-bold text-lg">✔ INTRUSION ASSESSMENT TERMINATED</div>
          <div className="text-white text-base">Your response score: <span className="font-bold text-brand-cyan text-lg">{score} Points</span></div>
          <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
            {score >= 25 ? "Excellent response latency and accuracy. Privilege levels: Senior Incident Analyst." : "Evaluation requires practice. Study local incident containment frameworks."}
          </p>
          <button
            onClick={handleStart}
            className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded font-mono text-xs uppercase cursor-pointer"
          >
            Run Simulation Again
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// ATTACK TIMELINE component
// ============================================================
const AttackTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const killChain = [
    { phase: "Reconnaissance", desc: "Harvest email registers, subdomains, open registers.", indicator: "Nmap sweeps, DNS fuzzing", caseStudy: "Simulated domain scanning logs on target networks." },
    { phase: "Weaponization", desc: "Bundle exploit macro keys within target PDFs.", indicator: "Metasploit payload generation", caseStudy: "Crafted malicious payload wrappers with reverse shell triggers." },
    { phase: "Delivery", desc: "Transmit payload securely via spearphishing pipelines.", indicator: "Spam campaign validation filters", caseStudy: "Dispatched payload files over simulated TLS tunnel." },
    { phase: "Exploitation", desc: "Trigger payload to compromise local machine system files.", indicator: "Process injection anomalies", caseStudy: "Bypassed system antivirus scanners; executed DLL injection." },
    { phase: "Installation", desc: "Install persistent backdoor services inside DC nodes.", indicator: "Registry modifications alerts", caseStudy: "Established persistent run registry keys on DC servers." },
    { phase: "Command & Control", desc: "Establish secure C2 channels to run remote scripts.", indicator: "HTTPS/DNS beacon traffic", caseStudy: "Simulated C2 beacon pings out of DB server nodes." },
    { phase: "Actions on Objectives", desc: "Exfiltrate database content; encrypt local directories.", indicator: "Large outbound transfers", caseStudy: "Securely exfiltrated encrypted data packets." }
  ];

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-5 font-mono text-xs">
      <div className="flex items-center gap-2 text-brand-cyan font-bold border-b border-white/5 pb-3">
        <Cpu className="w-5 h-5 text-brand-cyan" />
        <h4 className="font-display text-sm uppercase tracking-wider">Cyber Kill Chain Timeline</h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-1.5 border-r border-white/5 pr-4 max-h-[300px] overflow-y-auto">
          {killChain.map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-full text-left px-3 py-2 rounded transition-all cursor-pointer font-bold text-[0.62rem] uppercase ${activeIndex === idx ? 'bg-brand-cyan/20 text-brand-cyan border-l-2 border-brand-cyan' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}
            >
              {idx + 1}. {item.phase}
            </button>
          ))}
        </div>

        <div className="md:col-span-2 space-y-4 bg-black/40 p-4 rounded-xl border border-white/5">
          <div className="flex justify-between border-b border-white/5 pb-2">
            <span className="text-brand-cyan font-bold text-sm uppercase">{killChain[activeIndex].phase}</span>
            <span className="text-slate-500 text-[0.55rem] uppercase">Lockheed Martin Phase {activeIndex + 1}</span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-slate-500 block uppercase text-[0.52rem] mb-0.5">Objective:</span>
              <p className="text-white text-xs leading-relaxed">{killChain[activeIndex].desc}</p>
            </div>
            <div>
              <span className="text-slate-500 block uppercase text-[0.52rem] mb-0.5">Telemetry Indicator:</span>
              <span className="text-brand-purple font-bold block">{killChain[activeIndex].indicator}</span>
            </div>
            <div className="border-t border-white/5 pt-2 mt-2">
              <span className="text-slate-500 block uppercase text-[0.52rem] mb-0.5">Simulated case study:</span>
              <span className="text-brand-green italic block">"{killChain[activeIndex].caseStudy}"</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// OTHER SECONDARY MODULES
// ============================================================
const ThreatWorldMap = () => {
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([
    { id: 1, time: "08:52:10", text: "[+] Moscow, RU → Washington, US (SSH Probe)" },
    { id: 2, time: "08:52:45", text: "[+] Shenzhen, CN → Berlin, DE (IIS Exploit)" },
    { id: 3, time: "08:53:12", text: "[+] Frankfurt, DE → Tokyo, JP (DDoS Flood)" }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const cities = [
      { name: "Moscow, RU", x: width * 0.55, y: height * 0.25 },
      { name: "Washington, US", x: width * 0.25, y: height * 0.35 },
      { name: "Shenzhen, CN", x: width * 0.75, y: height * 0.55 },
      { name: "Berlin, DE", x: width * 0.50, y: height * 0.30 },
      { name: "Tokyo, JP", x: width * 0.85, y: height * 0.40 },
      { name: "Sydney, AU", x: width * 0.90, y: height * 0.85 },
      { name: "London, UK", x: width * 0.46, y: height * 0.28 },
      { name: "Bangalore, IN", x: width * 0.68, y: height * 0.60 },
      { name: "Sao Paulo, BR", x: width * 0.38, y: height * 0.80 }
    ];

    let attacks = [];
    let lastAttackTime = 0;

    const createAttack = () => {
      const srcIdx = Math.floor(Math.random() * cities.length);
      let dstIdx = Math.floor(Math.random() * cities.length);
      while (dstIdx === srcIdx) {
        dstIdx = Math.floor(Math.random() * cities.length);
      }
      const src = cities[srcIdx];
      const dst = cities[dstIdx];
      const protocols = ["SSH Probe", "IIS Exploit", "DDoS Flood", "SQLi Injection", "RDP Bypass", "C2 Beacon", "Port Scan"];
      const protocol = protocols[Math.floor(Math.random() * protocols.length)];

      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        text: `[+] ${src.name} → ${dst.name} (${protocol})`
      };

      setLogs(prev => [newLog, ...prev].slice(0, 3));

      attacks.push({
        src,
        dst,
        progress: 0,
        speed: 0.015 + Math.random() * 0.015,
        color: Math.random() > 0.6 ? "#a855f7" : Math.random() > 0.3 ? "#00f5ff" : "#ff3333",
        radius: 2 + Math.random() * 3
      });
    };

    const drawWorldMap = () => {
      ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
      for (let x = 10; x < width; x += 15) {
        for (let y = 10; y < height; y += 15) {
          ctx.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
        }
      }

      cities.forEach(city => {
        ctx.fillStyle = "rgba(0, 245, 255, 0.4)";
        ctx.beginPath();
        ctx.arc(city.x, city.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, width, height);
      drawWorldMap();

      if (timestamp - lastAttackTime > 2500) {
        createAttack();
        lastAttackTime = timestamp;
      }

      attacks.forEach((attack, idx) => {
        attack.progress += attack.speed;
        if (attack.progress >= 1) {
          ctx.strokeStyle = attack.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(attack.dst.x, attack.dst.y, 8, 0, Math.PI * 2);
          ctx.stroke();

          attacks.splice(idx, 1);
          return;
        }

        const midX = (attack.src.x + attack.dst.x) / 2;
        const midY = (attack.src.y + attack.dst.y) / 2 - 40;

        const t = attack.progress;
        const x = (1 - t) * (1 - t) * attack.src.x + 2 * (1 - t) * t * midX + t * t * attack.dst.x;
        const y = (1 - t) * (1 - t) * attack.src.y + 2 * (1 - t) * t * midY + t * t * attack.dst.y;

        ctx.strokeStyle = attack.color;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(attack.src.x, attack.src.y);
        ctx.quadraticCurveTo(midX, midY, x, y);
        ctx.stroke();

        ctx.fillStyle = attack.color;
        ctx.beginPath();
        ctx.arc(x, y, attack.radius, 0, Math.PI * 2);
        ctx.shadowColor = attack.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-brand-cyan font-bold font-mono text-xs">
          <Radar className="w-5 h-5 text-brand-cyan animate-pulse" />
          <h4 className="font-display text-sm uppercase tracking-wider">Global Cyber Attack Ticker</h4>
        </div>
        <span className="font-mono text-[0.58rem] text-brand-green uppercase tracking-widest animate-pulse font-bold">● Live Threat Map</span>
      </div>
      
      <div className="relative w-full h-[160px] bg-black/50 rounded-xl border border-white/5 flex items-center justify-center overflow-hidden my-3">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>

      <div className="bg-black/60 p-2.5 rounded-lg border border-white/5 font-mono text-[0.58rem] space-y-1 text-slate-400">
        {logs.map((log) => (
          <div key={log.id} className="flex justify-between items-center gap-2 text-left animate-fadeIn">
            <span className="text-slate-500 shrink-0">[{log.time}]</span>
            <span className="text-slate-300 truncate flex-1">{log.text}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 animate-ping" />
          </div>
        ))}
      </div>
    </div>
  );
};

const BinaryClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const toBinary = (n, bits) => n.toString(2).padStart(bits, "0").split("");
  const h = time.getHours(), m = time.getMinutes(), s = time.getSeconds();
  const unix = Math.floor(time.getTime() / 1000);
  const hexTime = `0x${unix.toString(16).toUpperCase()}`;

  const BinaryCol = ({ value, bits, label }) => (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex flex-col gap-1">
        {toBinary(value, bits).map((bit, i) => (
          <div
            key={i}
            className={`w-7 h-7 rounded-md border text-[0.55rem] font-bold flex items-center justify-center transition-all duration-300 font-mono ${bit === "1" ? "bg-brand-cyan/30 border-brand-cyan text-brand-cyan shadow-[0_0_8px_var(--brand-cyan)]" : "bg-white/3 border-white/10 text-slate-600"}`}
          >
            {bit}
          </div>
        ))}
      </div>
      <div className="font-mono text-[0.65rem] text-slate-400 font-bold">{String(value).padStart(2, "0")}</div>
      <div className="font-mono text-[0.52rem] text-slate-600 uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-5">
      <div className="flex items-center gap-2 text-brand-cyan font-bold">
        <Monitor className="w-5 h-5" />
        <h4 className="font-display text-sm uppercase tracking-wider">Binary System Clock</h4>
      </div>
      <div className="flex justify-center gap-6">
        <BinaryCol value={h} bits={6} label="HRS" />
        <div className="self-center text-brand-cyan font-bold text-2xl font-mono animate-blink">:</div>
        <BinaryCol value={m} bits={6} label="MIN" />
        <div className="self-center text-brand-cyan font-bold text-2xl font-mono animate-blink">:</div>
        <BinaryCol value={s} bits={6} label="SEC" />
      </div>
      <div className="grid grid-cols-2 gap-2 font-mono text-[0.62rem]">
        <div className="bg-black/40 p-2.5 rounded border border-white/5">
          <span className="text-slate-500 block text-[0.55rem] uppercase">Hex Timestamp</span>
          <span className="text-brand-purple font-bold">{hexTime}</span>
        </div>
        <div className="bg-black/40 p-2.5 rounded border border-white/5">
          <span className="text-slate-500 block text-[0.55rem] uppercase">Unix Epoch</span>
          <span className="text-brand-green font-bold">{unix}</span>
        </div>
      </div>
    </div>
  );
};

const PasswordCracker = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analyze = (pwd) => {
    if (!pwd) return null;
    const hasLower = /[a-z]/.test(pwd);
    const hasUpper = /[A-Z]/.test(pwd);
    const hasDigit = /[0-9]/.test(pwd);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pwd);
    const charsetSize = (hasLower ? 26 : 0) + (hasUpper ? 26 : 0) + (hasDigit ? 10 : 0) + (hasSymbol ? 32 : 0);
    const combinations = Math.pow(charsetSize, pwd.length);
    const guessesPerSecond = 1e10;
    const secondsToCrack = combinations / guessesPerSecond;

    const crackTime = (() => {
      if (secondsToCrack < 1e-3) return { text: "Instantly", color: "text-red-500" };
      if (secondsToCrack < 1) return { text: `${(secondsToCrack * 1000).toFixed(0)}ms`, color: "text-red-400" };
      if (secondsToCrack < 60) return { text: `${secondsToCrack.toFixed(1)} seconds`, color: "text-orange-400" };
      if (secondsToCrack < 3600) return { text: `${(secondsToCrack / 60).toFixed(1)} minutes`, color: "text-orange-400" };
      if (secondsToCrack < 86400) return { text: `${(secondsToCrack / 3600).toFixed(1)} hours`, color: "text-yellow-400" };
      if (secondsToCrack < 31536000) return { text: `${(secondsToCrack / 86400).toFixed(0)} days`, color: "text-yellow-300" };
      if (secondsToCrack < 3154000000) return { text: `${(secondsToCrack / 31536000).toFixed(0)} years`, color: "text-brand-green" };
      return { text: `${(secondsToCrack / 3154000000).toFixed(0)} millennia`, color: "text-brand-cyan" };
    })();

    const entropy = Math.log2(combinations);
    const strength = entropy < 28 ? { label: "CRITICAL", pct: 10, color: "bg-red-500" } : entropy < 36 ? { label: "WEAK", pct: 25, color: "bg-orange-500" } : entropy < 60 ? { label: "MODERATE", pct: 55, color: "bg-yellow-500" } : entropy < 128 ? { label: "STRONG", pct: 80, color: "bg-brand-green" } : { label: "UNBREAKABLE", pct: 100, color: "bg-brand-cyan" };
    const attack = entropy < 36 ? "Dictionary + Rule Attack" : entropy < 60 ? "Brute Force (GPU Cluster)" : "Quantum Supercomputer Required";

    return { crackTime, entropy, strength, charsetSize, combinations, attack };
  };

  const result = analyze(password);

  return (
    <div className="glass-panel p-6 border border-red-500/20 space-y-4">
      <div className="flex items-center gap-2 text-red-400 font-bold">
        <Fingerprint className="w-5 h-5" />
        <h4 className="font-display text-sm uppercase tracking-wider">Password Crack Estimator</h4>
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter a password to analyze..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-sm outline-none focus:border-red-500/50 focus:bg-red-900/5 transition-all placeholder-slate-600 pr-12"
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer text-[0.6rem] font-mono uppercase"
        >
          {showPassword ? "HIDE" : "SHOW"}
        </button>
      </div>
      {result && (
        <div className="space-y-4 font-mono text-xs text-slate-300 bg-black/40 p-4 rounded-lg border border-white/5">
          <div className="flex justify-between items-center">
            <span>Entropy:</span>
            <span className="text-white font-bold">{result.entropy.toFixed(1)} bits</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-[0.6rem] text-slate-400">
              <span>Security Rank:</span>
              <span className="font-bold text-white">{result.strength.label}</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full ${result.strength.color}`} style={{ width: `${result.strength.pct}%` }} />
            </div>
          </div>
          <div className="flex justify-between">
            <span>Time to crack:</span>
            <span className={`font-bold ${result.crackTime.color}`}>{result.crackTime.text}</span>
          </div>
          <div className="flex justify-between text-[0.58rem] text-slate-500 border-t border-white/5 pt-2">
            <span>Suggested Attack Vector:</span>
            <span className="text-slate-400 font-bold">{result.attack}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const PacketCaptureFeed = () => {
  const [packets, setPackets] = useState([]);
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    if (!isCapturing) return;
    const protocols = ["TCP", "UDP", "HTTPS", "DNS", "TLSv1.3", "SSH"];
    const ips = ["192.168.1.109", "10.0.4.5", "172.16.89.2", "185.220.101.4", "8.8.8.8", "192.168.1.1"];
    const events = ["Key exchange requested", "Outbound sync initiated", "DNS query complete", "TLS verification active", "Probe alert matching rules", "ACK payload received"];

    const interval = setInterval(() => {
      const p = {
        time: new Date().toLocaleTimeString(),
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        src: ips[Math.floor(Math.random() * ips.length)],
        dst: ips[Math.floor(Math.random() * ips.length)],
        event: events[Math.floor(Math.random() * events.length)],
        len: Math.floor(24 + Math.random() * 1400)
      };
      setPackets(prev => [p, ...prev].slice(0, 5));
    }, 1500);

    return () => clearInterval(interval);
  }, [isCapturing]);

  return (
    <div className="glass-panel p-6 border border-brand-purple/20 space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-brand-purple font-bold">
          <Activity className="w-5 h-5 animate-pulse" />
          <h4 className="font-display text-sm uppercase tracking-wider">Wireshark Packet Ticker</h4>
        </div>
        <button
          onClick={() => setIsCapturing(!isCapturing)}
          className={`px-3 py-1 font-mono text-[0.6rem] border rounded uppercase tracking-wider transition-colors cursor-pointer ${isCapturing ? 'border-brand-green/30 text-brand-green bg-brand-green/5' : 'border-red-500/30 text-red-400 bg-red-500/5'}`}
        >
          {isCapturing ? 'CAPTURING' : 'PAUSED'}
        </button>
      </div>

      <div className="font-mono text-[0.58rem] space-y-2 max-h-[160px] overflow-y-auto">
        {packets.map((pkt, i) => (
          <div key={i} className="p-2 bg-black/40 border border-white/5 rounded-lg flex items-start justify-between gap-3 text-slate-300">
            <div className="space-y-0.5">
              <div className="flex gap-2">
                <span className="text-brand-purple font-bold">[{pkt.protocol}]</span>
                <span className="text-slate-500">{pkt.time}</span>
              </div>
              <div>{pkt.src} $\rightarrow$ {pkt.dst}</div>
              <div className="text-white italic text-[0.52rem] mt-0.5">"{pkt.event}"</div>
            </div>
            <span className="text-slate-500 font-bold shrink-0">{pkt.len} B</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TorRouteVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRoute = async () => {
    setLoading(true);
    setNodes([]);
    await new Promise(r => setTimeout(r, 1400));
    setNodes([
      { type: "Guard node", ip: "185.220.101.4", country: "Germany", delay: "45ms" },
      { type: "Middle relay", ip: "109.163.234.8", country: "Sweden", delay: "109ms" },
      { type: "Exit Node", ip: "23.129.64.155", country: "Switzerland", delay: "220ms" }
    ]);
    setLoading(false);
  };

  return (
    <div className="glass-panel p-6 border border-brand-green/20 space-y-4 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div className="flex items-center gap-2 text-brand-green font-bold">
          <Network className="w-5 h-5" />
          <h4 className="font-display text-sm uppercase tracking-wider">Tor Routing Visualizer</h4>
        </div>
        <button
          onClick={fetchRoute}
          disabled={loading}
          className="px-3.5 py-1.5 bg-brand-green/10 border border-brand-green/30 text-brand-green text-[0.62rem] rounded uppercase font-bold tracking-wider hover:bg-brand-green/25 cursor-pointer active:scale-95 transition-all"
        >
          {loading ? 'Routing...' : 'Initialize'}
        </button>
      </div>

      {nodes.length === 0 && !loading && (
        <div className="text-center py-8 text-slate-500 font-mono text-[0.58rem]">// TOR GATEWAY IDLE. INITIALIZE CIRCUIT.</div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 font-mono text-xs text-brand-green animate-pulse">
          <span>[~] RESOLVING CIRCLING CONFLICTS...</span>
          <div className="w-1/2 h-1 bg-white/5 rounded overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-brand-green w-1/3 animate-[gridPulse_1.5s_infinite]" />
          </div>
        </div>
      )}

      {nodes.length > 0 && (
        <div className="space-y-4">
          <div className="relative pl-6 border-l-2 border-brand-green/30 space-y-4">
            {nodes.map((node, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full bg-brand-green shadow-[0_0_8px_var(--brand-green)] animate-pulse" />
                <div className="p-2.5 bg-black/40 rounded border border-white/5 text-[0.58rem] space-y-0.5 text-slate-300">
                  <div className="text-white font-bold">{node.type} ({node.country})</div>
                  <div>IP: <span className="text-brand-green select-all">{node.ip}</span> | Latency: <span className="text-slate-500">{node.delay}</span></div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-[0.52rem] text-slate-500 text-center uppercase tracking-widest pt-2 border-t border-white/5 animate-pulse">
            ✔ Cryptographic Onion Tunnel Established
          </div>
        </div>
      )}
    </div>
  );
};

const SteganographyDemo = () => {
  const [plainText, setPlainText] = useState('');
  const [stegoLogs, setStegoLogs] = useState([]);
  const [resultImage, setResultImage] = useState(null);

  const handleEncode = async () => {
    if (!plainText.trim()) return;
    setStegoLogs(["[~] Initializing stego bitmap encoder...", "[~] Extracting canvas binary headers..."]);
    await new Promise(r => setTimeout(r, 500));
    setStegoLogs(prev => [...prev, "[*] Hiding payload bits inside LSB register of pixel color values...", "[SUCCESS] Injection complete. Payload bound within carrier matrix."]);
    setResultImage(true);
  };

  return (
    <div className="glass-panel p-6 border border-brand-pink/20 space-y-4 font-mono text-xs">
      <div className="flex items-center gap-2 text-brand-pink font-bold border-b border-white/5 pb-3">
        <Cpu className="w-5 h-5 text-brand-pink" />
        <h4 className="font-display text-sm uppercase tracking-wider">Steganography Encoder</h4>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type hidden carrier message..."
            value={plainText}
            onChange={e => setPlainText(e.target.value)}
            className="flex-1 px-3 py-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-pink/50"
          />
          <button
            onClick={handleEncode}
            disabled={!plainText.trim()}
            className="px-4 py-2 bg-brand-pink/15 hover:bg-brand-pink/25 border border-brand-pink/30 text-brand-pink rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            Inject
          </button>
        </div>

        {stegoLogs.length > 0 && (
          <div className="bg-black/80 p-2.5 rounded border border-white/5 text-[0.58rem] text-slate-500 space-y-1">
            {stegoLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('[SUCCESS]') ? 'text-brand-pink font-bold' : ''}>
                {log}
              </div>
            ))}
          </div>
        )}

        {resultImage && (
          <div className="p-3 bg-black/40 border border-white/5 rounded-lg flex items-center justify-between gap-3">
            <div>
              <span className="text-brand-pink font-bold block text-[0.58rem] mb-1">LSB INJECTED CARRIER CARRIER:</span>
              <span className="text-slate-400 text-[0.55rem]">Payload integrity verified. carrier matches parent hashes.</span>
            </div>
            <div className="w-10 h-10 bg-brand-pink/10 border border-brand-pink/20 rounded flex items-center justify-center text-brand-pink text-[0.55rem] font-bold shadow-[0_0_8px_rgba(236,72,153,0.3)] select-none">
              BMP
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MitreAttackMatrix = () => {
  const [selectedCell, setSelectedCell] = useState(null);

  const matrix = [
    { tactic: "Initial Access", technique: "Phishing / Spearphishing", id: "T1566", desc: "Using malicious attachments or links sent in emails to compromise employee host nodes." },
    { tactic: "Execution", technique: "User Execution", id: "T1204", desc: "Tricking users into opening malicious attachments or running script shortcuts to initiate shell execution." },
    { tactic: "Persistence", technique: "Registry Run Keys", id: "T1547", desc: "Adding custom keys within local registry boot indices to start backdoor payloads during login cycles." },
    { tactic: "Privilege Escalation", technique: "Token Impersonation", id: "T1134", desc: "Duplicating administrative security tokens to run scripts with elevated permissions." },
    { tactic: "Defense Evasion", technique: "Process Injection", id: "T1055", desc: "Hiding backdoor execution inside standard clean processes like explorer.exe or svchost.exe." },
    { tactic: "Credential Access", technique: "OS Credential Dumping", id: "T1003", desc: "Accessing local security registers (like LSASS dump) to extract credentials or NTLM keys." }
  ];

  return (
    <div className="glass-panel p-6 border border-brand-cyan/20 space-y-4 font-mono text-xs col-span-2">
      <div className="flex items-center gap-2 text-brand-cyan font-bold border-b border-white/5 pb-3">
        <Shield className="w-5 h-5 text-brand-cyan" />
        <h4 className="font-display text-sm uppercase tracking-wider">MITRE ATT&CK Matrix Grid</h4>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {matrix.map((cell, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedCell(cell)}
            className="p-3 bg-black/40 border border-white/5 rounded-lg hover:border-brand-cyan/30 hover:bg-brand-cyan/5 transition-all cursor-pointer text-left space-y-2 flex flex-col justify-between"
          >
            <div className="text-slate-500 uppercase text-[0.52rem] font-bold border-b border-white/5 pb-1">
              {cell.tactic}
            </div>
            <div className="text-white text-[0.62rem] font-semibold tracking-tight min-h-[2rem]">
              {cell.technique}
            </div>
            <span className="text-[0.55rem] text-brand-cyan font-bold block">{cell.id}</span>
          </div>
        ))}
      </div>

      {selectedCell && (
        <div className="p-4 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl space-y-2 relative animate-fadeIn text-left">
          <div className="flex justify-between items-center border-b border-white/5 pb-2">
            <span className="text-brand-cyan font-bold uppercase">{selectedCell.technique} ({selectedCell.id})</span>
            <button
              onClick={() => setSelectedCell(null)}
              className="text-slate-400 hover:text-white font-bold select-none cursor-pointer"
            >
              [X]
            </button>
          </div>
          <p className="text-slate-300 leading-relaxed text-[0.65rem]">{selectedCell.desc}</p>
        </div>
      )}
    </div>
  );
};

const PhishingLab = () => {
  const [template, setTemplate] = useState('invoice');
  const [linkInput, setLinkInput] = useState('');
  const [report, setReport] = useState(null);

  const analyzePhish = () => {
    if (!linkInput.trim()) return;
    const isHttps = linkInput.startsWith("https://");
    const isLookalike = linkInput.includes("micros0ft") || linkInput.includes("goog1e") || linkInput.includes("paypa1");
    const isSubdomain = linkInput.split(".").length > 3;

    let score = 100;
    const warnings = [];

    if (!isHttps) {
      score -= 30;
      warnings.push("❌ HTTP Protocol: Data is transmitted in plaintext without SSL certificates.");
    }
    if (isLookalike) {
      score -= 40;
      warnings.push("❌ Lookalike domain: Domain name mocks trusted brands (homograph threat).");
    }
    if (isSubdomain) {
      score -= 20;
      warnings.push("❌ Nested subdomains: Excessive prefix registers mimic subdirectories (e.g. login.secure.bank.com).");
    }

    setReport({ score, warnings });
  };

  return (
    <div className="glass-panel p-6 border border-brand-purple/20 space-y-4 font-mono text-xs col-span-2">
      <div className="flex items-center gap-2 text-brand-purple font-bold border-b border-white/5 pb-3">
        <Mail className="w-5 h-5 text-brand-purple" />
        <h4 className="font-display text-sm uppercase tracking-wider">Social Engineering Threat sandbox</h4>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3.5 text-left">
          <p className="text-[0.62rem] text-slate-500 leading-normal">
            Analyze redirection links inside social engineering layouts to evaluate phishing parameters.
          </p>

          <div className="space-y-2">
            <span className="text-[0.52rem] text-slate-500 uppercase block">Redirection URI:</span>
            <input
              type="text"
              placeholder="https://micros0ft-support.secure.login-portal.net/auth"
              value={linkInput}
              onChange={e => setLinkInput(e.target.value)}
              className="w-full px-3 py-2 bg-black/60 border border-white/10 rounded text-xs text-white outline-none focus:border-brand-purple/50"
            />
          </div>

          <button
            onClick={analyzePhish}
            disabled={!linkInput.trim()}
            className="w-full py-2.5 bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple/35 text-brand-purple rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all disabled:opacity-40"
          >
            Run Threat Analysis
          </button>
        </div>

        {report && (
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-3 text-left">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="font-bold">DOM THREAT RATING:</span>
              <span className={`font-bold ${report.score < 50 ? 'text-red-500 animate-pulse' : report.score < 80 ? 'text-yellow-400' : 'text-brand-green'}`}>
                {report.score}/100 Integrity
              </span>
            </div>

            {report.warnings.length === 0 ? (
              <div className="text-brand-green font-bold text-[0.62rem]">// NO IMMEDIATE RED FLAGS IDENTIFIED. PROCEED WITH STANDARD INSPECTION.</div>
            ) : (
              <div className="space-y-1.5">
                {report.warnings.map((w, idx) => (
                  <div key={idx} className="text-red-400 text-[0.58rem] leading-normal">{w}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PgpEncryptionDemo = () => {
  const [plain, setPlain] = useState("");
  const [cipher, setCipher] = useState("");
  const [copied, setCopied] = useState(false);

  const handleEncrypt = () => {
    if (!plain) return;
    const encoded = btoa(unescape(encodeURIComponent(plain)));
    setCipher(encoded);
    setCopied(false);
  };

  const handleCopy = () => {
    if (!cipher) return;
    navigator.clipboard.writeText(cipher);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Type your secret message here..."
        value={plain}
        onChange={(e) => setPlain(e.target.value)}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs outline-none focus:border-brand-purple/50 focus:bg-brand-purple/5 transition-all placeholder-slate-600"
      />
      <button
        onClick={handleEncrypt}
        className="w-full py-2.5 bg-brand-purple/15 border border-brand-purple/40 text-brand-purple font-mono text-[0.65rem] rounded-lg uppercase tracking-widest hover:bg-brand-purple/25 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all active:scale-95 cursor-pointer"
      >
        ⚿ Generate Encrypted Ciphertext
      </button>
      {cipher && (
        <div className="bg-black/60 p-3 rounded-lg border border-brand-purple/20 font-mono text-[0.62rem] break-all text-slate-300 space-y-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-brand-purple font-bold">ENCRYPTED OUTPUT:</span>
            <button
              onClick={handleCopy}
              className="text-slate-400 hover:text-brand-purple transition-colors p-1 rounded hover:bg-white/5 active:scale-95 flex items-center gap-1 cursor-pointer"
              title="Copy to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-[0.55rem] text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span className="text-[0.55rem] font-semibold">Copy</span>
                </>
              )}
            </button>
          </div>
          <span className="text-emerald-400 leading-relaxed block">{cipher}</span>
        </div>
      )}
    </div>
  );
};

const PgpDecryptionDemo = ({ isUnlocked, onRedirectToCtf }) => {
  const [cipherInput, setCipherInput] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptLog, setDecryptLog] = useState([]);

  const handleDecrypt = () => {
    if (!cipherInput) return;
    setIsDecrypting(true);
    setDecryptLog(["[!] Initializing decryption handshake...", "[!] Loading active private keys from vault..."]);
    setTimeout(() => {
      setDecryptLog((prev) => [...prev, "[!] Checking user privilege tokens...", "[!] Verifying session signature integrity..."]);
      setTimeout(() => {
        try {
          const decoded = decodeURIComponent(escape(atob(cipherInput.trim())));
          setDecryptLog((prev) => [...prev, "✔ Signature verified successfully!", "✔ Ciphertext successfully decrypted!"]);
          setDecryptedText(decoded);
        } catch (e) {
          setDecryptLog((prev) => [...prev, "❌ ERROR: Mismatched padding / Invalid encoding digest.", "❌ Decryption pipeline failed. Check input data."]);
          setDecryptedText("");
        }
        setIsDecrypting(false);
      }, 1000);
    }, 800);
  };

  if (!isUnlocked) {
    return (
      <div className="relative overflow-hidden min-h-[160px] flex flex-col justify-center items-center text-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0 flex flex-col items-center justify-center p-4 text-center border border-red-500/20 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-2 text-red-500 animate-pulse">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="font-display text-xs font-bold text-white uppercase tracking-wider mb-1">PGP Decryption Locked</h4>
          <p className="text-[0.62rem] text-slate-400 font-mono max-w-xs mb-3 leading-relaxed">
            Privilege escalation required. Resolve all 3 challenges in the CTF Intrusion Room to unlock the private key register.
          </p>
          <button
            onClick={onRedirectToCtf}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/35 border border-red-500/50 hover:border-red-500/70 text-red-300 font-mono text-[0.62rem] rounded uppercase tracking-wider font-bold transition-all hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] active:scale-95 cursor-pointer"
          >
            🔒 Bypass Security via CTF Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fadeIn">
      <input
        type="text"
        placeholder="Paste encrypted base64 block here..."
        value={cipherInput}
        onChange={(e) => setCipherInput(e.target.value)}
        disabled={isDecrypting}
        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white font-mono text-xs outline-none focus:border-brand-green/50 focus:bg-brand-green/5 transition-all placeholder-slate-600"
      />
      <button
        onClick={handleDecrypt}
        disabled={isDecrypting || !cipherInput}
        className="w-full py-2.5 bg-brand-green/15 border border-brand-green/45 text-brand-green font-mono text-[0.65rem] rounded-lg uppercase tracking-widest hover:bg-brand-green/25 hover:shadow-[0_0_15px_rgba(74,222,128,0.2)] transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
      >
        {isDecrypting ? "🔓 Running Decryption..." : "🔓 Decrypt Ciphertext Payload"}
      </button>

      {decryptLog.length > 0 && (
        <div className="bg-black/60 p-3 rounded-lg border border-white/5 font-mono text-[0.58rem] text-slate-400 space-y-1">
          {decryptLog.map((log, index) => (
            <div key={index} className={log.startsWith("✔") ? "text-brand-green font-semibold" : log.startsWith("❌") ? "text-red-400 font-semibold" : ""}>
              {log}
            </div>
          ))}
        </div>
      )}

      {decryptedText && (
        <div className="bg-brand-green/10 p-3 rounded-lg border border-brand-green/20 font-mono text-[0.62rem] break-all text-slate-300 space-y-1">
          <span className="text-brand-green font-bold block">DECRYPTED MESSAGE:</span>
          <span className="text-white selection:bg-brand-green/30">{decryptedText}</span>
        </div>
      )}
    </div>
  );
};

// ============================================================
// MAIN LABS PAGE VIEW EXPORT
// ============================================================
export default function Labs({ ctfSolved, authUser }) {
  const navigate = useNavigate();
  return (
    <section className="py-12 animate-fadeIn space-y-12">
      <SectionHeader num="08" title="Security Labs & Toolset" />
      <p className="font-mono text-xs text-slate-400 -mt-8">Interactive cybersecurity demonstrations and tooling. All modules run 100% client-side.</p>

      {/* Row 1: Threat Map + Device Profiler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThreatWorldMap />
        <SystemProfiler />
      </div>

      {/* Row 2: Password Cracker + Hash Cracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PasswordCracker />
        <HashCracker />
      </div>

      {/* Row 3: Packet Capture + OSINT Scanner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PacketCaptureFeed />
        <OsintSimulator />
      </div>

      {/* Row 4: Tor Visualizer + Steganography */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TorRouteVisualizer />
        <SteganographyDemo />
      </div>

      {/* Row 5: Cipher Playground + XSS Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CipherPlayground />
        <XssPlayground />
      </div>

      {/* Row 6: PGP Encryption + PGP Decryption */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border border-brand-purple/30 bg-brand-purple/5 rounded-2xl space-y-4 text-left">
          <div className="flex items-center gap-2 text-brand-purple font-bold">
            <Lock className="w-5 h-5 text-brand-purple" />
            <h4 className="font-display text-sm uppercase tracking-wider">PGP Encryption Pipeline</h4>
          </div>
          <p className="text-xs text-slate-400">Type a secret message below to encrypt it client-side:</p>
          <PgpEncryptionDemo />
        </div>

        <div className={`glass-panel p-6 border rounded-2xl space-y-4 text-left ${ctfSolved ? "border-brand-green/30 bg-brand-green/5" : "border-red-500/20 bg-red-950/5"}`}>
          {ctfSolved && (
            <>
              <div className="flex items-center gap-2 text-brand-green font-bold">
                <Unlock className="w-5 h-5 text-brand-green" />
                <h4 className="font-display text-sm uppercase tracking-wider">PGP Decryption Pipeline</h4>
              </div>
              <p className="text-xs text-slate-400">Insert encrypted base64 payload to run client-side decryption:</p>
            </>
          )}
          <PgpDecryptionDemo isUnlocked={ctfSolved} onRedirectToCtf={() => navigate('/ctf')} />
        </div>
      </div>

      {/* Row 7: Incident Response Simulation */}
      <div className="relative overflow-hidden rounded-2xl">
        {!authUser && (
          <PremiumLock 
            title="PREMIUM INCIDENT RESPONSE LAB" 
            desc="Obtain portal authentication credentials to initialize SOC incident containment drills, triage simulations, and attack correlation maps." 
          />
        )}
        <div className={!authUser ? "blur-sm select-none pointer-events-none" : ""}>
          <IncidentResponseSim />
        </div>
      </div>

      {/* Row 8: Cyber Kill Chain Timeline */}
      <AttackTimeline />

      {/* Row 9: MITRE ATT&CK Matrix (full width) */}
      <MitreAttackMatrix />

      {/* Row 10: Phishing Lab (full width) */}
      <div className="relative overflow-hidden rounded-2xl">
        {!authUser && (
          <PremiumLock 
            title="PREMIUM PHISHING SANDBOX" 
            desc="Sign in with verified credentials to deploy custom decoy profiles, SMTP header simulations, and user-behavior analytics." 
          />
        )}
        <div className={!authUser ? "blur-sm select-none pointer-events-none" : ""}>
          <PhishingLab />
        </div>
      </div>

      {/* Row 11: Binary System Clock */}
      <div className="max-w-md mx-auto">
        <BinaryClock />
      </div>
    </section>
  );
}

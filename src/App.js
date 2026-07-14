import React, { useEffect, useState, useRef } from 'react';
import { Routes, Route, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getSupabase } from './supabaseClient.js';
import { 
  Palette, Leaf, Menu, X, ArrowUp, Lock, Unlock, HelpCircle, 
  ChevronRight, Terminal, Activity, Shield, Cpu, Network, User, ArrowLeft, Bell, BellRing
} from 'lucide-react';

// Subpages
import Home from './pages/Home.js';
import Tools from './pages/Tools.js';
import Skills from './pages/Skills.js';
import Projects from './pages/Projects.js';
import Timeline from './pages/Timeline.js';
import Ctf from './pages/Ctf.js';
import Labs from './pages/Labs.js';
import Portal from './pages/Portal.js';
import Contact from './pages/Contact.js';
import Profile from './pages/Profile.js';
import Premium from './pages/Premium.js';
import News from './pages/News.js';
import Admin from './pages/Admin.js';

// ============================================================
// COMPONENT DECLARATIONS (PORTED DIRECTLY FROM ORIGINAL App.js)
// ============================================================
const Particles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    setParticles(Array.from({ length: isMobile ? 10 : 30 }, (_, i) => i));
  }, []);
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {particles.map((i) => {
        const duration = 8 + Math.random() * 15;
        const delay = Math.random() * 20;
        const left = Math.random() * 100;
        const size = 1 + Math.random() * 2;
        const color = Math.random() > 0.8 ? "#00ff88" : Math.random() > 0.6 ? "#a855f7" : "#00f5ff";
        return (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              backgroundColor: color
            }}
          />
        );
      })}
    </div>
  );
};

const themeRgb = {
  matrix: "74, 222, 128",
  synthwave: "0, 245, 255",
  "hacker-red": "255, 51, 51",
  monochrome: "255, 255, 255",
  tiranga: "255, 153, 51"
};

const ThemeSwitcher = () => {
  const themes = [
    { id: "matrix", label: "Matrix", color: "bg-[#4ade80]" },
    { id: "synthwave", label: "Synthwave", color: "bg-[#00f5ff]" },
    { id: "hacker-red", label: "Crimson", color: "bg-[#ff3333]" },
    { id: "tiranga", label: "Tiranga", color: "bg-[linear-gradient(to_bottom,#ff9933,#ffffff,#138808)]" },
    { id: "monochrome", label: "Monochrome", color: "bg-[#ffffff]" }
  ];
  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("matrix");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "matrix";
    setCurrentTheme(saved);
    if (saved !== "matrix") {
      document.documentElement.setAttribute("data-theme", saved);
    }
    const rgb = themeRgb[saved] || "74, 222, 128";
    document.documentElement.style.setProperty("--spotlight-color", rgb);
  }, []);

  const changeTheme = (theme) => {
    setCurrentTheme(theme);
    localStorage.setItem("theme", theme);
    if (theme === "matrix") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    const rgb = themeRgb[theme] || "74, 222, 128";
    document.documentElement.style.setProperty("--spotlight-color", rgb);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-white/5 border border-brand-cyan/20 flex items-center justify-center hover:bg-brand-cyan/10 transition-colors cursor-pointer"
        title="Change Theme"
      >
        <Palette className="w-4 h-4 text-brand-cyan" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 p-3 bg-[var(--bg-base)] border border-brand-cyan/20 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[140px] text-left">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`flex items-center gap-3 px-3 py-2 text-xs font-mono rounded-lg hover:bg-white/5 transition-colors cursor-pointer ${currentTheme === t.id ? "text-brand-cyan bg-brand-cyan/10" : "text-slate-400"}`}
            >
              <div className={`w-3 h-3 rounded-full ${t.color}`} />
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const HexGridBackground = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let needsRedraw = true;
    let lastTheme = "";

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      needsRedraw = true;
    };
    window.addEventListener("resize", handleResize);

    const hexRadius = 28;
    const hexHeight = hexRadius * Math.sqrt(3);
    const horizDist = hexRadius * 1.5;
    const vertDist = hexHeight;
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e) => {
      if (mouseX !== e.clientX || mouseY !== e.clientY) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        needsRedraw = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Precompute vertex offsets to avoid Math.cos/Math.sin calculations on every frame / hexagon
    const hexRadiusEff = hexRadius - 2;
    const hexOffsets = Array.from({ length: 6 }, (_, i) => {
      const angle = i * Math.PI / 3;
      return {
        x: hexRadiusEff * Math.cos(angle),
        y: hexRadiusEff * Math.sin(angle)
      };
    });

    const render = () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "matrix";
      if (currentTheme !== lastTheme) {
        lastTheme = currentTheme;
        needsRedraw = true;
      }

      if (needsRedraw) {
        ctx.clearRect(0, 0, width, height);
        ctx.lineWidth = 0.5;
        const rgb = themeRgb[currentTheme] || "74, 222, 128";

        const cols = Math.ceil(width / horizDist) + 1;
        const rows = Math.ceil(height / vertDist) + 1;

        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const x = c * horizDist;
            let y = r * vertDist;
            if (c % 2 === 1) {
              y += vertDist / 2;
            }
            const dx = x - mouseX;
            const dy = y - mouseY;
            const distSq = dx * dx + dy * dy; // Fast check using squared distance
            
            let alpha = 0.012;
            if (distSq < 32400) { // 180^2
              const dist = Math.sqrt(distSq);
              alpha += (1 - dist / 180) * 0.12;
            }

            ctx.beginPath();
            ctx.moveTo(x + hexOffsets[0].x, y + hexOffsets[0].y);
            for (let i = 1; i < 6; i++) {
              ctx.lineTo(x + hexOffsets[i].x, y + hexOffsets[i].y);
            }
            ctx.closePath();
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.stroke();
          }
        }
        needsRedraw = false;
      }
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-45" />;
};

const BootScreen = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const bootLogs = [
    "[*] Starting Kali GNU/Linux kernel 6.9.1-kali-amd64...",
    "[*] Loading system configuration parameters...",
    "[*] Mounting virtual filesystem: /root...",
    "[*] Starting network interface card: wlan0...",
    "[*] Scanning local network gateways (IPv4/IPv6)...",
    "[*] Loading Offensive Security tools configurations...",
    "[*] SECURE SHELL INTERRUPT ENCRYPTION ACTIVE",
    "[*] Initializing Portfolios assets loader...",
    "[+] Handshake complete. Welcome back, root@kali."
  ];

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < bootLogs.length) {
        setLogs((prev) => [...prev, bootLogs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 180);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col justify-start p-6 sm:p-12 font-mono text-[0.72rem] sm:text-xs text-[#4ade80] leading-relaxed select-none overflow-y-auto">
      <div className="flex flex-col gap-1 max-w-3xl">
        <div className="text-white font-bold text-sm mb-4">KALI GNU/LINUX INITIALIZATION DAEMON v2.4</div>
        {logs.filter(Boolean).map((log, i) => (
          <div key={i} className={log && log.startsWith && log.startsWith("[+]") ? "text-white font-bold" : ""}>
            {log}
          </div>
        ))}
        <div className="w-2.5 h-4 bg-[#4ade80] animate-blink mt-2" />
      </div>
    </div>
  );
};

const BreachScreen = () => {
  return (
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center font-mono text-red-500 p-6 select-none overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%] pointer-events-none" />
      <div className="text-6xl md:text-8xl font-black mb-8 tracking-widest text-red-600 animate-bounce text-center">
        !!! SYSTEM COMPROMISED !!!
      </div>
      <div className="max-w-2xl w-full bg-red-950/20 border border-red-500/30 p-6 rounded-lg font-mono text-xs sm:text-sm space-y-2 mb-8 leading-relaxed shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <div>[!] WARNING: EXPLOIT CODE DISPATCHED IN ROOT SEGMENT</div>
        <div>[~] Clearing partition sectors: /dev/sda1...</div>
        <div>[~] Downloading RAM cache registers...</div>
        <div>[+] Target footprint: Compromised</div>
        <div className="text-white font-bold animate-pulse mt-4 text-center">AUTOREMEDIATION TRIGGERED IN 5 SECONDS...</div>
      </div>
    </div>
  );
};

const ThreatFeedTicker = () => {
  const [cves, setCves] = useState([]);
  useEffect(() => {
    const fetchRecentCVEs = async () => {
      try {
        setCves([
          { id: "CVE-2026-38291", desc: "Critical unauthenticated RCE VPN vulnerability exploited in the wild.", severity: "CRITICAL (9.8)" },
          { id: "CVE-2025-40192", desc: "Active Directory domain trust elevation bypass via LDAP packets.", severity: "HIGH (8.8)" },
          { id: "CVE-2025-39211", desc: "Linux Kernel privilege escalation via page cache race condition.", severity: "HIGH (7.8)" },
          { id: "CVE-2025-30114", desc: "Kubernetes Container escape vulnerability via custom symlink mount.", severity: "CRITICAL (9.6)" },
          { id: "CVE-2025-28821", desc: "Apache Struts remote execution bypass parameter dispatch.", severity: "CRITICAL (9.8)" }
        ]);
      } catch (e) {}
    };
    fetchRecentCVEs();
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 h-8 bg-red-950/95 border-b border-red-500/20 z-[150] flex items-center overflow-hidden select-none backdrop-blur-sm">
      <div className="absolute inset-0 flex items-center overflow-hidden">
        <div className="inline-flex gap-12 animate-ticker font-mono text-[0.6rem] text-red-200 whitespace-nowrap pl-2">
          {[...Array(2)].map((_, ri) => (
            <span key={ri} className="inline-flex gap-12">
              {cves.map((cve, i) => (
                <span key={i} className="inline-flex items-center gap-2 shrink-0">
                  <span className="text-white font-bold">{cve.id}</span>
                  <span className="text-red-300/80">[{cve.severity}]</span>
                  <span className="text-slate-300 hidden sm:inline">— {cve.desc}</span>
                  <span className="text-red-700/60">//</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      <div className="relative z-10 flex items-center shrink-0">
        <div
          className="absolute left-full top-0 h-full w-16 pointer-events-none"
          style={{ background: "linear-gradient(to right, #3b0a0a, transparent)" }}
        />
        <span className="bg-red-600 text-white px-2.5 py-0.5 ml-3 rounded font-bold uppercase tracking-wider text-[0.55rem] hidden sm:inline shadow-[4px_0_20px_8px_#3b0a0a]">
          Live Threat Feed
        </span>
      </div>
    </div>
  );
};

const HackerBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Secure session initialized. I am HackerBot v1.0, security query assistant. Query any record from Utkrasht's professional portfolio database." }
  ]);
  const [typing, setTyping] = useState(false);

  const handleQuery = async (queryType) => {
    if (typing) return;
    let userText = "";
    let botText = "";
    if (queryType === "skills") {
      userText = "What are Utkrasht's primary skills?";
      botText = "Scanning skill database... Utkrasht excels in: Penetration Testing (97%), Kali Linux (95%), Network Forensics (94%), Splunk SIEM mapping, red team tooling, and reverse engineering.";
    } else if (queryType === "contact") {
      userText = "How can I contact Utkrasht?";
      botText = "Connecting secure communication vectors... You can reach him directly via email at utkrashtkumar@gmail.com, connect on LinkedIn (linkedin.com/in/utkrashtkumar/), or trigger a secure contact handshake in the dashboard section.";
    } else if (queryType === "about") {
      userText = "Tell me about Utkrasht's background.";
      botText = "Retrieving credential logs... Utkrasht is currently pursuing his Master's in Computer Science at IET Lucknow, holding a Bachelor's degree from DBRAU. He is an IBM Certified Cybersecurity Analyst and Ethical Hacker.";
    } else if (queryType === "cve") {
      userText = "What security research has he published?";
      botText = "Searching vulnerability registers... Utkrasht discovered a critical unauthenticated Remote Code Execution (RCE) vulnerability in a major enterprise VPN appliance, tracked under advisory CVE-2024-38291, affecting 80,000+ nodes.";
    }
    setMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setTyping(true);
    await new Promise((r) => setTimeout(r, 600));
    setMessages((prev) => [...prev, { sender: "bot", text: botText }]);
    setTyping(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[120] font-mono">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center shadow-lg hover:bg-brand-cyan/35 cursor-pointer transition-all active:scale-95 hover:shadow-[0_0_15px_rgba(0,245,255,0.4)] animate-bounce"
          title="Query HackerBot"
        >
          <HelpCircle className="w-5 h-5 animate-pulse" />
        </button>
      ) : (
        <div className="bg-[#0b1319]/95 border border-brand-cyan/30 rounded-2xl w-72 md:w-80 shadow-2xl flex flex-col overflow-hidden max-h-[380px] backdrop-blur-md animate-fadeIn">
          <div className="bg-black/40 px-4 py-3 border-b border-brand-cyan/15 flex items-center justify-between text-xs font-bold text-brand-cyan">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-blink" />
              <span>HackerBot Security Agent</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">[X]</button>
          </div>

          <div className="p-4 flex-1 overflow-y-auto space-y-3 min-h-[180px] max-h-[220px] text-[0.62rem] leading-normal text-slate-300">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`p-2 rounded-lg max-w-[85%] ${m.sender === "user" ? "bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-right" : "bg-white/3 border border-white/5 text-slate-300"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="p-2 rounded bg-white/3 text-slate-500 italic animate-pulse">
                  Querying database index...
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5 bg-black/25 flex flex-wrap gap-1.5 justify-center">
            <button onClick={() => handleQuery("skills")} className="px-2 py-1 bg-white/5 border border-white/10 hover:border-brand-cyan/30 text-[0.55rem] text-slate-400 hover:text-brand-cyan rounded cursor-pointer transition-colors">
              Skills
            </button>
            <button onClick={() => handleQuery("about")} className="px-2 py-1 bg-white/5 border border-white/10 hover:border-brand-cyan/30 text-[0.55rem] text-slate-400 hover:text-brand-cyan rounded cursor-pointer transition-colors">
              Background
            </button>
            <button onClick={() => handleQuery("cve")} className="px-2 py-1 bg-white/5 border border-white/10 hover:border-brand-cyan/30 text-[0.55rem] text-slate-400 hover:text-brand-cyan rounded cursor-pointer transition-colors">
              Research
            </button>
            <button onClick={() => handleQuery("contact")} className="px-2 py-1 bg-white/5 border border-white/10 hover:border-brand-cyan/30 text-[0.55rem] text-slate-400 hover:text-brand-cyan rounded cursor-pointer transition-colors">
              Hire Him
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const TerminalOverlay = ({ isOpen, onClose }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([
    { text: "┌──(root💀kali-overlay)-[~]", type: "output" },
    { text: '└──# SYSTEM CONSOLE BRIDGE ESTABLISHED. TYPE "help" FOR DIRECTIVES.', type: "success" }
  ]);
  const [busy, setBusy] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const inputs = containerRef.current.getElementsByTagName("input");
      if (inputs.length > 0) inputs[0].focus();
    }
  }, [isOpen]);

  const executeCommand = async (cmdStr) => {
    const clean = cmdStr.trim();
    if (!clean) return;
    setHistory((prev) => [...prev, { text: `root@kali-overlay:~# ${clean}`, type: "input" }]);
    setBusy(true);
    const parts = clean.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    await new Promise((r) => setTimeout(r, 200));

    switch (cmd) {
      case "help":
        setHistory((prev) => [
          ...prev,
          { text: "Overlay Directives: help, hack, scan, cve, clear, exit", type: "output" },
          { text: "Press Esc or Ctrl+` to exit bridge.", type: "output" }
        ]);
        break;
      case "hack":
        setHistory((prev) => [...prev, { text: "[!] EXPLOITING LOCAL BRIDGE PORTAL...", type: "error" }]);
        await new Promise((r) => setTimeout(r, 600));
        setHistory((prev) => [...prev, { text: "✔ Exploitation complete. Access token dumped: ROOT_GATEWAY_OK", type: "success" }]);
        break;
      case "scan":
        setHistory((prev) => [...prev, { text: "[~] Recon scans initialized against host port mapping registers...", type: "output" }]);
        await new Promise((r) => setTimeout(r, 500));
        setHistory((prev) => [...prev, { text: "Open: 22 (SSH), 80 (HTTP), 443 (HTTPS). Security layers verified.", type: "success" }]);
        break;
      case "cve":
        setHistory((prev) => [...prev, { text: "Advisory CVE-2024-38291: Unauthenticated RCE in VPN portal gateway daemon.", type: "success" }]);
        break;
      case "clear":
        setHistory([]);
        break;
      case "exit":
        onClose();
        break;
      default:
        setHistory((prev) => [...prev, { text: `Command not found: "${cmd}". Type "help" for overlays directives.`, type: "error" }]);
    }
    setBusy(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (busy || !input) return;
    executeCommand(input);
    setInput("");
  };

  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[300] bg-black/70 backdrop-blur-md flex flex-col justify-start items-center p-4 md:p-10 select-text animate-slideDown"
      onClick={onClose}
    >
      <div
        ref={containerRef}
        className="w-full max-w-3xl bg-black border border-brand-cyan/30 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#111] px-4 py-2 flex items-center justify-between border-b border-brand-cyan/20 font-mono text-[0.65rem] text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="ml-1 text-slate-300">root@kali-overlay:~</span>
          </div>
          <button onClick={onClose} className="hover:text-white cursor-pointer font-bold">[X] CLOSE</button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 font-mono text-xs text-slate-300 space-y-1.5 h-64">
          {history.map((h, i) => (
            <div
              key={i}
              className={h.type === "input" ? "text-white" : h.type === "success" ? "text-brand-green" : h.type === "error" ? "text-red-400" : "text-brand-cyan"}
            >
              {h.text}
            </div>
          ))}
          {busy && <div className="text-slate-500 animate-pulse">Running overlay subprocess...</div>}
        </div>

        <form onSubmit={handleSubmit} className="border-t border-brand-cyan/20 p-2.5 bg-black flex items-center gap-2">
          <span className="font-mono text-brand-green text-xs shrink-0 select-none">root@kali-overlay#</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy}
            autoFocus
            autoComplete="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-white font-mono text-xs outline-none border-none focus:outline-none focus:ring-0"
          />
        </form>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APPLICATION LAYOUT ENGINE
// ============================================================
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isBooting, setIsBooting] = useState(true);
  const [isBreached, setIsBreached] = useState(false);
  const [isOverlayTerminalOpen, setIsOverlayTerminalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Shared Data States
  const [visitorIntel, setVisitorIntel] = useState(null);
  const [githubStats, setGithubStats] = useState(null);
  const [ctfSolved, setCtfSolved] = useState(() => {
    const ch1 = localStorage.getItem("utk_ctf_ch1") === "true";
    const ch2 = localStorage.getItem("utk_ctf_ch2") === "true";
    const ch3 = localStorage.getItem("utk_ctf_ch3") === "true";
    return ch1 && ch2 && ch3;
  });

  const [analytics, setAnalytics] = useState({
    visits: 1,
    commandsRun: 0,
    sessionStart: Date.now(),
    mostUsedCommand: "help"
  });

  // Supabase auth
  const [authUser, setAuthUser] = useState(null);
  const [authSession, setAuthSession] = useState(null);

  // Bell notification badge — new articles since last visit
  const [bellCount, setBellCount] = useState(0);
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const lastVisited = localStorage.getItem('news_last_visited_at');
    if (!lastVisited) return;
    supabase
      .from('cyber_news')
      .select('id', { count: 'exact', head: true })
      .eq('published', true)
      .gt('created_at', lastVisited)
      .then(({ count }) => { if (count > 0) setBellCount(count); });
  }, [location.pathname]);

  // UI Telemetry
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Initialize Auth session checking
  useEffect(() => {
    let authSubscription = null;
    const checkAuth = async () => {
      try {
        const supabase = getSupabase();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          // Check if this is a signup confirmation redirect in the URL hash
          const isSignupConfirmation = window.location.hash.includes('type=signup');
          
          if (isSignupConfirmation && session) {
            // Force sign out immediately to prevent auto-login
            await supabase.auth.signOut();
            window.location.hash = ''; // Clear hash
            navigate('/portal?confirmed=true');
            return;
          }

          if (session) {
            setAuthUser(session.user);
            setAuthSession(session);
          }

          // Listen to changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
            const isSignupHash = window.location.hash.includes('type=signup');
            if (isSignupHash && currentSession) {
              await supabase.auth.signOut();
              window.location.hash = '';
              setAuthUser(null);
              setAuthSession(null);
              navigate('/portal?confirmed=true');
              return;
            }

            if (currentSession) {
              setAuthUser(currentSession.user);
              setAuthSession(currentSession);
            } else {
              setAuthUser(null);
              setAuthSession(null);
            }
          });
          authSubscription = subscription;
        }
      } catch (e) {}
    };
    checkAuth();
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [navigate]);

  // Sync analytics states with custom updates (e.g. from the terminal component)
  useEffect(() => {
    const syncAnalytics = (e) => {
      if (e.detail) {
        setAnalytics(prev => ({
          ...prev,
          commandsRun: e.detail.commandsRun,
          mostUsedCommand: e.detail.mostUsedCommand
        }));
      }
    };
    window.addEventListener('update-analytics', syncAnalytics);
    return () => window.removeEventListener('update-analytics', syncAnalytics);
  }, []);

  // Fetch telemetry
  useEffect(() => {
    const localVisits = parseInt(localStorage.getItem("utk_visits") || "0") + 1;
    localStorage.setItem("utk_visits", localVisits.toString());
    const initialCommandsCount = parseInt(localStorage.getItem("utk_total_commands") || "0");
    
    setAnalytics(prev => ({
      ...prev,
      visits: localVisits,
      commandsRun: initialCommandsCount
    }));

    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => setVisitorIntel(data))
      .catch(() => {
        setVisitorIntel({
          ip: "103.241.12.89",
          city: "Lucknow",
          region: "Uttar Pradesh",
          country_name: "India",
          country_code: "IN",
          org: "Jio Infocomm Ltd",
          timezone: "Asia/Kolkata",
          asn: "AS55836"
        });
      });

    fetch("https://api.github.com/users/utkrashtkumar")
      .then((res) => res.json())
      .then((data) => {
        if (data.public_repos) {
          setGithubStats({
            repos: data.public_repos,
            followers: data.followers,
            following: data.following,
            bio: data.bio || "Ethical Hacker & Security Researcher",
            created: new Date(data.created_at).getFullYear()
          });
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        setGithubStats({
          repos: 18,
          followers: 12,
          following: 15,
          bio: "Cyber Security Analyst | Penetration Tester",
          created: 2022
        });
      });
  }, []);

  // Global overlay triggers
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        setIsOverlayTerminalOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOverlayTerminalOpen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  // Custom spotlight cursor coordinates
  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Scroll dynamics
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = window.scrollY / totalHeight * 100;
        setScrollProgress(progress);
        setShowScrollTop(window.scrollY > 400);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Set document title according to current routing path
  useEffect(() => {
    const titleMap = {
      "/": "Utkrasht Kumar | Cybersecurity Analyst & Ethical Hacker Portfolio",
      "/tools": "Offensive Security Arsenal | Utkrasht Kumar",
      "/skills": "Security Proficiency Registers | Utkrasht Kumar",
      "/projects": "Offensive Security Projects & Operations | Utkrasht Kumar",
      "/timeline": "Professional Timeline & Certifications | Utkrasht Kumar",
      "/ctf": "CTF Intrusion containment | Utkrasht Kumar",
      "/labs": "Interactive Laboratories | Utkrasht Kumar",
      "/portal": "Secure Access Portal | Utkrasht Kumar",
      "/profile": "Agent Profile Console | Utkrasht Kumar",
      "/news": "Cyber Intel Feed | Utkrasht Kumar",
      "/admin": "Admin Panel | Utkrasht Kumar",
      "/contact": "Secure Pipeline & Handshake | Contact Utkrasht Kumar"
    };
    document.title = titleMap[location.pathname] || "Utkrasht Kumar | Cybersecurity Analyst";
  }, [location.pathname]);

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  const handleNavLinkClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: "Terminal", path: "/" },
    { label: "Tools", path: "/tools" },
    { label: "Skills", path: "/skills" },
    { label: "Projects", path: "/projects" },
    { label: "Timeline", path: "/timeline" },
    { label: "CTF", path: "/ctf" },
    { label: "Labs", path: "/labs" },
    { label: "News", path: "/news" },
    ...(authUser ? [{ label: "Premium", path: "/premium" }] : []),
    { label: "Portal", path: "/portal" },
    ...(authUser ? [{ label: "Profile", path: "/profile" }] : []),
    ...(authUser?.email === 'utkrashtkumar@gmail.com' ? [{ label: "Admin", path: "/admin" }] : []),
    { label: "Contact", path: "/contact" }
  ];


  return (
    <>
      {isBreached && <BreachScreen />}
      <ThreatFeedTicker />
      <div className="bg-canvas" />
      <HexGridBackground />
      <div className="grid-overlay" />
      <div className="scanline" />
      <div className="noise-overlay" />
      <div className="cursor-spotlight" />
      <Particles />

      {/* NAV - positioned exactly below the 32px (h-8) threat ticker */}
      <nav className="fixed top-8 left-0 right-0 z-[100] px-4 sm:px-6 md:px-12 py-3.5 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-brand-cyan/10 flex items-center justify-between">
        <Link
          to="/"
          onClick={handleNavLinkClick}
          className="font-display font-bold text-lg text-brand-cyan tracking-widest drop-shadow-[0_0_20px_rgba(0,245,255,0.6)] flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Leaf className="w-5 h-5 text-brand-cyan" />
          UTKRASHT//SEC
        </Link>
        
        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 lg:gap-8 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.label}>
              <NavLink
                to={item.path}
                onClick={handleNavLinkClick}
                className={({ isActive }) => 
                  `font-mono text-xs no-underline tracking-widest uppercase transition-colors hover:text-brand-cyan ${isActive ? "text-brand-cyan font-bold border-b border-brand-cyan/40 pb-0.5" : "text-slate-400"}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <ThemeSwitcher />

          {/* Bell notification icon */}
          <Link
            to="/news"
            onClick={() => { setBellCount(0); handleNavLinkClick(); }}
            className="relative text-slate-400 hover:text-brand-cyan transition-colors"
            title="Cyber Intel Feed"
          >
            {bellCount > 0 ? (
              <BellRing className="w-4.5 h-4.5 text-brand-cyan animate-pulse" />
            ) : (
              <Bell className="w-4.5 h-4.5" />
            )}
            {bellCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-pink text-white font-mono text-[0.45rem] font-bold rounded-full flex items-center justify-center">
                {bellCount}
              </span>
            )}
          </Link>
          
          <div className="hidden sm:flex items-center gap-2 font-mono text-[0.72rem] text-brand-green">
            <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)] animate-blink" />
            <a href="https://www.linkedin.com/in/utkrashtkumar/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-brand-cyan transition-colors">Available for hire</a>
          </div>

          {!authUser && (
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline font-mono text-[0.6rem] text-slate-500 uppercase tracking-wider">
                ⚡ Login or signup to access premium features (100% Free)
              </span>
              <Link
                to="/portal"
                onClick={handleNavLinkClick}
                className="px-2.5 py-1 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/35 text-brand-cyan font-mono text-[0.58rem] rounded uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all no-underline shrink-0 animate-pulse hover:animate-none"
              >
                Sign In / Sign Up
              </Link>
            </div>
          )}

          {authUser && (
            <Link
              to="/profile"
              onClick={handleNavLinkClick}
              className="w-9 h-9 rounded-full overflow-hidden border border-brand-cyan/25 hover:border-brand-cyan/50 transition-colors flex items-center justify-center bg-black/40 cursor-pointer"
              title="View Profile / Account Settings"
            >
              {authUser.user_metadata?.avatar_url ? (
                <img
                  src={authUser.user_metadata.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-4.5 h-4.5 text-brand-cyan" />
              )}
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-white/5 border border-brand-cyan/20 flex items-center justify-center hover:bg-brand-cyan/10 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-brand-cyan" /> : <Menu className="w-5 h-5 text-brand-cyan" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-[109px] z-[90] bg-[var(--bg-base)]/95 backdrop-blur-2xl border-b border-brand-cyan/10 flex flex-col items-center justify-center p-6 md:hidden"
          >
            <ul className="flex flex-col gap-6 text-center list-none p-0 m-0 w-full">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={handleNavLinkClick}
                    className={`font-mono text-lg no-underline tracking-widest uppercase transition-colors hover:text-brand-cyan block py-2 w-full text-center ${location.pathname === item.path ? "text-brand-cyan font-bold" : "text-slate-300"}`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center gap-2 font-mono text-xs text-brand-green bg-brand-green/5 border border-brand-green/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-brand-green shadow-[0_0_8px_var(--color-brand-green)] animate-blink" />
              <a href="https://www.linkedin.com/in/utkrashtkumar/" target="_blank" rel="noopener noreferrer">Available for hire</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SKILLS SCROLLING TICKER */}
      <div className="pt-24 bg-brand-cyan/5 border-y border-brand-cyan/10 py-2.5 overflow-hidden whitespace-nowrap">
        <div className="inline-flex gap-12 animate-ticker">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-12">
              {[
                "Penetration Testing", "Threat Intelligence", "SIEM / SOC Operations",
                "Malware Analysis", "Network Forensics", "Vulnerability Assessment",
                "Red Teaming", "Incident Response", "Zero-Day Research", "Cloud Security"
              ].map((item) => (
                <span key={item} className="font-mono text-[0.72rem] text-brand-cyan/50 tracking-wider">
                  <span className="opacity-40 mr-2">//</span>{item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MAIN ROUTED VIEWPORTS */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="py-8"
          >
            <Routes>
              <Route path="/" element={
                <Home 
                  visitorIntel={visitorIntel} 
                  onTriggerBreach={setIsBreached} 
                  githubStats={githubStats}
                  analytics={analytics}
                  ctfSolved={ctfSolved}
                  setCtfSolved={setCtfSolved}
                  authUser={authUser}
                  authSession={authSession}
                  setAuthUser={setAuthUser}
                  setAuthSession={setAuthSession}
                />
              } />
              <Route path="/tools" element={<Tools authUser={authUser} />} />
              <Route path="/skills" element={<Skills authUser={authUser} />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/timeline" element={<Timeline githubStats={githubStats} analytics={analytics} />} />
              <Route path="/ctf" element={<Ctf setCtfSolved={setCtfSolved} />} />
              <Route path="/labs" element={<Labs ctfSolved={ctfSolved} authUser={authUser} />} />
              <Route path="/premium" element={<Premium authUser={authUser} />} />
              <Route path="/portal" element={
                <Portal 
                  authUser={authUser} 
                  authSession={authSession} 
                  setAuthUser={setAuthUser} 
                  setAuthSession={setAuthSession} 
                />
              } />
               <Route path="/profile" element={
                <Profile 
                  authUser={authUser} 
                  setAuthUser={setAuthUser} 
                  setAuthSession={setAuthSession} 
                />
              } />
              <Route path="/contact" element={<Contact ctfSolved={ctfSolved} />} />
              <Route path="/news" element={<News authUser={authUser} />} />
              <Route path="/admin" element={<Admin authUser={authUser} />} />
            </Routes>

            {location.pathname !== '/' && (
              <div className="mt-12 pt-8 border-t border-white/5 flex justify-start animate-fadeIn">
                <Link
                  to="/"
                  onClick={handleNavLinkClick}
                  className="inline-flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-brand-cyan hover:underline transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-500 group-hover:text-brand-cyan transition-colors" />
                  <span>[BACK] Return to Terminal Console</span>
                </Link>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-brand-cyan/15 bg-black/60 backdrop-blur-md py-8 px-6 font-mono text-[0.65rem] text-slate-400 mt-20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <div>© {new Date().getFullYear()} Utkrasht Kumar. All Rights Reserved.</div>
            <div className="text-slate-600 uppercase tracking-widest text-[0.55rem]">Encoded & Deployed by root@kali</div>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <span className="text-brand-purple select-none font-bold">PGP:</span>
            <span className="text-[0.6rem] text-slate-300">8F3E 9A72 BD1A C49E 2A7F</span>
          </div>
        </div>
      </footer>

      {/* SCROLL TO TOP WITH PROGRESS RING */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="scroll-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 z-[120] w-12 h-12 rounded-full bg-[var(--bg-base)]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-brand-cyan hover:text-white shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer group transition-colors active:scale-95"
            aria-label="Scroll to top"
          >
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-white/5 fill-none"
                strokeWidth="2.5"
              />
              <circle
                cx="24"
                cy="24"
                r="20"
                className="stroke-brand-cyan fill-none transition-all duration-75"
                strokeWidth="2.5"
                strokeDasharray="125.6"
                strokeDashoffset={125.6 - scrollProgress / 100 * 125.6}
                strokeLinecap="round"
              />
            </svg>
            <ArrowUp className="w-5 h-5 text-brand-cyan group-hover:animate-bounce relative z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      <HackerBot />
      <TerminalOverlay isOpen={isOverlayTerminalOpen} onClose={() => setIsOverlayTerminalOpen(false)} />


    </>
  );
}

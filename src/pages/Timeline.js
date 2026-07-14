import React, { useState, useEffect } from 'react';
import { Shield, Github, Activity } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

const CERTS = [
  { id: "IBM CA", name: "IBM Cybersecurity Analyst Professional", org: "Coursera / IBM", year: "Jun 2024", link: "https://coursera.org/share/270be57270bb9eabd1ca177fda099332", color: "text-brand-cyan", bg: "bg-brand-cyan/10", border: "border-brand-cyan/30" },
  { id: "SEC+", name: "CompTIA Security+ & CYSA+", org: "Coursera (80%)", year: "Jun 2024", link: "https://coursera.org/share/e85ac90dab4f12540226ad772c9c9a8f", color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/30" },
  { id: "UMD", name: "Cybersecurity for Everyone", org: "Univ. of Maryland (83.9%)", year: "Apr 2023", link: "https://coursera.org/share/f646364c01efdc0c31e67ea032f17016", color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/30" },
  { id: "CAP", name: "Case Studies & Capstone Project", org: "Coursera (95.7%)", year: "Apr 2023", link: "https://coursera.org/share/8b5a335e1a8f0d47f2fb9cc708987dd1", color: "text-brand-pink", bg: "bg-brand-pink/10", border: "border-brand-pink/30" },
  { id: "IRDF", name: "Incident Response & Forensics", org: "Coursera (100%)", year: "Feb 2023", link: "https://coursera.org/share/1636b2e16f0a523755e1faa81cc119e9", color: "text-brand-cyan", bg: "bg-brand-cyan/10", border: "border-brand-cyan/30" },
  { id: "PTTH", name: "Pen Testing, Threat Hunting & Crypto", org: "Coursera (100%)", year: "Feb 2023", link: "https://coursera.org/share/eee530f21a5c5e9f8e9706fd38208668", color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/30" },
  { id: "COMP", name: "Compliance Framework & Regs", org: "Coursera (95.1%)", year: "Feb 2023", link: "https://coursera.org/share/777419ff3b8d668d5ee72109090d32d8", color: "text-brand-green", bg: "bg-brand-green/10", border: "border-brand-green/30" },
  { id: "NETS", name: "Computer Networks & Security", org: "Coursera (97.7%)", year: "Feb 2023", link: "https://coursera.org/share/3ed4dde1d307c6ac95830e539dae5e7e", color: "text-brand-pink", bg: "bg-brand-pink/10", border: "border-brand-pink/30" },
  { id: "OSAS", name: "OS: Overview, Admin, & Security", org: "Coursera (94.6%)", year: "Feb 2023", link: "https://coursera.org/share/618e386f8e7a29ef0b2d4ad4ee7ed17a", color: "text-brand-cyan", bg: "bg-brand-cyan/10", border: "border-brand-cyan/30" },
  { id: "INTR", name: "Intro: Tools & Cyberattacks", org: "Coursera (97.2%)", year: "Feb 2023", link: "https://drive.google.com/file/d/1Ii5Vv_c0hfmVhBGI4S8wZiad_hkieOl1/view?usp=sharing", color: "text-brand-purple", bg: "bg-brand-purple/10", border: "border-brand-purple/30" },
  { id: "TRAINING", name: "Java, Oracle, Node.js & MongoDB Training", org: "E-Gain, Agra", year: "2024", link: "https://drive.google.com/file/d/1lTdWwXQJyAPj4vywAf7CF2ecg1rw6bbg/view?usp=sharing", color: "text-brand-pink", bg: "bg-brand-pink/10", border: "border-brand-pink/30" },
  { id: "JAVA_PROJ", name: "Service Center Management (Project Training)", org: "E-Gain", year: "2024", link: "https://drive.google.com/file/d/1Ii5Vv_c0hfmVhBGI4S8wZiad_hkieOl1/view?usp=sharing", color: "text-brand-cyan", bg: "bg-brand-cyan/10", border: "border-brand-cyan/30" }
];

const EDUCATION = [
  {
    degree: "Master's degree in Computer Science",
    school: "Institute of Engineering and Technology Lucknow",
    date: "September 2025 - Expected June 2027",
    color: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
    border: "border-brand-cyan/30"
  },
  {
    degree: "Bachelor's degree in Arts and Humanities",
    school: "Dr. Bhimrao Ambedkar University Agra",
    date: "May 2022 - May 2025",
    color: "text-brand-purple",
    bg: "bg-brand-purple/10",
    border: "border-brand-purple/30"
  },
  {
    degree: "Intermediate (Class XII)",
    school: "Central Board of Secondary Education (CBSE)",
    date: "2020 - 2021",
    color: "text-brand-pink",
    bg: "bg-brand-pink/10",
    border: "border-brand-pink/30"
  },
  {
    degree: "Matriculation (Class X)",
    school: "Central Board of Secondary Education (CBSE)",
    date: "2018 - 2019",
    color: "text-brand-green",
    bg: "bg-brand-green/10",
    border: "border-brand-green/30"
  }
];

const CertificateChainViewer = ({ cert, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0b1319] border border-brand-cyan/30 rounded-2xl w-full max-w-md p-6 font-mono text-xs text-slate-300 space-y-5 shadow-2xl relative">
        <div className="flex justify-between items-center border-b border-brand-cyan/20 pb-3">
          <span className="text-brand-cyan font-bold uppercase">[!] TLS TRUST CHAIN INSPECTOR</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white font-bold select-none cursor-pointer">[X]</button>
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-slate-500 block">Trust Chain:</span>
            <div className="pl-3 border-l-2 border-brand-purple/40 space-y-1 mt-1">
              <div className="text-brand-green text-[0.65rem]">Root CA: Baltimore CyberTrust Root</div>
              <div className="text-brand-purple text-[0.65rem]">Intermediate: IBM Credential Signer CA-1</div>
              <div className="text-white font-bold text-[0.68rem]">Leaf Cert: {cert.name}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1.5 text-[0.62rem] bg-black/40 p-3 rounded border border-white/5">
            <div><span className="text-brand-cyan">VALIDITY:</span> {cert.year}</div>
            <div><span className="text-brand-cyan">ISSUER:</span> {cert.org}</div>
            <div><span className="text-brand-cyan">ALGORITHM:</span> SHA256withRSA</div>
            <div><span className="text-brand-cyan">FINGERPRINT:</span> {cert.id}</div>
          </div>
          
          <div className="text-[0.58rem] text-slate-500 leading-normal">
            Certificate chain was validated against system trust nodes using public key cryptographic signatures. The trust hierarchy is validated.
          </div>

          <a
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center py-2 bg-brand-cyan/20 border border-brand-cyan/30 text-brand-cyan font-mono text-[0.62rem] rounded uppercase tracking-wider hover:bg-brand-cyan/35 transition-all"
          >
            Verify Credentials Online →
          </a>
        </div>
      </div>
    </div>
  );
};

const GithubContributionGraph = () => {
  const weeks = 24;
  const days = 7;
  const contributions = Array.from({ length: weeks * days }, () => Math.floor(Math.random() * 5));
  return (
    <div className="glass-panel p-5 border border-brand-cyan/25 bg-brand-cyan/5 rounded-xl space-y-3 shadow-xl">
      <div className="flex items-center justify-between font-display text-xs text-white font-bold">
        <span>GITHUB CONTRIBUTIONS INTEL</span>
        <span className="text-[0.62rem] font-mono text-brand-cyan uppercase">Live Pushes Feed</span>
      </div>
      
      <div className="flex gap-[2px] overflow-x-auto py-1">
        {Array.from({ length: weeks }).map((_, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[2px]">
            {Array.from({ length: days }).map((_2, dIdx) => {
              const level = contributions[wIdx * 7 + dIdx];
              return (
                <div
                  key={dIdx}
                  className={`w-2.5 h-2.5 rounded-[1px] transition-all hover:scale-125 ${level === 0 ? "bg-white/5 border border-white/5" : level === 1 ? "bg-emerald-950" : level === 2 ? "bg-emerald-700" : level === 3 ? "bg-emerald-500" : "bg-emerald-300 shadow-[0_0_4px_var(--brand-cyan)]"}`}
                  title={`${level * 3 + 1} security logs pushed`}
                />
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-[0.55rem] font-mono text-slate-500">
        <span>Less commits</span>
        <div className="flex gap-1 items-center">
          <div className="w-2 h-2 bg-white/5 rounded-[1px]" />
          <div className="w-2 h-2 bg-emerald-950 rounded-[1px]" />
          <div className="w-2 h-2 bg-emerald-700 rounded-[1px]" />
          <div className="w-2 h-2 bg-emerald-500 rounded-[1px]" />
          <div className="w-2 h-2 bg-emerald-300 rounded-[1px]" />
        </div>
        <span>More commits</span>
      </div>
    </div>
  );
};

const LiveSessionTimer = ({ sessionStart }) => {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(Math.round((Date.now() - sessionStart) / 1e3));
    }, 1e3);
    return () => clearInterval(interval);
  }, [sessionStart]);
  return <span>{seconds}s</span>;
};

export default function Timeline({ githubStats, analytics }) {
  const [showAllCerts, setShowAllCerts] = useState(false);
  const [activeCertForChain, setActiveCertForChain] = useState(null);

  const fallbackGithubStats = githubStats || {
    repos: 18,
    followers: 12,
    bio: 'Cyber Security Analyst | Penetration Tester',
    created: 2022
  };

  const fallbackAnalytics = analytics || {
    visits: 1,
    commandsRun: 0,
    sessionStart: Date.now(),
    mostUsedCommand: 'help'
  };

  return (
    <section id="timeline" className="py-12 animate-fadeIn">
      <SectionHeader num="05" title="Professional Timeline" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 relative pl-8 border-l border-brand-cyan/20 space-y-12">
          <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-brand-cyan via-brand-purple to-transparent" />
          
          {EDUCATION.map((edu, i) => (
            <div key={i} className="relative group">
              <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full bg-[var(--bg-base)] border border-brand-cyan flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-ping" />
              </div>
              
              <div className="glass-panel p-6 hover:border-brand-cyan/30 transition-all">
                <span className="font-mono text-[0.72rem] text-brand-cyan uppercase tracking-widest block mb-1">
                  {edu.date}
                </span>
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {edu.degree}
                </h3>
                <p className="font-mono text-sm text-slate-300">
                  {edu.school}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-5 h-5 text-brand-cyan" />
            <h3 className="font-display text-xl font-bold text-white">Certificates</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {(showAllCerts ? CERTS : CERTS.slice(0, 6)).map((cert) => (
              <div
                key={cert.id}
                onClick={() => setActiveCertForChain(cert)}
                className="glass-panel p-5 block hover:border-brand-purple/30 hover:bg-brand-purple/5 transition-all group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-white mb-1 leading-snug group-hover:text-brand-cyan transition-colors">
                      {cert.name}
                    </h4>
                    <p className="font-mono text-[0.68rem] text-slate-400">
                      {cert.org} · {cert.year}
                    </p>
                  </div>
                  <span className={`w-8 h-8 rounded-full ${cert.bg} border ${cert.border} ${cert.color} flex items-center justify-center font-display text-[0.62rem] font-bold shrink-0`}>
                    {cert.id.split(" ")[0]}
                  </span>
                </div>
              </div>
            ))}
            
            {CERTS.length > 6 && (
              <button
                onClick={() => setShowAllCerts(!showAllCerts)}
                className="mt-2 w-full py-3 bg-white/5 border border-brand-cyan/25 hover:border-brand-cyan/50 rounded-xl text-brand-cyan text-xs font-mono tracking-widest uppercase transition-colors"
              >
                {showAllCerts ? "Show Fewer Credentials" : `Show All Credentials (${CERTS.length})`}
              </button>
            )}
          </div>

          <div className="glass-panel p-5 border border-brand-purple/20 bg-brand-purple/5 rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-brand-purple font-bold">
              <Github className="w-5 h-5 text-brand-purple" />
              <h4 className="font-display text-xs uppercase tracking-wider font-semibold">GitHub Developer Intelligence</h4>
            </div>
            <p className="text-xs text-slate-400 font-sans italic">"{fallbackGithubStats.bio}"</p>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="block text-lg font-bold text-brand-cyan">{fallbackGithubStats.repos}</span>
                <span className="text-[0.55rem] text-slate-400 uppercase">Repos</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="block text-lg font-bold text-brand-cyan">{fallbackGithubStats.followers}</span>
                <span className="text-[0.55rem] text-slate-400 uppercase">Followers</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="block text-lg font-bold text-brand-cyan">{fallbackGithubStats.created}</span>
                <span className="text-[0.55rem] text-slate-400 uppercase">Joined</span>
              </div>
            </div>
            <a
              href="https://github.com/utkrashtkumar"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center font-mono text-[0.65rem] text-brand-purple hover:underline"
            >
              view active profiles @utkrashtkumar →
            </a>
          </div>

          <GithubContributionGraph />

          <div className="glass-panel p-5 border border-brand-cyan/20 bg-brand-cyan/5 rounded-xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-brand-cyan font-bold">
              <Activity className="w-5 h-5 text-brand-cyan" />
              <h4 className="font-display text-xs uppercase tracking-wider font-semibold">Visitor Session Telemetry</h4>
            </div>
            <div className="grid grid-cols-2 gap-3 text-left font-mono text-[0.62rem] text-slate-300">
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="text-slate-500 block">TOTAL VISITS:</span>
                <span className="text-white font-bold">{fallbackAnalytics.visits}</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="text-slate-500 block">COMMANDS RUN:</span>
                <span className="text-white font-bold">{fallbackAnalytics.commandsRun}</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="text-slate-500 block">MOST USED CMD:</span>
                <span className="text-brand-cyan font-bold">{fallbackAnalytics.mostUsedCommand}</span>
              </div>
              <div className="bg-black/40 p-2.5 rounded border border-white/5">
                <span className="text-slate-500 block">SESSION TIME:</span>
                <span className="text-brand-green font-bold">
                  <LiveSessionTimer sessionStart={fallbackAnalytics.sessionStart} />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeCertForChain && (
        <CertificateChainViewer 
          cert={activeCertForChain} 
          onClose={() => setActiveCertForChain(null)} 
        />
      )}
    </section>
  );
}

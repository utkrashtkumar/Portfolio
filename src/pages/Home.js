import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Radar, Zap, Shield, Network, Download } from 'lucide-react';
import CommandTerminal from '../components/CommandTerminal.js';
import { RevealSection } from '../components/Shared.js';

// Import all section pages to combine on Home screen
import Tools from './Tools.js';
import Skills from './Skills.js';
import Projects from './Projects.js';
import Timeline from './Timeline.js';
import Ctf from './Ctf.js';
import Labs from './Labs.js';
import Portal from './Portal.js';
import Contact from './Contact.js';

const BlackHoleName = ({ text1, text2 }) => {
  return (
    <h1 className="font-display text-[clamp(2.5rem,8vw,5rem)] font-black text-white leading-tight drop-shadow-[0_0_40px_rgba(0,245,255,0.3)] text-center lg:text-left mb-3">
      <span className="text-white hover:text-brand-cyan transition-colors duration-300">{text1}</span>
      <br className="hidden lg:block" />
      <span className="text-white hover:text-brand-cyan transition-colors duration-300">{text2}</span>
    </h1>
  );
};

const HeroRoleTypist = () => {
  const roles = [
    "ETHICAL HACKER",
    "RED TEAM OPERATOR",
    "CYBER SECURITY RESEARCHER"
  ];
  const [currentRoleIdx, setCurrentRoleIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  useEffect(() => {
    const fullText = roles[currentRoleIdx];
    let timer;
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, 40);
    } else {
      timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, displayText.length + 1));
      }, 75);
    }
    if (!isDeleting && displayText === fullText) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setCurrentRoleIdx((prev) => (prev + 1) % roles.length);
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentRoleIdx]);
  return (
    <span className="relative">
      {displayText}
      <span className="w-[3px] h-[1.1em] bg-brand-cyan inline-block ml-1.5 animate-blink align-middle" />
    </span>
  );
};

const RadarSweepWidget = () => {
  return (
    <div className="relative w-32 h-32 rounded-full border border-brand-cyan/20 bg-brand-cyan/5 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,245,255,0.15),transparent)] scale-75" />
      <div className="absolute w-full h-[1px] bg-brand-cyan/30 top-1/2 left-0 animate-pulse" />
      <div className="absolute h-full w-[1px] bg-brand-cyan/30 left-1/2 top-0 animate-pulse" />
      <div className="absolute w-24 h-24 rounded-full border border-dashed border-brand-cyan/15 animate-ping" />
      <div className="absolute w-12 h-12 rounded-full border border-brand-purple/20 animate-pulse" />
      <div className="absolute top-12 left-14 w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_var(--brand-cyan)] animate-ping" />
      <div className="absolute bottom-12 right-10 w-1.5 h-1.5 rounded-full bg-brand-purple animate-ping delay-700 shadow-[0_0_8px_var(--color-brand-purple)]" />
      <span className="absolute bottom-1.5 font-mono text-[0.52rem] text-brand-cyan/60 tracking-wider">SWEEP ACTIVE</span>
    </div>
  );
};

const AnimatedStat = ({ num, label, hasPlus = false, isPercent = false }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = num / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= num) {
        setCount(num);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, num]);
  return (
    <div ref={ref} className="p-6 md:p-8 bg-[var(--bg-base)]/80 backdrop-blur-xl text-center transition-colors duration-300 hover:bg-brand-cyan/5">
      <span className="block font-display text-3xl md:text-5xl font-bold text-brand-cyan drop-shadow-[0_0_20px_rgba(0,245,255,0.4)] leading-none mb-2">
        {count}{hasPlus ? "+" : ""}{isPercent ? "%" : ""}
      </span>
      <span className="font-mono text-[0.68rem] text-slate-400 uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
};

export default function Home({ 
  visitorIntel, 
  onTriggerBreach,
  githubStats,
  analytics,
  ctfSolved,
  setCtfSolved,
  authUser,
  authSession,
  setAuthUser,
  setAuthSession
}) {
  const navigate = useNavigate();
  const [avatar3D, setAvatar3D] = useState({ rotX: 0, rotY: 0, isFlipped: false });

  return (
    <div className="space-y-16">
      {/* 1. HERO SECTION */}
      <section className="min-h-[80vh] flex flex-col lg:flex-row items-center gap-16 py-12 lg:py-0 relative">
        <div className="absolute top-10 lg:top-24 left-1/2 -translate-x-1/2 z-10 w-full flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full font-mono text-xs text-brand-cyan tracking-wider pointer-events-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-blink shadow-[0_0_8px_var(--color-brand-cyan)]" />
            IBM Cybersecurity Analyst
          </div>
        </div>
        
        <div className="flex-1 text-center lg:text-left mt-24 lg:mt-0">
          <BlackHoleName text1="Utkrasht" text2="Kumar" />
          <div className="font-mono text-lg md:text-xl text-brand-cyan tracking-wider mb-8 flex items-center justify-center lg:justify-start gap-1">
            <span>// </span>
            <HeroRoleTypist />
          </div>
          <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-6 font-sans">
            Specialist in offensive security, adversary simulation, and incident response. 
            Securing digital infrastructure by thinking like the attacker — hunting threats 
            before they hunt you.
          </p>
          
          {visitorIntel && (
            <div className="glass-panel p-4 max-w-xl mx-auto lg:mx-0 mb-8 border border-brand-cyan/20 bg-brand-cyan/5 font-mono text-[0.7rem] text-slate-300 rounded-lg relative overflow-hidden text-left shadow-lg">
              <div className="absolute top-0 right-0 px-2 py-0.5 bg-brand-cyan/20 text-brand-cyan text-[0.55rem] font-bold rounded-bl uppercase tracking-wider animate-pulse">
                Active Connection Triangulated
              </div>
              <div className="flex items-center gap-2 mb-2.5 text-brand-cyan font-bold">
                <Radar className="w-3.5 h-3.5 animate-pulse" />
                <span>[SOC TELEMETRY: CLIENT_NODE_DETAILS]</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
                <div><span className="text-brand-cyan/70 font-semibold">PUBLIC_IP:</span> {visitorIntel.ip}</div>
                <div><span className="text-brand-cyan/70 font-semibold">LOCATION:</span> {visitorIntel.city}, {visitorIntel.region}</div>
                <div><span className="text-brand-cyan/70 font-semibold">ASN_ORG:</span> {visitorIntel.org?.substring(0, 24)}</div>
                <div><span className="text-brand-cyan/70 font-semibold">COUNTRY:</span> {visitorIntel.country_name} ({visitorIntel.country_code})</div>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-8 lg:mb-0">
            <button onClick={() => navigate("/projects")} className="px-8 py-3.5 bg-gradient-to-br from-brand-cyan/20 to-brand-cyan/5 border border-brand-cyan/40 rounded-lg text-brand-cyan font-display text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:from-brand-cyan/30 hover:to-brand-cyan/10 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(0,245,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_0_40px_rgba(0,245,255,0.3)] hover:border-brand-cyan/60 backdrop-blur-md cursor-pointer">
              View Projects
            </button>
            <button onClick={() => navigate("/contact")} className="px-8 py-3.5 bg-transparent border border-white/10 rounded-lg text-slate-400 font-display text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:border-brand-purple/40 hover:text-brand-purple hover:-translate-y-0.5 hover:shadow-[0_0_20px_var(--brand-purple)] backdrop-blur-md cursor-pointer">
              Contact Us
            </button>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="px-5 flex items-center gap-2 py-3.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-lg text-brand-cyan font-display text-sm font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-brand-cyan/20 hover:border-brand-cyan/40 hover:-translate-y-0.5 hover:shadow-[0_0_20px_var(--brand-cyan)] backdrop-blur-md">
              <Download className="w-4 h-4" />
              Resume
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center relative py-12 lg:py-0 w-full max-w-[100vw] overflow-visible">
          <div className="relative w-[75vw] h-[75vw] max-w-[380px] max-h-[380px] md:w-[380px] md:h-[380px]">
            <div className="absolute inset-0 rounded-full border border-brand-cyan/20 animate-rotateRing avatar-ring" />
            <div className="absolute inset-5 rounded-full border border-dashed border-brand-purple/30 animate-rotateRingReverse" />
            
            <div
              className="absolute inset-10 rounded-full bg-gradient-to-br from-brand-cyan/10 to-brand-purple/10 border border-brand-cyan/20 backdrop-blur-xl flex items-center justify-center overflow-hidden cursor-pointer shadow-xl select-none"
              onMouseMove={(e) => {
                const box = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - box.left - box.width / 2;
                const y = e.clientY - box.top - box.height / 2;
                setAvatar3D((prev) => ({
                  ...prev,
                  rotX: -(y / box.height) * 25,
                  rotY: x / box.width * 25
                }));
              }}
              onMouseLeave={() => setAvatar3D((prev) => ({ ...prev, rotX: 0, rotY: 0 }))}
              onClick={() => setAvatar3D((prev) => ({ ...prev, isFlipped: !prev.isFlipped }))}
              style={{
                transform: `perspective(600px) rotateX(${avatar3D.rotX}deg) rotateY(${avatar3D.rotY}deg) rotateY(${avatar3D.isFlipped ? 180 : 0}deg)`,
                transition: "transform 0.1s ease-out",
                transformStyle: "preserve-3d"
              }}
            >
              {avatar3D.isFlipped ? (
                <div className="absolute inset-0 rounded-full bg-black/90 border border-brand-purple/40 flex flex-col items-center justify-center p-6 text-center select-none font-mono text-[0.62rem] text-slate-300 gap-1.5 [transform:rotateY(180deg)]">
                  <div className="text-brand-purple font-bold uppercase animate-pulse">[SECURE PROFILE BACKSIDE]</div>
                  <div>UID: UTK_019E_CA</div>
                  <div>CLASS: RED_TEAM_LEAD</div>
                  <div>STATUS: SYSTEM_ACTIVE</div>
                  <div className="text-slate-500 mt-2 text-[0.55rem]">Click to return profile photo</div>
                </div>
              ) : (
                <img src="/profile.png" alt="Profile" className="w-full h-full object-cover animate-fadeIn" />
              )}
            </div>

            <div className="absolute top-2 -right-2 md:top-6 md:right-4 w-12 h-12 rounded-xl bg-[var(--bg-base)]/80 border border-brand-cyan/30 backdrop-blur-md flex flex-col items-center justify-center gap-[2px]">
              <Radar className="w-5 h-5 text-brand-cyan" />
              <span className="font-mono text-[0.55rem] text-brand-cyan leading-none">NMAP</span>
            </div>
            
            <div className="absolute -bottom-2 right-4 md:bottom-8 md:-right-2 w-12 h-12 rounded-xl bg-[var(--bg-base)]/80 border border-brand-purple/30 backdrop-blur-md flex flex-col items-center justify-center gap-[2px]">
              <Zap className="w-5 h-5 text-brand-purple" />
              <span className="font-mono text-[0.55rem] text-brand-purple leading-none">MSF</span>
            </div>
            
            <div className="absolute bottom-6 -left-4 md:bottom-12 md:left-0 w-12 h-12 rounded-xl bg-[var(--bg-base)]/80 border border-brand-green/30 backdrop-blur-md flex flex-col items-center justify-center gap-[2px]">
              <Shield className="w-5 h-5 text-brand-green" />
              <span className="font-mono text-[0.55rem] text-brand-green leading-none">BURP</span>
            </div>

            <div className="absolute top-10 -left-6 md:top-14 md:-left-4 w-12 h-12 rounded-xl bg-[var(--bg-base)]/80 border border-brand-pink/30 backdrop-blur-md flex flex-col items-center justify-center gap-[2px]">
              <Network className="w-5 h-5 text-brand-pink" />
              <span className="font-mono text-[0.55rem] text-brand-pink leading-none">WIRE</span>
            </div>
          </div>
          
          <div className="absolute -bottom-10 -right-4 hidden xl:block z-10">
            <RadarSweepWidget />
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1px] bg-brand-cyan/10 rounded-xl overflow-hidden border border-brand-cyan/20 my-16 shadow-2xl animate-fadeIn">
        <AnimatedStat num={3} label="Years Experience" />
        <AnimatedStat num={340} label="Vulns Discovered" hasPlus />
        <AnimatedStat num={12} label="CVEs Authored" />
        <AnimatedStat num={98} label="Threat Neutralized" isPercent />
      </div>

      {/* 3. SECURE COMMAND TERMINAL */}
      <CommandTerminal onTriggerBreach={onTriggerBreach} />

      {/* 4. OTHER COMBINED PORTFOLIO SECTIONS */}
      <RevealSection>
        <Tools authUser={authUser} />
      </RevealSection>

      <RevealSection>
        <Skills authUser={authUser} />
      </RevealSection>

      <RevealSection>
        <Projects />
      </RevealSection>

      <RevealSection>
        <Timeline githubStats={githubStats} analytics={analytics} ctfSolved={ctfSolved} authUser={authUser} />
      </RevealSection>

      <RevealSection>
        <Ctf setCtfSolved={setCtfSolved} />
      </RevealSection>

      <RevealSection>
        <Labs ctfSolved={ctfSolved} />
      </RevealSection>

      <RevealSection>
        <Portal 
          authUser={authUser} 
          authSession={authSession} 
          setAuthUser={setAuthUser} 
          setAuthSession={setAuthSession} 
        />
      </RevealSection>

      <RevealSection>
        <Contact ctfSolved={ctfSolved} />
      </RevealSection>
    </div>
  );
}

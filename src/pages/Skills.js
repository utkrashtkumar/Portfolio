import React, { useState, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Crosshair, Shield, Cpu } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

const SKILL_GROUPS = [
  {
    category: "Offensive Security",
    icon: <Crosshair className="w-5 h-5 text-red-500" />,
    skills: [
      { name: "Penetration Testing", pct: 97, color: "from-brand-cyan/40 to-brand-cyan" },
      { name: "Red Teaming / OPSEC", pct: 90, color: "from-brand-cyan/40 to-brand-cyan" },
      { name: "Kali Linux", pct: 95, color: "from-brand-cyan/40 to-brand-cyan" }
    ]
  },
  {
    category: "Defense & Forensics",
    icon: <Shield className="w-5 h-5 text-brand-green" />,
    skills: [
      { name: "Incident Response", pct: 88, color: "from-brand-green/40 to-brand-green" },
      { name: "Threat Intelligence", pct: 91, color: "from-brand-green/40 to-brand-green" },
      { name: "Network Forensics", pct: 94, color: "from-brand-green/40 to-brand-green" }
    ]
  },
  {
    category: "Cloud & Engineering",
    icon: <Cpu className="w-5 h-5 text-brand-purple" />,
    skills: [
      { name: "Cloud Security (AWS/GCP)", pct: 79, color: "from-brand-purple/40 to-brand-purple" },
      { name: "Reverse Engineering", pct: 76, color: "from-brand-purple/40 to-brand-purple" },
      { name: "Malware Analysis", pct: 83, color: "from-brand-purple/40 to-brand-purple" }
    ]
  }
];

const SkillNetworkGraph = () => {
  const nodes = [
    { id: "Recon", group: "Offensive", val: 12, label: "Reconnaissance" },
    { id: "PenTest", group: "Offensive", val: 18, label: "Pen Testing" },
    { id: "RedTeam", group: "Offensive", val: 16, label: "Red Teaming" },
    { id: "Kali", group: "Offensive", val: 14, label: "Kali Linux" },
    { id: "IncResp", group: "Defense", val: 15, label: "Incident Response" },
    { id: "ThreatIntel", group: "Defense", val: 17, label: "Threat Intel" },
    { id: "Forensics", group: "Defense", val: 15, label: "Forensics" },
    { id: "CloudSec", group: "Engineering", val: 14, label: "Cloud Security" },
    { id: "RevEng", group: "Engineering", val: 13, label: "Reverse Eng" },
    { id: "Malware", group: "Engineering", val: 16, label: "Malware Analysis" }
  ];
  
  const links = [
    { source: "Recon", target: "PenTest" },
    { source: "PenTest", target: "RedTeam" },
    { source: "Kali", target: "PenTest" },
    { source: "Kali", target: "Recon" },
    { source: "IncResp", target: "ThreatIntel" },
    { source: "IncResp", target: "Forensics" },
    { source: "ThreatIntel", target: "RedTeam" },
    { source: "CloudSec", target: "RedTeam" },
    { source: "RevEng", target: "Malware" },
    { source: "Malware", target: "Forensics" },
    { source: "Malware", target: "PenTest" }
  ];

  const nodePositions = {
    Recon: { x: 70, y: 150 },
    PenTest: { x: 170, y: 110 },
    RedTeam: { x: 270, y: 140 },
    Kali: { x: 90, y: 60 },
    IncResp: { x: 370, y: 220 },
    ThreatIntel: { x: 390, y: 110 },
    Forensics: { x: 290, y: 240 },
    CloudSec: { x: 230, y: 50 },
    RevEng: { x: 190, y: 280 },
    Malware: { x: 140, y: 210 }
  };

  const [activeNode, setActiveNode] = useState(null);

  return (
    <div className="glass-panel p-6 flex flex-col items-center select-none w-full relative overflow-visible min-h-[380px]">
      <div className="text-center mb-4">
        <h4 className="font-display text-sm font-bold text-brand-cyan tracking-wider">SKILLS KNOWLEDGE RELATIONSHIP TREE</h4>
        <p className="text-[0.62rem] font-mono text-slate-400">Click a node to inspect cybersecurity knowledge node dependencies</p>
      </div>

      <div className="relative w-full max-w-[500px] h-[320px] bg-black/30 rounded-xl border border-white/5 overflow-hidden flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 500 320">
          {links.map((link, i) => {
            const p1 = nodePositions[link.source];
            const p2 = nodePositions[link.target];
            if (!p1 || !p2) return null;
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="rgba(0, 245, 255, 0.15)"
                strokeWidth="1.5"
                className="animate-pulse"
              />
            );
          })}

          {nodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;
            const isActive = activeNode?.id === node.id;
            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setActiveNode(node)}
                className="cursor-pointer group"
              >
                <circle
                  r={node.val / 1.5 + (isActive ? 4 : 0)}
                  fill={node.group === "Offensive" ? "rgba(239, 68, 68, 0.8)" : node.group === "Defense" ? "rgba(34, 197, 94, 0.8)" : "rgba(168, 85, 247, 0.8)"}
                  stroke={isActive ? "#ffffff" : "rgba(255,255,255,0.1)"}
                  strokeWidth="2"
                  style={{ filter: isActive ? "drop-shadow(0 0 8px rgba(0,245,255,0.8))" : "none" }}
                />
                <text
                  y={node.val / 1.2 + 8}
                  textAnchor="middle"
                  className="font-mono text-[0.52rem] fill-slate-300 font-semibold uppercase tracking-wider pointer-events-none select-none"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>

        {activeNode && (
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/90 border border-brand-cyan/30 rounded-lg text-left font-mono text-[0.62rem] text-slate-300 flex justify-between items-start backdrop-blur-md">
            <div>
              <div className="text-brand-cyan font-bold uppercase">{activeNode.label}</div>
              <div>Category: <span className="text-white">{activeNode.group} Sector</span></div>
              <div>Dependency connections: <span className="text-white">Active</span></div>
            </div>
            <button
              onClick={() => setActiveNode(null)}
              className="text-slate-400 hover:text-white"
            >
              [X]
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SkillReticle = ({ skill, inView }) => {
  const radius = 28;
  const stroke = 3;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (inView ? skill.pct : 0) / 100 * circumference;

  return (
    <div className="flex flex-col items-center p-4 bg-white/5 border border-white/5 rounded-xl hover:border-brand-cyan/25 transition-all hover:bg-brand-cyan/5">
      <div className="relative w-16 h-16 flex items-center justify-center mb-3">
        <svg className="w-16 h-16 -rotate-90">
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="32"
            cy="32"
          />
          <motion.circle
            stroke="var(--brand-cyan)"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={inView ? { strokeDashoffset } : { strokeDashoffset: circumference }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            r={normalizedRadius}
            cx="32"
            cy="32"
            strokeLinecap="round"
            style={{ filter: "drop-shadow(0 0 4px var(--brand-cyan))" }}
          />
        </svg>
        <span className="absolute font-display text-xs font-bold text-slate-200">{skill.pct}%</span>
      </div>
      <span className="font-mono text-[0.7rem] text-slate-400 text-center uppercase tracking-wider leading-tight min-h-[2rem] flex items-center justify-center">
        {skill.name}
      </span>
    </div>
  );
};

export default function Skills() {
  const [activeSkillView, setActiveSkillView] = useState('grid');
  const skillsRef = useRef(null);
  const skillsInView = useInView(skillsRef, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-12 animate-fadeIn" ref={skillsRef}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <SectionHeader num="03" title="Proficiency Registers" />
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1 font-mono text-[0.62rem] gap-1 select-none shrink-0 self-center">
          <button
            onClick={() => setActiveSkillView("grid")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${activeSkillView === "grid" ? "bg-brand-cyan/20 text-brand-cyan font-bold shadow-[0_0_8px_rgba(0,245,255,0.2)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            GRID VIEW
          </button>
          <button
            onClick={() => setActiveSkillView("graph")}
            className={`px-3 py-1 rounded transition-colors cursor-pointer ${activeSkillView === "graph" ? "bg-brand-cyan/20 text-brand-cyan font-bold shadow-[0_0_8px_rgba(0,245,255,0.2)]" : "text-slate-400 hover:text-slate-200"}`}
          >
            RELATIONSHIP GRAPH
          </button>
        </div>
      </div>

      {activeSkillView === "grid" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {SKILL_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx} className="glass-panel p-8 flex flex-col border border-white/5 hover:border-brand-cyan/20 transition-all">
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  {group.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {group.category}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {group.skills.map((skill, skillIdx) => (
                  <SkillReticle key={skillIdx} skill={skill} inView={skillsInView} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SkillNetworkGraph />
      )}
    </section>
  );
}

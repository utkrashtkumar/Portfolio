import React from 'react';
import { Radar, Zap, Shield, Network, Activity, Fingerprint } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

const ARSENAL_TOOLS = [
  { id: 1, icon: <Radar className="w-6 h-6 text-brand-cyan animate-pulse" />, name: "Nmap / Masscan", category: "Reconnaissance", desc: "Advanced network scanning, port discovery, OS fingerprinting, and service version detection across enterprise networks.", bg: "bg-brand-cyan/10" },
  { id: 2, icon: <Zap className="w-6 h-6 text-brand-purple" />, name: "Metasploit Framework", category: "Exploitation", desc: "Post-exploitation, payload generation, privilege escalation, and pivoting through segmented network environments.", bg: "bg-brand-purple/10" },
  { id: 3, icon: <Shield className="w-6 h-6 text-brand-green" />, name: "Burp Suite Pro", category: "Web Security", desc: "OWASP Top 10 testing, automated scanning, fuzzing, IDOR, SSRF, SQLi, XSS, and auth bypass discovery.", bg: "bg-brand-green/10" },
  { id: 4, icon: <Network className="w-6 h-6 text-brand-pink" />, name: "Wireshark / Zeek", category: "Network Forensics", desc: "Deep packet inspection, C2 traffic analysis, lateral movement detection, and protocol anomaly identification.", bg: "bg-brand-pink/10" },
  { id: 5, icon: <Activity className="w-6 h-6 text-yellow-400" />, name: "Splunk / CrowdStrike", category: "SIEM / EDR", desc: "Threat correlation, SOC alert triage, custom detection rules, MITRE ATT&CK framework mapping and hunting.", bg: "bg-yellow-400/10" },
  { id: 6, icon: <Fingerprint className="w-6 h-6 text-red-500" />, name: "Ghidra / IDA Pro", category: "Malware Analysis", desc: "Static and dynamic analysis, reverse engineering malware, deobfuscation, and behavioral sandboxing.", bg: "bg-red-500/10" }
];

export default function Tools() {
  return (
    <section id="tools" className="py-12 animate-fadeIn">
      <SectionHeader num="02" title="Offensive Arsenal" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARSENAL_TOOLS.map((tool) => (
          <div key={tool.id} className="glass-panel p-6 sm:p-8 transition-transform duration-300 hover:-translate-y-1 hover:border-brand-cyan/30 group cursor-default">
            <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-5 border border-white/5 group-hover:scale-110 transition-transform duration-300`}>
              {tool.icon}
            </div>
            <div className="font-mono text-[0.68rem] text-brand-cyan uppercase tracking-widest mb-2">
              {tool.category}
            </div>
            <h3 className="font-display text-lg font-bold text-white mb-3">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              {tool.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

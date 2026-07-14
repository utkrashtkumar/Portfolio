import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

const PROJECTS = [
  {
    title: "Operation Ghost Protocol",
    tag: "Red Team",
    tagColor: "text-red-500 border-red-500/30 bg-red-500/10",
    difficulty: "Critical",
    desc: "Full-scope red team engagement against a Fortune 500 financial institution. Achieved domain admin in under 72 hours via spear phishing + NTLM relay chain. Zero detection by incumbent EDR.",
    tags: ["Cobalt Strike", "BloodHound", "Responder", "NTLM Relay"],
    overview: "Full-scope adversary simulation designed to test security detection, network isolation, and incident response teams of a financial enterprise.",
    attackLogs: [
      "[*] Initial Access: Emailed targeted spearphishing attachments with custom macro payload.",
      "[+] Shell established on workstation WRK-109. HTTPS C2 traffic initiated.",
      "[*] Active Directory Mapping: Dispatched BloodHound; mapped local admin paths.",
      "[*] LLMNR Poisoning: Ran Responder; intercepted authentication hashes.",
      "[+] Relayed Admin hash to critical database DB-SEC-01.",
      "[+] Compromised Domain Controller via DCSync replication exploit.",
      "[SUCCESS] Domain Administrator compromised. Operations completed."
    ],
    mitigation: "Implement SMB signing across the intranet. Disable legacy LLMNR and NetBIOS protocols. Enforce administrative tiering to restrict admin sessions to domain controllers."
  },
  {
    title: "ShadowNet SIEM Build",
    tag: "Detection",
    tagColor: "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10",
    difficulty: "High",
    desc: "Architected a custom Splunk SIEM with 200+ correlation rules mapped to MITRE ATT&CK. Reduced mean time-to-detect from 4.2 hours to 11 minutes across a 15,000-endpoint environment.",
    tags: ["Splunk", "MITRE ATT&CK", "Python", "ELK Stack"],
    overview: "A centralized log collection and security auditing system mapped directly to MITRE threat techniques, generating automated security playbooks.",
    attackLogs: [
      "[*] Integrating system telemetry logs (Security Event 4624, Sysmon 1/11).",
      "[*] Writing correlation search for Pass-the-Hash detection algorithms.",
      "[*] Anomaly detected: Multiple failed logins followed by instant remote script launch.",
      "[+] Dispatched automated incident containment via SOAR playbook endpoint API.",
      "[+] Local machine quarantined successfully in Active Directory.",
      "[SUCCESS] Threat progression halted. Attack vector neutralized in 11 minutes."
    ],
    mitigation: "Ensure endpoint logs are forwarded to Splunk instantly. Apply alert filtering rules to lower alerts on benign services. Regularly update threat maps."
  },
  {
    title: "CVE-2024-38291 Discovery",
    tag: "Research",
    tagColor: "text-brand-green border-brand-green/30 bg-brand-green/10",
    difficulty: "Critical",
    desc: "Discovered critical unauthenticated RCE in widely-deployed VPN appliance affecting 80,000+ devices globally. Coordinated disclosure with vendor, CISA advisory issued within 30 days.",
    tags: ["Ghidra", "Fuzzing", "PoC Dev", "CVD Process"],
    overview: "Discovered a stack-based buffer overflow in the VPN gateway authentication daemon. A crafted request could execute arbitrary binary code without credentials.",
    attackLogs: [
      "[*] Reverse Engineering: Dissassembling VPN auth daemon in Ghidra.",
      "[*] Vulnerability: Identified unchecked strcpy call writing into local stack buffer.",
      "[*] Exploitation development: Bypassing ASLR and DEP using custom ROP chain.",
      "[+] Created stable Proof of Concept (PoC) exploit executing remote shellcode.",
      "[+] Coordinated vulnerability disclosure (CVD) process initialized with vendor.",
      "[SUCCESS] CVE-2024-38291 assigned. Security patch deployed globally."
    ],
    mitigation: "Upgrade VPN appliance firmware to version 12.4.2 immediately. Restrict access to administration console ports to internal trusted networks."
  },
  {
    title: "CloudBreaker Assessment",
    tag: "Cloud PenTest",
    tagColor: "text-brand-purple border-brand-purple/30 bg-brand-purple/10",
    difficulty: "High",
    desc: "Comprehensive AWS environment penetration test revealing IAM privilege escalation paths, S3 bucket misconfigurations, and Lambda injection vectors resulting in full account compromise.",
    tags: ["AWS", "Pacu", "ScoutSuite", "IAM"],
    overview: "An offensive assessment focused on IAM roles, serverless injection points, and object storage exposure inside an AWS multi-account setup.",
    attackLogs: [
      "[*] Mapping: Scanning cloud perimeter via public endpoint indicators.",
      "[+] Discovered exposed IAM API access key inside public Github repo.",
      "[*] Privilege Escalation: Exploited iam:CreateNewPolicy to elevate target role.",
      "[*] Account Compromise: Gained administrative control of primary organization console.",
      "[+] Bypassed cloudtrail logging records via configuration modifications.",
      "[SUCCESS] Full cloud tenancy takeover accomplished. Reports finalized."
    ],
    mitigation: "Implement automated repository scanning for secrets (GitGuardian). Restrict iam:* actions using strict boundary policies. Enable MFA on delete roles."
  },
  {
    title: "Service Center Management System",
    tag: "Java Project",
    tagColor: "text-brand-pink border-brand-pink/30 bg-brand-pink/10",
    difficulty: "Medium",
    desc: "Developed a robust service center management application. Implemented customer and repair record management modules, featuring seamless integration with an Oracle database backend for persistent data storage and retrieval.",
    tags: ["Java", "Advanced Java", "Oracle Database"],
    overview: "An enterprise management software designed for service repair systems. Features role-based access control, data encryption, and robust transaction logs.",
    attackLogs: [
      "[*] Establishing Oracle Database connection parameters securely.",
      "[*] Implemented PreparedStatement queries to completely prevent SQL injection.",
      "[*] Created encryption methods for customer records using AES-128.",
      "[SUCCESS] Secure service database active. Transaction consistency achieved."
    ],
    mitigation: "Implement database connection pooling. Rotate database credentials every 90 days. Store connection configuration keys securely in environment vars."
  },
  {
    title: "Library Management System",
    tag: "Java Project",
    tagColor: "text-brand-cyan border-brand-cyan/30 bg-brand-cyan/10",
    difficulty: "Medium",
    desc: "Developed a comprehensive library management application. Implemented book inventory and user record management modules, featuring seamless integration with a MySQL database backend for reliable data storage and tracking.",
    tags: ["Java", "Advanced Java", "MySQL"],
    overview: "Developed a scalable library resource allocation application containing admin and student access tiers, complete with return calendars and fine estimation algorithms.",
    attackLogs: [
      "[*] Initializing MySQL schema for catalog search index.",
      "[*] Added validation triggers on student checkout roles.",
      "[SUCCESS] MySQL transaction logging configured. Data integrity confirmed."
    ],
    mitigation: "Add SSL encryption to database connection strings. Restrict user privileges in MySQL schemas to execute only required stored procedures."
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [modalTab, setModalTab] = useState('overview');

  return (
    <section id="projects" className="py-12 animate-fadeIn">
      <SectionHeader num="04" title="Operations & Exploits" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PROJECTS.map((proj, i) => (
          <div
            key={i}
            onClick={() => {
              setSelectedProject(proj);
              setModalTab("overview");
            }}
            className="glass-panel p-8 transition-all duration-300 hover:border-brand-cyan/30 hover:bg-brand-cyan/5 hover:-translate-y-1 group cursor-pointer"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
              <h3 className="font-display text-xl font-bold text-white group-hover:text-brand-cyan transition-colors">
                {proj.title}
              </h3>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[0.6rem] px-2.5 py-0.5 rounded border uppercase tracking-wider ${proj.difficulty === "Critical" ? "text-red-400 border-red-500/30 bg-red-500/10" : proj.difficulty === "High" ? "text-yellow-400 border-yellow-500/30 bg-yellow-500/10" : "text-blue-400 border-blue-500/30 bg-blue-500/10"}`}>
                  {proj.difficulty}
                </span>
                <span className={`font-mono text-[0.65rem] px-3 py-1 rounded border uppercase tracking-widest whitespace-nowrap ${proj.tagColor}`}>
                  {proj.tag}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-6 font-sans">
              {proj.desc}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {proj.tags.map((t, idx) => (
                <span key={idx} className="font-mono text-[0.65rem] px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-400">
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-brand-cyan opacity-80 group-hover:opacity-100 transition-opacity">
              <span>Decompress incident folder</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED PROJECT MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-[var(--bg-base)] border border-brand-cyan/30 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(0,245,255,0.15)]"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-black/40 px-6 py-4 border-b border-brand-cyan/10 flex items-center justify-between">
                <div>
                  <span className={`font-mono text-[0.62rem] px-2 py-0.5 rounded border ${selectedProject.tagColor} uppercase tracking-wider`}>
                    {selectedProject.tag}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white mt-2">
                    {selectedProject.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-brand-cyan/10 bg-black/25">
                <button 
                  onClick={() => setModalTab('overview')}
                  className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all ${modalTab === 'overview' ? 'text-brand-cyan border-brand-cyan bg-brand-cyan/5' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setModalTab('logs')}
                  className={`flex-1 py-3 font-mono text-xs uppercase tracking-widest border-b-2 transition-all ${modalTab === 'logs' ? 'text-brand-cyan border-brand-cyan bg-brand-cyan/5' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
                >
                  Exploitation & Telemetry Logs
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1 text-slate-300 font-sans text-sm space-y-6">
                {modalTab === 'overview' ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                    <div>
                      <h4 className="font-mono text-xs uppercase text-brand-cyan tracking-widest mb-1.5">[!] Objective</h4>
                      <p className="leading-relaxed font-sans">{selectedProject.overview}</p>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs uppercase text-brand-cyan tracking-widest mb-1.5">[!] Core Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tags.map((t, idx) => (
                          <span key={idx} className="font-mono text-[0.68rem] px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-mono text-xs uppercase text-brand-purple tracking-widest mb-1.5">[!] Remediation Measures</h4>
                      <p className="leading-relaxed text-slate-400 border-l-2 border-brand-purple/50 pl-4 py-1 italic font-sans">
                        {selectedProject.mitigation}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="bg-black/80 rounded-xl border border-brand-cyan/10 p-5 font-mono text-[0.72rem] text-slate-300 space-y-2 leading-relaxed">
                      <div className="text-brand-cyan border-b border-brand-cyan/10 pb-2 mb-3">
                        [!] INCIDENT REPORT TELEMETRY DUMP
                      </div>
                      {selectedProject.attackLogs.map((log, idx) => (
                        <div 
                          key={idx} 
                          className={
                            log.startsWith('[SUCCESS]') ? 'text-brand-green font-semibold' :
                            log.startsWith('[+]') ? 'text-brand-cyan' : 'text-slate-400'
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-black/40 px-6 py-4 border-t border-brand-cyan/10 flex items-center justify-end">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 bg-brand-cyan/10 border border-brand-cyan/25 rounded-lg text-brand-cyan font-mono text-xs hover:bg-brand-cyan/20 transition-colors"
                >
                  Close Session
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

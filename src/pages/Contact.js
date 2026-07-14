import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Mail, Linkedin, Github, Twitter, Facebook, Instagram, Ghost, Target, Box, Lock, Unlock, Check, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/Shared.js';

export default function Contact({ ctfSolved }) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState('idle'); // idle | handshake | success | error
  const [handshakeLogs, setHandshakeLogs] = useState([]);
  const [captcha, setCaptcha] = useState(() => ({
    num1: Math.floor(Math.random() * 10) + 1,
    num2: Math.floor(Math.random() * 10) + 1
  }));
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== captcha.num1 + captcha.num2) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setFormState("handshake");
    setHandshakeLogs([]);

    const logs = [
      "[~] Initiating handshake tunnel with api.web3forms.com...",
      "[*] Exchanging Ephemeral Diffie-Hellman Keys (X25519)...",
      "[+] Tunnel established. Cypher Suite: TLS_AES_256_GCM_SHA384",
      "[*] Encrypting message block metadata with AES-256-GCM...",
      "[*] Packing request parameters and anti-CSRF challenge token...",
      "[~] Dispatching payload securely over HTTPS POST..."
    ];

    for (let i = 0; i < logs.length; i++) {
      setHandshakeLogs((prev) => [...prev, logs[i]]);
      await new Promise((r) => setTimeout(r, 600));
    }

    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "3b9023d3-2f5f-4c1d-87aa-458df60dcee3");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setHandshakeLogs((prev) => [...prev, "[SUCCESS] Transmission ACK received. Session terminated successfully."]);
        await new Promise((r) => setTimeout(r, 800));
        setFormState("success");
        setCaptcha({ num1: Math.floor(Math.random() * 10) + 1, num2: Math.floor(Math.random() * 10) + 1 });
        setCaptchaAnswer("");
      } else {
        setFormState("error");
      }
    } catch (err) {
      setFormState("error");
    }
  };

  return (
    <section id="contact" className="py-12 animate-fadeIn">
      <SectionHeader num="06" title="Establish Connection" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="glass-panel p-6 md:p-8 flex flex-col">
            <div className="mb-6">
              <h3 className="font-display text-2xl font-bold text-white mb-3">
                Secure Threat Intelligence Pipeline
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed font-sans">
                Available for red team operations, infrastructure assessments, compliance audits, and advanced consulting.
              </p>
            </div>
            
            <div className="space-y-5">
              <div className="flex items-center gap-4 font-mono text-[0.82rem] text-slate-400">
                <div className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <a href="mailto:utkrashtkumar@gmail.com" className="hover:text-brand-cyan transition-colors break-all">utkrashtkumar@gmail.com</a>
              </div>
              
              <div className="flex flex-wrap items-center gap-2.5">
                <a href="https://www.linkedin.com/in/utkrashtkumar/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="https://github.com/utkrashtkumar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1">
                  <Github className="w-4 h-4" />
                </a>
                <a href="https://x.com/utkrashtkumar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://www.facebook.com/utkrashtkumarr/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/utkrashtkumarr/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="https://www.snapchat.com/@utkrashtkumarr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1" title="Snapchat">
                  <Ghost className="w-4 h-4" />
                </a>
                <a href="https://tryhackme.com/p/utkrashtkumar" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1" title="TryHackMe">
                  <Target className="w-4 h-4" />
                </a>
                <a href="https://profile.hackthebox.com/profile/019e30e3-c6d4-73c2-b21b-45ce64cd170a" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan hover:bg-brand-cyan/20 transition-all hover:-translate-y-1" title="HackTheBox">
                  <Box className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-8 md:p-10 relative overflow-hidden min-h-[400px]">
          {formState === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full space-y-4 text-center py-10"
            >
              <div className="w-16 h-16 rounded-full bg-brand-green/10 border border-brand-green/20 flex items-center justify-center text-brand-green">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-brand-cyan">Secure Dispatch Complete</h3>
              <p className="text-slate-400 font-mono text-xs">Your transmission logs were written and sent correctly.</p>
              <button onClick={() => setFormState("idle")} className="mt-4 px-6 py-2 border border-brand-cyan/40 rounded-lg text-brand-cyan font-mono text-xs tracking-widest uppercase transition-all duration-300 hover:bg-brand-cyan/10">
                Reset Session
              </button>
            </motion.div>
          ) : formState === "handshake" ? (
            <div className="flex flex-col justify-between h-full space-y-4 font-mono text-[0.72rem] text-slate-300 py-4 min-h-[300px]">
              <div className="space-y-2">
                <div className="text-brand-cyan border-b border-brand-cyan/10 pb-2 mb-4 font-bold tracking-widest uppercase">
                  [!] CRYPTO HANDSHAKE LOGS
                </div>
                {handshakeLogs.map((log, index) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index}
                    className={log.startsWith("[SUCCESS]") ? "text-brand-green font-bold" : log.startsWith("[-]") ? "text-red-400" : "text-slate-400"}
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
              <div className="w-full flex items-center justify-center">
                <div className="w-5 h-5 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-mono text-[0.72rem] text-slate-400 uppercase tracking-widest mb-2">Operator Name</label>
                <input type="text" name="name" required placeholder="John Doe" className="w-full px-5 py-3.5 bg-white/5 border border-brand-cyan/20 rounded-lg text-white font-sans text-sm outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all" />
              </div>
              <div>
                <label className="block font-mono text-[0.72rem] text-slate-400 uppercase tracking-widest mb-2">Secure Routing Address (Email)</label>
                <input type="email" name="email" required placeholder="john@example.com" className="w-full px-5 py-3.5 bg-white/5 border border-brand-cyan/20 rounded-lg text-white font-sans text-sm outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all" />
              </div>
              <div>
                <label className="block font-mono text-[0.72rem] text-slate-400 uppercase tracking-widest mb-2">Affiliation / Entity</label>
                <input type="text" name="organization" placeholder="Acme Corp" className="w-full px-5 py-3.5 bg-white/5 border border-brand-cyan/20 rounded-lg text-white font-sans text-sm outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all" />
              </div>
              <div>
                <label className="block font-mono text-[0.72rem] text-slate-400 uppercase tracking-widest mb-2">Encrypted Payload Message</label>
                <textarea name="message" required placeholder="Describe your security challenge or objective..." rows={3} className="w-full px-5 py-3.5 bg-white/5 border border-brand-cyan/20 rounded-lg text-white font-sans text-sm outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all resize-none" />
              </div>
              
              <div>
                <label className="block font-mono text-[0.72rem] text-slate-400 uppercase tracking-widest mb-2">Integrity Challenge: {captcha.num1} + {captcha.num2} = ?</label>
                <input
                  type="number"
                  required
                  placeholder="Calculate checksum to proceed"
                  value={captchaAnswer}
                  onChange={(e) => {
                    setCaptchaAnswer(e.target.value);
                    setCaptchaError(false);
                  }}
                  className={`w-full px-5 py-3.5 bg-white/5 border ${captchaError ? "border-red-500" : "border-brand-cyan/20"} rounded-lg text-white font-sans text-sm outline-none focus:border-brand-cyan/50 focus:bg-brand-cyan/5 transition-all`}
                />
                {captchaError && <div className="text-red-400 text-xs font-mono mt-2">Invalid session integrity sum.</div>}
              </div>

              {formState === "error" && (
                <div className="text-red-400 text-sm font-mono mt-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>Decryption tunnel collapsed. Please try again.</span>
                </div>
              )}
              
              <button type="submit" className="w-full px-8 py-4 bg-gradient-to-br from-brand-cyan/20 to-brand-cyan/5 border border-brand-cyan/40 rounded-lg text-brand-cyan font-mono text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:from-brand-cyan/30 hover:to-brand-cyan/10 hover:shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:border-brand-cyan/60 mt-4">
                Initialize Handshake
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

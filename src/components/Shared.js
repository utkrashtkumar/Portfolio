import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';

export const SectionHeader = ({ num, title }) => {
  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="font-mono text-xs text-brand-cyan px-2.5 py-1 bg-brand-cyan/5 border border-brand-cyan/20 rounded">
        {num}
      </div>
      <h2 className="font-display text-lg font-bold text-white tracking-wider uppercase">
        {title}
      </h2>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  );
};

export const RevealSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const PremiumLock = ({ title = "CLASSIFIED MODULE", desc = "Register or sign in to a FREE account to unlock premium simulators, tools, and classified laboratory files. Access is completely free." }) => {
  return (
    <div className="absolute inset-0 bg-black/75 backdrop-blur-md border border-brand-purple/20 rounded-xl flex flex-col items-center justify-center text-center p-4 space-y-3 z-20">
      <div className="w-9 h-9 rounded-full bg-brand-purple/10 border border-brand-purple/35 flex items-center justify-center text-brand-purple animate-pulse">
        <Lock className="w-3.5 h-3.5" />
      </div>
      <div className="space-y-1 max-w-[220px]">
        <h5 className="font-display font-bold text-white text-[0.68rem] uppercase tracking-wider flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-purple animate-pulse" /> {title}
        </h5>
        <p className="text-slate-400 text-[0.58rem] leading-normal font-sans">
          {desc}
        </p>
      </div>
      <Link
        to="/portal"
        className="px-3 py-1.5 bg-brand-purple/20 hover:bg-brand-purple/30 border border-brand-purple/40 text-brand-purple font-mono text-[0.58rem] rounded uppercase font-bold tracking-widest cursor-pointer transition-all active:scale-95 no-underline"
      >
        🔓 Unlock Premium Access
      </Link>
    </div>
  );
};

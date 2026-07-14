import React from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

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

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MainCanvasProps {
  children: React.ReactNode;
  title: string;
  description: string;
  stepDescription?: string;
  stepType?: 'compare' | 'swap' | 'sorted' | 'info' | 'visit' | 'edge' | 'data';
}

const TYPE_CONFIG = {
  swap:    { border: 'border-secondary/30',     bg: 'bg-secondary/10',     text: 'text-secondary',     icon: '⇄', glow: 'shadow-secondary/20' },
  compare: { border: 'border-primary/30',      bg: 'bg-primary/10',      text: 'text-primary',      icon: '?', glow: 'shadow-primary/20' },
  sorted:  { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', icon: '✓', glow: 'shadow-emerald-500/20' },
  info:    { border: 'border-primary/20',     bg: 'bg-primary/10',     text: 'text-primary',     icon: 'i', glow: 'shadow-primary/20' },
  visit:   { border: 'border-primary/30',     bg: 'bg-primary/10',     text: 'text-primary',     icon: '⊙', glow: 'shadow-primary/20' },
  edge:    { border: 'border-amber-500/30',   bg: 'bg-amber-500/10',   text: 'text-amber-400',   icon: '→', glow: 'shadow-amber-500/20' },
  data:    { border: 'border-blue-500/30',    bg: 'bg-blue-500/10',    text: 'text-blue-400',    icon: '▤', glow: 'shadow-blue-500/20' },
};

const MainCanvas: React.FC<MainCanvasProps> = ({ children, title, description, stepDescription, stepType = 'info' }) => {
  const typeStyle = TYPE_CONFIG[stepType];

  return (
    <main className="flex-1 relative overflow-hidden flex flex-col min-h-0">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] [background-size:128px_128px]" />
      </div>

      {/* Header */}
      <div className="p-8 pb-4 shrink-0 relative z-10 flex justify-between items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black text-white tracking-tight">{title}</h2>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--color-primary),1)]" />
          </div>
          <p className="text-slate-500 text-xs font-medium max-w-2xl leading-relaxed">{description}</p>
        </div>

        {/* Step description badge */}
        <AnimatePresence mode="wait">
          {stepDescription && (
            <motion.div
              key={stepDescription}
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-[11px] font-black tracking-wide shrink-0 shadow-2xl ${typeStyle.bg} ${typeStyle.border} ${typeStyle.text} ${typeStyle.glow}`}
            >
              <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-sm font-black">
                {typeStyle.icon}
              </div>
              <span className="uppercase">{stepDescription}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Canvas area */}
      <div className="flex-1 p-8 pt-4 relative z-10 flex items-center justify-center min-h-0">
        <div className="w-full h-full max-w-6xl glass-dark rounded-[2.5rem] p-8 shadow-2xl relative group border border-white/10 overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[2.5rem]" />
          
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default MainCanvas;

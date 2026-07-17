import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Variable, Activity, Cpu } from 'lucide-react';
import { cn } from '../../utils/cn';

interface RightPanelProps {
  pseudocode: string[];
  activeLine: number;
  variables: Record<string, unknown>;
  complexity: { 
    time: string; 
    space: string; 
  };
  queue?: string[];
  stack?: string[];
}

const RightPanel: React.FC<RightPanelProps> = ({
  pseudocode,
  activeLine,
  variables,
  complexity,
  queue,
  stack
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Complexity Section */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-secondary/10 text-secondary border border-secondary/20 shadow-lg shadow-secondary/5">
            <Activity size={18} />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Complexity</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1.5 group-hover:text-primary transition-colors">Time</span>
            <span className="text-base font-black text-white group-hover:scale-105 transition-transform block">{complexity.time}</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all group">
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest block mb-1.5 group-hover:text-secondary transition-colors">Space</span>
            <span className="text-base font-black text-white group-hover:scale-105 transition-transform block">{complexity.space}</span>
          </div>
        </div>
      </div>

      <div className="h-px bg-white/5 mx-6" />

      {/* Variables Section */}
      <div className="p-6 flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
              <Variable size={18} />
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">State</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          <AnimatePresence mode="popLayout">
            {Object.entries(variables).map(([key, value]) => (
              <motion.div
                layout
                key={key}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all"
              >
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-primary-light transition-colors">{key}</span>
                <span className="text-xs font-mono text-white bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 shadow-inner">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </motion.div>
            ))}
            
            {(queue || stack) && (
              <motion.div
                layout
                className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-3"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest">{queue ? 'Queue' : 'Stack'}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(queue || stack)?.map((item, i) => (
                    <span key={i} className="w-8 h-8 rounded-lg bg-black/60 border border-white/10 flex items-center justify-center text-[11px] font-black text-white shadow-xl">
                      {item}
                    </span>
                  ))}
                  {(queue || stack)?.length === 0 && (
                    <span className="text-[10px] text-slate-600 font-bold uppercase italic">Empty</span>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="h-px bg-white/5 mx-6" />

      {/* Pseudocode Section */}
      <div className="p-6 flex-[1.5] min-h-0 flex flex-col">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-lg shadow-primary/5">
            <Code2 size={18} />
          </div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">Pseudocode</h3>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black/40 rounded-2xl border border-white/5 p-4 font-mono text-[11px] leading-relaxed relative group">
          <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-100 transition-opacity">
            <Cpu size={14} className="text-primary" />
          </div>
          {pseudocode.map((line, idx) => (
            <div
              key={idx}
              className={cn(
                "py-1 px-3 rounded-lg transition-all duration-300 flex gap-4",
                idx === activeLine 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02] z-10" 
                  : "text-slate-500"
              )}
            >
              <span className={cn(
                "shrink-0 w-4 opacity-30 text-right select-none",
                idx === activeLine && "opacity-100 font-black"
              )}>
                {idx + 1}
              </span>
              <pre className="whitespace-pre-wrap break-all">{line}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

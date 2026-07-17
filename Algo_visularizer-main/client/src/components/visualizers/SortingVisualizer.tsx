import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface SortingVisualizerProps {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  maxVal: number;
  stepIndex: number;
  totalSteps: number;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  array,
  comparing,
  swapping,
  sorted,
  maxVal,
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      {/* Bars container */}
      <div className="flex items-end justify-center gap-[6px] w-full flex-1 min-h-0 pb-12 relative px-4">
        {array.map((value, idx) => {
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isSorted = sorted.includes(idx);

          let barGradient = 'from-primary-light to-primary'; 
          if (isSwapping) barGradient = 'from-secondary-light to-secondary';
          else if (isComparing) barGradient = 'from-primary-light to-primary';
          else if (isSorted) barGradient = 'from-emerald-400 to-emerald-600';

          const minHeightPercent = 4;
          const heightPercent = maxVal > 0 
            ? Math.max(minHeightPercent, (value / maxVal) * 100) 
            : minHeightPercent;

          return (
            <motion.div
              key={idx}
              layout
              initial={false}
              animate={{
                height: `${heightPercent}%`,
                opacity: 1,
                filter: 'blur(0px)',
                boxShadow: isSwapping
                  ? `0 0 30px rgba(var(--color-secondary), 0.4)`
                  : isComparing
                  ? `0 0 30px rgba(var(--color-primary), 0.3)`
                  : isSorted
                  ? `0 0 20px rgba(16,185,129,0.2)`
                  : `0 4px 12px rgba(0,0,0,0.2)`,
              }}
              transition={{
                height: { type: 'spring', stiffness: 300, damping: 30 },
                boxShadow: { duration: 0.3 },
                opacity: { duration: 0.2 },
              }}
              style={{
                originY: 1,
                minHeight: '12px',
              }}
              className={cn(
                'flex-1 min-w-[14px] max-w-[42px] rounded-t-xl rounded-b-sm relative group',
                (isComparing || isSwapping) && 'z-20'
              )}
            >
                {/* The Bar */}
                <div className={cn(
                  "absolute inset-0 rounded-t-xl rounded-b-sm bg-gradient-to-t transition-all duration-500",
                  barGradient,
                  !isComparing && !isSwapping && !isSorted && "opacity-60 group-hover:opacity-100"
                )} />

                {/* Glass reflection */}
                <div className="absolute inset-0 bg-white/10 opacity-20 rounded-t-xl rounded-b-sm" style={{ width: '30%' }} />

                {/* Value label */}
                <div className={cn(
                  "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl glass text-[11px] font-black transition-all duration-300 pointer-events-none opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 shadow-2xl",
                  isSwapping ? 'text-secondary-light border-secondary/40 bg-secondary/10' : 
                  isComparing ? 'text-primary-light border-primary/40 bg-primary/10' : 
                  isSorted ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' : 'text-white border-white/20 bg-white/5'
                )}>
                  {value}
                </div>

                {/* Active indicator dot */}
                {(isComparing || isSwapping) && (
                  <motion.div
                    layoutId="active-dot"
                    className={cn(
                      "absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                      isSwapping ? "bg-secondary shadow-[0_0_10px_rgba(var(--color-secondary),1)]" : "bg-primary shadow-[0_0_10px_rgba(var(--color-primary),1)]"
                    )}
                  />
                )}
              </motion.div>
            );
          })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-5 flex-wrap shrink-0">
        {[
          { color: 'bg-primary/60', label: 'Default', glow: '' },
          { color: 'bg-primary', label: 'Comparing', glow: 'shadow-[0_0_8px_rgba(var(--color-primary),1)]' },
          { color: 'bg-secondary', label: 'Swapping', glow: 'shadow-[0_0_8px_rgba(var(--color-secondary),1)]' },
          { color: 'bg-emerald-500', label: 'Sorted', glow: 'shadow-[0_0_8px_rgba(16,185,129,1)]' },
        ].map(({ color, label, glow }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={cn('w-2.5 h-2.5 rounded-sm transition-all duration-500', color, glow)} />
            <span className="text-[10px] text-slate-500 font-black uppercase tracking-wider">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SortingVisualizer;

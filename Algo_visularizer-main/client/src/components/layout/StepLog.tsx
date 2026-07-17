import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Target, Info, CheckCircle2, ArrowRightLeft, Search, Database, Pin, PinOff } from 'lucide-react';
import { cn } from '../../utils/cn';
import type { Step } from '../../types';

interface StepLogProps {
  steps: Step[];
  currentStepIdx: number;
  onJumpTo: (idx: number) => void;
}

const getStepIcon = (description: string) => {
  const d = description.toLowerCase();
  if (d.includes('comparing')) return <Search size={14} className="text-primary" />;
  if (d.includes('swap')) return <ArrowRightLeft size={14} className="text-secondary" />;
  if (d.includes('updating') || d.includes('set')) return <Database size={14} className="text-amber-400" />;
  if (d.includes('visiting') || d.includes('exploring')) return <Target size={14} className="text-primary-light" />;
  if (d.includes('completed')) return <CheckCircle2 size={14} className="text-emerald-400" />;
  return <Info size={14} className="text-slate-400" />;
};

const StepLog: React.FC<StepLogProps> = ({ steps, currentStepIdx, onJumpTo }) => {
  const activeRef = React.useRef<HTMLButtonElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);

  // isManual: true when user has scrolled the list away from autoscroll
  const [isManual, setIsManual] = React.useState(false);
  // Track a scroll timeout to debounce when manual mode ends
  const manualTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  // Flag to suppress the scroll event fired by our own programmatic scrollIntoView
  const suppressScrollRef = React.useRef(false);

  // Autoscroll to active step when not in manual mode
  React.useEffect(() => {
    if (activeRef.current && !isManual) {
      suppressScrollRef.current = true;
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
      // Allow a brief window for the smooth scroll to start before re-enabling detection
      setTimeout(() => { suppressScrollRef.current = false; }, 600);
    }
  }, [currentStepIdx, isManual]);

  // Reset manual mode when a new trace is loaded (step count changes)
  const prevStepsLengthRef = React.useRef(steps.length);
  React.useEffect(() => {
    if (steps.length !== prevStepsLengthRef.current) {
      prevStepsLengthRef.current = steps.length;
      setIsManual(false);
    }
  }, [steps.length]);

  const handleScroll = React.useCallback(() => {
    // Ignore scroll events fired by programmatic scrollIntoView
    if (suppressScrollRef.current) return;

    // User scrolled manually — pause autoscroll
    setIsManual(true);

    // After 3s of scroll inactivity, resume autoscroll
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    manualTimeoutRef.current = setTimeout(() => {
      setIsManual(false);
    }, 3000);
  }, []);

  const resumeAutoscroll = React.useCallback(() => {
    if (manualTimeoutRef.current) clearTimeout(manualTimeoutRef.current);
    setIsManual(false);
  }, []);

  const handleJumpTo = React.useCallback((idx: number) => {
    // Clicking a step should re-enable autoscroll from that step forward
    resumeAutoscroll();
    onJumpTo(idx);
  }, [onJumpTo, resumeAutoscroll]);

  return (
    <div className="w-80 min-h-0 flex flex-col bg-black/20 backdrop-blur-md border-l border-white/5">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-white/[0.02] shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <History size={16} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Execution Log</h3>
              <div className="mt-0.5">
                {isManual ? (
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/20 animate-pulse">
                    ⏸ Paused (scrolling)
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    ▶ Autoscrolling
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-1 rounded-md border border-white/5">
              {steps.length} STEPS
            </span>
            {/* Manual toggle button */}
            <button
              onClick={isManual ? resumeAutoscroll : () => setIsManual(true)}
              title={isManual ? 'Resume Autoscroll' : 'Pause Autoscroll'}
              className={cn(
                "p-1.5 rounded-lg border transition-all duration-200",
                isManual
                  ? "text-amber-400 bg-amber-400/10 border-amber-400/20 hover:bg-amber-400/20"
                  : "text-slate-500 bg-white/5 border-white/10 hover:text-slate-300 hover:bg-white/10"
              )}
            >
              {isManual
                ? <PinOff size={12} />
                : <Pin size={12} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable log list */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-scroll custom-scrollbar p-4 space-y-2"
      >
        <AnimatePresence initial={false}>
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIdx;
            const isPast = idx < currentStepIdx;

            return (
              <motion.button
                key={idx}
                ref={isActive ? activeRef : undefined}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => handleJumpTo(idx)}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 border-primary/30 shadow-lg shadow-primary/5"
                    : isPast
                    ? "bg-white/[0.02] border-white/5 opacity-60 hover:opacity-100 hover:bg-white/[0.05]"
                    : "bg-transparent border-transparent opacity-40 hover:opacity-100 hover:bg-white/[0.03]"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                  />
                )}

                <div className="flex gap-3 items-start relative z-10">
                  <div className={cn(
                    "mt-0.5 shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors",
                    isActive ? "bg-primary/20" : "bg-white/5 group-hover:bg-white/10"
                  )}>
                    {getStepIcon(step.description)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-black tracking-tighter",
                        isActive ? "text-primary" : "text-slate-500"
                      )}>
                        STEP {String(idx + 1).padStart(2, '0')}
                      </span>
                      {isActive && (
                        <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className={cn(
                      "text-xs font-medium leading-relaxed transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-300"
                    )}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Resume button shown when manual scrolled far from active step */}
      {isManual && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="p-3 border-t border-amber-400/10 bg-amber-400/5 shrink-0"
        >
          <button
            onClick={resumeAutoscroll}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 text-amber-400 text-[11px] font-bold uppercase tracking-widest transition-all"
          >
            <PinOff size={12} />
            Resume Autoscroll
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default StepLog;

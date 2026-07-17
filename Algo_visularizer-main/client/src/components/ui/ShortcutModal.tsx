import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard, MousePointer2 } from 'lucide-react';

interface ShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'Space', desc: 'Play / Pause Visualization', icon: '⎵' },
  { key: '←', desc: 'Previous Step', icon: '←' },
  { key: '→', desc: 'Next Step', icon: '→' },
  { key: 'Shift + ←', desc: 'Jump to Start', icon: '⇤' },
  { key: 'Shift + →', desc: 'Jump to End', icon: '⇥' },
  { key: '?', desc: 'Show Keyboard Shortcuts', icon: '?' },
];

const ShortcutModal: React.FC<ShortcutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-dark border border-white/10 rounded-[2.5rem] p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Keyboard size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Shortcuts</h2>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master the Lab</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-slate-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {SHORTCUTS.map((s, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
                >
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {s.desc}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <kbd className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-primary shadow-sm">
                      {s.key}
                    </kbd>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] justify-center">
              <MousePointer2 size={12} />
              <span>Click anywhere to close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ShortcutModal;

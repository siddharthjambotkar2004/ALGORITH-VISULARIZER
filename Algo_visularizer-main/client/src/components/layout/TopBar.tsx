import React, { useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, SkipBack, SkipForward, Sparkles, HelpCircle, LogOut, History, ChevronDown, ArrowLeft } from 'lucide-react';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  currentStepIdx: number;
  totalSteps: number;
  onJumpToEnd: () => void;
  onShortcutClick: () => void;
  onAuthClick: () => void;
  onHistoryClick: () => void;
}

const THEMES = [
  { id: 'midnight', name: 'Midnight', color: 'bg-[#6366f1]' },
  { id: 'cyberpunk', name: 'Cyberpunk', color: 'bg-[#f59e0b]' },
  { id: 'forest', name: 'Forest', color: 'bg-[#10b981]' },
  { id: 'deepsea', name: 'Deep Sea', color: 'bg-[#0ea5e9]' },
] as const;

const PATTERNS = [
  { id: 'mesh', name: 'Mesh' },
  { id: 'grid', name: 'Grid' },
  { id: 'dots', name: 'Dots' },
  { id: 'solid', name: 'Solid' },
] as const;

interface SpeedOption {
  value: number;
  label: string;
}

const SPEED_OPTIONS: SpeedOption[] = [
  { value: 0.5, label: '0.5x' },
  { value: 1, label: '1x' },
  { value: 2, label: '2x' },
  { value: 4, label: '4x' },
];

const TopBar: React.FC<TopBarProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  speed,
  onSpeedChange,
  canGoNext,
  canGoPrev,
  currentStepIdx,
  totalSteps,
  onJumpToEnd,
  onShortcutClick,
  onAuthClick,
  onHistoryClick,
}) => {
  const { theme, setTheme, bgPattern, setBgPattern } = useTheme();
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="h-20 border-b border-white/10 bg-white/[0.03] backdrop-blur-3xl flex items-center justify-between px-8 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-1.5 p-1.5 bg-black/60 border border-white/10 rounded-2xl shadow-inner">
          {/* Jump to start */}
          <Button variant="ghost" size="icon" onClick={onReset} disabled={!canGoPrev} title="Jump to Start" className="rounded-xl hover:bg-white/5">
            <SkipBack size={16} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPrev}
            disabled={!canGoPrev || isPlaying}
            title="Previous Step"
            className="rounded-xl hover:bg-white/5"
          >
            <ChevronLeft size={20} />
          </Button>

          <Button
            variant={isPlaying ? 'secondary' : 'primary'}
            size="icon"
            onClick={onTogglePlay}
            className={cn(
              'w-12 h-12 rounded-2xl shadow-2xl transition-all duration-500',
              !isPlaying 
                ? 'bg-gradient-to-br from-primary via-primary to-secondary hover:shadow-primary/40 hover:-translate-y-0.5' 
                : 'bg-white/10 text-white hover:bg-white/20'
            )}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onNext}
            disabled={!canGoNext || isPlaying}
            title="Next Step"
            className="rounded-xl hover:bg-white/5"
          >
            <ChevronRight size={20} />
          </Button>

          {/* Jump to end */}
          <Button variant="ghost" size="icon" onClick={onJumpToEnd} disabled={!canGoNext} title="Jump to End" className="rounded-xl hover:bg-white/5">
            <SkipForward size={16} />
          </Button>
        </div>

        <div className="w-px h-8 bg-white/5 mx-4" />

        {/* Step counter badge */}
        <div className="flex items-center gap-4 px-5 py-2.5 rounded-2xl bg-white/[0.08] border border-white/20 shadow-xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Step Status</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-white">{currentStepIdx + 1}</span>
              <span className="text-xs text-slate-400 font-bold">/</span>
              <span className="text-xs font-bold text-slate-300">{totalSteps}</span>
            </div>
          </div>
          {/* Progress bar mini */}
          <div className="w-20 h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/10 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 shadow-[0_0_12px_rgba(var(--color-primary),1)]" 
              style={{ width: `${((currentStepIdx + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        {/* Help/Shortcuts */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onShortcutClick}
          className="rounded-xl hover:bg-primary/10 text-slate-400 hover:text-primary transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <HelpCircle size={20} />
        </Button>

        <div className="w-px h-10 bg-white/20 mx-2" />

        {/* Theme Switcher */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Theme</span>
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/20 shadow-inner">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  'w-8 h-8 rounded-xl transition-all duration-300 flex items-center justify-center relative group',
                  theme === t.id ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'
                )}
                title={t.name}
              >
                <div className={cn('w-full h-full rounded-lg shadow-lg', t.color)} />
                {theme === t.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-10 bg-white/10 mx-2" />

        {/* Background Pattern Switcher */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-300 font-black uppercase tracking-[0.2em]">Background</span>
          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-2xl border border-white/20 shadow-inner">
            {PATTERNS.map((p) => (
              <button
                key={p.id}
                onClick={() => setBgPattern(p.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all duration-300',
                  bgPattern === p.id
                    ? 'bg-white text-black shadow-xl scale-105'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
                )}
                title={p.name}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-10 bg-white/10 mx-2" />

        {/* Speed Controls */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Execution Speed</span>
          <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 shadow-inner">
            {SPEED_OPTIONS.map((s) => (
              <button
                key={s.value}
                onClick={() => onSpeedChange(s.value)}
                className={cn(
                  'px-4 py-2 rounded-xl text-[11px] font-black transition-all duration-300',
                  speed === s.value
                    ? 'bg-white text-black shadow-xl scale-105 ring-1 ring-white/50'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-px h-10 bg-white/10 mx-2" />

        {/* Auth / Profile Section */}
        <div className="relative">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 bg-black/40 hover:bg-black/60 px-3.5 py-2.5 rounded-2xl border border-white/10 hover:border-white/20 transition-all shadow-inner group/avatar"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary text-white font-black text-xs flex items-center justify-center shadow-md">
                  {user?.username ? user.username.slice(0, 2).toUpperCase() : 'US'}
                </div>
                <span className="text-xs font-black text-slate-300 group-hover/avatar:text-white transition-colors max-w-[80px] truncate">
                  {user?.username}
                </span>
                <ChevronDown size={14} className={cn("text-slate-500 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setIsDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-950/95 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl z-45 flex flex-col">
                    <div className="pb-3 mb-3 border-b border-white/5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Signed In As</span>
                      <span className="text-xs font-black text-white block truncate">{user?.username}</span>
                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">{user?.email}</span>
                    </div>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        onHistoryClick();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all text-left"
                    >
                      <History size={14} className="text-primary" />
                      My History
                    </button>

                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-left mt-1"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="px-5 py-2.5 bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary hover:to-secondary text-primary-light hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 border border-primary/20 hover:border-transparent hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            >
              Sign In
            </button>
          )}
        </div>

        <div className="w-px h-10 bg-white/10 mx-2" />

        {/* Branding/Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
            <Sparkles size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black text-white leading-none tracking-tight">AlgoVisual</span>
            <span className="text-[10px] text-primary-light font-black uppercase tracking-widest mt-1.5 opacity-80">Laboratory</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;



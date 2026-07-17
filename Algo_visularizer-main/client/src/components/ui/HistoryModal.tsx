import React from 'react';
import { X, Trash2, Clock, Play, ListFilter, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadRun: (algorithmId: string, inputData: any) => void;
}

const ALGO_NAMES: Record<string, string> = {
  'bubble-sort': 'Bubble Sort',
  'insertion-sort': 'Insertion Sort',
  'selection-sort': 'Selection Sort',
  'heap-sort': 'Heap Sort',
  'merge-sort': 'Merge Sort',
  'quick-sort': 'Quick Sort',
  'bfs': 'BFS (Breadth-First Search)',
  'dfs': 'DFS (Depth-First Search)',
  'dijkstra': 'Dijkstra Pathfinding',
  'kruskal': "Kruskal's MST",
  'bellman-ford': 'Bellman-Ford Pathfinding',
  'floyd-warshall': 'Floyd-Warshall Pathfinding',
};

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onLoadRun }) => {
  const { history, historyLoading, deleteHistoryItem, clearHistory } = useAuth();

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const formatInputData = (inputDataStr: string, algorithmId: string) => {
    try {
      const parsed = JSON.parse(inputDataStr);
      if (Array.isArray(parsed)) {
        return `Array: [${parsed.join(', ')}]`;
      }
      if (typeof parsed === 'object') {
        const isWeighted = ['dijkstra', 'kruskal', 'bellman-ford', 'floyd-warshall'].includes(algorithmId);
        return isWeighted ? 'Weighted Graph' : 'Unweighted Graph';
      }
      return inputDataStr;
    } catch {
      return inputDataStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-950/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Glow Effects */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 rounded-full blur-[80px] pointer-events-none" />
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20">
              <Clock size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white leading-none">Visualization History</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                Retrieve and replay your past algorithm runs
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Bar (Clear All) */}
        {history.length > 0 && (
          <div className="px-6 py-3 bg-white/[0.02] border-b border-white/5 flex justify-end relative z-10">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all history?')) {
                  clearHistory();
                }
              }}
              className="flex items-center gap-1.5 text-[10px] font-bold text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest"
            >
              <Trash2 size={12} />
              Clear All
            </button>
          </div>
        )}

        {/* List Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-3 relative z-10">
          {historyLoading ? (
            <div className="h-40 flex flex-col items-center justify-center text-slate-500 gap-2">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-xs font-bold uppercase tracking-widest mt-2">Loading History...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="h-60 flex flex-col items-center justify-center text-slate-500 text-center px-8">
              <div className="w-14 h-14 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center justify-center mb-4 text-slate-400">
                <ListFilter size={24} />
              </div>
              <span className="text-sm font-black text-white">No saved history runs</span>
              <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
                Log in and run algorithm updates or trace requests to automatically populate this history!
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] rounded-2xl transition-all group/item"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white tracking-tight">
                      {ALGO_NAMES[item.algorithmId] || item.algorithmId}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold bg-white/5 px-2 py-0.5 rounded-md">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1 truncate">
                    {formatInputData(item.inputData, item.algorithmId)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onLoadRun(item.algorithmId, JSON.parse(item.inputData));
                      onClose();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-primary/10 hover:bg-primary/20 text-primary hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border border-primary/20 hover:border-primary/40 shadow-sm"
                  >
                    <Play size={10} fill="currentColor" />
                    Load
                  </button>

                  <button
                    onClick={() => deleteHistoryItem(item.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                    title="Delete Run"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

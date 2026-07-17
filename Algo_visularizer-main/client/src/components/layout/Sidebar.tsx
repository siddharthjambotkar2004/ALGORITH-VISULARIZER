import React, { useState } from 'react';
import { ChevronDown, BarChart2, Share2, Search } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  selectedAlgoId: string;
  onSelectAlgo: (id: string) => void;
}

const ALGORITHMS = [
  {
    id: 'sorting',
    name: 'Sorting',
    icon: BarChart2,
    items: [
      { id: 'bubble-sort', name: 'Bubble Sort' },
      { id: 'insertion-sort', name: 'Insertion Sort' },
      { id: 'selection-sort', name: 'Selection Sort' },
      { id: 'heap-sort', name: 'Heap Sort' },
      { id: 'merge-sort', name: 'Merge Sort' },
      { id: 'quick-sort', name: 'Quick Sort' },
    ]
  },
  {
    id: 'graph',
    name: 'Graph Traversal',
    icon: Share2,
    items: [
      { id: 'bfs', name: 'BFS' },
      { id: 'dfs', name: 'DFS' },
    ]
  },
  {
    id: 'pathfinding',
    name: 'Shortest Path',
    icon: Share2,
    items: [
      { id: 'dijkstra', name: 'Dijkstra' },
      { id: 'bellman-ford', name: 'Bellman-Ford' },
      { id: 'floyd-warshall', name: 'Floyd-Warshall' },
    ]
  },
  {
    id: 'mst',
    name: 'Minimum Spanning Tree',
    icon: Share2,
    items: [
      { id: 'kruskal', name: 'Kruskal\'s' },
    ]
  }
];

const Sidebar: React.FC<SidebarProps> = ({
  selectedAlgoId,
  onSelectAlgo,
}) => {
  const [expanded, setExpanded] = useState<string[]>(['sorting']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id: string) => {
    setExpanded(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <aside className="w-72 glass-dark border-r border-white/5 flex flex-col h-screen overflow-hidden z-20">
      {/* Sidebar Header */}
      <div className="p-6">
        <div className="flex items-center gap-4 mb-10 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/40 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-11 h-11 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <BarChart2 className="text-white" size={22} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white tracking-tight leading-none">AlgoVisual</span>
            <span className="text-[10px] text-primary-light font-bold tracking-[0.3em] uppercase mt-1">Laboratory</span>
          </div>
        </div>

        {/* Search */}
        <div className="space-y-6">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search algorithms..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all shadow-inner shadow-black/40"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="px-4 pb-8 space-y-4">
          {ALGORITHMS.map((category) => {
            const filteredItems = category.items.filter(item => 
              item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            
            if (filteredItems.length === 0) return null;

            return (
              <div key={category.id} className="mb-4">
                <button 
                  onClick={() => toggleExpand(category.id)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/[0.05] transition-all group/cat"
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-xl bg-white/[0.05] border border-white/10 group-hover/cat:border-primary/50 transition-all duration-500 shadow-lg",
                      expanded.includes(category.id) ? "text-primary shadow-primary/20" : "text-slate-400 shadow-black/40"
                    )}>
                      <category.icon size={18} />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover/cat:text-white transition-colors">{category.name}</span>
                  </div>
                  <ChevronDown size={16} className={cn("text-slate-500 transition-transform duration-500", expanded.includes(category.id) && "rotate-180")} />
                </button>

                <div className={cn(
                  "mt-2 space-y-2 overflow-hidden transition-all duration-500 ease-in-out px-2",
                  expanded.includes(category.id) ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  {filteredItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSelectAlgo(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 pl-10 rounded-2xl text-xs font-bold transition-all duration-300",
                        selectedAlgoId === item.id 
                          ? "bg-primary/20 text-white border border-primary/40 shadow-xl shadow-primary/10" 
                          : "text-slate-400 hover:text-white hover:bg-white/[0.05] hover:translate-x-1"
                      )}
                    >
                      {item.name}
                      {selectedAlgoId === item.id && (
                        <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(99,102,241,1)]" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

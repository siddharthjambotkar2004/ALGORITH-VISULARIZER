import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Edge {
  from: string;
  to: string;
  weight?: number;
}

interface GraphVisualizerProps {
  adjList: Record<string, (string | { to: string; weight: number })[]>;
  visited: string[];
  current: string | null;
  activeEdge?: { from: string; to: string } | null;
  mstEdges?: { from: string; to: string }[];
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number | string>;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  adjList = {},
  visited,
  current,
  activeEdge,
  mstEdges,
  queue,
  stack,
  distances,
}) => {
  const nodes = Object.keys(adjList);
  
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 font-black uppercase tracking-widest animate-pulse">
        Initializing Graph...
      </div>
    );
  }

  // Simple circular layout
  const nodePositions: Record<string, { x: number, y: number }> = {};
  const radius = 180; // Increased from 150
  const centerX = 300; // Increased from 250
  const centerY = 250; // Increased from 200

  nodes.forEach((id, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI;
    nodePositions[id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  const edges: Edge[] = [];
  const seenEdges = new Set<string>();

  nodes.forEach(from => {
    const neighbors = adjList[from];
    if (Array.isArray(neighbors)) {
      neighbors.forEach(neighbor => {
        let to: string;
        let weight: number | undefined;

        if (typeof neighbor === 'string') {
          to = neighbor;
        } else {
          to = neighbor.to;
          weight = neighbor.weight;
        }

        const edgeId = [from, to].sort().join('-');
        if (!seenEdges.has(edgeId)) {
          edges.push({ from, to, weight });
          seenEdges.add(edgeId);
        }
      });
    }
  });

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center">
      <svg 
        viewBox="0 0 600 500" 
        preserveAspectRatio="xMidYMid meet"
        className="flex-1 w-full h-full max-w-[800px] max-h-[500px] drop-shadow-2xl"
      >
        {/* Render Edges */}
        {edges.map((edge, i) => {
          const p1 = nodePositions[edge.from];
          const p2 = nodePositions[edge.to];
          if (!p1 || !p2) return null;
          
          const isActive = activeEdge && (
            (activeEdge.from === edge.from && activeEdge.to === edge.to) ||
            (activeEdge.from === edge.to && activeEdge.to === edge.from)
          );
          
  const isMST = mstEdges && mstEdges.some(e => 
            (e.from === edge.from && e.to === edge.to) ||
            (e.from === edge.to && e.to === edge.from)
          );

          // Floyd-Warshall active path highlighting (i-j path)
          const isFloydPath = activeEdge && 
            (activeEdge.from === edge.from && activeEdge.to === edge.to);
          
          return (
            <g key={`edge-${i}`}>
              <motion.line
                initial={false}
                animate={{
                  stroke: isMST ? '#10b981' : (isActive || isFloydPath ? 'rgb(var(--color-primary))' : 'rgba(255,255,255,0.15)'),
                  strokeWidth: isMST || isActive || isFloydPath ? 4 : 2,
                  x1: p1.x,
                  y1: p1.y,
                  x2: p2.x,
                  y2: p2.y,
                }}
                transition={{ duration: 0.3 }}
              />
              {(isActive || isFloydPath) && (
                <motion.line
                  initial={false}
                  animate={{
                    x1: p1.x,
                    y1: p1.y,
                    x2: p2.x,
                    y2: p2.y,
                    strokeDashoffset: [0, -15]
                  }}
                  stroke="rgb(var(--color-primary))"
                  strokeWidth={2}
                  strokeDasharray="10 5"
                  transition={{ 
                    strokeDashoffset: { duration: 0.5, repeat: Infinity, ease: "linear" },
                    default: { duration: 0.3 }
                  }}
                />
              )}
              {edge.weight !== undefined && (
                <motion.g
                  initial={false}
                  animate={{
                    x: (p1.x + p2.x) / 2,
                    y: (p1.y + p2.y) / 2,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <rect
                    x="-12"
                    y="-9"
                    width="24"
                    height="18"
                    rx="6"
                    className="fill-black/80 backdrop-blur-md stroke-white/10"
                  />
                  <text
                    x="0"
                    y="1"
                    textAnchor="middle"
                    dy=".3em"
                    className="text-[12px] fill-white font-black"
                  >
                    {edge.weight}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Render Nodes */}
        {nodes.map(id => {
          const pos = nodePositions[id];
          if (!pos) return null;
          
          const isVisited = visited.includes(id);
          const isCurrent = current === id;
          const isInQueue = queue?.includes(id);
          const isInStack = stack?.includes(id);
          
          let color = 'rgba(255,255,255,0.1)'; // Increased default opacity
          let strokeColor = 'rgba(255,255,255,0.3)'; // Increased default opacity
          let glowColor = 'transparent';

          if (isCurrent) {
            color = 'rgba(var(--color-primary), 0.4)';
            strokeColor = 'rgb(var(--color-primary))';
            glowColor = 'rgba(var(--color-primary), 0.6)';
          } else if (isVisited) {
            color = 'rgba(16, 185, 129, 0.3)';
            strokeColor = '#10b981';
            glowColor = 'rgba(16, 185, 129, 0.4)';
          } else if (isInQueue || isInStack) {
            color = 'rgba(var(--color-secondary), 0.3)';
            strokeColor = 'rgb(var(--color-secondary))';
            glowColor = 'rgba(var(--color-secondary), 0.4)';
          }

          return (
            <motion.g
              key={id}
              initial={false}
              animate={{ 
                scale: isCurrent ? 1.2 : 1,
                x: pos.x,
                y: pos.y
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Node Glow */}
              <circle
                cx="0"
                cy="0"
                r="30"
                fill={glowColor}
                className="blur-2xl transition-all duration-500"
              />
              
              {/* Node Circle */}
              <circle
                cx="0"
                cy="0"
                r="24"
                fill={color}
                stroke={strokeColor}
                strokeWidth="3"
                className="transition-all duration-500 backdrop-blur-3xl"
              />
              
              <text
                x="0"
                y="0"
                textAnchor="middle"
                dy=".3em"
                className={cn(
                  "font-black text-[14px] pointer-events-none transition-colors duration-500",
                  isCurrent || isVisited || isInQueue || isInStack ? "fill-white" : "fill-slate-200"
                )}
              >
                {id}
              </text>
              
              {distances && distances[id] !== undefined && (
                <g>
                  <rect
                    x="-20"
                    y="32"
                    width="40"
                    height="18"
                    rx="6"
                    className="fill-black/80 stroke-white/20 shadow-xl"
                  />
                  <text
                    x="0"
                    y="44"
                    textAnchor="middle"
                    className="fill-primary-light text-[11px] font-black"
                  >
                    {distances[id] === Infinity ? '∞' : distances[id]}
                  </text>
                </g>
              )}
            </motion.g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-6 justify-center p-4 glass rounded-2xl border-white/10 shrink-0 scale-90">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary),1)]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Current</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_#10b981]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Visited</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-secondary shadow-[0_0_10px_rgba(var(--color-secondary),1)]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">{queue ? 'Queue' : 'Stack'}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Unvisited</span>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;

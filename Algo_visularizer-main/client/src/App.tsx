import { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import MainCanvas from './components/layout/MainCanvas';
import RightPanel from './components/layout/RightPanel';
import StepLog from './components/layout/StepLog';
import SortingVisualizer from './components/visualizers/SortingVisualizer';
import { cn } from './utils/cn';
import { BUBBLE_SORT } from './algorithms/bubble-sort';
import { INSERTION_SORT } from './algorithms/insertion-sort';
import { SELECTION_SORT } from './algorithms/selection-sort';
import { HEAP_SORT } from './algorithms/heap-sort';
import { MERGE_SORT } from './algorithms/merge-sort';
import { QUICK_SORT } from './algorithms/quick-sort';
import { BFS } from './algorithms/bfs';
import { DFS } from './algorithms/dfs';
import { DIJKSTRA } from './algorithms/dijkstra';
import { KRUSKAL } from './algorithms/kruskal';
import { BELLMAN_FORD } from './algorithms/bellman-ford';
import { FLOYD_WARSHALL } from './algorithms/floyd-warshall';
import GraphVisualizer from './components/visualizers/GraphVisualizer';
import { useIsMobile } from './hooks/useIsMobile';
import ShortcutModal from './components/ui/ShortcutModal';
import ErrorBoundary from './components/layout/ErrorBoundary';
import type { Step, Algorithm, TraceResponse } from './types';
import { API_BASE_URL } from './config';
import { useAuth } from './context/AuthContext';
import { AuthModal } from './components/ui/AuthModal';
import { HistoryModal } from './components/ui/HistoryModal';

const INITIAL_ARRAY = [45, 12, 89, 34, 67, 23];

const INITIAL_GRAPH = {
  adjList: {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"]
  },
  startNode: "A"
};

const INITIAL_WEIGHTED_GRAPH = {
  adjList: {
    "A": [{ "to": "B", "weight": 4 }, { "to": "C", "weight": 2 }],
    "B": [{ "to": "D", "weight": 3 }, { "to": "E", "weight": 1 }],
    "C": [{ "to": "F", "weight": 5 }],
    "D": [],
    "E": [{ "to": "F", "weight": 2 }],
    "F": []
  },
  startNode: "A"
};

const ALGO_MAP: Record<string, Algorithm> = {
  'bubble-sort': BUBBLE_SORT,
  'insertion-sort': INSERTION_SORT,
  'selection-sort': SELECTION_SORT,
  'heap-sort': HEAP_SORT,
  'merge-sort': MERGE_SORT,
  'quick-sort': QUICK_SORT,
  'bfs': BFS,
  'dfs': DFS,
  'dijkstra': DIJKSTRA,
  'kruskal': KRUSKAL,
  'bellman-ford': BELLMAN_FORD,
  'floyd-warshall': FLOYD_WARSHALL,
};

function inferStepType(step: Step): 'compare' | 'swap' | 'sorted' | 'info' | 'visit' | 'edge' | 'data' {
  if (step.swapping && step.swapping.length > 0) return 'swap';
  if (step.comparing && step.comparing.length > 0) return 'compare';
  if (step.sorted && step.sorted.length > 0) return 'sorted';
  if (step.activeEdge) return 'edge';
  if (step.current) return 'visit';
  if (step.distances || step.queue || step.stack) return 'data';
  return 'info';
}

function parseGraphInput(inputStr: string, isWeighted: boolean): Record<string, any> {
  const trimmed = inputStr.trim();
  
  // Try to parse as JSON first
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') {
        if (parsed.adjList) {
          return parsed.adjList;
        }
        return parsed;
      }
    } catch (e) {
      throw new Error("Invalid JSON graph structure");
    }
  }

  const adjList: Record<string, any[]> = {};
  const edges = trimmed.split(/[,\n;]+/).map(s => s.trim()).filter(Boolean);
  
  for (const edge of edges) {
    const match = edge.match(/^([A-Za-z0-9]+)\s*(?:[-—>~]+)\s*([A-Za-z0-9]+)(?:\s*:\s*(-?\d+(?:\.\d+)?))?$/);
    if (!match) {
      throw new Error(`Invalid edge: "${edge}". Use "Node1-Node2" or "Node1-Node2:weight"`);
    }
    
    const [, from, to, weightStr] = match;
    const weight = weightStr ? parseFloat(weightStr) : 1;
    
    const uFrom = from.toUpperCase();
    const uTo = to.toUpperCase();
    
    if (!adjList[uFrom]) adjList[uFrom] = [];
    if (!adjList[uTo]) adjList[uTo] = [];
    
    if (isWeighted) {
      if (!adjList[uFrom].some(e => e.to === uTo)) {
        adjList[uFrom].push({ to: uTo, weight });
      }
      if (!adjList[uTo].some(e => e.to === uFrom)) {
        adjList[uTo].push({ to: uFrom, weight });
      }
    } else {
      if (!adjList[uFrom].includes(uTo)) {
        adjList[uFrom].push(uTo);
      }
      if (!adjList[uTo].includes(uFrom)) {
        adjList[uTo].push(uFrom);
      }
    }
  }

  if (Object.keys(adjList).length === 0) {
    throw new Error("No valid edges found in graph input.");
  }

  return adjList;
}

function App() {
  const { isAuthenticated, fetchHistory } = useAuth();
  const [selectedAlgo, setSelectedAlgo] = useState<Algorithm>(BUBBLE_SORT);
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [customInput, setCustomInput] = useState<string>(INITIAL_ARRAY.join(', '));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStepLog, setShowStepLog] = useState(true);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [startNode, setStartNode] = useState<string>('A');
  const [currentAdjList, setCurrentAdjList] = useState<Record<string, any>>({});

  const skipNextInitialFetchRef = useRef(false);
  const isMobile = useIsMobile();

  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const timerRef = useRef<number | null>(null);

  const fetchTrace = useCallback(async (algoId: string, input: number[] | Record<string, unknown>) => {
    setIsLoading(true);
    setError(null);
    setSteps([]); // Clear existing steps to show loading state
    try {
      const response = await fetch(`${API_BASE_URL}/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ algorithmId: algoId, inputData: input }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch algorithm trace');
      }

      const data: TraceResponse = await response.json();
      setSteps(data.steps);
      setCurrentStepIdx(0);
      setIsPlaying(false);

      // Refresh history list if authenticated
      if (isAuthenticated) {
        fetchHistory();
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const message = err instanceof Error ? err.message : 'Could not generate trace. Make sure the backend is running.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchHistory]);

  useEffect(() => {
    if (skipNextInitialFetchRef.current) {
      skipNextInitialFetchRef.current = false;
      return;
    }

    const runInitialFetch = () => {
      if (selectedAlgo.category === 'sorting') {
        const inputArr = customInput
          .split(/[,\s]+/)
          .map(s => parseInt(s.trim()))
          .filter(n => !isNaN(n));
        
        if (inputArr.length > 0) {
          fetchTrace(selectedAlgo.id, inputArr);
        } else {
          setCustomInput(INITIAL_ARRAY.join(', '));
          fetchTrace(selectedAlgo.id, INITIAL_ARRAY);
        }
      } else {
        const isWeighted = ['dijkstra', 'kruskal', 'bellman-ford', 'floyd-warshall'].includes(selectedAlgo.id);
        const defaultEdges = isWeighted 
          ? "A-B:4, A-C:2, B-D:3, B-E:1, C-F:5, E-F:2"
          : "A-B, A-C, B-D, B-E, C-F, E-F";
        setCustomInput(defaultEdges);
        setStartNode("A");
        
        const input = isWeighted ? INITIAL_WEIGHTED_GRAPH : INITIAL_GRAPH;
        setCurrentAdjList(input.adjList);
        fetchTrace(selectedAlgo.id, input);
      }
    };

    runInitialFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAlgo, fetchTrace]);

  const loadHistoryItem = useCallback((algoId: string, input: any) => {
    const algo = ALGO_MAP[algoId];
    if (!algo) return;

    skipNextInitialFetchRef.current = true;
    setSelectedAlgo(algo);

    if (algo.category === 'sorting') {
      if (Array.isArray(input)) {
        setCustomInput(input.join(', '));
      }
    } else {
      if (input && typeof input === 'object') {
        if (input.startNode) {
          setStartNode(input.startNode);
        }
        if (input.adjList) {
          setCurrentAdjList(input.adjList);
        }
        
        try {
          const adjList = input.adjList;
          const edges: string[] = [];
          const seen = new Set<string>();
          const isWeighted = ['dijkstra', 'kruskal', 'bellman-ford', 'floyd-warshall'].includes(algoId);
          
          Object.keys(adjList).forEach(from => {
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
                const id = [from, to].sort().join('-');
                if (!seen.has(id)) {
                  seen.add(id);
                  edges.push(weight !== undefined ? `${from}-${to}:${weight}` : `${from}-${to}`);
                }
              });
            }
          });
          
          setCustomInput(edges.join(', '));
        } catch (e) {
          setCustomInput(JSON.stringify(input.adjList || input));
        }
      }
    }

    fetchTrace(algoId, input);
  }, [fetchTrace]);

  const handleNext = useCallback(() => {
    if (currentStepIdx < steps.length - 1) setCurrentStepIdx(prev => prev + 1);
    else setIsPlaying(false);
  }, [currentStepIdx, steps.length]);

  const handlePrev = useCallback(() => {
    if (currentStepIdx > 0) setCurrentStepIdx(prev => prev - 1);
  }, [currentStepIdx]);

  const handleReset = useCallback(() => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, []);

  const handleJumpToEnd = useCallback(() => {
    setCurrentStepIdx(steps.length - 1);
    setIsPlaying(false);
  }, [steps.length]);

  const handleTogglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handleTogglePlay();
          break;
        case 'ArrowRight':
          if (e.shiftKey) handleJumpToEnd();
          else handleNext();
          break;
        case 'ArrowLeft':
          if (e.shiftKey) handleReset();
          else handlePrev();
          break;
        case '?':
          setIsShortcutModalOpen(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNext, handlePrev, handleJumpToEnd, handleReset]);

  useEffect(() => {
    if (isPlaying) {
      const interval = 800 / speed;
      timerRef.current = window.setInterval(handleNext, interval);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, handleNext]);

  if (isMobile) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center p-8 text-center bg-slate-950 text-slate-300">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary text-4xl mb-6">
          📱
        </div>
        <h1 className="text-3xl font-black text-white mb-4 tracking-tight">AlgoVisual Laboratory</h1>
        <p className="text-lg text-slate-400 max-w-sm leading-relaxed">
          AlgoVisual is optimized for desktop. Please open on a larger screen to experience the full visualization suite.
        </p>
      </div>
    );
  }

  const currentStep: Step = steps[currentStepIdx] || {
    array: INITIAL_ARRAY,
    activeLine: -1,
    variables: {},
    description: isLoading ? 'Generating Trace...' : error ?? 'Initializing...',
    comparing: [],
    swapping: [],
    sorted: []
  };

  const currentArray = currentStep.array || INITIAL_ARRAY;
  const maxVal = Math.max(...currentArray);
  const stepType = inferStepType(currentStep);

  return (
    <div className="flex h-screen bg-pattern-container overflow-hidden text-slate-300">
      <ShortcutModal isOpen={isShortcutModalOpen} onClose={() => setIsShortcutModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <HistoryModal 
        isOpen={isHistoryModalOpen} 
        onClose={() => setIsHistoryModalOpen(false)} 
        onLoadRun={loadHistoryItem}
      />

      <Sidebar
        selectedAlgoId={selectedAlgo.id}
        onSelectAlgo={(id) => { if (ALGO_MAP[id]) setSelectedAlgo(ALGO_MAP[id]); }}
      />

      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          onNext={handleNext}
          onPrev={handlePrev}
          onReset={handleReset}
          speed={speed}
          onSpeedChange={setSpeed}
          canGoNext={currentStepIdx < steps.length - 1 && !isLoading}
          canGoPrev={currentStepIdx > 0 && !isLoading}
          currentStepIdx={currentStepIdx}
          totalSteps={steps.length || 1}
          onJumpToEnd={handleJumpToEnd}
          onShortcutClick={() => setIsShortcutModalOpen(true)}
          onAuthClick={() => setIsAuthModalOpen(true)}
          onHistoryClick={() => setIsHistoryModalOpen(true)}
        />

        {/* Input bar */}
        <div className="px-8 py-3 bg-white/[0.02] backdrop-blur-md border-b border-white/5 flex items-center gap-6">
          <form onSubmit={(e) => {
            e.preventDefault();
            if (isLoading) return;
            
            if (selectedAlgo.category === 'sorting') {
              const inputArr = customInput
                .split(/[,\s]+/)
                .map(s => parseInt(s.trim()))
                .filter(n => !isNaN(n));
                
              if (inputArr.length > 0) {
                if (inputArr.length > 50) {
                  setError('Array size limited to 50 elements.');
                  return;
                }
                fetchTrace(selectedAlgo.id, inputArr);
              } else {
                setError('Please enter valid numbers.');
              }
            } else {
              const isWeighted = ['dijkstra', 'kruskal', 'bellman-ford', 'floyd-warshall'].includes(selectedAlgo.id);
              const needsStart = ['bfs', 'dfs', 'dijkstra', 'bellman-ford'].includes(selectedAlgo.id);
              
              try {
                const adjList = parseGraphInput(customInput, isWeighted);
                const normalizedStartNode = startNode.trim().toUpperCase();
                
                if (needsStart) {
                  const nodes = Object.keys(adjList);
                  if (nodes.length > 0 && !adjList[normalizedStartNode]) {
                    setError(`Start node "${normalizedStartNode}" not found in graph nodes: ${nodes.join(', ')}`);
                    return;
                  }
                }
                
                setCurrentAdjList(adjList);
                
                fetchTrace(selectedAlgo.id, {
                  adjList,
                  startNode: needsStart ? normalizedStartNode : (Object.keys(adjList)[0] || 'A')
                });
              } catch (err: any) {
                setError(err.message || 'Failed to parse graph input.');
              }
            }
          }} className="flex-1 flex items-center gap-4">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] shrink-0">
              {selectedAlgo.category === 'sorting' ? 'Input Array' : 'Graph Edges'}
            </label>
            <div className="relative flex-1 group">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={selectedAlgo.category === 'sorting' ? "Enter numbers (e.g. 1, 2, 3)" : "Edges (e.g. A-B:4, B-C:2) or JSON"}
                disabled={isLoading}
                className={cn(
                  "w-full bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-sm text-white",
                  "focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all",
                  "placeholder:text-slate-600",
                  isLoading && "cursor-not-allowed opacity-50"
                )}
              />
            </div>

            {selectedAlgo.category === 'graph' && ['bfs', 'dfs', 'dijkstra', 'bellman-ford'].includes(selectedAlgo.id) && (
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] shrink-0">
                  Start Node
                </label>
                <input
                  type="text"
                  value={startNode}
                  onChange={(e) => setStartNode(e.target.value)}
                  placeholder="A"
                  maxLength={5}
                  disabled={isLoading}
                  className={cn(
                    "w-16 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-sm text-white text-center font-bold",
                    "focus:outline-none focus:border-primary/50 focus:bg-white/[0.05] transition-all",
                    isLoading && "cursor-not-allowed opacity-50"
                  )}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={cn(
                "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                isLoading 
                  ? "bg-white/5 text-slate-500 border-white/10 cursor-not-allowed" 
                  : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              )}
            >
              {isLoading ? 'Updating...' : 'Update'}
            </button>
          </form>

          <div className="h-4 w-px bg-white/10" />

          <button
            onClick={() => setShowStepLog(!showStepLog)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
              showStepLog ? "bg-primary/20 text-primary border-primary/30" : "bg-white/5 text-slate-500 border-white/10 hover:bg-white/10"
            )}
          >
            {showStepLog ? 'Hide Log' : 'Show Log'}
          </button>
        </div>

        <div className="flex-1 flex min-h-0">
          <ErrorBoundary>
            <MainCanvas
              title={selectedAlgo.name}
              description={selectedAlgo.description}
              stepDescription={currentStep.description}
              stepType={stepType}
            >
              {selectedAlgo.category === 'sorting' ? (
                <SortingVisualizer
                  array={currentArray}
                  comparing={currentStep.comparing || []}
                  swapping={currentStep.swapping || []}
                  sorted={currentStep.sorted || []}
                  maxVal={maxVal}
                  stepIndex={currentStepIdx}
                  totalSteps={steps.length || 1}
                />
              ) : (
                <GraphVisualizer
                  adjList={currentAdjList}
                  visited={currentStep.visited || []}
                  current={currentStep.current || null}
                  activeEdge={currentStep.activeEdge || null}
                  distances={currentStep.distances || {}}
                  mstEdges={currentStep.mstEdges || []}
                  queue={currentStep.queue || []}
                  stack={currentStep.stack || []}
                />
              )}
            </MainCanvas>
          </ErrorBoundary>

          <RightPanel
            pseudocode={selectedAlgo.pseudocode}
            activeLine={currentStep.activeLine}
            variables={currentStep.variables}
            complexity={selectedAlgo.complexity}
            queue={currentStep.queue}
            stack={currentStep.stack}
          />

          {showStepLog && (
            <StepLog
              steps={steps}
              currentStepIdx={currentStepIdx}
              onJumpTo={setCurrentStepIdx}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

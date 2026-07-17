import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Floyd-Warshall all-pairs shortest path algorithm.
 * 
 * @param adjList - The adjacency list of the weighted graph.
 * @param nodes - An array of all node labels in the graph.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(V³).
 * - Space: O(V²) auxiliary.
 */
export function getFloydWarshallTrace(adjList: Record<string, { to: string; weight: number }[]>, nodes: string[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const V = nodes.length;
  const dist: Record<string, Record<string, number | string>> = {};

  // Initial distances
  for (const u of nodes) {
    dist[u] = {};
    for (const v of nodes) {
      if (u === v) dist[u][v] = 0;
      else dist[u][v] = Infinity;
    }
  }

  const entries = Object.entries(adjList);
  for (const [from, neighbors] of entries) {
    for (const edge of neighbors) {
      const { to, weight } = edge;
      const uDist = dist[from];
      if (uDist) uDist[to] = weight;
    }
  }

  steps.push({
    activeLine: 0,
    variables: { dist: JSON.parse(JSON.stringify(dist)) },
    description: 'Starting Floyd-Warshall: Initializing distance matrix',
    distances: {}
  });

  for (let kIdx = 0; kIdx < V; kIdx++) {
    const k = nodes[kIdx]!;
    steps.push({
      activeLine: 5,
      variables: { k, dist: JSON.parse(JSON.stringify(dist)) },
      description: `Considering node ${k} as intermediate node`,
      current: k,
      distances: {}
    });

    for (let iIdx = 0; iIdx < V; iIdx++) {
      const i = nodes[iIdx]!;
      for (let jIdx = 0; jIdx < V; jIdx++) {
        const j = nodes[jIdx]!;
        
        const dIK = dist[i]![k];
        const dKJ = dist[k]![j];
        const dIJ = dist[i]![j];

        steps.push({
          activeLine: 8,
          variables: { k, i, j, dIK, dKJ, dIJ },
          description: `Checking if ${i}->${k}->${j} is shorter than ${i}->${j}`,
          current: k,
          activeEdge: { from: i, to: j },
          distances: { 
            [`${i}->${j}`]: dIJ ?? Infinity, 
            [`${i}->${k}`]: dIK ?? Infinity, 
            [`${k}->${j}`]: dKJ ?? Infinity 
          }
        });

        if (dIK !== Infinity && dKJ !== Infinity && (dIK as number) + (dKJ as number) < (dIJ as number)) {
          dist[i]![j] = (dIK as number) + (dKJ as number);
          steps.push({
            activeLine: 9,
            variables: { k, i, j, newDist: dist[i]![j], dist: JSON.parse(JSON.stringify(dist)) },
            description: `Updated distance ${i}->${j} to ${dist[i]![j]}`,
            current: k,
            activeEdge: { from: i, to: j },
            distances: { [`${i}->${j}`]: dist[i]![j] as number }
          });
        }
      }
    }
  }

  steps.push({
    activeLine: 12,
    variables: { dist: JSON.parse(JSON.stringify(dist)) },
    description: 'Floyd-Warshall completed! All-pairs shortest paths found.',
    distances: {}
  });

  return steps;
}

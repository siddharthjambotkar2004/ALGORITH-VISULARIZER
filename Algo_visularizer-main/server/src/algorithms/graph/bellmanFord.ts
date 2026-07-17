import type { TraceStep } from '../../types/index.js';

interface Edge {
  from: string;
  to: string;
  weight: number;
}

/**
 * Generates an execution trace for the Bellman-Ford algorithm.
 * 
 * @param adjList - The adjacency list of the weighted graph.
 * @param nodes - An array of all node labels in the graph.
 * @param startNode - The starting node for the algorithm.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(V * E).
 * - Space: O(V) auxiliary.
 */
export function getBellmanFordTrace(adjList: Record<string, { to: string; weight: number }[]>, nodes: string[], startNode: string): TraceStep[] {
  const steps: TraceStep[] = [];
  const distances: Record<string, number | string> = {};
  
  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  const edges: Edge[] = [];
  const entries = Object.entries(adjList);
  for (const [from, neighbors] of entries) {
    for (const edge of neighbors) {
      edges.push({ from, to: edge.to, weight: edge.weight });
    }
  }

  steps.push({
    activeLine: 0,
    variables: { distances: { ...distances } },
    description: `Starting Bellman-Ford from node ${startNode}`,
    visited: [],
    current: null,
    distances: { ...distances }
  });

  const V = nodes.length;
  for (let i = 1; i < V; i++) {
    steps.push({
      activeLine: 5,
      variables: { iteration: i, distances: { ...distances } },
      description: `Iteration ${i}: Relaxing all edges`,
      visited: [],
      current: null,
      distances: { ...distances }
    });

    for (const edge of edges) {
      const { from, to, weight } = edge;
      const dFrom = distances[from];
      const dTo = distances[to];

      steps.push({
        activeLine: 7,
        variables: { from, to, weight, dFrom, dTo },
        description: `Considering edge ${from} -> ${to} with weight ${weight}`,
        activeEdge: { from, to },
        distances: { ...distances }
      });

      if (dFrom !== Infinity && (dFrom as number) + weight < (dTo as number)) {
        distances[to] = (dFrom as number) + weight;
        steps.push({
          activeLine: 8,
          variables: { from, to, weight, newDist: distances[to], distances: { ...distances } },
          description: `Updating distance of ${to} to ${distances[to]}`,
          activeEdge: { from, to },
          distances: { ...distances }
        });
      }
    }
  }

  // Check for negative cycles
  for (const edge of edges) {
    const { from, to, weight } = edge;
    if (distances[from] !== Infinity && (distances[from] as number) + weight < (distances[to] as number)) {
      steps.push({
        activeLine: 12,
        variables: { from, to, weight },
        description: 'Negative cycle detected!',
        activeEdge: { from, to },
        distances: { ...distances }
      });
      return steps;
    }
  }

  steps.push({
    activeLine: 15,
    variables: { distances: { ...distances } },
    description: 'Bellman-Ford completed! Shortest paths found.',
    distances: { ...distances }
  });

  return steps;
}

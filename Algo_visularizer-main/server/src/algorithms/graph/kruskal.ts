import type { TraceStep } from '../../types/index.js';

interface Edge {
  from: string;
  to: string;
  weight: number;
}

class DSU {
  parent: Record<string, string>;
  constructor(nodes: string[]) {
    this.parent = {};
    for (const node of nodes) {
      this.parent[node] = node;
    }
  }

  find(i: string): string {
    const p = this.parent[i];
    if (p === undefined || p === i) return i;
    this.parent[i] = this.find(p);
    return this.parent[i] as string;
  }

  union(i: string, j: string) {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
      return true;
    }
    return false;
  }
}

/**
 * Generates an execution trace for Kruskal's Minimum Spanning Tree (MST) algorithm.
 * 
 * @param adjList - The adjacency list of the weighted graph.
 * @param nodes - An array of all node labels in the graph.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(E log E) or O(E log V).
 * - Space: O(V + E) auxiliary.
 */
export function getKruskalTrace(adjList: Record<string, { to: string; weight: number }[]>, nodes: string[]): TraceStep[] {
  const steps: TraceStep[] = [];
  const edges: Edge[] = [];
  const mstEdges: Edge[] = [];
  const dsu = new DSU(nodes);

  // Extract all unique edges
  const seenEdges = new Set<string>();
  const entries = Object.entries(adjList);
  for (const [from, neighbors] of entries) {
    for (const edge of neighbors) {
      const edgeId = [from, edge.to].sort().join('-');
      if (!seenEdges.has(edgeId)) {
        edges.push({ from, to: edge.to, weight: edge.weight });
        seenEdges.add(edgeId);
      }
    }
  }

  steps.push({
    activeLine: 0,
    variables: { totalEdges: edges.length },
    description: 'Starting Kruskal\'s Algorithm',
    mstEdges: [...mstEdges],
    visited: []
  });

  // Sort edges by weight
  edges.sort((a, b) => a.weight - b.weight);

  steps.push({
    activeLine: 2,
    variables: { sortedEdges: edges.map(e => `${e.from}-${e.to}(${e.weight})`) },
    description: 'Sorted all edges by weight',
    mstEdges: [...mstEdges],
    visited: []
  });

  for (const edge of edges) {
    const { from, to, weight } = edge;
    const rootFrom = dsu.find(from);
    const rootTo = dsu.find(to);

    steps.push({
      activeLine: 5,
      variables: { from, to, weight, rootFrom, rootTo },
      description: `Considering edge ${from}-${to} with weight ${weight}`,
      activeEdge: { from, to },
      mstEdges: [...mstEdges],
      visited: Array.from(new Set(mstEdges.flatMap(e => [e.from, e.to])))
    });

    if (rootFrom !== rootTo) {
      dsu.union(from, to);
      mstEdges.push(edge);
      
      steps.push({
        activeLine: 7,
        variables: { from, to, weight, rootFrom, rootTo, added: true },
        description: `Edge ${from}-${to} does not form a cycle. Adding to MST.`,
        activeEdge: { from, to },
        mstEdges: [...mstEdges],
        visited: Array.from(new Set(mstEdges.flatMap(e => [e.from, e.to])))
      });
    } else {
      steps.push({
        activeLine: 10,
        variables: { from, to, weight, rootFrom, rootTo, added: false },
        description: `Edge ${from}-${to} forms a cycle. Skipping.`,
        activeEdge: { from, to },
        mstEdges: [...mstEdges],
        visited: Array.from(new Set(mstEdges.flatMap(e => [e.from, e.to])))
      });
    }
  }

  steps.push({
    activeLine: 15,
    variables: { mstTotalWeight: mstEdges.reduce((acc, e) => acc + e.weight, 0) },
    description: 'Kruskal\'s Algorithm completed! Minimum Spanning Tree found.',
    mstEdges: [...mstEdges],
    visited: Array.from(new Set(mstEdges.flatMap(e => [e.from, e.to])))
  });

  return steps;
}

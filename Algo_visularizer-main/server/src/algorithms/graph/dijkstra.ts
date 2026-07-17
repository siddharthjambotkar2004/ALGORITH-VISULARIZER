import type { TraceStep } from '../../types/index.js';

interface Edge {
  to: string;
  weight: number;
}

/**
 * Generates an execution trace for Dijkstra's shortest path algorithm.
 * 
 * @param adjList - The adjacency list of the weighted graph.
 * @param startNode - The starting node for the algorithm.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O((V + E) log V).
 * - Space: O(V) auxiliary.
 */
export function getDijkstraTrace(adjList: Record<string, Edge[]>, startNode: string): TraceStep[] {
  const steps: TraceStep[] = [];
  const distances: Record<string, number | string> = {};
  const visited: string[] = [];
  const nodes = Object.keys(adjList);
  
  for (const node of nodes) {
    distances[node] = Infinity;
  }
  distances[startNode] = 0;

  steps.push({
    activeLine: 0,
    variables: { distances: { ...distances }, visited: [...visited] },
    description: `Starting Dijkstra from node ${startNode}`,
    visited: [...visited],
    current: null,
    activeEdge: null,
    distances: { ...distances }
  });

  const pq = [{ node: startNode, dist: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node: current, dist: d } = pq.shift()!;

    if (visited.includes(current)) continue;
    visited.push(current);

    steps.push({
      activeLine: 5,
      variables: { current, distances: { ...distances }, visited: [...visited] },
      description: `Exploring node ${current} with distance ${d}`,
      visited: [...visited],
      current,
      activeEdge: null,
      distances: { ...distances }
    });

    const neighbors = adjList[current] || [];
    for (const edge of neighbors) {
      const neighbor = edge.to;
      const weight = edge.weight;
      const newDist = (distances[current] as number) + weight;

      steps.push({
        activeLine: 10,
        variables: { current, neighbor, weight, newDist, distances: { ...distances } },
        description: `Checking neighbor ${neighbor} via edge weight ${weight}`,
        visited: [...visited],
        current,
        activeEdge: { from: current, to: neighbor },
        distances: { ...distances }
      });

      if (distances[neighbor] === undefined || newDist < (distances[neighbor] as number)) {
        distances[neighbor] = newDist;
        pq.push({ node: neighbor, dist: newDist });
        
        steps.push({
          activeLine: 15,
          variables: { neighbor, newDist, distances: { ...distances } },
          description: `Updating distance of ${neighbor} to ${newDist}`,
          visited: [...visited],
          current,
          activeEdge: { from: current, to: neighbor },
          distances: { ...distances }
        });
      }
    }
  }

  steps.push({
    activeLine: 20,
    variables: { distances: { ...distances }, visited: [...visited] },
    description: 'Dijkstra completed!',
    visited: [...visited],
    current: null,
    activeEdge: null,
    distances: { ...distances }
  });

  return steps;
}

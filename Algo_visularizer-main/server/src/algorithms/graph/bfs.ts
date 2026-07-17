import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Breadth-First Search (BFS) algorithm.
 * 
 * @param adjList - The adjacency list of the graph.
 * @param startNode - The starting node for the algorithm.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(V + E).
 * - Space: O(V) auxiliary.
 */
export function getBFSTrace(adjList: Record<string, string[]>, startNode: string): TraceStep[] {
  const steps: TraceStep[] = [];
  const visited: string[] = [];
  const queue: string[] = [startNode];
  
  steps.push({
    activeLine: 0,
    variables: { queue: [...queue], visited: [...visited] },
    description: `Starting BFS from node ${startNode}`,
    visited: [...visited],
    current: null,
    activeEdge: null,
    queue: [...queue]
  });

  visited.push(startNode);
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    steps.push({
      activeLine: 5,
      variables: { current, queue: [...queue], visited: [...visited] },
      description: `Exploring node ${current}`,
      visited: [...visited],
      current,
      activeEdge: null,
      queue: [...queue]
    });

    const neighbors = adjList[current] || [];
    for (const neighbor of neighbors) {
      steps.push({
        activeLine: 10,
        variables: { current, neighbor, queue: [...queue], visited: [...visited] },
        description: `Checking neighbor ${neighbor} of ${current}`,
        visited: [...visited],
        current,
        activeEdge: { from: current, to: neighbor },
        queue: [...queue]
      });

      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        queue.push(neighbor);
        
        steps.push({
          activeLine: 15,
          variables: { neighbor, queue: [...queue], visited: [...visited] },
          description: `Visiting and adding ${neighbor} to queue`,
          visited: [...visited],
          current,
          activeEdge: { from: current, to: neighbor },
          queue: [...queue]
        });
      }
    }
  }

  steps.push({
    activeLine: 20,
    variables: { visited: [...visited] },
    description: 'BFS traversal completed!',
    visited: [...visited],
    current: null,
    activeEdge: null,
    queue: []
  });

  return steps;
}

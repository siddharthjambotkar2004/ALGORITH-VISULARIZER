import type { TraceStep } from '../../types/index.js';

/**
 * Generates an execution trace for the Depth-First Search (DFS) algorithm.
 * 
 * @param adjList - The adjacency list of the graph.
 * @param startNode - The starting node for the algorithm.
 * @returns An array of TraceStep objects representing the algorithm's state at each step.
 * 
 * @complexity
 * - Time: O(V + E).
 * - Space: O(V) auxiliary.
 */
export function getDFSTrace(adjList: Record<string, string[]>, startNode: string): TraceStep[] {
  const steps: TraceStep[] = [];
  const visited: string[] = [];
  const stack: string[] = [startNode];
  
  steps.push({
    activeLine: 0,
    variables: { stack: [...stack], visited: [...visited] },
    description: `Starting DFS from node ${startNode}`,
    visited: [...visited],
    current: null,
    activeEdge: null,
    stack: [...stack]
  });

  visited.push(startNode);
  
  while (stack.length > 0) {
    const current = stack.pop()!;
    
    steps.push({
      activeLine: 5,
      variables: { current, stack: [...stack], visited: [...visited] },
      description: `Exploring node ${current}`,
      visited: [...visited],
      current,
      activeEdge: null,
      stack: [...stack]
    });

    const neighbors = adjList[current] || [];
    // For DFS we typically visit neighbors in reverse order to explore in a specific order with a stack
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i]!;
      steps.push({
        activeLine: 10,
        variables: { current, neighbor, stack: [...stack], visited: [...visited] },
        description: `Checking neighbor ${neighbor} of ${current}`,
        visited: [...visited],
        current,
        activeEdge: { from: current, to: neighbor },
        stack: [...stack]
      });

      if (!visited.includes(neighbor)) {
        visited.push(neighbor);
        stack.push(neighbor);
        
        steps.push({
          activeLine: 15,
          variables: { neighbor, stack: [...stack], visited: [...visited] },
          description: `Visiting and pushing ${neighbor} to stack`,
          visited: [...visited],
          current,
          activeEdge: { from: current, to: neighbor },
          stack: [...stack]
        });
      }
    }
  }

  steps.push({
    activeLine: 20,
    variables: { visited: [...visited] },
    description: 'DFS traversal completed!',
    visited: [...visited],
    current: null,
    activeEdge: null,
    stack: []
  });

  return steps;
}

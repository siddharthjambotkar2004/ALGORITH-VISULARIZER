import type { Algorithm } from '../types';

export const DFS: Algorithm = {
  id: 'dfs',
  name: 'Depth-First Search',
  category: 'graph',
  description: 'An algorithm for traversing or searching tree or graph data structures. The algorithm starts at the root node (selecting some arbitrary node as the root node in the case of a graph) and explores as far as possible along each branch before backtracking.',
  complexity: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  pseudocode: [
    'procedure DFS(G, v)',
    '    label v as discovered',
    '    for all directed edges from v to w in G.adjacentEdges(v) do',
    '        if vertex w is not labeled as discovered then',
    '            recursively call DFS(G, w)',
    'end procedure'
  ]
};

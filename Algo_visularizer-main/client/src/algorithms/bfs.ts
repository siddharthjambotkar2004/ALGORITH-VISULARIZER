import type { Algorithm } from '../types';

export const BFS: Algorithm = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'graph',
  description: 'An algorithm for traversing or searching tree or graph data structures. It starts at the tree root and explores all of the neighbor nodes at the present depth prior to moving on to the nodes at the next depth level.',
  complexity: {
    time: 'O(V + E)',
    space: 'O(V)',
  },
  pseudocode: [
    'procedure BFS(G, start_node)',
    '    let Q be a queue',
    '    label start_node as visited',
    '    Q.enqueue(start_node)',
    '    while Q is not empty do',
    '        v := Q.dequeue()',
    '        for all edges from v to w in G.adjacentEdges(v) do',
    '            if w is not labeled as visited then',
    '                label w as visited',
    '                Q.enqueue(w)',
    'end procedure'
  ]
};

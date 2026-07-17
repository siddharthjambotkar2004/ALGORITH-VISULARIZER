import type { Algorithm } from '../types';

export const KRUSKAL: Algorithm = {
  id: 'kruskal',
  name: 'Kruskal\'s Algorithm',
  category: 'graph',
  description: 'An algorithm that finds a minimum spanning tree for a connected weighted graph. It finds a subset of the edges that forms a tree that includes every vertex, where the total weight of all the edges in the tree is minimized.',
  complexity: {
    time: 'O(E log E)',
    space: 'O(V + E)',
  },
  pseudocode: [
    'procedure kruskal(G)',
    '    A := empty set',
    '    for each vertex v in G.V do',
    '        makeSet(v)',
    '    sort edges of G.E into nondecreasing order by weight',
    '    for each edge (u, v) in G.E sorted do',
    '        if findSet(u) != findSet(v) then',
    '            A := A ∪ {(u, v)}',
    '            union(u, v)',
    '    return A',
    'end procedure'
  ]
};

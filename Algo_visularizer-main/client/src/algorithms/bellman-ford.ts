import type { Algorithm } from '../types';

export const BELLMAN_FORD: Algorithm = {
  id: 'bellman-ford',
  name: 'Bellman-Ford Algorithm',
  category: 'graph',
  description: 'An algorithm that computes shortest paths from a single source vertex to all of the other vertices in a weighted digraph. It is slower than Dijkstra but more versatile, as it can handle graphs with negative edge weights.',
  complexity: {
    time: 'O(VE)',
    space: 'O(V)',
  },
  pseudocode: [
    'procedure BellmanFord(G, start_node)',
    '    for each vertex v in G.V:',
    '        dist[v] := INFINITY',
    '    dist[start_node] := 0',
    '    for i from 1 to |V|-1:',
    '        for each edge (u, v) with weight w in G.E:',
    '            if dist[u] + w < dist[v]:',
    '                dist[v] := dist[u] + w',
    '    for each edge (u, v) with weight w in G.E:',
    '        if dist[u] + w < dist[v]:',
    '            error "Graph contains negative cycle"',
    '    return dist[]',
    'end procedure'
  ]
};

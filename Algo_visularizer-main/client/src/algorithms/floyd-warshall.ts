import type { Algorithm } from '../types';

export const FLOYD_WARSHALL: Algorithm = {
  id: 'floyd-warshall',
  name: 'Floyd-Warshall Algorithm',
  category: 'graph',
  description: 'An algorithm for finding shortest paths in a weighted graph with positive or negative edge weights (but with no negative cycles). A single execution of the algorithm will find the lengths of shortest paths between all pairs of vertices.',
  complexity: {
    time: 'O(V³)',
    space: 'O(V²)',
  },
  pseudocode: [
    'procedure FloydWarshall(G)',
    '    let dist be a |V| × |V| matrix',
    '    for each edge (u, v) in G.E:',
    '        dist[u][v] := weight(u, v)',
    '    for each vertex v in G.V:',
    '        dist[v][v] := 0',
    '    for k from 1 to |V|:',
    '        for i from 1 to |V|:',
    '            for j from 1 to |V|:',
    '                if dist[i][j] > dist[i][k] + dist[k][j]:',
    '                    dist[i][j] := dist[i][k] + dist[k][j]',
    '    return dist',
    'end procedure'
  ]
};

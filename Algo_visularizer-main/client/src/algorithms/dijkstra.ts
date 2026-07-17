import type { Algorithm } from '../types';

export const DIJKSTRA: Algorithm = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  category: 'graph',
  description: "An algorithm for finding the shortest paths between nodes in a graph, which may represent, for example, road networks. It was conceived by computer scientist Edsger W. Dijkstra in 1956.",
  complexity: {
    time: 'O(E + V log V)',
    space: 'O(V)',
  },
  pseudocode: [
    "function Dijkstra(Graph, source):",
    "    create vertex set Q",
    "    for each vertex v in Graph:",
    "        dist[v] := INFINITY",
    "        prev[v] := UNDEFINED",
    "        add v to Q",
    "    dist[source] := 0",
    "    while Q is not empty:",
    "        u := vertex in Q with min dist[u]",
    "        remove u from Q",
    "        for each neighbor v of u:",
    "            alt := dist[u] + length(u, v)",
    "            if alt < dist[v]:",
    "                dist[v] := alt",
    "                prev[v] := u",
    "    return dist[], prev[]"
  ]
};

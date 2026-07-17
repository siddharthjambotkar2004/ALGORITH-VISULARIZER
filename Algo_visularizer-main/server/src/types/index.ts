export type AlgorithmCategory = 'sorting' | 'graph' | 'searching';

export interface Algorithm {
  id: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  pseudocode: string[];
}

export interface GraphEdge {
  to: string;
  weight: number;
}

export interface GraphInput {
  adjList: Record<string, (string | GraphEdge)[]>;
  startNode: string;
}

export interface TraceStep {
  // Sorting specific
  array?: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  
  // Graph specific
  visited?: string[];
  current?: string | null;
  activeEdge?: { from: string; to: string } | null;
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number | string>;
  edges?: { from: string; to: string; weight?: number }[];
  mstEdges?: { from: string; to: string; weight?: number }[];
  
  // Common
  activeLine: number;
  variables: Record<string, string | number | boolean | null | undefined | object>;
  description: string;
}

export interface TraceResponse {
  algorithmId: string;
  steps: TraceStep[];
}

import type { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}


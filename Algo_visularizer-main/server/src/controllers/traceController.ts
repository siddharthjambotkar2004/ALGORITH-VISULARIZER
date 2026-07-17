import type { Response } from 'express';
import crypto from 'crypto';
import { getBubbleSortTrace } from '../algorithms/sorting/bubbleSort.js';
import { getInsertionSortTrace } from '../algorithms/sorting/insertionSort.js';
import { getSelectionSortTrace } from '../algorithms/sorting/selectionSort.js';
import { getHeapSortTrace } from '../algorithms/sorting/heapSort.js';
import { getMergeSortTrace } from '../algorithms/sorting/mergeSort.js';
import { getQuickSortTrace } from '../algorithms/sorting/quickSort.js';
import { getBFSTrace } from '../algorithms/graph/bfs.js';
import { getDFSTrace } from '../algorithms/graph/dfs.js';
import { getDijkstraTrace } from '../algorithms/graph/dijkstra.js';
import { getKruskalTrace } from '../algorithms/graph/kruskal.js';
import { getBellmanFordTrace } from '../algorithms/graph/bellmanFord.js';
import { getFloydWarshallTrace } from '../algorithms/graph/floydWarshall.js';
import type { TraceResponse, GraphInput, GraphEdge, AuthRequest } from '../types/index.js';
import { TraceRequestSchema } from '../schemas/traceSchema.js';
import logger from '../utils/logger.js';
import redisClient from '../utils/redis.js';
import prisma from '../db.js';

const CACHE_TTL = 3600;

export const getAlgorithmTrace = async (req: AuthRequest, res: Response): Promise<void> => {
  const validation = TraceRequestSchema.safeParse(req.body);
  if (!validation.success) {
    logger.warn({ errors: validation.error.format() }, 'Trace request validation failed');
    res.status(400).json({ 
      error: 'Invalid input data', 
      details: validation.error.format() 
    });
    return;
  }

  const { algorithmId, inputData } = validation.data;
  const inputString = JSON.stringify(inputData);
  const hash = crypto.createHash('sha256').update(inputString).digest('hex');
  const cacheKey = `trace:${algorithmId}:${hash}`;

  // Log to history if user is authenticated
  if (req.user) {
    try {
      await prisma.history.create({
        data: {
          userId: req.user.id,
          algorithmId,
          inputData: inputString,
        },
      });
      logger.info({ userId: req.user.id, algorithmId }, 'Trace request logged to history');
    } catch (historyError) {
      logger.error({ historyError }, 'Failed to save trace run to history');
    }
  }


  try {
    if (redisClient.isReady) {
      const cachedTrace = await redisClient.get(cacheKey);
      if (cachedTrace) {
        logger.info({ algorithmId, cacheKey }, 'Trace cache hit');
        res.json(JSON.parse(cachedTrace));
        return;
      }
    }

    let steps;
    switch (algorithmId) {
      case 'bubble-sort':
        steps = getBubbleSortTrace(inputData as number[]);
        break;
      case 'insertion-sort':
        steps = getInsertionSortTrace(inputData as number[]);
        break;
      case 'selection-sort':
        steps = getSelectionSortTrace(inputData as number[]);
        break;
      case 'heap-sort':
        steps = getHeapSortTrace(inputData as number[]);
        break;
      case 'merge-sort':
        steps = getMergeSortTrace(inputData as number[]);
        break;
      case 'quick-sort':
        steps = getQuickSortTrace(inputData as number[]);
        break;
      case 'bfs': {
        const data = inputData as unknown as GraphInput;
        steps = getBFSTrace(data.adjList as Record<string, string[]>, data.startNode);
        break;
      }
      case 'dfs': {
        const data = inputData as unknown as GraphInput;
        steps = getDFSTrace(data.adjList as Record<string, string[]>, data.startNode);
        break;
      }
      case 'dijkstra': {
        const data = inputData as unknown as GraphInput;
        steps = getDijkstraTrace(data.adjList as Record<string, GraphEdge[]>, data.startNode);
        break;
      }
      case 'kruskal': {
        const data = inputData as unknown as GraphInput;
        steps = getKruskalTrace(data.adjList as Record<string, GraphEdge[]>, Object.keys(data.adjList));
        break;
      }
      case 'bellman-ford': {
        const data = inputData as unknown as GraphInput;
        steps = getBellmanFordTrace(data.adjList as Record<string, GraphEdge[]>, Object.keys(data.adjList), data.startNode);
        break;
      }
      case 'floyd-warshall': {
        const data = inputData as unknown as GraphInput;
        steps = getFloydWarshallTrace(data.adjList as Record<string, GraphEdge[]>, Object.keys(data.adjList));
        break;
      }
      default:
        res.status(404).json({ error: 'Algorithm not found' });
        return;
    }

    const response: TraceResponse = {
      algorithmId,
      steps,
    };

    // 4. Redis Caching - Save to cache
    if (redisClient.isReady && inputString.length < 5000) {
      await redisClient.setEx(cacheKey, CACHE_TTL, JSON.stringify(response));
    }

    res.json(response);
  } catch (error) {
    logger.error({ error, algorithmId }, 'Error generating trace');
    res.status(500).json({ error: 'Internal server error' });
  }
};

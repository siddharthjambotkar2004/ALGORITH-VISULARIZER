import { z } from 'zod';

const SortingInputSchema = z.array(z.number().finite()).max(50);

const GraphEdgeSchema = z.object({
  to: z.string(),
  weight: z.number().optional()
});

const GraphInputSchema = z.object({
  adjList: z.record(z.string(), z.array(z.union([z.string(), GraphEdgeSchema]))),
  startNode: z.string()
});

export const TraceRequestSchema = z.object({
  algorithmId: z.string(),
  inputData: z.union([SortingInputSchema, GraphInputSchema])
});

export type TraceRequest = z.infer<typeof TraceRequestSchema>;

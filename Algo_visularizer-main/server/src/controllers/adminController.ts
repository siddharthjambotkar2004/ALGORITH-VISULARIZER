import type { Response } from 'express';
import prisma from '../db.js';
import logger from '../utils/logger.js';
import type { AuthRequest } from '../types/index.js';
import { z } from 'zod';

const CreateAlgorithmSchema = z.object({
  identifier: z.string().min(1),
  name: z.string().min(1),
  category: z.enum(['SORTING', 'GRAPH']),
  description: z.string().min(1),
  timeComplexity: z.string().min(1),
  spaceComplexity: z.string().min(1),
  pseudocode: z.array(z.string()),
});

const UpdateAlgorithmSchema = CreateAlgorithmSchema.partial();

// Helper to parse pseudocode from JSON string
function parseAlgorithm(algo: any): any {
  return {
    ...algo,
    pseudocode: JSON.parse(algo.pseudocode),
  };
}

export const getAllAlgorithms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const algorithms = await prisma.algorithm.findMany({
      orderBy: { createdAt: 'desc' },
    }) as any[];
    res.json({ algorithms: algorithms.map(parseAlgorithm) });
  } catch (error) {
    logger.error({ error }, 'Failed to get algorithms');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAlgorithmById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const algorithm = await prisma.algorithm.findUnique({
      where: { id } as any,
    }) as any;
    if (!algorithm) {
      res.status(404).json({ error: 'Algorithm not found' });
      return;
    }
    res.json({ algorithm: parseAlgorithm(algorithm) });
  } catch (error) {
    logger.error({ error }, 'Failed to get algorithm');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createAlgorithm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = CreateAlgorithmSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
      return;
    }

    const existing = await prisma.algorithm.findUnique({
      where: { identifier: validation.data.identifier } as any,
    }) as any;
    if (existing) {
      res.status(409).json({ error: 'Algorithm identifier already exists' });
      return;
    }

    const { pseudocode, ...rest } = validation.data;
    const algorithm = await prisma.algorithm.create({
      data: {
        ...rest,
        pseudocode: JSON.stringify(pseudocode),
      },
    }) as any;

    logger.info({ algorithmId: algorithm.id }, 'Algorithm created successfully');
    res.status(201).json({ algorithm: parseAlgorithm(algorithm) });
  } catch (error) {
    logger.error({ error }, 'Failed to create algorithm');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateAlgorithm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = UpdateAlgorithmSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
      return;
    }

    const data: any = { updatedAt: new Date() };
    for (const [key, value] of Object.entries(validation.data)) {
      if (key === 'pseudocode') {
        data[key] = JSON.stringify(value);
      } else {
        data[key] = value;
      }
    }

    const algorithm = await prisma.algorithm.update({
      where: { id } as any,
      data,
    }) as any;

    logger.info({ algorithmId: id }, 'Algorithm updated successfully');
    res.json({ algorithm: parseAlgorithm(algorithm) });
  } catch (error) {
    logger.error({ error }, 'Failed to update algorithm');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteAlgorithm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.algorithm.delete({
      where: { id } as any,
    });

    logger.info({ algorithmId: id }, 'Algorithm deleted successfully');
    res.json({ message: 'Algorithm deleted successfully' });
  } catch (error) {
    logger.error({ error }, 'Failed to delete algorithm');
    res.status(500).json({ error: 'Internal server error' });
  }
};

// User Management
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { history: true },
        },
      },
    });
    res.json({ users });
  } catch (error) {
    logger.error({ error }, 'Failed to get users');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Don't let admin delete themselves
    if (id === req.user?.id) {
      res.status(400).json({ error: 'Cannot delete your own account' });
      return;
    }

    await prisma.history.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } as any });

    logger.info({ userId: id }, 'User deleted successfully');
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error({ error }, 'Failed to delete user');
    res.status(500).json({ error: 'Internal server error' });
  }
};

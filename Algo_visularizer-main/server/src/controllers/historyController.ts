import type { Response } from 'express';
import prisma from '../db.js';
import logger from '../utils/logger.js';
import type { AuthRequest } from '../types/index.js';

export const getHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const history = await prisma.history.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ history });
  } catch (error) {
    logger.error({ error, userId: req.user.id }, 'Error fetching history');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteHistoryItem = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const { id } = req.params;
  if (!id || typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid ID parameter' });
    return;
  }

  try {
    // Verify item belongs to user before deletion
    const item = await prisma.history.findUnique({
      where: { id },
    });

    if (!item) {
      res.status(404).json({ error: 'History item not found' });
      return;
    }

    if (item.userId !== req.user.id) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    await prisma.history.delete({
      where: { id },
    });

    res.json({ message: 'History item deleted' });
  } catch (error) {
    logger.error({ error, itemId: id, userId: req.user.id }, 'Error deleting history item');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    await prisma.history.deleteMany({
      where: { userId: req.user.id },
    });

    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    logger.error({ error, userId: req.user.id }, 'Error clearing history');
    res.status(500).json({ error: 'Internal server error' });
  }
};

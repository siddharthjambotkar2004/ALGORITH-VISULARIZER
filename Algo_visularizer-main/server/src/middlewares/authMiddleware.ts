import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthRequest } from '../types/index.js';
import logger from '../utils/logger.js';
import prisma from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';

export interface JwtPayload {
  id: string;
  username: string;
  email: string;
  role: string;
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token = req.cookies?.token;

    // Also support Authorization header
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    logger.warn({ error }, 'Failed to verify authentication token');
    // If token is malformed/expired, we just treat them as unauthenticated
    next();
  }
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  await optionalAuth(req, res, () => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    next();
  });
};

export const requireAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  await requireAuth(req, res, async () => {
    if (!req.user) return;
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user || user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Admin privileges required' });
        return;
      }
      next();
    } catch (error) {
      logger.error({ error }, 'Failed to check admin role');
      res.status(500).json({ error: 'Internal server error' });
    }
  });
};

import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../db.js';
import { SignupSchema, SigninSchema } from '../schemas/authSchema.js';
import logger from '../utils/logger.js';
import type { AuthRequest } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false, // Localhost dev server is HTTP, so set secure to false for compatibility
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const validation = SignupSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
    return;
  }

  const { username, email, password } = validation.data;

  try {
    // Check if email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        res.status(409).json({ error: 'Email already registered' });
      } else {
        res.status(409).json({ error: 'Username already taken' });
      }
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email: email.toLowerCase(),
        password: passwordHash,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, COOKIE_OPTIONS);

    logger.info({ userId: user.id }, 'User signed up successfully');
    res.status(201).json({ user, token });
  } catch (error) {
    logger.error({ error }, 'Signup error');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const validation = SigninSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: 'Validation failed', details: validation.error.format() });
    return;
  }

  const { emailOrUsername, password } = validation.data;

  try {
    // Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: emailOrUsername.toLowerCase() },
          { username: emailOrUsername },
        ],
      },
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, COOKIE_OPTIONS);

    logger.info({ userId: user.id }, 'User signed in successfully');

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    logger.error({ error }, 'Signin error');
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const signout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
  });
  logger.info('User signed out');
  res.json({ message: 'Signed out successfully' });
};

export const me = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  // Get full user from DB to include role
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });
  res.json({ user });
};

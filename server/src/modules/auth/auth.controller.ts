import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { hashPassword, verifyPassword, generateToken, parseJsonField, calculateProfileCompleteness } from '../../utils/helpers.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, name, firstName, lastName } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
      return;
    }

    const displayName = name || (firstName && lastName ? `${firstName} ${lastName}` : firstName || email.split('@')[0]);
    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        firstName: firstName || displayName.split(' ')[0] || displayName,
        lastName: lastName || displayName.split(' ').slice(1).join(' ') || '',
        profile: {
          create: {
            bio: '',
            currentStatus: 'Exploring opportunities',
            skills: JSON.stringify([]),
            interests: JSON.stringify([]),
            goals: JSON.stringify([]),
            education: JSON.stringify([]),
            experience: JSON.stringify([]),
            opportunityPreferences: JSON.stringify([]),
            locationPreferences: JSON.stringify([]),
            remotePreferences: JSON.stringify([]),
            completeness: 20
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        type: 'new_match',
        title: 'Welcome to ROMEfind',
        message: 'Discover opportunities you didn’t know you were looking for. Start by completing your onboarding.'
      }
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const userData = {
      id: user.id,
      email: user.email,
      name: displayName,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      profile: {
        name: displayName,
        email: user.email,
        bio: user.profile?.bio || '',
        location: user.location || '',
        country: user.country || '',
        currentStatus: user.profile?.currentStatus || '',
        skills: parseJsonField(user.profile?.skills, []),
        interests: parseJsonField(user.profile?.interests, []),
        goals: parseJsonField(user.profile?.goals, []),
        education: parseJsonField(user.profile?.education, []),
        experience: parseJsonField(user.profile?.experience, []),
        completeness: user.profile?.completeness || 20
      },
      preferences: {
        opportunityTypes: parseJsonField(user.profile?.opportunityPreferences, []),
        fields: parseJsonField(user.profile?.interests, []),
        goals: parseJsonField(user.profile?.goals, []),
        locationPreference: parseJsonField(user.profile?.locationPreferences, []),
        remotePreference: parseJsonField(user.profile?.remotePreferences, []),
        fundingPreference: user.profile?.fundingPreferences || false
      }
    };

    res.status(201).json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Failed to create user account' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: { profile: true }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
      return;
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];

    const userData = {
      id: user.id,
      email: user.email,
      name: displayName,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      profile: {
        name: displayName,
        email: user.email,
        bio: user.profile?.bio || '',
        location: user.location || '',
        country: user.country || '',
        currentStatus: user.profile?.currentStatus || '',
        skills: parseJsonField(user.profile?.skills, []),
        interests: parseJsonField(user.profile?.interests, []),
        goals: parseJsonField(user.profile?.goals, []),
        education: parseJsonField(user.profile?.education, []),
        experience: parseJsonField(user.profile?.experience, []),
        completeness: user.profile?.completeness || 0
      },
      preferences: {
        opportunityTypes: parseJsonField(user.profile?.opportunityPreferences, []),
        fields: parseJsonField(user.profile?.interests, []),
        goals: parseJsonField(user.profile?.goals, []),
        locationPreference: parseJsonField(user.profile?.locationPreferences, []),
        remotePreference: parseJsonField(user.profile?.remotePreferences, []),
        fundingPreference: user.profile?.fundingPreferences || false
      }
    };

    res.json({
      success: true,
      data: {
        token,
        user: userData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
}

export async function getMe(req: AuthRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { profile: true }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];

    const userData = {
      id: user.id,
      email: user.email,
      name: displayName,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      profile: {
        name: displayName,
        email: user.email,
        bio: user.profile?.bio || '',
        location: user.location || '',
        country: user.country || '',
        currentStatus: user.profile?.currentStatus || '',
        skills: parseJsonField(user.profile?.skills, []),
        interests: parseJsonField(user.profile?.interests, []),
        goals: parseJsonField(user.profile?.goals, []),
        education: parseJsonField(user.profile?.education, []),
        experience: parseJsonField(user.profile?.experience, []),
        completeness: user.profile?.completeness || 0
      },
      preferences: {
        opportunityTypes: parseJsonField(user.profile?.opportunityPreferences, []),
        fields: parseJsonField(user.profile?.interests, []),
        goals: parseJsonField(user.profile?.goals, []),
        locationPreference: parseJsonField(user.profile?.locationPreferences, []),
        remotePreference: parseJsonField(user.profile?.remotePreferences, []),
        fundingPreference: user.profile?.fundingPreferences || false
      }
    };

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('getMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
}

export function logout(_req: Request, res: Response): void {
  res.json({ success: true, message: 'Logged out successfully' });
}

import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from '../../config/prisma.js';
import { generateToken, parseJsonField } from '../../utils/helpers.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.warn('[auth/google] GOOGLE_CLIENT_ID env variable is not set — Google Sign-In endpoint will reject all requests.');
}

const googleClient = GOOGLE_CLIENT_ID ? new OAuth2Client(GOOGLE_CLIENT_ID) : null;

/** Build the standard user object returned by all auth endpoints. */
function buildUserPayload(user: any) {
  const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];
  return {
    id: user.id,
    email: user.email,
    name: displayName,
    role: user.role,
    profileImage: user.profileImage || '',
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
      completeness: user.profile?.completeness || 20,
      onboardingStep: user.profile?.onboardingStep || user.onboardingStep || 1
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
}

/**
 * POST /auth/google
 *
 * Body: { idToken: string }
 *
 * Security:
 * - Verifies the ID token's signature, audience, issuer, and expiry using
 *   google-auth-library (Google's official library).
 * - Only accepts tokens with a verified email.
 * - Does NOT automatically link a Google identity to an existing password-
 *   based account that shares the same email — returns 409 in that case,
 *   requiring an explicit account-linking flow.
 */
export async function googleSignIn(req: Request, res: Response): Promise<void> {
  // 1. Check service is configured
  if (!googleClient || !GOOGLE_CLIENT_ID) {
    res.status(503).json({
      success: false,
      message: 'Google Sign-In is not configured on this server. Please contact the administrator.'
    });
    return;
  }

  // 2. Extract and validate request body
  const { idToken } = req.body;
  if (!idToken || typeof idToken !== 'string') {
    res.status(400).json({
      success: false,
      message: 'A Google ID token is required.'
    });
    return;
  }

  // 3. Cryptographically verify the token
  let ticket;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID
    });
  } catch (err: any) {
    console.warn('[auth/google] Token verification failed:', err?.message);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired Google token. Please sign in again.'
    });
    return;
  }

  const payload = ticket.getPayload();
  if (!payload) {
    res.status(401).json({ success: false, message: 'Could not extract claims from Google token.' });
    return;
  }

  // 4. Check the email is verified by Google
  if (!payload.email_verified) {
    res.status(401).json({
      success: false,
      message: 'Your Google account email is not verified. Please verify it and try again.'
    });
    return;
  }

  const { sub: googleId, email, given_name, family_name, name, picture } = payload;

  if (!googleId || !email) {
    res.status(401).json({ success: false, message: 'Incomplete identity data received from Google.' });
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();

  try {
    // 5. Check if a user already exists with this googleId
    const existingByGoogleId = await prisma.user.findUnique({
      where: { googleId },
      include: { profile: true }
    });

    if (existingByGoogleId) {
      // Returning Google-authenticated user — update profile picture if changed
      if (picture && picture !== existingByGoogleId.profileImage) {
        await prisma.user.update({
          where: { id: existingByGoogleId.id },
          data: { profileImage: picture }
        });
        existingByGoogleId.profileImage = picture;
      }

      const token = generateToken({
        userId: existingByGoogleId.id,
        email: existingByGoogleId.email,
        role: existingByGoogleId.role
      });

      res.json({
        success: true,
        data: {
          token,
          user: buildUserPayload(existingByGoogleId)
        }
      });
      return;
    }

    // 6. Check if a password-based account already exists with this email
    const existingByEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingByEmail) {
      // 6a. Account exists but has a password (not linked to Google) — reject.
      // A separate account-linking flow is required (out of scope for this task).
      if (existingByEmail.passwordHash && !existingByEmail.googleId) {
        res.status(409).json({
          success: false,
          code: 'ACCOUNT_EXISTS_WITH_PASSWORD',
          message:
            'An account with this email already exists and uses a password. ' +
            'Please sign in with your email and password. ' +
            'Account linking with Google can be enabled from your profile settings.'
        });
        return;
      }
    }

    // 7. Create a new Google-authenticated user
    const firstName = given_name || (name?.split(' ')[0] ?? normalizedEmail.split('@')[0]);
    const lastName = family_name || (name?.split(' ').slice(1).join(' ') ?? '');

    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        googleId,
        passwordHash: null, // OAuth-only account — no password
        firstName,
        lastName,
        profileImage: picture || null,
        onboardingCompleted: false,
        onboardingStep: 1,
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
            completeness: 20,
            onboardingStep: 1
          }
        }
      },
      include: { profile: true }
    });

    // Create welcome notification for new user
    await prisma.notification.create({
      data: {
        userId: newUser.id,
        type: 'new_match',
        title: 'Welcome to ROMEfind',
        message: "Discover opportunities you didn't know you were looking for. Start by completing your onboarding."
      }
    });

    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: buildUserPayload(newUser)
      }
    });
  } catch (error) {
    console.error('[auth/google] Internal error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during Google Sign-In. Please try again.'
    });
  }
}

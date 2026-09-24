import { Request, Response } from 'express';
import { prisma } from '../../config/prisma.js';
import { AuthRequest } from '../../middleware/auth.middleware.js';
import { parseJsonField, stringifyJsonField, calculateProfileCompleteness } from '../../utils/helpers.js';

export async function getProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: displayName,
        profile: {
          name: displayName,
          email: user.email,
          bio: user.profile.bio || '',
          location: user.location || '',
          country: user.country || '',
          currentStatus: user.profile.currentStatus || '',
          skills: parseJsonField(user.profile.skills, []),
          interests: parseJsonField(user.profile.interests, []),
          goals: parseJsonField(user.profile.goals, []),
          education: parseJsonField(user.profile.education, []),
          experience: parseJsonField(user.profile.experience, []),
          portfolioLinks: parseJsonField(user.profile.portfolioLinks, []),
          certifications: parseJsonField(user.profile.certifications, []),
          completeness: user.profile.completeness,
          onboardingStep: user.profile.onboardingStep || 1
        },
        preferences: {
          opportunityTypes: parseJsonField(user.profile.opportunityPreferences, []),
          fields: parseJsonField(user.profile.interests, []),
          goals: parseJsonField(user.profile.goals, []),
          locationPreference: parseJsonField(user.profile.locationPreferences, []),
          remotePreference: parseJsonField(user.profile.remotePreferences, []),
          fundingPreference: user.profile.fundingPreferences
        }
      }
    });
  } catch (error) {
    console.error('getProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
}

export async function updateProfile(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const { profile, preferences, onboardingCompleted, onboardingStep, bio, skills, interests, goals, education, experience, currentStatus, location, country } = req.body;

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!currentUser) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Support both nested and flat updates
    let firstName = currentUser.firstName;
    let lastName = currentUser.lastName;
    const name = profile?.name;
    if (name) {
      const parts = name.trim().split(' ');
      firstName = parts[0] || '';
      lastName = parts.slice(1).join(' ') || '';
    }

    const updatedLocation = location !== undefined ? location : (profile?.location !== undefined ? profile.location : currentUser.location);
    const updatedCountry = country !== undefined ? country : (profile?.country !== undefined ? profile.country : currentUser.country);

    const updatedBio = bio !== undefined ? bio : (profile?.bio !== undefined ? profile.bio : currentUser.profile?.bio);
    const updatedStatus = currentStatus !== undefined ? currentStatus : (profile?.currentStatus !== undefined ? profile.currentStatus : currentUser.profile?.currentStatus);
    
    const updatedSkills = skills !== undefined ? stringifyJsonField(skills) : (profile?.skills !== undefined ? stringifyJsonField(profile.skills) : currentUser.profile?.skills || '[]');
    const updatedInterests = interests !== undefined ? stringifyJsonField(interests) : (profile?.interests !== undefined ? stringifyJsonField(profile.interests) : currentUser.profile?.interests || '[]');
    const updatedGoals = goals !== undefined ? stringifyJsonField(goals) : (profile?.goals !== undefined ? stringifyJsonField(profile.goals) : currentUser.profile?.goals || '[]');
    const updatedEducation = education !== undefined ? stringifyJsonField(education) : (profile?.education !== undefined ? stringifyJsonField(profile.education) : currentUser.profile?.education || '[]');
    const updatedExperience = experience !== undefined ? stringifyJsonField(experience) : (profile?.experience !== undefined ? stringifyJsonField(profile.experience) : currentUser.profile?.experience || '[]');

    const updatedStep = onboardingStep !== undefined ? Number(onboardingStep) : (profile?.onboardingStep !== undefined ? Number(profile.onboardingStep) : (currentUser.profile?.onboardingStep || currentUser.onboardingStep || 1));

    const updatedOppPrefs = preferences?.opportunityTypes !== undefined 
      ? stringifyJsonField(preferences.opportunityTypes) 
      : currentUser.profile?.opportunityPreferences || '[]';
    const updatedLocPrefs = preferences?.locationPreference !== undefined 
      ? stringifyJsonField(preferences.locationPreference) 
      : currentUser.profile?.locationPreferences || '[]';
    const updatedRemotePrefs = preferences?.remotePreference !== undefined 
      ? stringifyJsonField(preferences.remotePreference) 
      : currentUser.profile?.remotePreferences || '[]';
    const updatedFundingPref = preferences?.fundingPreference !== undefined 
      ? Boolean(preferences.fundingPreference) 
      : (currentUser.profile?.fundingPreferences ?? false);

    const completeness = calculateProfileCompleteness({
      bio: updatedBio,
      currentStatus: updatedStatus,
      location: updatedLocation,
      education: updatedEducation,
      experience: updatedExperience,
      skills: updatedSkills,
      interests: updatedInterests,
      goals: updatedGoals
    });

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        location: updatedLocation,
        country: updatedCountry,
        onboardingCompleted: onboardingCompleted !== undefined ? Boolean(onboardingCompleted) : currentUser.onboardingCompleted,
        onboardingStep: updatedStep,
        profile: {
          upsert: {
            create: {
              bio: updatedBio,
              currentStatus: updatedStatus,
              skills: updatedSkills,
              interests: updatedInterests,
              goals: updatedGoals,
              education: updatedEducation,
              experience: updatedExperience,
              opportunityPreferences: updatedOppPrefs,
              locationPreferences: updatedLocPrefs,
              remotePreferences: updatedRemotePrefs,
              fundingPreferences: updatedFundingPref,
              completeness,
              onboardingStep: updatedStep
            },
            update: {
              bio: updatedBio,
              currentStatus: updatedStatus,
              skills: updatedSkills,
              interests: updatedInterests,
              goals: updatedGoals,
              education: updatedEducation,
              experience: updatedExperience,
              opportunityPreferences: updatedOppPrefs,
              locationPreferences: updatedLocPrefs,
              remotePreferences: updatedRemotePrefs,
              fundingPreferences: updatedFundingPref,
              completeness,
              onboardingStep: updatedStep
            }
          }
        }
      },
      include: { profile: true }
    });

    const displayName = `${updated.firstName || ''} ${updated.lastName || ''}`.trim() || updated.email.split('@')[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updated.id,
        email: updated.email,
        name: displayName,
        onboardingCompleted: updated.onboardingCompleted,
        profile: {
          name: displayName,
          email: updated.email,
          bio: updated.profile?.bio || '',
          location: updated.location || '',
          country: updated.country || '',
          currentStatus: updated.profile?.currentStatus || '',
          skills: parseJsonField(updated.profile?.skills, []),
          interests: parseJsonField(updated.profile?.interests, []),
          goals: parseJsonField(updated.profile?.goals, []),
          education: parseJsonField(updated.profile?.education, []),
          experience: parseJsonField(updated.profile?.experience, []),
          completeness: updated.profile?.completeness || 0,
          onboardingStep: updated.profile?.onboardingStep || updated.onboardingStep || 1
        },
        preferences: {
          opportunityTypes: parseJsonField(updated.profile?.opportunityPreferences, []),
          fields: parseJsonField(updated.profile?.interests, []),
          goals: parseJsonField(updated.profile?.goals, []),
          locationPreference: parseJsonField(updated.profile?.locationPreferences, []),
          remotePreference: parseJsonField(updated.profile?.remotePreferences, []),
          fundingPreference: updated.profile?.fundingPreferences || false
        }
      }
    });
  } catch (error) {
    console.error('updateProfile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
}

export async function getProfileByUserId(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user || !user.profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }

    const displayName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email.split('@')[0];

    res.json({
      success: true,
      data: {
        id: user.id,
        name: displayName,
        profile: {
          name: displayName,
          bio: user.profile.bio || '',
          location: user.location || '',
          currentStatus: user.profile.currentStatus || '',
          skills: parseJsonField(user.profile.skills, []),
          interests: parseJsonField(user.profile.interests, []),
          goals: parseJsonField(user.profile.goals, []),
          completeness: user.profile.completeness
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve profile' });
  }
}

// Aliases for route bindings
export const getMyProfile = getProfile;
export const updateMyProfile = updateProfile;

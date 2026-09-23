import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function parseJsonField<T>(value: string | null | undefined, defaultValue: T): T {
  if (!value) return defaultValue;
  try {
    return JSON.parse(value) as T;
  } catch {
    return defaultValue;
  }
}

export function parseJsonArray<T = string>(value: string | null | undefined): T[] {
  return parseJsonField<T[]>(value, []);
}

export function stringifyJsonField(value: unknown): string {
  if (value === undefined || value === null) return '[]';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: { userId: string; email: string; role: string }): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as any });
}

export function verifyToken(token: string): { userId: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, config.jwtSecret) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function formatOpportunityResponse(opp: any) {
  if (!opp) return null;
  return {
    id: opp.id,
    title: opp.title,
    organizationId: opp.organizationId,
    organization: opp.organization ? {
      id: opp.organization.id,
      name: opp.organization.name,
      website: opp.organization.website,
      description: opp.organization.description,
      logo: opp.organization.logo,
      country: opp.organization.country,
      verificationStatus: opp.organization.verificationStatus
    } : null,
    type: opp.opportunityType,
    opportunityType: opp.opportunityType,
    description: opp.description,
    shortDescription: opp.shortDescription,
    field: parseJsonArray<string>(opp.field),
    subfields: parseJsonArray<string>(opp.subfields),
    location: opp.location,
    country: opp.country,
    remoteStatus: opp.remoteStatus,
    fundingType: opp.fundingType,
    fundingAmount: opp.fundingAmount,
    funding: opp.funding,
    benefits: parseJsonArray<string>(opp.benefits),
    eligibility: parseJsonArray<string>(opp.eligibility),
    educationRequirements: parseJsonArray<string>(opp.educationRequirements),
    experienceRequirements: opp.experienceRequirements,
    duration: opp.duration,
    deadline: opp.deadline,
    startDate: opp.startDate,
    applicationUrl: opp.applicationUrl,
    officialSource: opp.officialSource,
    sourceName: opp.sourceName,
    sourceType: opp.sourceType,
    verificationStatus: opp.verificationStatus,
    status: opp.status,
    requirements: parseJsonArray<string>(opp.requirements),
    applicationSteps: parseJsonArray<string>(opp.applicationSteps),
    tags: parseJsonArray<string>(opp.tags),
    isFeatured: opp.isFeatured,
    createdAt: opp.createdAt,
    updatedAt: opp.updatedAt
  };
}

export function calculateProfileCompleteness(profile: {
  bio?: string | null;
  currentStatus?: string | null;
  location?: string | null;
  education?: string | any[];
  experience?: string | any[];
  skills?: string | any[];
  interests?: string | any[];
  goals?: string | any[];
}): number {
  let score = 0;
  const total = 8;
  if (profile.bio && profile.bio.trim()) score++;
  if (profile.currentStatus && profile.currentStatus.trim()) score++;
  if (profile.location && profile.location.trim()) score++;
  
  const edu = Array.isArray(profile.education) ? profile.education : parseJsonField(profile.education, []);
  if (edu.length > 0) score++;

  const exp = Array.isArray(profile.experience) ? profile.experience : parseJsonField(profile.experience, []);
  if (exp.length > 0) score++;

  const skills = Array.isArray(profile.skills) ? profile.skills : parseJsonField(profile.skills, []);
  if (skills.length > 0) score++;

  const interests = Array.isArray(profile.interests) ? profile.interests : parseJsonField(profile.interests, []);
  if (interests.length > 0) score++;

  const goals = Array.isArray(profile.goals) ? profile.goals : parseJsonField(profile.goals, []);
  if (goals.length > 0) score++;

  return Math.round((score / total) * 100);
}

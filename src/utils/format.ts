import { format, formatDistanceToNow, differenceInDays, isPast, parseISO } from 'date-fns';

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'MMM d');
}

export function formatRelative(dateStr: string): string {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function daysUntil(dateStr: string): number {
  return differenceInDays(parseISO(dateStr), new Date());
}

export function isExpired(dateStr: string): boolean {
  return isPast(parseISO(dateStr));
}

export function getDeadlineUrgency(dateStr: string): 'urgent' | 'soon' | 'normal' | 'expired' {
  const days = daysUntil(dateStr);
  if (days < 0) return 'expired';
  if (days <= 3) return 'urgent';
  if (days <= 14) return 'soon';
  return 'normal';
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length).trimEnd() + '…';
}

export function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function calculateProfileCompleteness(profile: Record<string, any>): number {
  let score = 0;
  const total = 8;
  if (profile.name) score++;
  if (profile.bio) score++;
  if (profile.location) score++;
  if (Array.isArray(profile.education) && profile.education.length > 0) score++;
  if (Array.isArray(profile.experience) && profile.experience.length > 0) score++;
  if (Array.isArray(profile.skills) && profile.skills.length > 0) score++;
  if (Array.isArray(profile.interests) && profile.interests.length > 0) score++;
  if (Array.isArray(profile.goals) && profile.goals.length > 0) score++;
  return Math.round((score / total) * 100);
}

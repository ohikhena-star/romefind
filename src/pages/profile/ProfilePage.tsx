import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useUIStore } from '@/store/uiStore';
import { Button, Input, Chip } from '@/components/ui';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import { ProfileSkeleton } from '@/components/ui/composite-skeletons';
import { CountrySelector } from '@/components/ui/CountrySelector';
import { SolarIcon } from '@/components/ui/SolarIcon';
import { FIELDS, GOALS, LOCATIONS } from '@/utils/constants';
import { formatCountryDisplay } from '@/data/countries';
import { OpportunityType, RemoteStatus } from '@/types/models';
import { cn } from '@/utils/cn';

const OPPORTUNITY_TYPES = [
  { id: OpportunityType.Fellowship, label: 'Fellowships', icon: 'graduation-cap-linear' },
  { id: OpportunityType.Scholarship, label: 'Scholarships', icon: 'cup-star-linear' },
  { id: OpportunityType.Internship, label: 'Internships', icon: 'case-linear' },
  { id: OpportunityType.Job, label: 'Full-Time Jobs', icon: 'users-group-rounded-linear' },
  { id: OpportunityType.Grant, label: 'Grants & Funding', icon: 'lightbulb-linear' },
  { id: OpportunityType.Research, label: 'Research', icon: 'test-tube-linear' },
  { id: OpportunityType.Programme, label: 'Programmes', icon: 'compass-linear' },
  { id: OpportunityType.Competition, label: 'Competitions', icon: 'global-linear' },
  { id: OpportunityType.Volunteering, label: 'Volunteering', icon: 'heart-linear' },
];

const STATUS_OPTIONS = [
  'University Student (Undergrad / Master\'s / PhD)',
  'Recent Graduate',
  'Working Professional / Practitioner',
  'Software Engineer / AI Researcher',
  'Public Health / Medical Specialist',
  'Founder / Entrepreneur',
  'High School Student',
  'Career Transitioner / Seeking New Role',
];

const EXPERIENCE_LEVELS = [
  'Beginner / Student (0-1 yrs)',
  'Intermediate (1-3 yrs experience)',
  'Advanced (4-7 yrs experience)',
  'Expert / Lead (8+ yrs experience)',
];

const WORK_MODALITIES: { id: string; label: string }[] = [
  { id: 'Remote', label: 'Remote' },
  { id: 'Hybrid', label: 'Hybrid' },
  { id: 'In-Person', label: 'In-person' },
  { id: 'Flexible', label: 'Flexible' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const { savedOpportunities, trackedApplications } = useApplicationStore();

  const photoInputRef = useRef<HTMLInputElement>(null);

  // Section edit states
  const [editingIdentity, setEditingIdentity] = useState(false);
  const [editingPreferences, setEditingPreferences] = useState(false);
  const [showSignoutConfirm, setShowSignoutConfirm] = useState(false);

  const [isSavingIdentity, setIsSavingIdentity] = useState(false);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [newSkill, setNewSkill] = useState('');

  // Local identity state
  const [identityData, setIdentityData] = useState(() => ({
    name: user?.profile?.name || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    country: user?.profile?.country || '',
    currentStatus: user?.profile?.currentStatus || '',
    experienceLevel: (user?.profile as any)?.experienceLevel || '',
    photo: user?.profileImage || '',
    skills: user?.profile?.skills || [],
  }));

  // Local preferences state
  const [prefsData, setPrefsData] = useState(() => ({
    opportunityTypes: (user?.preferences?.opportunityTypes || []) as OpportunityType[],
    interests: user?.profile?.interests || [],
    goals: user?.profile?.goals || [],
    remotePreference: (user?.preferences?.remotePreference || ['Remote', 'Hybrid']).map(r => String(r)),
    locationPreference: user?.preferences?.locationPreference || [],
    fundingPreference: user?.preferences?.fundingPreference ?? true,
  }));

  // Sync state when store user changes
  useEffect(() => {
    if (user) {
      setIdentityData({
        name: user.profile?.name || '',
        bio: user.profile?.bio || '',
        location: user.profile?.location || '',
        country: user.profile?.country || '',
        currentStatus: user.profile?.currentStatus || '',
        experienceLevel: (user.profile as any)?.experienceLevel || '',
        photo: user.profileImage || '',
        skills: user.profile?.skills || [],
      });
      setPrefsData({
        opportunityTypes: (user.preferences?.opportunityTypes || []) as OpportunityType[],
        interests: user.profile?.interests || [],
        goals: user.profile?.goals || [],
        remotePreference: (user.preferences?.remotePreference || ['Remote', 'Hybrid']).map(r => String(r)),
        locationPreference: user.preferences?.locationPreference || [],
        fundingPreference: user.preferences?.fundingPreference ?? true,
      });
    }
  }, [user]);

  if (!user) return <ProfileSkeleton />;

  const toggleItem = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setFeedback({ type: 'error', message: 'Unsupported file type. Please use JPG, PNG, WebP, or GIF.' });
      e.target.value = '';
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Photo is too large. Maximum size is 1 MB.' });
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setIdentityData(prev => ({ ...prev, photo: dataUrl }));
      setFeedback(null); // Clear any previous error
    };
    reader.onerror = () => {
      setFeedback({ type: 'error', message: 'Could not read the selected file. Please try another image.' });
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    const s = newSkill.trim();
    if (s && !identityData.skills.includes(s)) {
      setIdentityData(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setIdentityData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  // Save Identity
  const handleSaveIdentity = async () => {
    setIsSavingIdentity(true);
    setFeedback(null);
    try {
      await updateUser({
        profileImage: identityData.photo,
        profile: {
          ...user.profile,
          name: identityData.name.trim() || user.profile.name,
          bio: identityData.bio, // user-provided or cleared empty
          location: identityData.location,
          country: identityData.country,
          currentStatus: identityData.currentStatus,
          experienceLevel: identityData.experienceLevel,
          skills: identityData.skills,
        } as any,
      });
      setFeedback({ type: 'success', message: 'Profile identity updated.' });
      setEditingIdentity(false);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback({ type: 'error', message: 'Could not update identity. Please try again.' });
    } finally {
      setIsSavingIdentity(false);
    }
  };

  const handleCancelIdentity = () => {
    if (user?.profile) {
      setIdentityData({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        country: user.profile.country || '',
        currentStatus: user.profile.currentStatus || '',
        experienceLevel: (user.profile as any)?.experienceLevel || '',
        photo: user.profileImage || '',
        skills: user.profile.skills || [],
      });
    }
    setEditingIdentity(false);
  };

  // Save Preferences
  const handleSavePreferences = async () => {
    setIsSavingPreferences(true);
    setFeedback(null);
    try {
      await updateUser({
        profile: {
          ...user.profile,
          interests: prefsData.interests,
          goals: prefsData.goals,
        } as any,
        preferences: {
          ...user.preferences,
          opportunityTypes: prefsData.opportunityTypes,
          fields: prefsData.interests,
          goals: prefsData.goals,
          remotePreference: prefsData.remotePreference.map(r =>
            r === 'Remote' ? RemoteStatus.Remote :
            r === 'Hybrid' ? RemoteStatus.Hybrid :
            r === 'In-Person' ? RemoteStatus.InPerson :
            RemoteStatus.Flexible
          ),
          locationPreference: prefsData.locationPreference,
          fundingPreference: prefsData.fundingPreference,
        } as any,
      });
      setFeedback({ type: 'success', message: 'Discovery preferences updated.' });
      setEditingPreferences(false);
      setTimeout(() => setFeedback(null), 3500);
    } catch {
      setFeedback({ type: 'error', message: 'Could not update preferences. Please try again.' });
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleCancelPreferences = () => {
    if (user) {
      setPrefsData({
        opportunityTypes: (user.preferences?.opportunityTypes || []) as OpportunityType[],
        interests: user.profile?.interests || [],
        goals: user.profile?.goals || [],
        remotePreference: (user.preferences?.remotePreference || ['Remote', 'Hybrid']).map(r => String(r)),
        locationPreference: user.preferences?.locationPreference || [],
        fundingPreference: user.preferences?.fundingPreference ?? true,
      });
    }
    setEditingPreferences(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const initials = (user.profile?.name || user.profile?.email?.split('@')[0] || 'U')
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── 1. Page Header ── */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-surface-200/60 dark:border-surface-800/60 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-surface-100">
              My Profile
            </h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
              Manage your personal identity, discovery criteria, and account settings.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {!editingIdentity && !editingPreferences && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingIdentity(true)}
                className="text-xs h-9 px-3 gap-1.5"
              >
                <SolarIcon name="pen-2-linear" size={14} />
                Edit Profile
              </Button>
            )}
          </div>
        </header>

        {/* ── Feedback Banner ── */}
        {feedback && (
          <div
            role="status"
            className={cn(
              'flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm border',
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50'
                : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/50'
            )}
          >
            <div className="flex items-center gap-2">
              <SolarIcon
                name={feedback.type === 'success' ? 'check-circle-linear' : 'danger-circle-linear'}
                size={16}
              />
              <span>{feedback.message}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-200"
              aria-label="Dismiss notification"
            >
              <SolarIcon name="close-circle-linear" size={14} />
            </button>
          </div>
        )}

        {/* ── 2. Profile Identity Section ── */}
        <section aria-labelledby="identity-heading" className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 sm:p-7 shadow-xs">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-100 dark:border-surface-800/60">
            <div>
              <h2 id="identity-heading" className="text-base font-semibold text-surface-900 dark:text-surface-100">
                Personal Identity
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                Your public name, current focus, and self-authored biography.
              </p>
            </div>
            {!editingIdentity ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingIdentity(true)}
                className="text-xs text-rome-600 hover:text-rome-700 dark:text-rome-400 h-8 px-2.5 gap-1"
              >
                <SolarIcon name="pen-2-linear" size={13} />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelIdentity}
                  disabled={isSavingIdentity}
                  className="text-xs h-8 px-3"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSaveIdentity}
                  disabled={isSavingIdentity}
                  className="text-xs h-8 px-3.5 bg-rome-500 hover:bg-rome-600 text-white"
                >
                  {isSavingIdentity ? 'Saving…' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          <div className="pt-6">
            {!editingIdentity ? (
              /* Read Mode */
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <Avatar className="h-20 w-20 ring-2 ring-surface-100 dark:ring-surface-800">
                    <AvatarImage src={user.profileImage || undefined} alt={user.profile?.name || 'User'} />
                    <AvatarFallback className="text-base font-semibold bg-rome-50 text-rome-700 dark:bg-surface-800 dark:text-surface-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 min-w-0 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100">
                      {user.profile?.name || 'Explorer'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-surface-500 dark:text-surface-400 mt-1">
                      {user.profile?.currentStatus && (
                        <span>{user.profile.currentStatus}</span>
                      )}
                      {(user.profile as any)?.experienceLevel && (
                        <>
                          <span>·</span>
                          <span>{(user.profile as any).experienceLevel}</span>
                        </>
                      )}
                      {user.profile?.country && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1">
                            {formatCountryDisplay(user.profile.country)}
                          </span>
                        </>
                      )}
                      {user.profile?.location && user.profile.location !== user.profile.country && (
                        <>
                          <span>·</span>
                          <span>{user.profile.location}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    {user.profile?.bio?.trim() ? (
                      <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-line">
                        {user.profile.bio}
                      </p>
                    ) : (
                      <p className="text-xs text-surface-400 dark:text-surface-500 italic">
                        Add a short bio to introduce yourself.
                      </p>
                    )}
                  </div>

                  {/* Skills preview if set */}
                  {user.profile?.skills && user.profile.skills.length > 0 && (
                    <div className="pt-2">
                      <span className="text-xs font-medium text-surface-500 dark:text-surface-400 block mb-1.5">
                        Key Skills & Strengths
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {user.profile.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200/60 dark:border-surface-700/60"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-5">
                {/* Avatar with photo selector */}
                <div className="flex items-center gap-4">
                  <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()}>
                    <Avatar className="h-16 w-16 ring-2 ring-rome-400">
                      <AvatarImage src={identityData.photo || undefined} alt="Preview" />
                      <AvatarFallback className="text-sm font-semibold bg-rome-50 text-rome-700">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <SolarIcon name="camera-linear" size={18} className="text-white" />
                    </div>
                  </div>
                  <div>
                    <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handlePhotoChange} />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => photoInputRef.current?.click()}
                      className="text-xs h-8"
                    >
                      Change Photo
                    </Button>
                    <p className="text-[11px] text-surface-400 mt-1">JPG, PNG, WebP or GIF — max 1 MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name-input" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Full Name
                    </label>
                    <Input
                      id="name-input"
                      value={identityData.name}
                      onChange={e => setIdentityData(p => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Maya Lin"
                    />
                  </div>

                  <div>
                    <label htmlFor="status-select" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Current Status
                    </label>
                    <select
                      id="status-select"
                      className="w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none h-10"
                      value={identityData.currentStatus}
                      onChange={e => setIdentityData(p => ({ ...p, currentStatus: e.target.value }))}
                    >
                      <option value="">Select current focus…</option>
                      {STATUS_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="exp-select" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Experience Level
                    </label>
                    <select
                      id="exp-select"
                      className="w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none h-10"
                      value={identityData.experienceLevel}
                      onChange={e => setIdentityData(p => ({ ...p, experienceLevel: e.target.value }))}
                    >
                      <option value="">Select experience bracket…</option>
                      {EXPERIENCE_LEVELS.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Country of Residence / Citizenship
                    </label>
                    <CountrySelector
                      value={identityData.country}
                      onChange={(countryName) => setIdentityData(p => ({ ...p, country: countryName }))}
                      placeholder="Select your country…"
                    />
                  </div>
                </div>

                {/* City/Location */}
                <div>
                  <label htmlFor="location-input" className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                    City / Specific Location (Optional)
                  </label>
                  <Input
                    id="location-input"
                    value={identityData.location}
                    onChange={e => setIdentityData(p => ({ ...p, location: e.target.value }))}
                    placeholder="e.g. Lagos, Nairobi, London, Berlin"
                  />
                </div>

                {/* Bio text area */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="bio-textarea" className="block text-xs font-medium text-surface-700 dark:text-surface-300">
                      Short Bio
                    </label>
                    <span className="text-[11px] text-surface-400">
                      {identityData.bio.length}/500
                    </span>
                  </div>
                  <textarea
                    id="bio-textarea"
                    rows={3}
                    maxLength={500}
                    value={identityData.bio}
                    onChange={e => setIdentityData(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell other applicants or mentors about your background, interests, and what you're working toward…"
                    className="w-full p-3 rounded-lg border border-surface-300 dark:border-surface-700 bg-transparent text-surface-900 dark:text-surface-50 text-sm focus:ring-2 focus:ring-rome-500 outline-none resize-none"
                  />
                  <p className="text-[11px] text-surface-400 mt-1">
                    Leave blank to clear your bio. Placeholder text is never saved.
                  </p>
                </div>

                {/* Skills editor */}
                <div>
                  <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1">
                    Skills & Strengths
                  </label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add a skill (e.g. Python, Financial Modeling, Grant Writing)…"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      className="h-9 text-xs"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={handleAddSkill}
                      className="h-9 px-3 text-xs"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {identityData.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 border border-surface-200 dark:border-surface-700"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-surface-400 hover:text-red-500"
                          aria-label={`Remove ${skill}`}
                        >
                          <SolarIcon name="close-circle-linear" size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-surface-100 dark:border-surface-800">
                  <Button variant="ghost" size="sm" onClick={handleCancelIdentity} disabled={isSavingIdentity} className="text-xs">
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleSaveIdentity} disabled={isSavingIdentity} className="text-xs bg-rome-500 hover:bg-rome-600 text-white">
                    {isSavingIdentity ? 'Saving…' : 'Save Identity'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── 3. Opportunity Preferences Section ── */}
        <section aria-labelledby="preferences-heading" className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 sm:p-7 shadow-xs">
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-100 dark:border-surface-800/60">
            <div>
              <h2 id="preferences-heading" className="text-base font-semibold text-surface-900 dark:text-surface-100">
                Opportunity Discovery Preferences
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                These criteria refine your Discover recommendations, matches, and search relevance.
              </p>
            </div>
            {!editingPreferences ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingPreferences(true)}
                className="text-xs text-rome-600 hover:text-rome-700 dark:text-rome-400 h-8 px-2.5 gap-1"
              >
                <SolarIcon name="pen-2-linear" size={13} />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelPreferences}
                  disabled={isSavingPreferences}
                  className="text-xs h-8 px-3"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSavePreferences}
                  disabled={isSavingPreferences}
                  className="text-xs h-8 px-3.5 bg-rome-500 hover:bg-rome-600 text-white"
                >
                  {isSavingPreferences ? 'Saving…' : 'Save'}
                </Button>
              </div>
            )}
          </div>

          <div className="pt-6 space-y-6">

            {/* A. Opportunity Types */}
            <div>
              <label className="block text-xs font-semibold text-surface-900 dark:text-surface-200 mb-1">
                Preferred Opportunity Types
              </label>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
                Select the formats you are actively seeking.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {OPPORTUNITY_TYPES.map(type => {
                  const selected = prefsData.opportunityTypes.includes(type.id);
                  return (
                    <button
                      key={type.id}
                      type="button"
                      disabled={!editingPreferences}
                      onClick={() => editingPreferences && setPrefsData(p => ({ ...p, opportunityTypes: toggleItem(p.opportunityTypes, type.id) }))}
                      className={cn(
                        'flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium text-left transition-all',
                        selected
                          ? 'border-rome-500 bg-rome-50 dark:bg-rome-950/20 text-rome-800 dark:text-rome-200 font-semibold'
                          : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 bg-transparent',
                        editingPreferences ? 'cursor-pointer hover:border-rome-400' : 'cursor-default'
                      )}
                    >
                      <SolarIcon name={type.icon} size={15} className={selected ? 'text-rome-600 dark:text-rome-400' : 'text-surface-400'} />
                      <span className="flex-1 truncate">{type.label}</span>
                      {selected && <SolarIcon name="check-circle-linear" size={13} className="text-rome-600 dark:text-rome-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* B. Fields & Areas of Interest */}
            <div>
              <label className="block text-xs font-semibold text-surface-900 dark:text-surface-200 mb-1">
                Fields & Disciplines
              </label>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
                Select domains to highlight on your Discover feed.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {editingPreferences ? (
                  FIELDS.map(f => (
                    <Chip
                      key={f}
                      label={f}
                      selected={prefsData.interests.includes(f)}
                      onClick={() => setPrefsData(p => ({ ...p, interests: toggleItem(p.interests, f) }))}
                    />
                  ))
                ) : prefsData.interests.length > 0 ? (
                  prefsData.interests.map(i => <Chip key={i} label={i} selected />)
                ) : (
                  <span className="text-xs text-surface-400 italic">No fields selected yet.</span>
                )}
              </div>
            </div>

            {/* C. Current Goals */}
            <div>
              <label className="block text-xs font-semibold text-surface-900 dark:text-surface-200 mb-1">
                Current Objectives
              </label>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-3">
                What are you aiming to accomplish over the next 6–12 months?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {editingPreferences ? (
                  GOALS.map(g => (
                    <Chip
                      key={g}
                      label={g}
                      variant="outline"
                      selected={prefsData.goals.includes(g)}
                      onClick={() => setPrefsData(p => ({ ...p, goals: toggleItem(p.goals, g) }))}
                    />
                  ))
                ) : prefsData.goals.length > 0 ? (
                  prefsData.goals.map(g => <Chip key={g} label={g} variant="outline" selected />)
                ) : (
                  <span className="text-xs text-surface-400 italic">No goals selected.</span>
                )}
              </div>
            </div>

            {/* D. Work Modality & Funding */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-surface-100 dark:border-surface-800">
              <div>
                <label className="block text-xs font-semibold text-surface-900 dark:text-surface-200 mb-1">
                  Work Arrangement
                </label>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-2.5">
                  Acceptable work and participation modalities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {WORK_MODALITIES.map(mod => {
                    const selected = prefsData.remotePreference.includes(mod.id);
                    return (
                      <button
                        key={mod.id}
                        type="button"
                        disabled={!editingPreferences}
                        onClick={() => editingPreferences && setPrefsData(p => ({ ...p, remotePreference: toggleItem(p.remotePreference, mod.id) }))}
                        className={cn(
                          'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
                          selected
                            ? 'bg-rome-500 text-white border-rome-600'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700',
                          editingPreferences && 'cursor-pointer hover:opacity-85'
                        )}
                      >
                        {mod.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-surface-900 dark:text-surface-200 mb-1">
                  Funding Preference
                </label>
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-2.5">
                  Whether funding/stipend is a strict priority
                </p>
                <button
                  type="button"
                  disabled={!editingPreferences}
                  onClick={() => editingPreferences && setPrefsData(p => ({ ...p, fundingPreference: !p.fundingPreference }))}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all inline-flex items-center gap-1.5',
                    prefsData.fundingPreference
                      ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700',
                    editingPreferences && 'cursor-pointer'
                  )}
                >
                  <SolarIcon
                    name={prefsData.fundingPreference ? 'check-circle-linear' : 'close-circle-linear'}
                    size={14}
                  />
                  <span>
                    {prefsData.fundingPreference ? 'Prioritize funded / paid opportunities' : 'Open to self-funded and unpaid roles'}
                  </span>
                </button>
              </div>
            </div>

            {/* Target Locations */}
            <div className="pt-2 border-t border-surface-100 dark:border-surface-800">
              <label className="block text-xs font-semibold text-surface-900 dark:text-surface-200 mb-1">
                Target Countries & Regions
              </label>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-2.5">
                Locations where you are willing to study, work, or attend programmes
              </p>
              <div className="flex flex-wrap gap-1.5">
                {editingPreferences ? (
                  LOCATIONS.map(loc => {
                    const selected = prefsData.locationPreference.includes(loc);
                    return (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => setPrefsData(p => ({ ...p, locationPreference: toggleItem(p.locationPreference, loc) }))}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-all',
                          selected
                            ? 'bg-rome-500 text-white border-rome-600'
                            : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-200'
                        )}
                      >
                        {loc}
                      </button>
                    );
                  })
                ) : prefsData.locationPreference.length > 0 ? (
                  prefsData.locationPreference.map(loc => (
                    <span
                      key={loc}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border border-surface-200 dark:border-surface-700"
                    >
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-surface-400 italic">No specific target locations set (open globally).</span>
                )}
              </div>
            </div>

            {editingPreferences && (
              <div className="flex justify-end gap-2 pt-2 border-t border-surface-100 dark:border-surface-800">
                <Button variant="ghost" size="sm" onClick={handleCancelPreferences} disabled={isSavingPreferences} className="text-xs">
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSavePreferences} disabled={isSavingPreferences} className="text-xs bg-rome-500 hover:bg-rome-600 text-white">
                  {isSavingPreferences ? 'Saving…' : 'Save Preferences'}
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* ── 4. Account Summary / Activity Links ── */}
        <section aria-labelledby="activity-heading" className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-surface-100 dark:border-surface-800/60">
            <div>
              <h2 id="activity-heading" className="text-base font-semibold text-surface-900 dark:text-surface-100">
                My Workspace Activity
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
                Quick access to your curated and in-progress applications.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <Link
              to="/my-opportunities"
              className="flex items-center justify-between p-4 rounded-xl border border-surface-200/80 dark:border-surface-800 hover:border-rome-400 dark:hover:border-rome-600 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-rome-50 dark:bg-rome-950/40 text-rome-600 dark:text-rome-400 flex items-center justify-center">
                  <SolarIcon name="heart-linear" size={18} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-100 block group-hover:text-rome-600 transition-colors">
                    Saved Opportunities
                  </span>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {savedOpportunities.length} {savedOpportunities.length === 1 ? 'item saved' : 'items saved'}
                  </span>
                </div>
              </div>
              <SolarIcon name="alt-arrow-right-linear" size={16} className="text-surface-400 group-hover:text-rome-500 transition-colors" />
            </Link>

            <Link
              to="/my-opportunities?tab=tracking"
              className="flex items-center justify-between p-4 rounded-xl border border-surface-200/80 dark:border-surface-800 hover:border-rome-400 dark:hover:border-rome-600 hover:bg-surface-50/50 dark:hover:bg-surface-800/30 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <SolarIcon name="case-linear" size={18} />
                </div>
                <div>
                  <span className="text-sm font-semibold text-surface-900 dark:text-surface-100 block group-hover:text-rome-600 transition-colors">
                    Active Applications
                  </span>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {trackedApplications.length} {trackedApplications.length === 1 ? 'application tracked' : 'applications tracked'}
                  </span>
                </div>
              </div>
              <SolarIcon name="alt-arrow-right-linear" size={16} className="text-surface-400 group-hover:text-rome-500 transition-colors" />
            </Link>
          </div>
        </section>

        {/* ── 5. Account Settings Section ── */}
        <section aria-labelledby="settings-heading" className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 shadow-xs">
          <div className="pb-4 border-b border-surface-100 dark:border-surface-800/60">
            <h2 id="settings-heading" className="text-base font-semibold text-surface-900 dark:text-surface-100">
              Account & Preferences
            </h2>
            <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">
              Manage authentication credentials, display mode, and support.
            </p>
          </div>

          <div className="divide-y divide-surface-100 dark:divide-surface-800">
            {/* Account Email */}
            <div className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">
                  Email Address
                </span>
                <span className="text-xs text-surface-400">
                  Used for account sign-in and security notifications
                </span>
              </div>
              <span className="text-xs font-mono font-medium text-surface-700 dark:text-surface-300">
                {user.profile?.email || 'Account email'}
              </span>
            </div>

            {/* Display Mode */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">
                  Interface Theme
                </span>
                <span className="text-xs text-surface-400 capitalize">
                  Current: {theme} mode
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="text-xs h-8 px-3 gap-1.5"
                aria-label="Toggle dark / light theme"
              >
                <SolarIcon name={theme === 'dark' ? 'sun-2-linear' : 'moon-linear'} size={14} />
                <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'}</span>
              </Button>
            </div>

            {/* Product Tour Reset */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">
                  Product Walkthrough
                </span>
                <span className="text-xs text-surface-400">
                  Reset the guided feature highlights
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const { resetTour } = useUIStore.getState();
                  resetTour();
                  navigate('/discover');
                }}
                className="text-xs h-8 px-3"
              >
                Take Tour Again
              </Button>
            </div>

            {/* Support */}
            <div className="py-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">
                  Feedback & Support
                </span>
                <span className="text-xs text-surface-400">
                  Questions, feedback, or report an issue
                </span>
              </div>
              <a
                href="mailto:support@romefind.com?subject=ROMEfind%20Support%20Request"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              >
                <span>Contact Team</span>
                <SolarIcon name="arrow-right-up-linear" size={13} />
              </a>
            </div>

            {/* Sign Out */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">
                  Session
                </span>
                <span className="text-xs text-surface-400">
                  Sign out of this browser session
                </span>
              </div>

              {!showSignoutConfirm ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSignoutConfirm(true)}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 border-red-200 dark:border-red-900/50 h-8 px-3 gap-1.5"
                >
                  <SolarIcon name="logout-2-linear" size={13} />
                  <span>Log out</span>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-surface-500">Sign out?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSignoutConfirm(false)}
                    className="text-xs h-8 px-2.5"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="text-xs h-8 px-3.5 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Confirm Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

import React, { useState, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar, ProgressBar, Chip, Button, Input, ProfileSkeleton } from '@/components/ui';
import { calculateProfileCompleteness } from '@/utils/format';
import { FIELDS, GOALS, LOCATIONS } from '@/utils/constants';
import { cn } from '@/utils/cn';
import { OpportunityType, RemoteStatus } from '@/types/models';
import {
  Moon, Sun, Plus, X, Compass, Camera, Check, CheckCircle,
  Briefcase, GraduationCap, Award, Globe, Lightbulb, Heart,
  Rocket, Users, Laptop, DollarSign, MapPin, Sparkles, AlertCircle
} from 'lucide-react';

// Same opportunity types list as onboarding
const OPPORTUNITY_TYPES = [
  { id: OpportunityType.Fellowship, label: 'Fellowships', icon: GraduationCap, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: OpportunityType.Scholarship, label: 'Scholarships', icon: Award, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: OpportunityType.Internship, label: 'Internships', icon: Briefcase, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: OpportunityType.Job, label: 'Full-Time Jobs', icon: Users, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: OpportunityType.Grant, label: 'Grants & Funding', icon: Lightbulb, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: OpportunityType.Research, label: 'Research', icon: Rocket, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: OpportunityType.Programme, label: 'Programmes', icon: Compass, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { id: OpportunityType.Competition, label: 'Competitions', icon: Globe, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: OpportunityType.Volunteering, label: 'Volunteering', icon: Heart, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
];

const STATUS_OPTIONS = [
  'University Student (Undergrad / Master\'s / PhD)',
  'Working Professional / Practitioner',
  'Public Health / Medical Specialist',
  'Software Engineer / AI Researcher',
  'Founder / Entrepreneur',
  'Recent Graduate',
  'High School Student',
  'Career Transitioner / Seeking New Role',
];

const EXPERIENCE_LEVELS = [
  'Beginner / Student (0-1 yrs)',
  'Intermediate (1-3 yrs experience)',
  'Advanced (4-7 yrs experience)',
  'Expert / Lead (8+ yrs experience)',
];

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newSkill, setNewSkill] = useState('');

  // Profile fields (from onboarding step 5 + profile)
  const [localProfile, setLocalProfile] = useState(() => ({
    name: user?.profile?.name || '',
    bio: user?.profile?.bio || '',
    location: user?.profile?.location || '',
    country: user?.profile?.country || '',
    currentStatus: user?.profile?.currentStatus || 'University Student',
    experienceLevel: (user?.profile as any)?.experienceLevel || 'Intermediate',
    skills: user?.profile?.skills || [],
    interests: user?.profile?.interests || [],
    goals: user?.profile?.goals || [],
    photo: (user?.profile as any)?.photo || '',
  }));

  // Preferences fields (from onboarding steps 1-4)
  const [localPrefs, setLocalPrefs] = useState(() => ({
    opportunityTypes: (user?.preferences?.opportunityTypes || []) as OpportunityType[],
    remotePreference: (user?.preferences?.remotePreference || ['Remote', 'Hybrid']) as string[],
    locationPreference: user?.preferences?.locationPreference || [],
    fundingPreference: user?.preferences?.fundingPreference ?? true,
  }));

  // Sync when user loads from store
  React.useEffect(() => {
    if (user?.profile) {
      setLocalProfile({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        country: user.profile.country || '',
        currentStatus: user.profile.currentStatus || 'University Student',
        experienceLevel: (user.profile as any)?.experienceLevel || 'Intermediate',
        skills: user.profile.skills || [],
        interests: user.profile.interests || [],
        goals: user.profile.goals || [],
        photo: (user.profile as any)?.photo || '',
      });
    }
    if (user?.preferences) {
      setLocalPrefs({
        opportunityTypes: (user.preferences.opportunityTypes || []) as OpportunityType[],
        remotePreference: (user.preferences.remotePreference || []).map((r: any) => String(r)),
        locationPreference: user.preferences.locationPreference || [],
        fundingPreference: user.preferences.fundingPreference ?? true,
      });
    }
  }, [user?.profile, user?.preferences]);

  if (!user) return <ProfileSkeleton />;

  const completeness = calculateProfileCompleteness(localProfile as any);

  // ── Photo upload ─────────────────────────────────────────────────────
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setLocalProfile(prev => ({ ...prev, photo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  // ── Save ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    try {
      await updateUser({
        profile: {
          ...user.profile,
          ...localProfile,
          completeness,
        } as any,
        preferences: {
          ...user.preferences,
          opportunityTypes: localPrefs.opportunityTypes,
          remotePreference: localPrefs.remotePreference.map(r =>
            r === 'Remote' ? RemoteStatus.Remote :
            r === 'Hybrid' ? RemoteStatus.Hybrid :
            r === 'In-Person' ? RemoteStatus.InPerson :
            RemoteStatus.Flexible
          ) as any,
          locationPreference: localPrefs.locationPreference,
          fundingPreference: localPrefs.fundingPreference,
        } as any,
      });
      setSaveStatus('success');
      setIsEditing(false);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to current user state
    if (user?.profile) {
      setLocalProfile({
        name: user.profile.name || '',
        bio: user.profile.bio || '',
        location: user.profile.location || '',
        country: user.profile.country || '',
        currentStatus: user.profile.currentStatus || '',
        experienceLevel: (user.profile as any)?.experienceLevel || 'Intermediate',
        skills: user.profile.skills || [],
        interests: user.profile.interests || [],
        goals: user.profile.goals || [],
        photo: (user.profile as any)?.photo || '',
      });
    }
    if (user?.preferences) {
      setLocalPrefs({
        opportunityTypes: (user.preferences.opportunityTypes || []) as OpportunityType[],
        remotePreference: (user.preferences.remotePreference || []).map((r: any) => String(r)),
        locationPreference: user.preferences.locationPreference || [],
        fundingPreference: user.preferences.fundingPreference ?? true,
      });
    }
    setIsEditing(false);
  };

  // ── Skill helpers ─────────────────────────────────────────────────────
  const handleAddSkill = () => {
    const s = newSkill.trim();
    if (s && !localProfile.skills.includes(s)) {
      setLocalProfile(prev => ({ ...prev, skills: [...prev.skills, s] }));
      setNewSkill('');
    }
  };

  // ── Toggle helpers ────────────────────────────────────────────────────
  const toggle = <T,>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-6 pb-24">

      {/* ── Save feedback banner ── */}
      {saveStatus === 'success' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-700 dark:text-emerald-300">
          <CheckCircle size={16} /> Profile saved successfully!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          <AlertCircle size={16} /> Failed to save. Please try again.
        </div>
      )}

      {/* ── Header Identity Card ── */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 md:p-8 shadow-card border border-surface-200 dark:border-surface-800 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative">
        {/* Avatar with upload */}
        <div className="flex-shrink-0 relative group">
          <Avatar name={localProfile.name || 'User'} size="xl" src={localProfile.photo || undefined} />
          {isEditing && (
            <>
              <button
                onClick={() => photoInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={22} className="text-white" />
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </>
          )}
        </div>

        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-950 dark:text-surface-50">
                {localProfile.name || 'Opportunity Explorer'}
              </h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {localProfile.currentStatus || 'Student / Professional'}
                {localProfile.location ? ` · ${localProfile.location}` : ''}
              </p>
              <p className="text-xs text-surface-400 mt-0.5">{user.email}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {isEditing ? (
                <>
                  <Button variant="ghost" size="sm" onClick={handleCancel} disabled={isSaving}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}>
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>

          {/* Completeness */}
          <div className="mt-5 bg-surface-50 dark:bg-surface-800/60 p-3 rounded-xl border border-surface-100 dark:border-surface-700/50">
            <div className="flex justify-between text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2">
              <span className="flex items-center gap-1.5"><Compass size={13} className="text-rome-500" /> Opportunity Identity Completeness</span>
              <span className="text-rome-600 dark:text-rome-400">{completeness}%</span>
            </div>
            <ProgressBar value={completeness} size="sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* About Me */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-4">About Me</h2>
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <textarea
                  className="w-full p-3 rounded-lg border border-surface-300 dark:border-surface-700 bg-transparent text-surface-900 dark:text-surface-50 text-sm focus:ring-2 focus:ring-rome-500 outline-none resize-none"
                  rows={3}
                  value={localProfile.bio}
                  onChange={e => setLocalProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Share a short bio about your trajectory, interests, and aspirations..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input label="Full Name" value={localProfile.name} onChange={e => setLocalProfile(p => ({ ...p, name: e.target.value }))} />
                  <div>
                    <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Current Status</label>
                    <select
                      className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none"
                      value={localProfile.currentStatus}
                      onChange={e => setLocalProfile(p => ({ ...p, currentStatus: e.target.value }))}
                    >
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <Input label="Location / City" value={localProfile.location} onChange={e => setLocalProfile(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Lagos, Nigeria" />
                  <div>
                    <label className="block text-xs font-medium text-surface-700 dark:text-surface-300 mb-1.5">Experience Level</label>
                    <select
                      className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none"
                      value={localProfile.experienceLevel}
                      onChange={e => setLocalProfile(p => ({ ...p, experienceLevel: e.target.value }))}
                    >
                      {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed">
                  {localProfile.bio || <span className="text-surface-400 italic">No bio yet. Click Edit Profile to add one.</span>}
                </p>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {localProfile.experienceLevel && (
                    <div className="text-xs">
                      <span className="text-surface-400">Experience · </span>
                      <span className="font-medium text-surface-700 dark:text-surface-300">{localProfile.experienceLevel}</span>
                    </div>
                  )}
                  {localProfile.country && (
                    <div className="text-xs">
                      <span className="text-surface-400">Country · </span>
                      <span className="font-medium text-surface-700 dark:text-surface-300">{localProfile.country}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Skills */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-4">Skills & Strengths</h2>
            {isEditing && (
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Add a skill (e.g. Python, Grant Writing, UX Research)…"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button size="sm" variant="secondary" onClick={handleAddSkill}><Plus size={16} /></Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {localProfile.skills.length > 0 ? localProfile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 text-xs font-medium rounded-full border border-surface-200 dark:border-surface-700"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => setLocalProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))}
                      className="text-surface-400 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  )}
                </span>
              )) : (
                <span className="text-sm text-surface-400 italic">No skills added yet.</span>
              )}
            </div>
          </section>

          {/* Fields & Interests */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-1">Fields & Interests</h2>
            <p className="text-xs text-surface-500 mb-4">The domains you want to explore opportunities within</p>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                FIELDS.map((f: string) => (
                  <Chip
                    key={f} label={f}
                    selected={localProfile.interests.includes(f)}
                    onClick={() => setLocalProfile(p => ({ ...p, interests: toggle(p.interests, f) }))}
                  />
                ))
              ) : localProfile.interests.length > 0 ? (
                localProfile.interests.map((i: string) => <Chip key={i} label={i} selected />)
              ) : (
                <span className="text-sm text-surface-400 italic">No interests selected. Edit your profile to add some.</span>
              )}
            </div>
          </section>

          {/* Goals */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-1">Current Goals</h2>
            <p className="text-xs text-surface-500 mb-4">What outcomes are you aiming to make happen?</p>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                GOALS.map((g: string) => (
                  <Chip
                    key={g} label={g} variant="outline"
                    selected={localProfile.goals.includes(g)}
                    onClick={() => setLocalProfile(p => ({ ...p, goals: toggle(p.goals, g) }))}
                  />
                ))
              ) : localProfile.goals.length > 0 ? (
                localProfile.goals.map((g: string) => <Chip key={g} label={g} variant="outline" selected />)
              ) : (
                <span className="text-sm text-surface-400 italic">No goals selected.</span>
              )}
            </div>
          </section>
        </div>

        {/* ── Right Column ── */}
        <div className="flex flex-col gap-6">

          {/* Opportunity Types Preference */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-5 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-1 flex items-center gap-1.5">
              <Sparkles size={14} className="text-rome-500" /> Opportunity Preferences
            </h2>
            <p className="text-xs text-surface-500 mb-4">Types you're actively seeking</p>
            <div className="flex flex-col gap-2">
              {OPPORTUNITY_TYPES.map(type => {
                const Icon = type.icon;
                const selected = localPrefs.opportunityTypes.includes(type.id);
                return (
                  <button
                    key={type.id}
                    onClick={() => isEditing && setLocalPrefs(p => ({ ...p, opportunityTypes: toggle(p.opportunityTypes, type.id) }))}
                    className={cn(
                      'flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left text-xs font-medium transition-all',
                      selected
                        ? 'border-rome-400 bg-rome-50 dark:bg-rome-950/20 text-rome-700 dark:text-rome-300'
                        : 'border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 bg-transparent',
                      isEditing ? 'cursor-pointer hover:border-rome-300' : 'cursor-default'
                    )}
                  >
                    <div className={cn('p-1 rounded-md flex-shrink-0', type.color)}>
                      <Icon size={12} />
                    </div>
                    <span className="flex-1">{type.label}</span>
                    {selected && <Check size={12} className="text-rome-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Work & Location */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-5 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-4">Work & Location</h2>

            {/* Work Modality */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-2 flex items-center gap-1">
                <Laptop size={12} /> Work Modality
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Remote', 'Hybrid', 'In-Person', 'Flexible'].map(mod => {
                  const selected = localPrefs.remotePreference.includes(mod);
                  return (
                    <button
                      key={mod}
                      onClick={() => isEditing && setLocalPrefs(p => ({ ...p, remotePreference: toggle(p.remotePreference, mod) }))}
                      className={cn(
                        'px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
                        selected ? 'bg-rome-500 text-white border-rome-600' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700',
                        isEditing && 'cursor-pointer hover:opacity-80'
                      )}
                    >
                      {mod === 'Remote' ? '🌐 Remote' : mod}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Funding */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 flex items-center gap-1">
                  <DollarSign size={12} /> Funding Required
                </span>
                <span className="text-xs text-surface-400">Prioritize paid / fully-funded</span>
              </div>
              <button
                onClick={() => isEditing && setLocalPrefs(p => ({ ...p, fundingPreference: !p.fundingPreference }))}
                className={cn(
                  'px-2.5 py-1 rounded-lg text-xs font-bold border transition-all',
                  localPrefs.fundingPreference
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-300'
                    : 'bg-surface-100 dark:bg-surface-800 text-surface-500 border-surface-200 dark:border-surface-700',
                  isEditing && 'cursor-pointer'
                )}
              >
                {localPrefs.fundingPreference ? '✓ Required' : 'Open to All'}
              </button>
            </div>

            {/* Target Locations */}
            <div>
              <label className="block text-xs font-semibold text-surface-600 dark:text-surface-400 mb-2 flex items-center gap-1">
                <MapPin size={12} /> Target Locations
              </label>
              <div className="flex flex-wrap gap-1.5">
                {isEditing ? (
                  LOCATIONS.map(loc => {
                    const selected = localPrefs.locationPreference.includes(loc);
                    return (
                      <button
                        key={loc}
                        onClick={() => setLocalPrefs(p => ({ ...p, locationPreference: toggle(p.locationPreference, loc) }))}
                        className={cn(
                          'px-2.5 py-1 rounded-md text-xs font-semibold border cursor-pointer transition-all',
                          selected ? 'bg-emerald-600 text-white border-emerald-700' : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-200 dark:border-surface-700 hover:bg-surface-200'
                        )}
                      >
                        {loc}
                      </button>
                    );
                  })
                ) : localPrefs.locationPreference.length > 0 ? (
                  localPrefs.locationPreference.map(loc => (
                    <span key={loc} className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {loc}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-surface-400 italic">No locations set.</span>
                )}
              </div>
            </div>
          </section>

          {/* Settings */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-5 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-base font-bold text-surface-950 dark:text-surface-50 mb-4">Settings</h2>

            <div className="flex items-center justify-between py-2.5 border-b border-surface-100 dark:border-surface-800 mb-3">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">Theme</span>
                <span className="text-xs text-surface-400 capitalize">{theme} mode</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
              >
                {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
              </button>
            </div>

            <div>
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-1.5">Account</span>
              <p className="text-xs text-surface-600 dark:text-surface-400">
                Email: <span className="font-medium text-surface-900 dark:text-surface-100">{user.email}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { Avatar, ProgressBar, Chip, Button, Input, ProfileSkeleton } from '@/components/ui';
import { calculateProfileCompleteness } from '@/utils/format';
import { FIELDS, GOALS, LOCATIONS } from '@/utils/constants';
import { Moon, Sun, Plus, X, Briefcase, GraduationCap, Award, Compass } from 'lucide-react';
import { UserProfile, WorkExperience, Education } from '@/types/models';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>('');

  const [profile, setProfile] = useState<UserProfile>(() => user?.profile || {
    name: 'Opportunity Explorer',
    email: 'user@romefind.com',
    location: 'United States',
    country: 'United States',
    bio: 'Passionate learner discovering next-generation career and fellowship opportunities.',
    education: [],
    experience: [],
    skills: ['Product Strategy', 'UI/UX Design', 'TypeScript', 'Research'],
    projects: [],
    certifications: [],
    portfolioLinks: [],
    interests: ['Technology', 'Design', 'Social Impact'],
    goals: ['Get experience', 'Find funding', 'Build something'],
    currentStatus: 'Exploring options',
    completeness: 80
  });

  React.useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
    }
  }, [user?.profile]);

  if (!user) return <ProfileSkeleton />;

  const completeness = calculateProfileCompleteness(profile);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = {
        ...profile,
        completeness
      };
      await updateUser({ profile: updated });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile({
      ...profile,
      skills: profile.skills.filter(s => s !== skillToRemove)
    });
  };

  const toggleInterest = (interest: string) => {
    const current = profile.interests || [];
    const updated = current.includes(interest)
      ? current.filter(i => i !== interest)
      : [...current, interest];
    setProfile({ ...profile, interests: updated });
  };

  const toggleGoal = (goal: string) => {
    const current = profile.goals || [];
    const updated = current.includes(goal)
      ? current.filter(g => g !== goal)
      : [...current, goal];
    setProfile({ ...profile, goals: updated });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Header Profile Identity Card */}
      <div className="bg-white dark:bg-surface-900 rounded-2xl p-6 md:p-8 shadow-card border border-surface-200 dark:border-surface-800 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left relative">
        <div className="flex-shrink-0">
          <Avatar name={profile.name || 'User'} size="xl" src={profile.photo} />
        </div>
        
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-surface-950 dark:text-surface-50">
                {profile.name || 'Opportunity Explorer'}
              </h1>
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 font-medium">
                {profile.currentStatus || 'Student / Professional'} • {profile.location || 'Global'}
              </p>
            </div>
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} disabled={isSaving}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-surface-50 dark:bg-surface-800/60 p-4 rounded-xl border border-surface-100 dark:border-surface-700/50">
            <div className="flex justify-between text-xs font-semibold text-surface-700 dark:text-surface-300 mb-2">
              <span className="flex items-center gap-1.5">
                <Compass size={14} className="text-rome-500" />
                Opportunity Identity Completeness
              </span>
              <span className="text-rome-600 dark:text-rome-400">{completeness}%</span>
            </div>
            <ProgressBar value={completeness} size="sm" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* About Me */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-950 dark:text-surface-50 mb-3">About Me</h2>
            {isEditing ? (
              <div className="flex flex-col gap-3">
                <textarea 
                  className="w-full p-3 rounded-lg border border-surface-300 dark:border-surface-700 bg-transparent text-surface-900 dark:text-surface-50 text-sm focus:ring-2 focus:ring-rome-500 outline-none"
                  rows={4}
                  value={profile.bio || ''}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  placeholder="Share a short bio about your trajectory, interests, and aspirations..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input 
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                  <Input 
                    label="Current Status / Role"
                    value={profile.currentStatus}
                    onChange={(e) => setProfile({...profile, currentStatus: e.target.value})}
                  />
                  <Input 
                    label="Location"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                  <Input 
                    label="Country"
                    value={profile.country}
                    onChange={(e) => setProfile({...profile, country: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
                {profile.bio || 'Add a bio to tell opportunity providers and algorithms about yourself.'}
              </p>
            )}
          </section>

          {/* Skills */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-surface-950 dark:text-surface-50">Skills & Strengths</h2>
            </div>
            
            {isEditing && (
              <div className="flex gap-2 mb-4">
                <Input 
                  placeholder="Add a new skill (e.g. Python, UX Research, Grant Writing)..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                />
                <Button size="sm" variant="secondary" onClick={handleAddSkill}>
                  <Plus size={16} />
                </Button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {profile.skills?.map((skill: string) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-100 dark:bg-surface-800 text-surface-800 dark:text-surface-200 text-xs font-medium rounded-full border border-surface-200 dark:border-surface-700"
                >
                  {skill}
                  {isEditing && (
                    <button onClick={() => handleRemoveSkill(skill)} className="text-surface-400 hover:text-red-500">
                      <X size={13} />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </section>

          {/* Interests */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-950 dark:text-surface-50 mb-2">Fields & Interests</h2>
            <p className="text-xs text-surface-500 mb-4">Select the domains you want to explore opportunities within</p>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                FIELDS.map((f: string) => (
                  <Chip
                    key={f}
                    label={f}
                    selected={profile.interests?.includes(f)}
                    onClick={() => toggleInterest(f)}
                  />
                ))
              ) : (
                profile.interests?.map((i: string) => <Chip key={i} label={i} selected />) || (
                  <span className="text-surface-500 text-xs">No interests added.</span>
                )
              )}
            </div>
          </section>

          {/* Goals */}
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-950 dark:text-surface-50 mb-2">Current Goals</h2>
            <p className="text-xs text-surface-500 mb-4">What outcomes are you aiming to make happen next?</p>
            <div className="flex flex-wrap gap-2">
              {isEditing ? (
                GOALS.map((g: string) => (
                  <Chip
                    key={g}
                    label={g}
                    selected={profile.goals?.includes(g)}
                    onClick={() => toggleGoal(g)}
                  />
                ))
              ) : (
                profile.goals?.map((g: string) => <Chip key={g} label={g} variant="outline" selected />) || (
                  <span className="text-surface-500 text-xs">No goals selected.</span>
                )
              )}
            </div>
          </section>
        </div>

        {/* Right Column / Settings */}
        <div className="flex flex-col gap-8">
          <section className="bg-white dark:bg-surface-900 rounded-xl p-6 shadow-card border border-surface-200 dark:border-surface-800">
            <h2 className="text-lg font-bold text-surface-950 dark:text-surface-50 mb-4">Preferences & Theme</h2>
            
            <div className="flex items-center justify-between py-3 border-b border-surface-100 dark:border-surface-800">
              <div>
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200 block">Theme</span>
                <span className="text-xs text-surface-400 capitalize">{theme} mode</span>
              </div>
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-200 hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-surface-700" />}
              </button>
            </div>

            <div className="py-4">
              <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block mb-2">
                Account Details
              </span>
              <p className="text-xs text-surface-600 dark:text-surface-400">
                Email: <span className="font-medium text-surface-900 dark:text-surface-100">{user.profile?.email || 'user@romefind.com'}</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

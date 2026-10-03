import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { Button, Input, Chip } from '@/components/ui';
import { cn } from '@/utils/cn';

const INTEREST_FIELDS = [
  'Product Design', 'UX/UI', 'UX Research', 'Software Engineering', 'AI / Machine Learning', 
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'Product Management', 'Business', 
  'Finance', 'Marketing', 'Sales', 'Strategy', 'Research', 'Agriculture', 'Climate', 
  'Energy', 'Healthcare', 'Education', 'Law', 'Policy', 'Media', 'Creative', 
  'Entrepreneurship', 'Social Impact', 'Biotechnology', 'Life Sciences'
];

const DESTINATIONS = [
  'Stay where I am', 'Explore my country', 'Explore Africa', 'Europe', 'UK', 
  'North America', 'Asia', 'Middle East', 'Latin America & Caribbean', 'Oceania', 
  'Remote', 'Anywhere', 'I\'m not sure yet'
];

const GOALS_LIST = [
  'Find work', 'Build my experience', 'Get funded', 'Study somewhere new', 
  'Build my portfolio', 'Get into research', 'Meet people', 'Start something', 
  'Find international opportunities', 'I\'m still figuring it out'
];

const EXPERIENCE_LEVELS = [
  'Student', 'Recent graduate', 'Early career', 'Experienced professional', 
  'Career switcher', 'Founder / builder', 'Researcher', 'Other'
];

const OPPORTUNITY_TYPES = [
  'Jobs', 'Internships', 'Fellowships', 'Scholarships', 'Grants', 'Research', 
  'Competitions', 'Accelerators', 'Conferences', 'Programmes', 'Training', 
  'Volunteer opportunities', 'Exchange opportunities'
];

const RELOCATION_OPTIONS = [
  'Yes', 'Maybe', 'No', 'Remote is my preference', 'I\'m not sure yet'
];

const FUNDING_OPTIONS = [
  'I need fully funded opportunities', 'Funding would be helpful', 
  'I\'m open to paid opportunities', 'Funding isn\'t a deciding factor', 'It depends'
];

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { updateProfile } = useProfileStore();
  
  const [step, setStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  const [name, setName] = useState(user?.profile?.name || '');
  const [location, setLocation] = useState(user?.profile?.location || '');
  const [destinations, setDestinations] = useState<string[]>(user?.preferences?.locationPreference || []);
  const [goals, setGoals] = useState<string[]>(user?.preferences?.goals || []);
  const [interests, setInterests] = useState<string[]>(user?.preferences?.fields || []);
  const [fieldSearch, setFieldSearch] = useState('');
  const [experience, setExperience] = useState<string>('');
  const [oppTypes, setOppTypes] = useState<string[]>([]);
  const [relocation, setRelocation] = useState<string>('');
  const [funding, setFunding] = useState<string>('');

  const next = () => setStep(s => s + 1);
  const back = () => setStep(s => Math.max(0, s - 1));

  const toggleArray = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const handleComplete = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...(user?.profile || {}),
        name: name.trim() || 'Explorer',
        location,
        country: location,
        bio: 'Exploring transformative opportunities.',
        interests: interests,
        goals: goals,
        currentStatus: experience,
        completeness: 100,
        onboardingStep: 10
      };

      const updatedPreferences = {
        ...(user?.preferences || {}),
        fields: interests,
        goals: goals,
        locationPreference: destinations,
        fundingPreference: funding.includes('fully funded') || funding.includes('helpful')
      };

      await updateUser({
        profile: updatedProfile as any,
        preferences: updatedPreferences as any,
        onboardingCompleted: true,
        onboardingStep: 10
      });

      updateProfile(updatedProfile as any);
      navigate('/discover');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredInterests = INTEREST_FIELDS.filter(f => f.toLowerCase().includes(fieldSearch.toLowerCase()));

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 text-center max-w-lg mx-auto flex flex-col items-center justify-center h-[50vh]">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-surface-950 dark:text-white">
              Hey, I'm ROMEfind.
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-surface-700 dark:text-surface-300">
              Let's figure out what's possible for you.
            </h2>
            <p className="text-surface-500 dark:text-surface-400 mb-10 text-lg">
              Tell me a little about where you are, where you're headed, and what you're hoping to find. You can always change this later.
            </p>
            <Button size="lg" onClick={next} className="w-48 text-base font-medium mx-auto">Let's start</Button>
          </div>
        );
      
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              First things first — what should I call you?
            </h2>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Your name" 
              className="text-lg py-6"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim() && next()}
            />
            <div className="mt-8">
              <Button onClick={next} disabled={!name.trim()}>Continue</Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <p className="text-rome-600 dark:text-rome-400 font-medium mb-4">Nice to meet you, {name || 'there'}.</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              Where are you based right now?
            </h2>
            <Input 
              value={location} 
              onChange={e => setLocation(e.target.value)} 
              placeholder="Country, region, or city" 
              className="text-lg py-6"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && location.trim() && next()}
            />
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={!location.trim()}>Continue</Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <p className="text-rome-600 dark:text-rome-400 font-medium mb-4">Got it. And where are you hoping to explore?</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-surface-900 dark:text-white leading-tight">
              Where are you looking toward?
            </h2>
            <p className="text-surface-500 mb-8">You don't have to know exactly yet. Select all that apply.</p>
            <div className="flex flex-wrap gap-2.5">
              {DESTINATIONS.map(dest => (
                <Chip 
                  key={dest} 
                  label={dest} 
                  selected={destinations.includes(dest)} 
                  onClick={() => toggleArray(setDestinations, dest)} 
                  className="cursor-pointer py-2 px-4 text-sm font-medium"
                />
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={destinations.length === 0}>Continue</Button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              What are you hoping to find right now?
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {GOALS_LIST.map(goal => (
                <Chip 
                  key={goal} 
                  label={goal} 
                  selected={goals.includes(goal)} 
                  onClick={() => toggleArray(setGoals, goal)} 
                  className="cursor-pointer py-2 px-4 text-sm font-medium"
                />
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={goals.length === 0}>Continue</Button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-surface-900 dark:text-white leading-tight">
              What are you interested in?
            </h2>
            <Input 
              value={fieldSearch} 
              onChange={e => setFieldSearch(e.target.value)} 
              placeholder="Search fields (e.g. Product Design, Engineering)" 
              className="mb-6"
            />
            <div className="flex flex-wrap gap-2.5 max-h-[40vh] overflow-y-auto pb-4">
              {filteredInterests.map(field => (
                <Chip 
                  key={field} 
                  label={field} 
                  selected={interests.includes(field)} 
                  onClick={() => toggleArray(setInterests, field)} 
                  className="cursor-pointer py-1.5 px-3 text-sm"
                />
              ))}
              {filteredInterests.length === 0 && (
                <p className="text-surface-500 italic">No matches found. Try a different term.</p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={interests.length === 0}>Continue</Button>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              Where are you right now?
            </h2>
            <div className="flex flex-col gap-2">
              {EXPERIENCE_LEVELS.map(exp => (
                <button
                  key={exp}
                  onClick={() => { setExperience(exp); setTimeout(next, 300); }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all cursor-pointer font-medium",
                    experience === exp 
                      ? "border-rome-500 bg-rome-50 dark:bg-rome-900/20 text-rome-700 dark:text-rome-300 shadow-sm ring-1 ring-rome-500"
                      : "border-surface-200 dark:border-surface-700 hover:border-rome-300 dark:hover:border-rome-700 bg-white dark:bg-surface-800"
                  )}
                >
                  {exp}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={!experience}>Continue</Button>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              What kinds of opportunities would you actually consider?
            </h2>
            <div className="flex flex-wrap gap-2.5">
              {OPPORTUNITY_TYPES.map(opt => (
                <Chip 
                  key={opt} 
                  label={opt} 
                  selected={oppTypes.includes(opt)} 
                  onClick={() => toggleArray(setOppTypes, opt)} 
                  className="cursor-pointer py-2 px-4 text-sm font-medium"
                />
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={oppTypes.length === 0}>Continue</Button>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              If the right opportunity came along, would you relocate?
            </h2>
            <div className="flex flex-col gap-2">
              {RELOCATION_OPTIONS.map(rel => (
                <button
                  key={rel}
                  onClick={() => { setRelocation(rel); setTimeout(next, 300); }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all cursor-pointer font-medium",
                    relocation === rel 
                      ? "border-rome-500 bg-rome-50 dark:bg-rome-900/20 text-rome-700 dark:text-rome-300 shadow-sm ring-1 ring-rome-500"
                      : "border-surface-200 dark:border-surface-700 hover:border-rome-300 dark:hover:border-rome-700 bg-white dark:bg-surface-800"
                  )}
                >
                  {rel}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={!relocation}>Continue</Button>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              Does funding matter for what you're looking for?
            </h2>
            <div className="flex flex-col gap-2">
              {FUNDING_OPTIONS.map(fund => (
                <button
                  key={fund}
                  onClick={() => { setFunding(fund); setTimeout(next, 300); }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all cursor-pointer font-medium",
                    funding === fund 
                      ? "border-rome-500 bg-rome-50 dark:bg-rome-900/20 text-rome-700 dark:text-rome-300 shadow-sm ring-1 ring-rome-500"
                      : "border-surface-200 dark:border-surface-700 hover:border-rome-300 dark:hover:border-rome-700 bg-white dark:bg-surface-800"
                  )}
                >
                  {fund}
                </button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <Button variant="outline" onClick={back}>Back</Button>
              <Button onClick={next} disabled={!funding}>Continue</Button>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-lg mx-auto py-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-surface-900 dark:text-white leading-tight">
              Okay, we've got a starting point.
            </h2>
            
            <div className="space-y-4 mb-12 text-lg text-surface-700 dark:text-surface-300">
              <p className="flex items-start gap-3">
                <span className="text-rome-500 text-xl mt-1">•</span> 
                <span>You're based in <strong className="font-semibold text-surface-950 dark:text-white">{location}</strong>.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-rome-500 text-xl mt-1">•</span> 
                <span>You're exploring <strong className="font-semibold text-surface-950 dark:text-white">{destinations.slice(0, 2).join(' and ')}{destinations.length > 2 ? ' and other places' : ''}</strong>.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-rome-500 text-xl mt-1">•</span> 
                <span>You're interested in <strong className="font-semibold text-surface-950 dark:text-white">{interests.slice(0, 2).join(' and ')}{interests.length > 2 ? ' and more' : ''}</strong>.</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-rome-500 text-xl mt-1">•</span> 
                <span>You're looking for ways to <strong className="font-semibold text-surface-950 dark:text-white">{goals[0]?.toLowerCase()}</strong>.</span>
              </p>
            </div>

            <h3 className="text-2xl font-bold mb-8 text-surface-900 dark:text-white">
              Let's see what's possible.
            </h3>
            
            <Button size="lg" onClick={handleComplete} disabled={isSaving} className="w-full text-base font-bold py-6">
              {isSaving ? "Preparing your map..." : "Show me"}
            </Button>
            
            <div className="mt-4 text-center">
              <button onClick={() => setStep(1)} className="text-sm text-surface-500 hover:text-surface-800 underline underline-offset-2">
                Wait, let me change something
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-[70vh] flex flex-col pt-8 md:pt-16 pb-12 px-4">
      {step > 0 && step < 10 && (
        <div className="max-w-xl mx-auto w-full mb-12">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-surface-400 uppercase tracking-wider">Getting to know you</span>
            <button 
              onClick={handleComplete}
              className="text-xs text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 font-medium"
            >
              Skip
            </button>
          </div>
          <div className="h-1 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-rome-500 transition-all duration-500 ease-out" 
              style={{ width: `${(step / 9) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="flex-1 w-full">
        {renderStep()}
      </div>
    </div>
  );
};

export default OnboardingFlow;

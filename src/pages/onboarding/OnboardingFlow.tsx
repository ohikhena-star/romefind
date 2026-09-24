import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProfileStore } from '@/store/profileStore';
import { Button, Chip, Input } from '@/components/ui';
import { 
  Check, Briefcase, GraduationCap, Globe, Lightbulb, Heart, 
  Compass, Rocket, Award, Users, Laptop, DollarSign, MapPin, 
  Sparkles, ArrowRight, ArrowLeft 
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { OpportunityType, RemoteStatus, ExperienceLevel } from '@/types/models';
import { FIELDS, GOALS, LOCATIONS, WORK_MODALITIES } from '@/utils/constants';

const OPPORTUNITY_TYPES = [
  { id: OpportunityType.Fellowship, label: 'Fellowships', desc: 'Mentorship, funding, and career acceleration', icon: GraduationCap, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: OpportunityType.Scholarship, label: 'Scholarships', desc: 'Degree and tuition financial support', icon: Award, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: OpportunityType.Internship, label: 'Internships', desc: 'Hands-on practical industry experience', icon: Briefcase, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: OpportunityType.Job, label: 'Full-Time & Remote Jobs', desc: 'Direct career roles and positions', icon: Users, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: OpportunityType.Grant, label: 'Grants & Funding', desc: 'Non-dilutive capital for projects and research', icon: Lightbulb, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: OpportunityType.Research, label: 'Research Positions', desc: 'Academic and scientific lab investigations', icon: Rocket, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  { id: OpportunityType.Programme, label: 'Programmes & Accelerators', desc: 'Structured cohorts and bootcamps', icon: Compass, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { id: OpportunityType.Competition, label: 'Competitions & Hackathons', desc: 'Prizes, challenges, and recognition', icon: Globe, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: OpportunityType.Volunteering, label: 'Volunteering & Impact', desc: 'Community and civic leadership roles', icon: Heart, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
];

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { updateProfile } = useProfileStore();
  
  // Guarantee starting at step 1
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 5;

  // Selected State
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([
    OpportunityType.Fellowship,
    OpportunityType.Internship,
    OpportunityType.Grant
  ]);
  
  const [selectedFields, setSelectedFields] = useState<string[]>([
    'Public Health',
    'Technology',
    'Social Impact'
  ]);
  
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    'Build practical experience',
    'Find funding & grants'
  ]);

  const [remotePreferences, setRemotePreferences] = useState<string[]>([
    'Remote', 'Hybrid'
  ]);

  const [targetLocations, setTargetLocations] = useState<string[]>([
    'Remote (Worldwide)', 'United States', 'United Kingdom', 'Nigeria'
  ]);

  const [requireFunding, setRequireFunding] = useState<boolean>(true);
  const [experienceLevel, setExperienceLevel] = useState<string>('Intermediate');

  const [profileData, setProfileData] = useState({
    name: user?.profile?.name || '',
    residence: user?.profile?.location || 'Nigeria',
    country: user?.profile?.country || 'Nigeria',
    status: user?.profile?.currentStatus || 'University Student',
    bio: user?.profile?.bio || ''
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    const updatedProfile = {
      ...(user?.profile || {}),
      name: profileData.name.trim() || user?.profile?.name || 'Explorer',
      location: profileData.residence,
      country: profileData.country,
      currentStatus: profileData.status,
      bio: profileData.bio || 'Exploring transformative opportunities across fields.',
      interests: selectedFields,
      goals: selectedGoals,
      experienceLevel,
      completeness: 90
    };

    const updatedPreferences = {
      ...(user?.preferences || {}),
      opportunityTypes: selectedTypes,
      fields: selectedFields,
      goals: selectedGoals,
      remotePreference: remotePreferences.map(r => r === 'Remote' ? RemoteStatus.Remote : r === 'Hybrid' ? RemoteStatus.Hybrid : RemoteStatus.InPerson),
      locationPreference: targetLocations,
      fundingPreference: requireFunding
    };

    await updateUser({
      profile: updatedProfile as any,
      preferences: updatedPreferences as any,
      onboardingCompleted: true
    });

    updateProfile(updatedProfile as any);
    navigate('/discover');
  };

  const toggleType = (type: OpportunityType) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleField = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]
    );
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const toggleRemote = (status: string) => {
    setRemotePreferences(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  };

  const toggleTargetLocation = (loc: string) => {
    setTargetLocations(prev =>
      prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
    );
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1: return selectedTypes.length === 0;
      case 2: return selectedFields.length === 0;
      case 3: return selectedGoals.length === 0;
      case 4: return remotePreferences.length === 0 || targetLocations.length === 0;
      case 5: return !profileData.name.trim();
      default: return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 mb-1">
              <Sparkles className="w-4 h-4" /> Step 1 of {totalSteps}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
              What types of opportunities are you seeking?
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6 text-sm md:text-base">
              Select all that apply. ROMEfind will construct your personalized opportunity map.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {OPPORTUNITY_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={cn(
                      "flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                      isSelected 
                        ? "border-rome-500 bg-rome-50/70 dark:bg-rome-950/30 shadow-sm ring-1 ring-rome-500/50" 
                        : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-800"
                    )}
                  >
                    <div className={cn("p-2 rounded-lg flex-shrink-0 mt-0.5", type.color)}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={cn("font-bold text-sm", isSelected ? "text-rome-700 dark:text-rome-400" : "text-surface-900 dark:text-white")}>
                          {type.label}
                        </h3>
                        <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ml-1 transition-colors", 
                          isSelected ? "border-rome-500 bg-rome-500 text-white" : "border-surface-300 dark:border-surface-600 text-transparent"
                        )}>
                          <Check size={10} className={isSelected ? "opacity-100 stroke-[3]" : "opacity-0"} />
                        </div>
                      </div>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5 leading-snug">
                        {type.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 mb-1">
              <Sparkles className="w-4 h-4" /> Step 2 of {totalSteps}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
              What fields and sectors excite you?
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6 text-sm md:text-base">
              Choose your disciplines (e.g. Public Health, Technology, Climate, Life Sciences).
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              {FIELDS.map((field: string) => {
                const isSelected = selectedFields.includes(field);
                return (
                  <Chip
                    key={field}
                    label={field}
                    selected={isSelected}
                    onClick={() => toggleField(field)}
                    size="md"
                    className="cursor-pointer font-medium"
                  />
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 mb-1">
              <Sparkles className="w-4 h-4" /> Step 3 of {totalSteps}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
              What are you trying to make happen?
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6 text-base">
              Goal-based exploration connects you to hidden alternative pathways.
            </p>
            
            <div className="flex flex-wrap gap-2.5">
              {GOALS.map((goal: string) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <Chip
                    key={goal}
                    label={goal}
                    selected={isSelected}
                    onClick={() => toggleGoal(goal)}
                    variant="outline"
                    size="md"
                    className="cursor-pointer font-medium"
                  />
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 mb-1">
              <Sparkles className="w-4 h-4" /> Step 4 of {totalSteps}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
              Work arrangement & location preferences
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6 text-sm md:text-base">
              Tell us where and how you want to work or pursue opportunities.
            </p>

            <div className="space-y-6 max-w-2xl">
              {/* Remote / In-Person Setup */}
              <div>
                <label className="block text-sm font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <Laptop className="w-4 h-4 text-rome-500" />
                  Work Modality & Arrangement
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Remote', 'Hybrid', 'In-Person', 'Flexible'].map((mod) => (
                    <button
                      key={mod}
                      type="button"
                      onClick={() => toggleRemote(mod)}
                      className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer",
                        remotePreferences.includes(mod)
                          ? "bg-rome-500 text-white border-rome-600 shadow-sm"
                          : "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-200"
                      )}
                    >
                      {mod === 'Remote' ? '🌐 Full-Time Remote' : mod}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target / Preferred Locations */}
              <div>
                <label className="block text-sm font-bold text-surface-900 dark:text-white mb-2 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rome-500" />
                  Target / Preferred Locations (Where you want opportunities to be based)
                </label>
                <div className="flex flex-wrap gap-2">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => toggleTargetLocation(loc)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer",
                        targetLocations.includes(loc)
                          ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                          : "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:bg-surface-200"
                      )}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Requirement */}
              <div className="pt-2 border-t border-surface-200 dark:border-surface-700 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-surface-900 dark:text-white flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                    Funding & Stipend Requirement
                  </h4>
                  <p className="text-xs text-surface-500">Prioritize fully-funded opportunities, grants, and paid stipends</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireFunding(!requireFunding)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                    requireFunding 
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-300"
                      : "bg-surface-100 dark:bg-surface-800 text-surface-500 border-surface-200 dark:border-surface-700"
                  )}
                >
                  {requireFunding ? "✓ Required / Preferred" : "Open to All"}
                </button>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rome-600 dark:text-rome-400 mb-1">
              <Sparkles className="w-4 h-4" /> Step 5 of {totalSteps}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">
              Complete your Opportunity Profile
            </h2>
            <p className="text-surface-600 dark:text-surface-400 mb-6 text-sm md:text-base">
              These details tailor eligibility checks and personalize your fit scores.
            </p>
            
            <div className="space-y-4 max-w-md">
              <Input
                label="Full Name *"
                value={profileData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="e.g. Alex Chen"
                required
              />
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Current Status / Role
                </label>
                <select 
                  className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none cursor-pointer"
                  value={profileData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfileData({ ...profileData, status: e.target.value })}
                >
                  <option value="University Student">University Student (Undergrad / Master's / PhD)</option>
                  <option value="Working Professional">Working Professional / Practitioner</option>
                  <option value="Public Health Specialist">Public Health / Medical Specialist</option>
                  <option value="Software Engineer / AI Researcher">Software Engineer / AI Researcher</option>
                  <option value="Founder / Entrepreneur">Founder / Entrepreneur</option>
                  <option value="Recent Graduate">Recent Graduate</option>
                  <option value="High School Student">High School Student</option>
                  <option value="Career Transitioner">Career Transitioner / Seeking New Role</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Current Residence / Country of Citizenship
                </label>
                <select 
                  className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none cursor-pointer"
                  value={profileData.residence}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfileData({ ...profileData, residence: e.target.value, country: e.target.value })}
                >
                  {LOCATIONS.filter(l => !l.includes('Remote')).map((loc: string) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Experience Level
                </label>
                <select 
                  className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none cursor-pointer"
                  value={experienceLevel}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setExperienceLevel(e.target.value)}
                >
                  <option value="Beginner">Beginner / Student (0-1 yrs)</option>
                  <option value="Intermediate">Intermediate (1-3 yrs experience)</option>
                  <option value="Advanced">Advanced (4-7 yrs experience)</option>
                  <option value="Expert">Expert / Lead (8+ yrs experience)</option>
                </select>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col min-h-[460px] max-w-3xl mx-auto py-4">
      {/* Progress Bar Header */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((step) => (
          <div 
            key={step} 
            className={cn(
              "h-1.5 rounded-full transition-all duration-300 flex-1",
              step === currentStep ? "bg-rome-500" : 
              step < currentStep ? "bg-rome-200 dark:bg-rome-900/50" : 
              "bg-surface-100 dark:bg-surface-800"
            )} 
          />
        ))}
      </div>

      <div className="flex-1">
        {renderStepContent()}
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 pt-6 border-t border-surface-200 dark:border-surface-800 flex items-center justify-between">
        {currentStep > 1 ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack}
            leftIcon={<ArrowLeft size={16} />}
          >
            Back
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={completeOnboarding} 
            className="text-surface-400 hover:text-surface-700 dark:hover:text-surface-200"
          >
            Skip for now
          </Button>
        )}
        
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleNext} 
          disabled={isNextDisabled()}
          rightIcon={<ArrowRight size={16} />}
          className="ml-auto"
        >
          {currentStep === totalSteps ? "Launch Opportunity Map 🚀" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useProfileStore } from '@/store/profileStore';
import { Button, Chip, Input } from '@/components/ui';
import { Check, Briefcase, GraduationCap, Globe, Lightbulb, Heart, Compass, BookOpen, Rocket, Award } from 'lucide-react';
import { cn } from '@/utils/cn';
import { OpportunityType } from '@/types/models';
import { FIELDS, GOALS, LOCATIONS } from '@/utils/constants';

const OPPORTUNITY_TYPES = [
  { id: OpportunityType.Internship, label: 'Internships', icon: Briefcase, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: OpportunityType.Fellowship, label: 'Fellowships', icon: GraduationCap, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  { id: OpportunityType.Scholarship, label: 'Scholarships', icon: Award, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { id: OpportunityType.Grant, label: 'Grants & Funding', icon: Lightbulb, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: OpportunityType.Competition, label: 'Competitions', icon: Globe, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: OpportunityType.Programme, label: 'Programmes', icon: Compass, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  { id: OpportunityType.Research, label: 'Research', icon: Rocket, color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: OpportunityType.Volunteering, label: 'Volunteering', icon: Heart, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
];

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const { onboardingStep, setOnboardingStep } = useUIStore();
  const { updateProfile } = useProfileStore();
  
  const [selectedTypes, setSelectedTypes] = useState<OpportunityType[]>([
    OpportunityType.Internship,
    OpportunityType.Fellowship
  ]);
  const [selectedFields, setSelectedFields] = useState<string[]>(['Technology', 'Design']);
  const [selectedGoals, setSelectedGoals] = useState<string[]>(['Get experience', 'Find funding']);
  
  const [profileData, setProfileData] = useState({
    name: user?.profile?.name || '',
    location: user?.profile?.location || 'United States',
    status: user?.profile?.currentStatus || 'University Student',
  });

  const handleNext = () => {
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    }
  };

  const completeOnboarding = () => {
    const updatedProfile = {
      ...(user?.profile || {}),
      name: profileData.name || user?.profile?.name || 'Explorer',
      location: profileData.location,
      currentStatus: profileData.status,
      interests: selectedFields,
      goals: selectedGoals,
      completeness: 85
    };

    const updatedPreferences = {
      ...(user?.preferences || {}),
      opportunityTypes: selectedTypes,
      fields: selectedFields,
      goals: selectedGoals
    };

    updateUser({
      profile: updatedProfile as any,
      preferences: updatedPreferences as any,
      onboardingCompleted: true
    });

    updateProfile(updatedProfile as any);
    setOnboardingStep(4);
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

  const renderStepContent = () => {
    switch (onboardingStep) {
      case 1:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">What are you looking for?</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6 text-base">Select the types of opportunities you want to discover.</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {OPPORTUNITY_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type.id);
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => toggleType(type.id)}
                    className={cn(
                      "flex items-center gap-3.5 p-4 rounded-xl border-2 text-left transition-all duration-200",
                      isSelected 
                        ? "border-rome-500 bg-rome-50 dark:bg-rome-900/20 shadow-sm" 
                        : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 bg-white dark:bg-surface-800"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-lg flex-shrink-0", type.color)}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("font-semibold text-sm", isSelected ? "text-rome-700 dark:text-rome-400" : "text-surface-900 dark:text-white")}>
                        {type.label}
                      </h3>
                    </div>
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors", 
                      isSelected ? "border-rome-500 bg-rome-500 text-white" : "border-surface-300 dark:border-surface-600 text-transparent"
                    )}>
                      <Check size={12} className={isSelected ? "opacity-100" : "opacity-0"} />
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
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">What fields interest you?</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6 text-base">Select fields to personalize your opportunity map.</p>
            
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
                    className="cursor-pointer"
                  />
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">What are you trying to make happen?</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6 text-base">Goal-driven exploration helps you discover hidden paths.</p>
            
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
                    className="cursor-pointer"
                  />
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-2">Tell us about yourself</h2>
            <p className="text-surface-500 dark:text-surface-400 mb-6 text-base">Final details to tailor deadlines and eligibility.</p>
            
            <div className="space-y-4 max-w-md">
              <Input
                label="Full Name"
                value={profileData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Your name"
              />
              
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Current Status
                </label>
                <select 
                  className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none"
                  value={profileData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfileData({ ...profileData, status: e.target.value })}
                >
                  <option value="High School Student">High School Student</option>
                  <option value="University Student">University Student (Undergrad/Grad)</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="Freelancer / Founder">Freelancer / Founder</option>
                  <option value="Looking for opportunities">Looking for opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-200 mb-1.5">
                  Location
                </label>
                <select 
                  className="w-full px-3 py-2.5 bg-white dark:bg-surface-900 border border-surface-300 dark:border-surface-700 rounded-lg text-sm text-surface-900 dark:text-white focus:ring-2 focus:ring-rome-500 outline-none"
                  value={profileData.location}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setProfileData({ ...profileData, location: e.target.value })}
                >
                  {LOCATIONS.map((loc: string) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    switch (onboardingStep) {
      case 1: return selectedTypes.length === 0;
      case 2: return selectedFields.length === 0;
      case 3: return selectedGoals.length === 0;
      case 4: return !profileData.name;
      default: return false;
    }
  };

  const currentStep = onboardingStep || 1;

  return (
    <div className="w-full flex flex-col min-h-[440px]">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((step) => (
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

      {/* Navigation */}
      <div className="mt-10 pt-6 border-t border-surface-100 dark:border-surface-800 flex items-center justify-between">
        {currentStep > 1 ? (
          <Button variant="outline" size="sm" onClick={handleBack}>
            Back
          </Button>
        ) : (
          <Button variant="ghost" size="sm" onClick={completeOnboarding} className="text-surface-400">
            Skip
          </Button>
        )}
        
        <Button 
          variant="primary" 
          size="sm"
          onClick={handleNext} 
          disabled={isNextDisabled()}
          className="ml-auto"
        >
          {currentStep === 4 ? "Complete Setup" : "Continue"}
        </Button>
      </div>
    </div>
  );
};

export default OnboardingFlow;

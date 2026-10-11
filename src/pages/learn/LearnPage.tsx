import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { getRecommendationsForOpportunity, getRecommendationsForProfile } from '@/services/learning.service';
import { learningResources } from '@/data/learning-resources';
import { api } from '@/api/client';
import { Badge, Button, EmptyState, Skeleton } from '@/components/ui';
import { BookOpen, ExternalLink, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Opportunity, LearningResource } from '@/types/models';
import { cn } from '@/utils/cn';

export default function LearnPage() {
  const navigate = useNavigate();
  const { opportunities, isLoading } = useOpportunityStore();
  const { savedOpportunities, trackedApplications } = useApplicationStore();
  const { user } = useAuthStore();
  
  const [learningStatus, setLearningStatus] = useState<Record<string, string>>(() => {
    try {
      return JSON.parse(localStorage.getItem('learningStatus') || '{}');
    } catch {
      return {};
    }
  });

  // Fetch learning progress from backend
  useEffect(() => {
    api.getUserLearningProgress()
      .then(progressList => {
        if (Array.isArray(progressList)) {
          const map: Record<string, string> = {};
          progressList.forEach(p => {
            const st = p.status === 'COMPLETED' ? 'completed' : p.status === 'LEARNING' ? 'learning' : 'want';
            map[p.resourceId] = st;
          });
          setLearningStatus(prev => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const newStatus = { ...learningStatus, [id]: status };
    setLearningStatus(newStatus);
    localStorage.setItem('learningStatus', JSON.stringify(newStatus));

    const serverStatus = status === 'completed' ? 'COMPLETED' : status === 'learning' ? 'LEARNING' : 'WANT_TO_LEARN';
    try {
      await api.updateUserLearningProgress(id, serverStatus as any);
    } catch {
      // local state persists
    }
  };

  const relevantOpportunityIds = Array.from(new Set([
    ...savedOpportunities,
    ...trackedApplications.map(a => a.opportunityId)
  ]));

  const savedOpps: Opportunity[] = opportunities.filter((opp: Opportunity) =>
    relevantOpportunityIds.includes(opp.id)
  );

  const profileRecommendations: LearningResource[] = user
    ? getRecommendationsForProfile(user.profile, learningResources)
    : learningResources.slice(0, 6);

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">{Array.from({length:4}).map((_,i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}</div>;

  return (
    <div className="w-full py-4 sm:py-8 flex flex-col gap-8 sm:gap-10 overflow-hidden">
      <div className="w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-surface-950 dark:text-surface-50 tracking-tight break-words">
          Learn for what you're pursuing.
        </h1>
        <p className="text-sm sm:text-base text-surface-600 dark:text-surface-400 mt-1.5">
          Build skills connected to opportunities you're interested in.
        </p>
      </div>

      {savedOpps.length === 0 ? (
        <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-6 sm:p-8 border border-surface-200 dark:border-surface-800">
          <EmptyState
            icon="book-2-linear"
            title="Save opportunities to get tailored learning recommendations"
            description="When you save opportunities you want to pursue, ROMEfind analyzes the required skills and recommends high-impact resources."
            actionLabel="Explore opportunities"
            onAction={() => navigate('/explore')}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rome-500 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100">
              Recommended for Your Saved Opportunities
            </h2>
          </div>
          
          {savedOpps.map((opp: Opportunity) => {
            const resources = getRecommendationsForOpportunity(opp, learningResources);
            if (resources.length === 0) return null;

            return (
              <div key={opp.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-surface-200 dark:border-surface-800">
                  <h3 className="text-sm sm:text-base font-semibold text-surface-800 dark:text-surface-200 break-words min-w-0 flex-1">
                    Skills for: <span className="text-rome-600 dark:text-rome-400">{opp.title}</span>
                  </h3>
                  <Badge variant="secondary" className="shrink-0">{opp.type}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource: LearningResource) => (
                    <div
                      key={resource.id}
                      className="bg-white dark:bg-surface-900 rounded-xl p-4 sm:p-5 border border-surface-200 dark:border-surface-800 flex flex-col h-full hover:shadow-card-hover transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                          {resource.type}
                        </span>
                        <span className={cn(
                          "text-xs font-bold px-2 py-0.5 rounded",
                          resource.free 
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300"
                        )}>
                          {resource.free ? 'Free' : 'Paid'}
                        </span>
                      </div>
                      
                      <h4 className="text-sm sm:text-base font-bold text-surface-950 dark:text-surface-50 mb-1 leading-snug">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-surface-500 mb-2">{resource.provider} • {resource.duration}</p>
                      <p className="text-xs text-surface-600 dark:text-surface-400 mb-3 line-clamp-2 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.skills.slice(0, 3).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-[11px] rounded text-surface-700 dark:text-surface-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {resource.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[11px] text-surface-400 font-medium">
                            +{resource.skills.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface-100 dark:border-surface-800 gap-2">
                        <select 
                          className="text-xs font-medium bg-surface-50 dark:bg-surface-800 px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 outline-none cursor-pointer text-surface-700 dark:text-surface-300"
                          value={learningStatus[resource.id] || 'want'}
                          onChange={(e) => updateStatus(resource.id, e.target.value)}
                          aria-label="Learning status"
                        >
                          <option value="want">Want to learn</option>
                          <option value="learning">Learning</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <a 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rome-600 dark:text-rome-400 hover:text-rome-700 py-1 px-1.5"
                        >
                          <span>Open</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Based on Interests */}
      <div className="flex flex-col gap-4 pt-6 border-t border-surface-200 dark:border-surface-800">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-100">
            Based on Your Interests
          </h2>
          <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
            General skill building aligned with your career direction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileRecommendations.map((resource: LearningResource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-surface-900 rounded-xl p-4 sm:p-5 border border-surface-200 dark:border-surface-800 flex flex-col h-full hover:shadow-card-hover transition-shadow"
            >
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300">
                  {resource.type}
                </span>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded",
                  resource.free 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300"
                )}>
                  {resource.free ? 'Free' : 'Paid'}
                </span>
              </div>
              
              <h4 className="text-sm sm:text-base font-bold text-surface-950 dark:text-surface-50 mb-1 leading-snug">
                {resource.title}
              </h4>
              <p className="text-xs text-surface-500 mb-2">{resource.provider} • {resource.duration}</p>
              <p className="text-xs text-surface-600 dark:text-surface-400 mb-3 line-clamp-2 leading-relaxed">
                {resource.description}
              </p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {resource.skills.slice(0, 3).map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-[11px] rounded text-surface-700 dark:text-surface-300 font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {resource.skills.length > 3 && (
                  <span className="px-1.5 py-0.5 text-[11px] text-surface-400 font-medium">
                    +{resource.skills.length - 3}
                  </span>
                )}
              </div>
              
              <div className="mt-auto pt-3 flex items-center justify-between border-t border-surface-100 dark:border-surface-800 gap-2">
                <select 
                  className="text-xs font-medium bg-surface-50 dark:bg-surface-800 px-2 py-1 rounded-lg border border-surface-200 dark:border-surface-700 outline-none cursor-pointer text-surface-700 dark:text-surface-300"
                  value={learningStatus[resource.id] || 'want'}
                  onChange={(e) => updateStatus(resource.id, e.target.value)}
                  aria-label="Learning status"
                >
                  <option value="want">Want to learn</option>
                  <option value="learning">Learning</option>
                  <option value="completed">Completed</option>
                </select>
                
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rome-600 dark:text-rome-400 hover:text-rome-700 py-1 px-1.5"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

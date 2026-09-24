import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useApplicationStore } from '@/store/applicationStore';
import { useAuthStore } from '@/store/authStore';
import { getRecommendationsForOpportunity, getRecommendationsForProfile } from '@/services/learning.service';
import { learningResources } from '@/data/learning-resources';
import { api } from '@/api/client';
import { Badge, Button, EmptyState } from '@/components/ui';
import { BookOpen, ExternalLink, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { Opportunity, LearningResource } from '@/types/models';

export default function LearnPage() {
  const navigate = useNavigate();
  const { opportunities } = useOpportunityStore();
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold text-surface-950 dark:text-surface-50 tracking-tight">
          Learn for what you're pursuing.
        </h1>
        <p className="text-lg text-surface-600 dark:text-surface-400 mt-2">
          Build skills connected to opportunities you're interested in.
        </p>
      </div>

      {savedOpps.length === 0 ? (
        <div className="bg-surface-50 dark:bg-surface-900 rounded-xl p-8 border border-surface-200 dark:border-surface-800">
          <EmptyState
            icon={BookOpen}
            title="Save opportunities to get tailored learning recommendations"
            description="When you save opportunities you want to pursue, ROMEfind analyzes the required skills and recommends high-impact resources."
            actionLabel="Explore opportunities"
            onAction={() => navigate('/explore')}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rome-500" />
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              Recommended for Your Saved Opportunities
            </h2>
          </div>
          
          {savedOpps.map((opp: Opportunity) => {
            const resources = getRecommendationsForOpportunity(opp, learningResources);
            if (resources.length === 0) return null;

            return (
              <div key={opp.id} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-200 dark:border-surface-800">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-200">
                    Skills for: <span className="text-rome-600 dark:text-rome-400">{opp.title}</span>
                  </h3>
                  <Badge variant="secondary">{opp.type}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources.map((resource: LearningResource) => (
                    <div
                      key={resource.id}
                      className="bg-white dark:bg-surface-900 rounded-lg p-6 shadow-card border border-surface-200 dark:border-surface-800 flex flex-col h-full hover:shadow-card-hover transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">{resource.type}</Badge>
                        <Badge variant={resource.free ? 'secondary' : 'default'}>
                          {resource.free ? 'Free' : 'Paid'}
                        </Badge>
                      </div>
                      
                      <h4 className="text-base font-semibold text-surface-950 dark:text-surface-50 mb-1">
                        {resource.title}
                      </h4>
                      <p className="text-xs text-surface-500 mb-3">{resource.provider} • {resource.duration}</p>
                      <p className="text-sm text-surface-600 dark:text-surface-300 mb-4 line-clamp-2">
                        {resource.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {resource.skills.map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-xs rounded text-surface-700 dark:text-surface-300 font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-100 dark:border-surface-800">
                        <select 
                          className="text-xs font-medium bg-surface-50 dark:bg-surface-800 px-2.5 py-1 rounded border border-surface-200 dark:border-surface-700 outline-none cursor-pointer text-surface-700 dark:text-surface-300"
                          value={learningStatus[resource.id] || 'want'}
                          onChange={(e) => updateStatus(resource.id, e.target.value)}
                        >
                          <option value="want">Want to learn</option>
                          <option value="learning">Learning</option>
                          <option value="completed">Completed</option>
                        </select>
                        
                        <a 
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-rome-600 dark:text-rome-400 hover:text-rome-700 font-medium text-xs"
                        >
                          Start <ExternalLink size={13} />
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
      <div className="flex flex-col gap-6 pt-6 border-t border-surface-200 dark:border-surface-800">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Based on Your Interests
          </h2>
          <p className="text-sm text-surface-500 mt-1">
            General skill building aligned with your career direction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profileRecommendations.map((resource: LearningResource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-surface-900 rounded-lg p-6 shadow-card border border-surface-200 dark:border-surface-800 flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-3">
                <Badge variant="outline">{resource.type}</Badge>
                <Badge variant={resource.free ? 'secondary' : 'default'}>
                  {resource.free ? 'Free' : 'Paid'}
                </Badge>
              </div>
              
              <h4 className="text-base font-semibold text-surface-950 dark:text-surface-50 mb-1">
                {resource.title}
              </h4>
              <p className="text-xs text-surface-500 mb-3">{resource.provider} • {resource.duration}</p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {resource.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 bg-surface-100 dark:bg-surface-800 text-xs rounded text-surface-700 dark:text-surface-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-surface-100 dark:border-surface-800">
                <select 
                  className="text-xs bg-surface-50 dark:bg-surface-800 px-2 py-1 rounded border border-surface-200 dark:border-surface-700 outline-none cursor-pointer text-surface-600 dark:text-surface-400"
                  value={learningStatus[resource.id] || 'want'}
                  onChange={(e) => updateStatus(resource.id, e.target.value)}
                >
                  <option value="want">Want to learn</option>
                  <option value="learning">Learning</option>
                  <option value="completed">Completed</option>
                </select>
                
                <a 
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-rome-600 dark:text-rome-400 hover:text-rome-700 font-medium text-xs"
                >
                  Start <ExternalLink size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

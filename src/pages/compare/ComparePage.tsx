import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStore } from '@/store/applicationStore';
import { useOpportunityStore } from '@/store/opportunityStore';
import { useAuthStore } from '@/store/authStore';
import { getAlternativeDiscoveries } from '@/services/personalization.service';
import { Button, Tag, DeadlineIndicator, SolarIcon } from '@/components/ui';
import { OpportunityCard } from '@/components/opportunity/OpportunityCard';
import { Opportunity, AlternativeDiscovery, RemoteStatus, ExperienceLevel } from '@/types/models';
import { daysUntil } from '@/utils/format';
import { cn } from '@/utils/cn';

// ─── Evidence-based Pros/Cons engine ─────────────────────────────────────────
// Every point must be traceable to an actual field on the Opportunity object.
// No invented fees, competition rates, acceptance rates, or disadvantages.

interface ProsConsList {
  pros: Array<{ text: string; detail?: string }>;
  cons: Array<{ text: string; detail?: string }>;
  insufficient: boolean; // true when too little data to assess
}

function buildProsCons(opp: Opportunity): ProsConsList {
  const pros: Array<{ text: string; detail?: string }> = [];
  const cons: Array<{ text: string; detail?: string }> = [];
  let dataPoints = 0;

  // ── FUNDING ──────────────────────────────────────────────
  if (opp.funding) {
    dataPoints++;
    const fl = opp.funding.toLowerCase();
    const hasFullKeyword =
      fl.includes('full') || fl.includes('100%') || fl.includes('fully funded');
    const hasPartialKeyword =
      fl.includes('partial') || fl.includes('part-funded') || fl.includes('contribution');
    const hasStipend =
      fl.includes('stipend') || fl.includes('salary') || fl.includes('paid') || fl.includes('prize');

    if (hasFullKeyword) {
      pros.push({ text: 'Fully funded', detail: opp.funding });
    } else if (hasStipend && !hasPartialKeyword) {
      pros.push({ text: 'Paid / stipend provided', detail: opp.funding });
    } else if (hasPartialKeyword) {
      cons.push({ text: 'Partial funding only', detail: opp.funding });
    } else {
      // Funding stated but nature is unclear — report as a pro (funding exists)
      pros.push({ text: 'Funding available', detail: opp.funding });
    }
  }

  // ── REMOTE / LOCATION ─────────────────────────────────────
  if (opp.remoteStatus) {
    dataPoints++;
    if (opp.remoteStatus === RemoteStatus.Remote) {
      pros.push({ text: 'Fully remote participation', detail: 'No relocation or travel required.' });
    } else if (opp.remoteStatus === RemoteStatus.Hybrid) {
      pros.push({ text: 'Hybrid work arrangement', detail: 'Mix of remote and in-person.' });
    } else if (opp.remoteStatus === RemoteStatus.InPerson) {
      cons.push({
        text: 'In-person attendance required',
        detail: opp.location ? `Based in ${opp.location}.` : 'Location commitment required.'
      });
    }
  }

  // ── DEADLINE ─────────────────────────────────────────────
  if (opp.deadline) {
    dataPoints++;
    const days = daysUntil(opp.deadline);
    if (days < 0) {
      cons.push({ text: 'Deadline has passed', detail: `Closed ${Math.abs(days)} days ago.` });
    } else if (days <= 7) {
      cons.push({ text: 'Deadline approaching very soon', detail: `Only ${days} day${days === 1 ? '' : 's'} remaining.` });
    } else if (days <= 21) {
      cons.push({ text: 'Application deadline is near', detail: `${days} days remaining — act promptly.` });
    } else if (days > 60) {
      pros.push({ text: 'Ample time to apply', detail: `${days} days until the deadline.` });
    }
  } else {
    // Rolling deadline — generally positive
    pros.push({ text: 'Rolling applications', detail: 'No fixed closing date; apply when ready.' });
  }

  // ── EXPERIENCE REQUIREMENTS ───────────────────────────────
  if (opp.experienceRequirements) {
    dataPoints++;
    if (opp.experienceRequirements === ExperienceLevel.Beginner) {
      pros.push({ text: 'Open to beginners', detail: 'No prior experience required.' });
    } else if (opp.experienceRequirements === ExperienceLevel.Expert) {
      cons.push({ text: 'Expert-level experience required', detail: 'This opportunity targets senior practitioners.' });
    } else if (opp.experienceRequirements === ExperienceLevel.Advanced) {
      cons.push({ text: 'Advanced experience required', detail: 'Significant prior experience is expected.' });
    }
    // Intermediate — neutral, no bullet
  }

  // ── ELIGIBILITY (country/group breadth) ───────────────────
  if (opp.eligibility && opp.eligibility.length > 0) {
    dataPoints++;
    const raw = opp.eligibility.join(' ').toLowerCase();
    const isOpen = raw.includes('worldwide') || raw.includes('all countries') ||
      raw.includes('international') || raw.includes('global') || raw.includes('all nationalities');
    const hasGeoRestriction = raw.includes('citizen') || raw.includes('resident') ||
      raw.includes('national') || (raw.includes('only') && !isOpen);

    if (isOpen) {
      pros.push({ text: 'Open to international applicants', detail: 'Worldwide or global eligibility confirmed.' });
    } else if (hasGeoRestriction) {
      cons.push({ text: 'Geographic eligibility restrictions', detail: 'Eligibility is limited to specific countries or groups.' });
    }
  }

  // ── BENEFITS ─────────────────────────────────────────────
  if (opp.benefits && opp.benefits.length >= 3) {
    dataPoints++;
    pros.push({
      text: `Multiple stated benefits (${opp.benefits.length})`,
      detail: opp.benefits.slice(0, 2).join('; ') + (opp.benefits.length > 2 ? '…' : '')
    });
  }

  // ── APPLICATION REQUIREMENTS (burden) ────────────────────
  if (opp.requirements && opp.requirements.length >= 5) {
    dataPoints++;
    cons.push({
      text: 'Significant application requirements',
      detail: `${opp.requirements.length} items required — plan adequate preparation time.`
    });
  }

  // ── APPLICATION URL ───────────────────────────────────────
  if (!opp.applicationUrl || opp.applicationUrl.trim() === '') {
    // This is a practical limitation worth noting
    cons.push({ text: 'No direct application link available', detail: 'Contact host institution directly.' });
  }

  // ── DURATION ─────────────────────────────────────────────
  if (opp.duration) {
    dataPoints++;
    const dl = opp.duration.toLowerCase();
    // Long programmes (12+ months) are a positive for immersion, flag neutrally
    const isLong = dl.includes('year') || dl.includes('12') || dl.includes('24') || dl.includes('18') || dl.includes('2-year');
    const isShort = dl.includes('week') || dl.includes('day') || dl.includes('1 month') || dl.includes('one month');
    if (isLong) {
      pros.push({ text: 'Extended programme duration', detail: `${opp.duration} — substantial commitment and deeper engagement.` });
    } else if (isShort) {
      pros.push({ text: 'Short time commitment', detail: `${opp.duration} — good for those with schedule constraints.` });
    }
  }

  const insufficient = dataPoints < 2 && pros.length === 0 && cons.length === 0;
  return { pros, cons, insufficient };
}

// ─── Meaningful differences between a set of opportunities ───────────────────

interface Difference {
  label: string;
  summary: string;
}

function buildDifferences(opps: Opportunity[]): Difference[] {
  if (opps.length < 2) return [];
  const diffs: Difference[] = [];

  // Funding
  const fundedOpps = opps.filter(o => o.funding);
  const unfundedOpps = opps.filter(o => !o.funding);
  if (fundedOpps.length > 0 && unfundedOpps.length > 0) {
    const funded = fundedOpps.map(o => o.title).join(', ');
    const notFunded = unfundedOpps.map(o => o.title).join(', ');
    diffs.push({
      label: 'Funding',
      summary: `${funded} ${fundedOpps.length === 1 ? 'specifies' : 'specify'} funding. ${notFunded} ${unfundedOpps.length === 1 ? 'does' : 'do'} not specify funding.`
    });
  }

  // Remote vs in-person
  const remoteOpps = opps.filter(o => o.remoteStatus === RemoteStatus.Remote);
  const inPersonOpps = opps.filter(o => o.remoteStatus === RemoteStatus.InPerson);
  if (remoteOpps.length > 0 && inPersonOpps.length > 0) {
    diffs.push({
      label: 'Work arrangement',
      summary: `${remoteOpps.map(o => o.title).join(', ')} ${remoteOpps.length === 1 ? 'is' : 'are'} remote. ${inPersonOpps.map(o => o.title).join(', ')} require${inPersonOpps.length === 1 ? 's' : ''} in-person attendance.`
    });
  }

  // Deadline comparison (only if both have deadlines)
  const withDeadlines = opps.filter(o => o.deadline);
  if (withDeadlines.length >= 2) {
    const sorted = [...withDeadlines].sort((a, b) =>
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
    const earliest = sorted[0];
    const latest = sorted[sorted.length - 1];
    if (earliest.id !== latest.id) {
      const daysDiff = Math.abs(daysUntil(earliest.deadline) - daysUntil(latest.deadline));
      if (daysDiff > 7) {
        diffs.push({
          label: 'Application deadline',
          summary: `${earliest.title} has an earlier deadline${earliest.deadline ? ` (${new Date(earliest.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })})` : ''}. ${latest.title} closes later.`
        });
      }
    }
  } else if (withDeadlines.length === 1 && opps.length > 1) {
    const rolling = opps.filter(o => !o.deadline);
    if (rolling.length > 0) {
      diffs.push({
        label: 'Application deadline',
        summary: `${withDeadlines[0].title} has a fixed deadline. ${rolling.map(o => o.title).join(', ')} accept${rolling.length === 1 ? 's' : ''} rolling applications.`
      });
    }
  }

  // Experience level
  const beginnerOpps = opps.filter(o => o.experienceRequirements === ExperienceLevel.Beginner);
  const advancedOpps = opps.filter(o =>
    o.experienceRequirements === ExperienceLevel.Advanced ||
    o.experienceRequirements === ExperienceLevel.Expert
  );
  if (beginnerOpps.length > 0 && advancedOpps.length > 0) {
    diffs.push({
      label: 'Experience requirements',
      summary: `${beginnerOpps.map(o => o.title).join(', ')} ${beginnerOpps.length === 1 ? 'is' : 'are'} accessible to beginners. ${advancedOpps.map(o => o.title).join(', ')} require${advancedOpps.length === 1 ? 's' : ''} advanced or expert-level experience.`
    });
  }

  // Eligibility breadth
  const openOpps = opps.filter(o => {
    const raw = (o.eligibility || []).join(' ').toLowerCase();
    return raw.includes('worldwide') || raw.includes('all countries') ||
      raw.includes('international') || raw.includes('global');
  });
  const restrictedOpps = opps.filter(o => {
    const raw = (o.eligibility || []).join(' ').toLowerCase();
    const isOpen = raw.includes('worldwide') || raw.includes('all countries') ||
      raw.includes('international') || raw.includes('global');
    return !isOpen && (raw.includes('citizen') || raw.includes('resident') || raw.includes('only'));
  });
  if (openOpps.length > 0 && restrictedOpps.length > 0) {
    diffs.push({
      label: 'Eligibility',
      summary: `${openOpps.map(o => o.title).join(', ')} ${openOpps.length === 1 ? 'accepts' : 'accept'} international applicants. ${restrictedOpps.map(o => o.title).join(', ')} ${restrictedOpps.length === 1 ? 'has' : 'have'} specific country or group restrictions.`
    });
  }

  // Application requirements count
  const heavyOpps = opps.filter(o => (o.requirements?.length ?? 0) >= 5);
  const lightOpps = opps.filter(o => (o.requirements?.length ?? 0) < 3 && (o.requirements?.length ?? 0) > 0);
  if (heavyOpps.length > 0 && lightOpps.length > 0) {
    diffs.push({
      label: 'Application burden',
      summary: `${heavyOpps.map(o => o.title).join(', ')} ${heavyOpps.length === 1 ? 'has' : 'have'} more application requirements (${heavyOpps.map(o => o.requirements?.length ?? 0).join(', ')} items). ${lightOpps.map(o => o.title).join(', ')} ${lightOpps.length === 1 ? 'has' : 'have'} fewer (${lightOpps.map(o => o.requirements?.length ?? 0).join(', ')} items).`
    });
  }

  return diffs;
}

// ─── "What to consider" decision-support ─────────────────────────────────────

interface Consideration {
  condition: string;
  suggestion: string;
  oppTitle: string;
}

function buildConsiderations(opps: Opportunity[]): Consideration[] {
  if (opps.length < 2) return [];
  const items: Consideration[] = [];

  // Funding priority
  const fullFundedOpps = opps.filter(o => {
    if (!o.funding) return false;
    const fl = o.funding.toLowerCase();
    return fl.includes('full') || fl.includes('100%') || fl.includes('fully funded');
  });
  if (fullFundedOpps.length > 0 && fullFundedOpps.length < opps.length) {
    fullFundedOpps.forEach(opp => {
      items.push({
        condition: 'full funding is your priority',
        suggestion: `${opp.title} explicitly states full funding.`,
        oppTitle: opp.title
      });
    });
  }

  // Remote preference
  const remoteOpps = opps.filter(o => o.remoteStatus === RemoteStatus.Remote);
  if (remoteOpps.length > 0 && remoteOpps.length < opps.length) {
    items.push({
      condition: 'remote participation is essential',
      suggestion: `${remoteOpps.map(o => o.title).join(' and ')} ${remoteOpps.length === 1 ? 'is' : 'are'} fully remote.`,
      oppTitle: remoteOpps[0].title
    });
  }

  // Beginner accessibility
  const beginnerOpps = opps.filter(o => o.experienceRequirements === ExperienceLevel.Beginner);
  if (beginnerOpps.length > 0 && beginnerOpps.length < opps.length) {
    items.push({
      condition: 'you are early in your career or have limited experience',
      suggestion: `${beginnerOpps.map(o => o.title).join(' and ')} ${beginnerOpps.length === 1 ? 'is' : 'are'} accessible to beginners.`,
      oppTitle: beginnerOpps[0].title
    });
  }

  // Deadline urgency — pick the one with the most time left
  const withDeadlines = opps.filter(o => o.deadline).sort((a, b) =>
    new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
  );
  if (withDeadlines.length >= 2) {
    const mostTime = withDeadlines[0];
    const days = daysUntil(mostTime.deadline);
    if (days > 30) {
      items.push({
        condition: 'you need more preparation time',
        suggestion: `${mostTime.title} has ${days} days remaining — more time to prepare a strong application.`,
        oppTitle: mostTime.title
      });
    }
  }

  // Rolling vs fixed — rolling is more flexible
  const rollingOpps = opps.filter(o => !o.deadline);
  if (rollingOpps.length > 0 && rollingOpps.length < opps.length) {
    items.push({
      condition: 'application timing flexibility matters',
      suggestion: `${rollingOpps.map(o => o.title).join(' and ')} accept${rollingOpps.length === 1 ? 's' : ''} rolling applications — no fixed deadline.`,
      oppTitle: rollingOpps[0].title
    });
  }

  return items;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ComparePage() {
  const navigate = useNavigate();
  const { comparisons, addToCompare, removeFromCompare, isSaved, saveOpportunity, unsaveOpportunity } = useApplicationStore();
  const { opportunities } = useOpportunityStore();
  const { user } = useAuthStore();
  const [filterType, setFilterType] = useState<string>('All');

  const compareOpps: Opportunity[] = useMemo(() => {
    return comparisons
      .map((id: string) => opportunities.find((o: Opportunity) => o.id === id))
      .filter(Boolean) as Opportunity[];
  }, [comparisons, opportunities]);

  const uniqueTypes = useMemo(() => Array.from(new Set(compareOpps.map(o => o.type))), [compareOpps]);

  const alternatives: AlternativeDiscovery[] = useMemo(() => {
    if (!user?.profile || !user?.preferences || uniqueTypes.length === 0) return [];
    return uniqueTypes.flatMap(type => getAlternativeDiscoveries(type, opportunities, user.profile, user.preferences));
  }, [uniqueTypes, opportunities, user]);

  const availableOpps = useMemo(() => {
    return opportunities
      .filter(o => !comparisons.includes(o.id))
      .filter(o => filterType === 'All' || o.type === filterType);
  }, [opportunities, comparisons, filterType]);

  const allTypes = useMemo(() => ['All', 'Fellowship', 'Scholarship', 'Internship', 'Research', 'Grant', 'Competition', 'Programme'], []);

  // Compute pros/cons, differences, and considerations only when 2+ opps selected
  const prosConsMap = useMemo(() => {
    const map: Record<string, ProsConsList> = {};
    compareOpps.forEach(opp => { map[opp.id] = buildProsCons(opp); });
    return map;
  }, [compareOpps]);

  const differences = useMemo(() => buildDifferences(compareOpps), [compareOpps]);
  const considerations = useMemo(() => buildConsiderations(compareOpps), [compareOpps]);

  return (
    <div className="w-full py-6 md:py-10 animate-in fade-in">
      {/* ─── Header ─── */}
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-200 dark:border-surface-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rome-50 dark:bg-rome-950/40 text-rome-600 dark:text-rome-400 border border-rome-200/60 dark:border-rome-900/40">
              <SolarIcon name="scale-linear" size={18} />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-surface-950 dark:text-surface-50">
              Compare Opportunities
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400">
            Evaluate funding, deadlines, location, and requirements side-by-side ({compareOpps.length}/4 selected).
          </p>
        </div>

        {compareOpps.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-semibold h-9 px-3 rounded-xl border-surface-200 dark:border-surface-700"
              onClick={() => comparisons.forEach(id => removeFromCompare(id))}
            >
              Clear Comparison
            </Button>
          </div>
        )}
      </header>

      {/* ─── Comparison Section (2+ selected) ─── */}
      {compareOpps.length >= 2 ? (
        <section aria-label="Comparison" className="mb-12 space-y-10">

          {/* ── Desktop Table ── */}
          <div className="hidden md:block overflow-x-auto pb-2">
            <table className="w-full min-w-[760px] border-collapse bg-white dark:bg-surface-900 rounded-2xl overflow-hidden shadow-xs border border-surface-200 dark:border-surface-800 text-left">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-850/60">
                  <th scope="col" className="p-5 text-xs font-bold uppercase tracking-wider text-surface-500 w-44 align-bottom">
                    Attributes
                  </th>
                  {compareOpps.map((opp: Opportunity) => {
                    const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
                    return (
                      <th key={opp.id} scope="col" className="p-5 align-top min-w-[240px] w-1/3 border-l border-surface-200/80 dark:border-surface-800 relative">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 pr-2">
                            <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 truncate uppercase tracking-wider">
                              {orgName}
                            </p>
                            <h2 className="text-base font-bold text-surface-950 dark:text-white line-clamp-2 leading-snug mt-0.5">
                              {opp.title}
                            </h2>
                            <Tag label={opp.type} className="mt-2" />
                          </div>
                          <button
                            onClick={() => removeFromCompare(opp.id)}
                            className="p-1.5 rounded-lg text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0 cursor-pointer"
                            aria-label={`Remove ${opp.title} from comparison`}
                            title="Remove"
                          >
                            <SolarIcon name="close-circle-linear" size={18} />
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800 text-xs sm:text-sm">

                {/* Funding */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Funding / Value
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      {opp.funding ? (
                        <span className="font-semibold text-surface-900 dark:text-surface-100 text-xs">
                          {opp.funding}
                        </span>
                      ) : (
                        <span className="text-surface-400 text-xs italic">Not specified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Deadline */}
                <tr className="bg-surface-50/50 dark:bg-surface-850/20">
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Deadline
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      {opp.deadline ? (
                        <DeadlineIndicator deadline={opp.deadline} />
                      ) : (
                        <span className="text-surface-600 dark:text-surface-400 text-xs">Rolling / Ongoing</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Location & Work Setup */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Location &amp; Mode
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      <div className="font-medium text-surface-900 dark:text-surface-100 text-xs">
                        {opp.remoteStatus === RemoteStatus.Remote
                          ? 'Remote'
                          : (opp.location || 'Not specified')}
                      </div>
                      {opp.remoteStatus && opp.remoteStatus !== RemoteStatus.Remote && (
                        <div className="text-xs text-surface-500 mt-0.5">{opp.remoteStatus}</div>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Duration */}
                <tr className="bg-surface-50/50 dark:bg-surface-850/20">
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Duration
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      <span className="text-xs text-surface-800 dark:text-surface-200">
                        {opp.duration || <span className="italic text-surface-400">Not specified</span>}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Eligibility */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Eligibility
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      {opp.eligibility && opp.eligibility.length > 0 ? (
                        <ul className="space-y-1 text-xs text-surface-700 dark:text-surface-300">
                          {opp.eligibility.slice(0, 3).map((e: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <SolarIcon name="check-circle-linear" size={12} className="text-surface-400 shrink-0 mt-0.5" />
                              {e}
                            </li>
                          ))}
                          {opp.eligibility.length > 3 && (
                            <li className="text-surface-400 text-xs pl-4">+{opp.eligibility.length - 3} more</li>
                          )}
                        </ul>
                      ) : (
                        <span className="italic text-surface-400 text-xs">Not specified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Education & Experience */}
                <tr className="bg-surface-50/50 dark:bg-surface-850/20">
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Education &amp; Experience
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      <div className="space-y-1 text-xs">
                        {opp.educationRequirements && opp.educationRequirements.length > 0 ? (
                          <p className="text-surface-700 dark:text-surface-300">
                            <span className="font-semibold text-surface-600 dark:text-surface-400">Education: </span>
                            {opp.educationRequirements.join(', ')}
                          </p>
                        ) : (
                          <p className="italic text-surface-400">Education: Not specified</p>
                        )}
                        {opp.experienceRequirements ? (
                          <p className="text-surface-700 dark:text-surface-300">
                            <span className="font-semibold text-surface-600 dark:text-surface-400">Experience: </span>
                            {opp.experienceRequirements}
                          </p>
                        ) : (
                          <p className="italic text-surface-400">Experience: Not specified</p>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Application Requirements */}
                <tr>
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Application Requirements
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      {opp.requirements && opp.requirements.length > 0 ? (
                        <ul className="space-y-1 text-xs text-surface-700 dark:text-surface-300">
                          {opp.requirements.slice(0, 4).map((req: string, i: number) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <SolarIcon name="checklist-minimalistic-linear" size={12} className="text-surface-400 shrink-0 mt-0.5" />
                              {req}
                            </li>
                          ))}
                          {opp.requirements.length > 4 && (
                            <li className="text-surface-400 text-xs pl-4">+{opp.requirements.length - 4} more</li>
                          )}
                        </ul>
                      ) : (
                        <span className="italic text-surface-400 text-xs">Not specified</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Official Application Link */}
                <tr className="bg-surface-50/50 dark:bg-surface-850/20">
                  <th scope="row" className="p-4 pl-5 font-semibold text-surface-600 dark:text-surface-400 align-top pt-4">
                    Application Link
                  </th>
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-100 dark:border-surface-800 align-top">
                      {opp.applicationUrl && opp.applicationUrl.trim() !== '' ? (
                        <a
                          href={opp.applicationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-rome-600 dark:text-rome-400 hover:underline"
                        >
                          <span>Official site</span>
                          <SolarIcon name="arrow-right-up-linear" size={11} />
                        </a>
                      ) : (
                        <span className="italic text-surface-400 text-xs">Not available</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4" />
                  {compareOpps.map((opp: Opportunity) => (
                    <td key={opp.id} className="p-4 border-l border-surface-200/80 dark:border-surface-800">
                      <Button
                        variant="default"
                        size="default"
                        className="w-full h-10 min-h-[40px] text-xs font-semibold rounded-xl bg-rome-500 hover:bg-rome-600 text-white shadow-xs"
                        onClick={() => navigate(`/opportunity/${opp.id}`)}
                      >
                        <span>View Details</span>
                        <SolarIcon name="alt-arrow-right-linear" size={14} />
                      </Button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Mobile Stacked Card View ── */}
          <div className="md:hidden flex flex-col w-full space-y-4">
            <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider px-1">
              Comparing {compareOpps.length} opportunities
            </p>

            {compareOpps.map((opp: Opportunity) => {
              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
              return (
                <article
                  key={opp.id}
                  className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-surface-100 dark:border-surface-800 pb-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider truncate block">
                        {orgName}
                      </span>
                      <h2 className="text-sm font-bold text-surface-950 dark:text-white line-clamp-2 mt-0.5">
                        {opp.title}
                      </h2>
                      <Tag label={opp.type} className="mt-2" />
                    </div>
                    <button
                      onClick={() => removeFromCompare(opp.id)}
                      className="p-1.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0"
                      aria-label={`Remove ${opp.title} from comparison`}
                    >
                      <SolarIcon name="close-circle-linear" size={18} />
                    </button>
                  </div>

                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                    <div>
                      <dt className="text-surface-400 font-medium mb-0.5">Funding</dt>
                      <dd className="font-semibold text-surface-900 dark:text-surface-100 leading-snug">
                        {opp.funding || <span className="italic text-surface-400 font-normal">Not specified</span>}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-surface-400 font-medium mb-0.5">Deadline</dt>
                      <dd className="font-semibold text-surface-900 dark:text-surface-100">
                        {opp.deadline ? <DeadlineIndicator deadline={opp.deadline} /> : 'Rolling'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-surface-400 font-medium mb-0.5">Location</dt>
                      <dd className="font-semibold text-surface-900 dark:text-surface-100 leading-snug">
                        {opp.remoteStatus === RemoteStatus.Remote ? 'Remote' : (opp.location || 'Not specified')}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-surface-400 font-medium mb-0.5">Duration</dt>
                      <dd className="font-semibold text-surface-900 dark:text-surface-100 leading-snug">
                        {opp.duration || <span className="italic text-surface-400 font-normal">Not specified</span>}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-surface-400 font-medium mb-0.5">Experience</dt>
                      <dd className="font-semibold text-surface-900 dark:text-surface-100">
                        {opp.experienceRequirements || <span className="italic text-surface-400 font-normal">Not specified</span>}
                      </dd>
                    </div>
                    {opp.eligibility && opp.eligibility.length > 0 && (
                      <div className="col-span-2">
                        <dt className="text-surface-400 font-medium mb-0.5">Eligibility</dt>
                        <dd className="text-surface-700 dark:text-surface-300 leading-snug">
                          {opp.eligibility.slice(0, 2).join('; ')}
                          {opp.eligibility.length > 2 && ` +${opp.eligibility.length - 2} more`}
                        </dd>
                      </div>
                    )}
                  </dl>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="default"
                      size="default"
                      className="flex-1 justify-center h-10 min-h-[40px] text-xs font-semibold rounded-xl bg-rome-500 hover:bg-rome-600 text-white"
                      onClick={() => navigate(`/opportunity/${opp.id}`)}
                    >
                      <span>View Details</span>
                      <SolarIcon name="alt-arrow-right-linear" size={14} />
                    </Button>
                    {opp.applicationUrl && opp.applicationUrl.trim() !== '' && (
                      <a
                        href={opp.applicationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 h-10 min-h-[40px] text-xs font-semibold rounded-xl border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
                      >
                        <span>Apply</span>
                        <SolarIcon name="arrow-right-up-linear" size={13} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* ── Pros & Cons per opportunity ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">Pros &amp; Cons</h2>
              <span className="text-xs text-surface-400 dark:text-surface-500 font-normal">Based on verified opportunity data only</span>
            </div>

            <div className={cn(
              "grid gap-5",
              compareOpps.length === 2 ? "grid-cols-1 md:grid-cols-2" :
              compareOpps.length === 3 ? "grid-cols-1 md:grid-cols-3" :
              "grid-cols-1 sm:grid-cols-2"
            )}>
              {compareOpps.map((opp: Opportunity) => {
                const pc = prosConsMap[opp.id];
                const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
                return (
                  <div key={opp.id} className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 shadow-xs overflow-hidden">
                    {/* Card header */}
                    <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50">
                      <p className="text-xs text-surface-500 dark:text-surface-400 font-medium truncate">{orgName}</p>
                      <h3 className="text-sm font-bold text-surface-900 dark:text-white line-clamp-2 leading-snug mt-0.5">
                        {opp.title}
                      </h3>
                    </div>

                    <div className="p-4 space-y-4">
                      {pc.insufficient ? (
                        <p className="text-xs text-surface-500 dark:text-surface-400 italic py-2">
                          Not enough verified information to assess pros and cons for this opportunity.
                        </p>
                      ) : (
                        <>
                          {/* Pros */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              {/* ✓ marker — distinct without relying solely on green */}
                              <span className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider flex items-center gap-1">
                                <span aria-hidden className="inline-block w-3.5 h-3.5 rounded-sm bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[9px] font-black flex items-center justify-center">✓</span>
                                Pros
                              </span>
                            </div>
                            {pc.pros.length === 0 ? (
                              <p className="text-xs text-surface-400 italic pl-1">No clear advantages identified from available data.</p>
                            ) : (
                              <ul className="space-y-2">
                                {pc.pros.map((pro, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs">
                                    <SolarIcon name="check-circle-linear" size={14} className="text-rome-500 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold text-surface-900 dark:text-surface-100">{pro.text}</span>
                                      {pro.detail && (
                                        <span className="text-surface-500 dark:text-surface-400 ml-1">— {pro.detail}</span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>

                          {/* Cons */}
                          <div>
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-xs font-bold text-surface-700 dark:text-surface-300 uppercase tracking-wider flex items-center gap-1">
                                <span aria-hidden className="inline-block w-3.5 h-3.5 rounded-sm bg-surface-300 dark:bg-surface-600 text-white text-[9px] font-black flex items-center justify-center">✕</span>
                                Cons
                              </span>
                            </div>
                            {pc.cons.length === 0 ? (
                              <p className="text-xs text-surface-400 italic pl-1">No clear limitations identified from available data.</p>
                            ) : (
                              <ul className="space-y-2">
                                {pc.cons.map((con, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs">
                                    <SolarIcon name="info-circle-linear" size={14} className="text-surface-400 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-semibold text-surface-900 dark:text-surface-100">{con.text}</span>
                                      {con.detail && (
                                        <span className="text-surface-500 dark:text-surface-400 ml-1">— {con.detail}</span>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Key Differences ── */}
          {differences.length > 0 && (
            <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5 space-y-3">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
                <SolarIcon name="layers-minimalistic-linear" size={16} className="text-rome-500" />
                Key Differences
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Meaningful differences between these opportunities, based on verified data.
              </p>
              <ul className="space-y-2.5 pt-1">
                {differences.map((diff, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs">
                    <span className="shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 uppercase tracking-wider">
                      {diff.label}
                    </span>
                    <span className="text-surface-700 dark:text-surface-300 leading-relaxed">{diff.summary}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── What to Consider ── */}
          {considerations.length > 0 && (
            <div className="bg-white dark:bg-surface-900 rounded-2xl border border-rome-200/60 dark:border-rome-800/40 p-5 space-y-3">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-50 flex items-center gap-2">
                <SolarIcon name="lightbulb-linear" size={16} className="text-rome-500" />
                What to Consider
              </h2>
              <p className="text-xs text-surface-500 dark:text-surface-400">
                Conditional suggestions based on available opportunity data. Your personal priorities will determine the best fit.
              </p>
              <ul className="space-y-2.5 pt-1">
                {considerations.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-surface-700 dark:text-surface-300">
                    <SolarIcon name="alt-arrow-right-linear" size={13} className="text-rome-500 shrink-0 mt-0.5" />
                    <span>
                      <span className="font-semibold text-surface-900 dark:text-surface-100">
                        If {c.condition}:
                      </span>{' '}
                      {c.suggestion}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-surface-400 dark:text-surface-500 pt-1 border-t border-surface-100 dark:border-surface-800 mt-2">
                These suggestions are based on the data recorded for each opportunity. They do not account for your personal situation, application strength, or factors not documented in the listings.
              </p>
            </div>
          )}

        </section>
      ) : compareOpps.length === 1 ? (
        /* ─── 1 Opportunity Selected ─── */
        <div className="mb-10 bg-surface-50 dark:bg-surface-900 border border-rome-200/80 dark:border-rome-900/60 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-200/80 dark:border-surface-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rome-500 animate-pulse" />
              <h2 className="text-sm sm:text-base font-bold text-surface-900 dark:text-surface-100">
                1 of 2 opportunities selected
              </h2>
            </div>
            <span className="text-xs text-surface-500">
              Select 1 more opportunity below to unlock comparison
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {compareOpps.map((opp: Opportunity) => {
              const orgName = typeof opp.organization === 'object' ? opp.organization.name : opp.organization;
              return (
                <div key={opp.id} className="p-4 bg-white dark:bg-surface-850 rounded-xl border border-surface-200 dark:border-surface-700 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-surface-500 uppercase tracking-wider block">
                      {orgName}
                    </span>
                    <h3 className="text-sm font-bold text-surface-900 dark:text-white truncate">
                      {opp.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-surface-500">
                      <span>{opp.type}</span>
                      <span>•</span>
                      <span>{opp.funding || 'Funding not specified'}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCompare(opp.id)}
                    className="p-1.5 text-surface-400 hover:text-red-500 rounded-lg transition-colors shrink-0"
                    title="Remove from comparison"
                  >
                    <SolarIcon name="close-circle-linear" size={18} />
                  </button>
                </div>
              );
            })}

            {/* Second slot invitation */}
            <div className="p-4 rounded-xl border-2 border-dashed border-surface-200 dark:border-surface-700 flex items-center justify-center text-center">
              <p className="text-xs font-medium text-surface-500">
                Click <strong className="text-rome-600 dark:text-rome-400">+ Add to Compare</strong> on an opportunity below
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* ─── 0 Selected Empty State ─── */
        <div className="bg-surface-50 dark:bg-surface-900/40 border border-surface-200 dark:border-surface-800 rounded-2xl p-8 sm:p-10 mb-10 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <span className="inline-flex p-3 rounded-2xl bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300">
              <SolarIcon name="scale-linear" size={28} />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-50">
              No opportunities selected to compare
            </h2>
            <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
              Add 2 to 4 opportunities from the list below to compare funding packages, deadlines, and eligibility side-by-side — with evidence-based pros and cons for each.
            </p>
          </div>
        </div>
      )}

      {/* ─── Available Opportunities to Compare ─── */}
      <section className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-surface-50">
              Available Opportunities to Add
            </h2>
            <p className="text-xs text-surface-500">
              Browse options and add to your active comparison.
            </p>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {allTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer min-h-[32px] shrink-0",
                  filterType === type
                    ? "bg-surface-900 dark:bg-white text-white dark:text-surface-900"
                    : "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-200/60 dark:border-surface-700"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {availableOpps.slice(0, 9).map((opp: Opportunity) => {
            const isComparing = comparisons.includes(opp.id);
            return (
              <div key={opp.id} className="h-full flex flex-col">
                <OpportunityCard
                  opportunity={opp}
                  showCompareButton={true}
                  primaryAction="compare"
                  compact={true}
                  isComparing={isComparing}
                  onToggleCompare={() => {
                    if (isComparing) {
                      removeFromCompare(opp.id);
                    } else {
                      addToCompare(opp.id);
                    }
                  }}
                  showSaveButton
                  isSaved={isSaved(opp.id)}
                  onSave={() => saveOpportunity(opp.id)}
                  onUnsave={() => unsaveOpportunity(opp.id)}
                  onClick={() => navigate(`/opportunity/${opp.id}`)}
                  className="h-full"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Alternative Pathways ─── */}
      {alternatives.length > 0 && (
        <aside aria-label="Alternative pathways" className="mt-14 pt-8 border-t border-surface-200 dark:border-surface-800">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50 mb-1 flex items-center gap-2">
            <SolarIcon name="magic-stick-linear" size={18} className="text-rome-500" />
            Alternative Pathways
          </h2>
          <p className="text-xs text-surface-500 mb-6">
            Parallel formats that advance the same goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {alternatives.slice(0, 4).map((alt: AlternativeDiscovery, i: number) => (
              <div
                key={i}
                className="group bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-2xl p-5 cursor-pointer hover:border-rome-300 dark:hover:border-rome-700 hover:shadow-card transition-all"
                onClick={() => navigate(`/explore?type=${encodeURIComponent(alt.alternativeType)}`)}
              >
                <h3 className="text-base font-bold text-surface-900 dark:text-surface-50 mb-1.5 group-hover:text-rome-600 transition-colors">
                  Consider {alt.alternativeType} instead of {alt.sourceType}
                </h3>
                <p className="text-xs text-surface-600 dark:text-surface-300 mb-3 leading-relaxed">
                  {alt.reason}
                </p>
                <span className="text-xs font-semibold text-rome-600 dark:text-rome-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Explore {alt.alternativeType} ({alt.count} available)
                  <SolarIcon name="alt-arrow-right-linear" size={13} />
                </span>
              </div>
            ))}
          </div>
        </aside>
      )}
    </div>
  );
}

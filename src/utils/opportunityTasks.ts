import { Opportunity, OpportunityType } from '@/types/models';

/**
 * Dynamically generates a specific, actionable application checklist tailored
 * directly to the requirements, application steps, and format of a specific opportunity.
 */
export function generateOpportunityTasks(opp: Opportunity): string[] {
  const tasks: string[] = [];

  // 1. From explicit requirements listed in the opportunity data
  if (opp.requirements && Array.isArray(opp.requirements) && opp.requirements.length > 0) {
    opp.requirements.forEach((req: string) => {
      const cleanReq = req.trim();
      if (!cleanReq) return;

      // Format into a natural task label if it is just a noun phrase
      if (/^(prepare|write|draft|gather|submit|complete|request|obtain|provide|upload|review|attend|schedule)/i.test(cleanReq)) {
        tasks.push(cleanReq);
      } else if (/^(cv|resume)/i.test(cleanReq)) {
        tasks.push(`Update & tailor CV / Resume`);
      } else if (/^(portfolio|github|work samples)/i.test(cleanReq)) {
        tasks.push(`Prepare & review portfolio / work samples`);
      } else if (/^(personal statement|statement of purpose|motivation letter|cover letter|essay)/i.test(cleanReq)) {
        tasks.push(`Draft ${cleanReq}`);
      } else if (/^(transcript|academic record|degree certificate)/i.test(cleanReq)) {
        tasks.push(`Obtain official academic transcripts`);
      } else if (/^(recommendation|reference|referees)/i.test(cleanReq)) {
        tasks.push(`Request letters of recommendation`);
      } else if (/^(proposal|research proposal|project plan)/i.test(cleanReq)) {
        tasks.push(`Draft project / research proposal`);
      } else if (/^(budget|financial plan|funding breakdown)/i.test(cleanReq)) {
        tasks.push(`Prepare budget & cost justification`);
      } else if (/^(interview|assessment|quiz|test)/i.test(cleanReq)) {
        tasks.push(`Prepare for ${cleanReq}`);
      } else {
        tasks.push(`Prepare ${cleanReq}`);
      }
    });
  }

  // 2. From application steps in the opportunity data
  if (opp.applicationSteps && Array.isArray(opp.applicationSteps) && opp.applicationSteps.length > 0) {
    opp.applicationSteps.forEach((step: string) => {
      const cleanStep = step.trim();
      if (!cleanStep) return;

      const alreadyCovered = tasks.some(t => 
        t.toLowerCase().includes(cleanStep.toLowerCase()) || 
        cleanStep.toLowerCase().includes(t.toLowerCase())
      );

      if (!alreadyCovered) {
        if (/^(submit|complete|attend|participate|review|undergo|register|upload)/i.test(cleanStep)) {
          tasks.push(cleanStep);
        } else {
          tasks.push(`Complete ${cleanStep}`);
        }
      }
    });
  }

  // 3. Fallback based on Opportunity Type if fewer than 3 tasks exist
  if (tasks.length < 3) {
    switch (opp.type) {
      case OpportunityType.Scholarship:
      case OpportunityType.Fellowship:
        if (!tasks.some(t => /transcript/i.test(t))) tasks.push('Gather official academic transcripts');
        if (!tasks.some(t => /recommendation|reference/i.test(t))) tasks.push('Request letters of recommendation');
        if (!tasks.some(t => /statement|purpose|essay/i.test(t))) tasks.push('Draft personal statement / essay');
        break;

      case OpportunityType.Research:
        if (!tasks.some(t => /proposal/i.test(t))) tasks.push('Write research proposal & abstract');
        if (!tasks.some(t => /cv|resume/i.test(t))) tasks.push('Tailor academic CV & publications list');
        if (!tasks.some(t => /reference/i.test(t))) tasks.push('Contact academic referees');
        break;

      case OpportunityType.Grant:
        if (!tasks.some(t => /proposal|pitch/i.test(t))) tasks.push('Draft grant proposal & objectives');
        if (!tasks.some(t => /budget/i.test(t))) tasks.push('Prepare detailed budget & milestones');
        break;

      case OpportunityType.Competition:
        if (!tasks.some(t => /prototype|entry|submission/i.test(t))) tasks.push('Prepare competition prototype / entry');
        if (!tasks.some(t => /pitch|deck|demo/i.test(t))) tasks.push('Create pitch deck / demonstration video');
        break;

      case OpportunityType.Internship:
      case OpportunityType.Job:
        if (!tasks.some(t => /cv|resume/i.test(t))) tasks.push('Tailor CV / resume for this role');
        if (!tasks.some(t => /cover|letter/i.test(t))) tasks.push('Write tailored cover letter');
        if (!tasks.some(t => /portfolio|github/i.test(t))) tasks.push('Polish portfolio / project links');
        break;

      default:
        if (!tasks.some(t => /cv|resume/i.test(t))) tasks.push('Update CV / Resume');
        if (!tasks.some(t => /documents|materials/i.test(t))) tasks.push('Gather supporting documents');
        break;
    }
  }

  // 4. Ensure the final submission step is present
  const hasSubmit = tasks.some(t => /submit.*(application|entry|proposal|portal)/i.test(t));
  if (!hasSubmit) {
    tasks.push('Submit official application form');
  }

  // 5. Deduplicate and clean
  const uniqueTasks: string[] = [];
  tasks.forEach(t => {
    const trimmed = t.trim();
    if (trimmed && !uniqueTasks.some(u => u.toLowerCase() === trimmed.toLowerCase())) {
      uniqueTasks.push(trimmed);
    }
  });

  return uniqueTasks.slice(0, 6);
}

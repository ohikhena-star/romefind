import { opportunities } from '../src/data/opportunities';
import { FIELDS } from '../src/utils/constants';
import { OpportunityType, RemoteStatus } from '../src/types/models';

interface FieldAudit {
  field: string;
  existing: number;
  active: number;
  jobs: number;
  nonJobs: number;
  events: number;
  africaAccessible: number;
  nigeriaAccessible: number;
  verifiedEligibility: number;
  missingEligibility: number;
  missingNotes: string[];
}

// Function to test African and Nigerian accessibility
export function checkAccessibility(opp: any) {
  const loc = (opp.location || '').toLowerCase();
  const country = (opp.country || '').toLowerCase();
  const eligList = Array.isArray(opp.eligibility) ? opp.eligibility : [];
  const eligStr = eligList.join(' ').toLowerCase();
  const reqStr = (Array.isArray(opp.requirements) ? opp.requirements.join(' ') : '').toLowerCase();
  const desc = (opp.description || '').toLowerCase();
  const allText = `${loc} ${country} ${eligStr} ${reqStr} ${desc}`;

  // Strict disqualifiers for Nigeria/Africa
  const usOnly = eligStr.includes('us citizen') || eligStr.includes('u.s. citizen') || eligStr.includes('us resident') || loc.includes('us only') || eligStr.includes('authorized to work in the us') || eligStr.includes('us work authorization required') || loc.includes('united states only');
  const ukOnly = eligStr.includes('uk citizen') || eligStr.includes('uk resident') || loc.includes('uk only') || eligStr.includes('right to work in the uk');
  const euOnly = eligStr.includes('eu citizen') || eligStr.includes('eu resident') || loc.includes('eu only') || eligStr.includes('european union');
  const kenyaOnly = (loc.includes('kenya') || country.includes('kenya')) && !loc.includes('nigeria') && !loc.includes('africa') && !loc.includes('global') && !allText.includes('pan-african');

  const isRestrictedNonAfrican = usOnly || ukOnly || euOnly;

  // Indicators of Africa accessibility
  const mentionsAfrica = allText.includes('africa') || allText.includes('nigeria') || allText.includes('ghana') || allText.includes('kenya') || allText.includes('rwanda') || allText.includes('south africa') || allText.includes('sub-saharan');
  const isGlobal = loc.includes('global') || country.includes('global') || loc.includes('worldwide') || allText.includes('open to all nationalities') || allText.includes('international applicants') || allText.includes('any country');
  const isRemoteUnrestricted = opp.remoteStatus === RemoteStatus.Remote && !isRestrictedNonAfrican;

  let africaAccessible = false;
  let nigeriaAccessible = false;

  if (!isRestrictedNonAfrican) {
    if (mentionsAfrica || isGlobal || isRemoteUnrestricted) {
      africaAccessible = true;
    }
    
    // Nigeria accessibility
    if (allText.includes('nigeria') || isGlobal || (isRemoteUnrestricted && !kenyaOnly) || (mentionsAfrica && !kenyaOnly)) {
      nigeriaAccessible = true;
    }
  }

  // Explicit Nigeria presence
  if (loc.includes('lagos') || loc.includes('abuja') || loc.includes('nigeria')) {
    nigeriaAccessible = true;
    africaAccessible = true;
  }

  return { africaAccessible, nigeriaAccessible, isRestrictedNonAfrican };
}

const today = new Date().toISOString().slice(0, 10);

const fieldAudits: FieldAudit[] = FIELDS.map(field => {
  const matchingOpps = opportunities.filter(opp => {
    const fields = (opp.field || []).map((f: string) => f.toLowerCase());
    const subfields = (opp.subfields || []).map((s: string) => s.toLowerCase());
    const target = field.toLowerCase();
    return fields.includes(target) || subfields.includes(target);
  });

  let activeCount = 0;
  let jobCount = 0;
  let nonJobCount = 0;
  let eventCount = 0;
  let africaCount = 0;
  let nigeriaCount = 0;
  let verifiedCount = 0;
  let missingCount = 0;
  const missingNotes: string[] = [];

  for (const opp of matchingOpps) {
    // Active check
    const isActive = opp.status !== 'closed' && (!opp.deadline || opp.deadline >= today);
    if (isActive) activeCount++;

    // Type check
    const isJob = opp.type === OpportunityType.Job || opp.type === OpportunityType.Internship;
    const isEvent = opp.type === OpportunityType.Conference || opp.type === OpportunityType.Competition;
    
    if (opp.type === OpportunityType.Job) jobCount++;
    else nonJobCount++;

    if (isEvent) eventCount++;

    // Accessibility check
    const access = checkAccessibility(opp);
    if (access.africaAccessible) africaCount++;
    if (access.nigeriaAccessible) nigeriaCount++;

    // Eligibility check
    const hasEligibility = Array.isArray(opp.eligibility) && opp.eligibility.length > 0;
    if (hasEligibility) {
      verifiedCount++;
    } else {
      missingCount++;
    }
  }

  if (matchingOpps.length === 0) {
    missingNotes.push('ZERO opportunities in database');
  } else if (jobCount === 0) {
    missingNotes.push('ZERO jobs');
  } else if (matchingOpps.length < 3) {
    missingNotes.push('Fewer than 3 total opportunities');
  }

  if (eventCount === 0) {
    missingNotes.push('ZERO events');
  }

  if (nigeriaCount === 0) {
    missingNotes.push('ZERO Nigeria-accessible');
  }

  return {
    field,
    existing: matchingOpps.length,
    active: activeCount,
    jobs: jobCount,
    nonJobs: nonJobCount,
    events: eventCount,
    africaAccessible: africaCount,
    nigeriaAccessible: nigeriaCount,
    verifiedEligibility: verifiedCount,
    missingEligibility: missingCount,
    missingNotes
  };
});

console.log('=== OVERALL INVENTORY AUDIT ===');
console.log(`Total Opportunities in DB: ${opportunities.length}`);
console.log(`Total Canonical Fields: ${FIELDS.length}`);

console.log('\n=== FIELD COVERAGE AUDIT TABLE (PHASE 18 FORMAT) ===');
console.log('| FIELD | EXISTING | ACTIVE | JOBS | EVENTS | AFRICA-ACCESSIBLE | NIGERIA-ACCESSIBLE | MISSING |');
console.log('|---|---|---|---|---|---|---|---|');
for (const a of fieldAudits) {
  const missingStr = a.missingNotes.length > 0 ? a.missingNotes.join(', ') : 'None';
  console.log(`| ${a.field} | ${a.existing} | ${a.active} | ${a.jobs} | ${a.events} | ${a.africaAccessible} | ${a.nigeriaAccessible} | ${missingStr} |`);
}

// Global stats
const allTypes: Record<string, number> = {};
opportunities.forEach(o => {
  allTypes[o.type] = (allTypes[o.type] || 0) + 1;
});
console.log('\n=== OPPORTUNITY TYPES SUMMARY ===');
console.log(JSON.stringify(allTypes, null, 2));

const zeroOppFields = fieldAudits.filter(f => f.existing === 0);
const zeroJobFields = fieldAudits.filter(f => f.jobs === 0);
const lowOppFields = fieldAudits.filter(f => f.existing > 0 && f.existing < 3);
const zeroEventFields = fieldAudits.filter(f => f.events === 0);
const zeroNigeriaFields = fieldAudits.filter(f => f.nigeriaAccessible === 0);

console.log(`\nFields with ZERO opportunities: ${zeroOppFields.length} (${zeroOppFields.map(f => f.field).join(', ')})`);
console.log(`Fields with ZERO jobs: ${zeroJobFields.length} (${zeroJobFields.map(f => f.field).join(', ')})`);
console.log(`Fields with < 3 opportunities: ${lowOppFields.length} (${lowOppFields.map(f => f.field).join(', ')})`);
console.log(`Fields with ZERO events: ${zeroEventFields.length} (${zeroEventFields.map(f => f.field).join(', ')})`);
console.log(`Fields with ZERO Nigeria-accessible: ${zeroNigeriaFields.length} (${zeroNigeriaFields.map(f => f.field).join(', ')})`);

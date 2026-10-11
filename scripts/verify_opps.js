import fs from 'fs';

const content = fs.readFileSync('./src/data/opportunities.ts', 'utf8');

// Use node to directly evaluate the array
const arrayStart = content.indexOf('export const opportunities: Opportunity[] = [');
const arrayCode = content.slice(arrayStart).replace('export const opportunities: Opportunity[] = ', 'const opps = ')
  .replace(/\]\s*as\s*any\s*;/g, '];')
  .replace(/OpportunityType\.(\w+)/g, '"$1"')
  .replace(/RemoteStatus\.(\w+)/g, '"$1"')
  .replace(/EducationLevel\.(\w+)/g, '"$1"')
  .replace(/ExperienceLevel\.(\w+)/g, '"$1"')
  .replace(/VerificationStatus\.(\w+)/g, '"$1"');

const evalFn = new Function(arrayCode + '\nreturn opps;');
const opps = evalFn();

console.log('Total opportunities in dataset:', opps.length);

const today = '2026-10-10';
const active = opps.filter(o => o.status !== 'closed' && (!o.deadline || o.deadline >= today));
console.log('Active opportunities (deadline >= 2026-10-10):', active.length);

console.log('\nActive Opportunities by Type (Sample 1 each):');
const types = Array.from(new Set(active.map(o => o.type)));
types.forEach(t => {
  const match = active.find(o => o.type === t);
  if (match) {
    console.log(`\n[${match.type}] ${match.title} (${match.id})`);
    console.log(`  Org: ${match.organization.name}`);
    console.log(`  Deadline: ${match.deadline}`);
    console.log(`  Funding: ${match.funding}`);
    console.log(`  Location: ${match.location}`);
    console.log(`  URL: ${match.applicationUrl}`);
  }
});

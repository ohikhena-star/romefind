// @ts-nocheck
import { opportunities } from './opportunities';
import fs from 'fs';

const report = [];

report.push('# Opportunity Database Audit Report');
report.push(`Total Opportunities: ${opportunities.length}`);

const counts = (arr, keyFn) => {
  const m = {};
  arr.forEach(a => {
    const k = keyFn(a);
    if (Array.isArray(k)) {
      k.forEach(x => { m[x] = (m[x] || 0) + 1; });
    } else {
      m[k] = (m[k] || 0) + 1;
    }
  });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
};

report.push('## By Field');
counts(opportunities, o => o.field).forEach(([k, v]) => report.push(`- ${k}: ${v}`));

report.push('\n## By Type');
counts(opportunities, o => o.type).forEach(([k, v]) => report.push(`- ${k}: ${v}`));

report.push('\n## By Remote Status');
counts(opportunities, o => o.remoteStatus).forEach(([k, v]) => report.push(`- ${k}: ${v}`));

report.push('\n## By Location');
counts(opportunities, o => o.location).forEach(([k, v]) => report.push(`- ${k}: ${v}`));

fs.writeFileSync('audit_report.md', report.join('\n'));
console.log('Report generated.');

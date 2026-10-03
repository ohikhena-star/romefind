const fs = require('fs');
const src = fs.readFileSync('src/data/opportunities.ts', 'utf8');
const constantsSrc = fs.readFileSync('src/utils/constants.ts', 'utf8');

// Extract FIELDS from constants.ts
const fieldsMatch = constantsSrc.match(/export const FIELDS = \[([\s\S]+?)\] as const/);
const canonicalFields = [];
if (fieldsMatch) {
  const inner = fieldsMatch[1];
  const fieldStrings = inner.match(/'([^']+)'/g) || [];
  fieldStrings.forEach(f => canonicalFields.push(f.replace(/'/g, '')));
}

// Extract fields from opportunities
const fieldCounts = {};
canonicalFields.forEach(f => { fieldCounts[f] = 0; });

const fieldBlockRegex = /"field":\s*\[([^\]]+)\]/g;
let m;
while ((m = fieldBlockRegex.exec(src)) !== null) {
  const inner = m[1];
  const flds = inner.match(/"([^"]+)"/g) || [];
  flds.forEach(f => {
    const name = f.replace(/"/g, '');
    if (fieldCounts[name] !== undefined) {
      fieldCounts[name]++;
    }
  });
}

console.log('=== CANONICAL FIELDS COVERAGE (vs opportunities.ts) ===\n');
console.log('Total canonical fields:', canonicalFields.length);

const zero = [], weak = [], healthy = [];
Object.entries(fieldCounts).forEach(([k, v]) => {
  if (v === 0) zero.push([k, v]);
  else if (v === 1) weak.push([k, v]);
  else healthy.push([k, v]);
});

console.log(`Healthy (>=2): ${healthy.length}`);
console.log(`Weak (=1):     ${weak.length}`);
console.log(`Zero (=0):     ${zero.length}\n`);

if (zero.length) {
  console.log('=== ZERO COVERAGE CANONICAL FIELDS ===');
  zero.forEach(([k]) => console.log(' ❌', k));
}

if (weak.length) {
  console.log('\n=== WEAK CANONICAL FIELDS (1 opp) ===');
  weak.forEach(([k]) => console.log(' ⚠️ ', k));
}

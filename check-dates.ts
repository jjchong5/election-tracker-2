import * as fs from 'fs';
import * as path from 'path';

// Read the elections data
const dataPath = path.join(__dirname, 'elections.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const elections = JSON.parse(rawData);

console.log('🔍 Checking all unique election dates...');

// Get unique election dates
const uniqueDates = new Set<string>();
elections.forEach((election: any) => {
  uniqueDates.add(election.election_date);
});

console.log(`📊 Found ${uniqueDates.size} unique election dates:`);
Array.from(uniqueDates).sort().forEach(date => {
  console.log(`   📅 ${date}`);
});

// Check for any dates that might be causing issues
const problemDates = Array.from(uniqueDates).filter((date: string) => {
  const parsed = new Date(date);
  return parsed.getFullYear() < 2025 || parsed.getFullYear() > 2030;
});

if (problemDates.length > 0) {
  console.log(`\n⚠️ Problematic dates found:`);
  problemDates.forEach(date => {
    console.log(`   🚨 ${date}`);
  });
}

import * as fs from 'fs';
import * as path from 'path';

// Read the elections data
const dataPath = path.join(__dirname, 'elections.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const elections = JSON.parse(rawData);

console.log('🔍 Checking all election dates in detail...');

// Get unique election dates with counts
const dateCounts = new Map<string, number>();
elections.forEach((election: any) => {
  const date = election.election_date;
  dateCounts.set(date, (dateCounts.get(date) || 0) + 1);
});

console.log(`📊 Election date distribution:`);
Array.from(dateCounts.entries()).sort().forEach(([date, count]) => {
  const parsed = new Date(date);
  console.log(`   📅 ${date} (${count} elections) -> ${parsed.toDateString()}`);
});

// Check for any dates that might be causing the December 31st issue
const problemDates = Array.from(dateCounts.keys()).filter(date => {
  const parsed = new Date(date);
  return parsed.getMonth() === 11 && parsed.getDate() === 31; // December 31st
});

if (problemDates.length > 0) {
  console.log(`\n⚠️ December 31st dates found:`);
  problemDates.forEach(date => {
    console.log(`   🚨 ${date}`);
  });
}

import * as fs from 'fs';
import * as path from 'path';

// Read the elections data
const dataPath = path.join(__dirname, 'elections.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const elections = JSON.parse(rawData);

console.log('🔍 Debugging election dates in detail...');

// Show first few elections with their dates
console.log('📊 Sample election data:');
for (let i = 0; i < 5; i++) {
  const election = elections[i];
  console.log(`\n🏛️ ${election.office} - ${election.district}`);
  console.log(`   📍 State: ${election.state}`);
  console.log(`   📅 Election Date: "${election.election_date}"`);
  console.log(`   📅 Type: ${typeof election.election_date}`);
  console.log(`   📅 Length: ${election.election_date.length}`);
  console.log(`   📅 Characters: ${election.election_date.split('').map((c: string) => c.charCodeAt(0))}`);
}

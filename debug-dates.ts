import * as fs from 'fs';
import * as path from 'path';

// Read the elections data
const dataPath = path.join(__dirname, 'elections.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const elections = JSON.parse(rawData);

console.log('🔍 Debugging election dates...');
console.log('📊 Sample election dates from JSON:');

// Show first 5 election dates
for (let i = 0; i < 5; i++) {
  const election = elections[i];
  console.log(`\n📅 Original: ${election.election_date}`);
  console.log(`   📍 State: ${election.state}`);
  console.log(`   🏛️ Office: ${election.office}`);
  
  const parsedDate = new Date(election.election_date);
  console.log(`   🔄 Parsed: ${parsedDate}`);
  console.log(`   📆 ISO: ${parsedDate.toISOString()}`);
}

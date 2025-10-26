import * as fs from 'fs';
import * as path from 'path';

// Read the elections data
const dataPath = path.join(__dirname, 'elections.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const elections = JSON.parse(rawData);

console.log('🔍 Debugging date parsing in import...');

// Filter for future elections only
const now = new Date();
const futureElections = elections.filter((election: any) => {
  const electionDate = new Date(election.election_date);
  return electionDate > now;
});

console.log(`📊 Found ${futureElections.length} future elections`);

// Show first few future elections
console.log('\n📅 Sample future election dates:');
for (let i = 0; i < 5; i++) {
  const election = futureElections[i];
  console.log(`\n🏛️ ${election.office} - ${election.district}`);
  console.log(`   📍 State: ${election.state}`);
  console.log(`   📅 Original date: ${election.election_date}`);
  
  const parsedDate = new Date(election.election_date);
  console.log(`   🔄 Parsed date: ${parsedDate}`);
  console.log(`   📆 ISO: ${parsedDate.toISOString()}`);
  console.log(`   🗓️ Year: ${parsedDate.getFullYear()}`);
  console.log(`   📅 Month: ${parsedDate.getMonth() + 1}`);
  console.log(`   📅 Day: ${parsedDate.getDate()}`);
}

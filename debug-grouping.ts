import * as fs from 'fs';
import * as path from 'path';

// Read the elections data
const dataPath = path.join(__dirname, 'elections.json');
const rawData = fs.readFileSync(dataPath, 'utf8');
const elections = JSON.parse(rawData);

console.log('🔍 Debugging election grouping...');

// Filter for future elections only
const now = new Date();
const futureElections = elections.filter((election: any) => {
  // Parse date as UTC to avoid timezone issues
  const electionDate = new Date(election.election_date + 'T00:00:00.000Z');
  return electionDate > now;
});

console.log(`📊 Found ${futureElections.length} future elections`);

// Filter for open seats
const openSeats = futureElections.filter((election: any) => 
  !election.incumbent || 
  election.incumbent.trim() === '' || 
  election.incumbent === 'null' ||
  election.incumbent === 'Primary results pending'
);

console.log(`🎯 Found ${openSeats.length} open seats`);

// Group by state and election date
const electionGroups = new Map<string, any[]>();

openSeats.forEach((seat: any) => {
  const key = `${seat.state}-${seat.election_date}`;
  if (!electionGroups.has(key)) {
    electionGroups.set(key, []);
  }
  electionGroups.get(key)!.push(seat);
});

console.log(`\n🗳️ Election groups:`);
Array.from(electionGroups.entries()).forEach(([key, seats]) => {
  const [state, electionDate] = key.split('-');
  console.log(`\n📅 ${state} - ${electionDate}`);
  console.log(`   📊 ${seats.length} seats`);
  console.log(`   🔄 Parsed date: ${new Date(electionDate + 'T00:00:00.000Z')}`);
  console.log(`   📆 ISO: ${new Date(electionDate + 'T00:00:00.000Z').toISOString()}`);
});

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface BallotpediaElection {
  location: string;
  state: string;
  office: string;
  district: string;
  election_date: string;
  r_plus: string | null;
  is_uncontested: boolean;
  incumbent: string | null;
  source_url: string;
  last_updated: string;
}

async function importBallotpediaData() {
  console.log('🌱 Importing Ballotpedia elections data...');

  // Clear existing data
  console.log('🗑️ Clearing existing data...');
  await prisma.candidate.deleteMany();
  await prisma.race.deleteMany();
  await prisma.election.deleteMany();

  // Read the elections data
  const dataPath = path.join(__dirname, '..', 'elections.json');
  const rawData = fs.readFileSync(dataPath, 'utf8');
  const elections: BallotpediaElection[] = JSON.parse(rawData);

  console.log(`📊 Found ${elections.length} total elections in dataset`);

  // Filter for open seats (incumbent is null or empty)
  const openSeats = elections.filter(election => 
    !election.incumbent || 
    election.incumbent.trim() === '' || 
    election.incumbent === 'null' ||
    election.incumbent === 'Primary results pending'
  );

  console.log(`🎯 Found ${openSeats.length} open seats`);

  // Group by state and election date for creating elections
  const electionGroups = new Map<string, BallotpediaElection[]>();
  
  openSeats.forEach(seat => {
    const key = `${seat.state}-${seat.election_date}`;
    if (!electionGroups.has(key)) {
      electionGroups.set(key, []);
    }
    electionGroups.get(key)!.push(seat);
  });

  console.log(`🗳️ Creating ${electionGroups.size} elections...`);

  let totalRaces = 0;
  let totalOpenSeats = 0;

  // Create elections and races
  for (const [key, seats] of electionGroups) {
    const [state, electionDate] = key.split('-');
    const firstSeat = seats[0];
    
    // Create election
    const election = await prisma.election.create({
      data: {
        name: `${state} Elections ${new Date(electionDate).getFullYear()}`,
        state: getFullStateName(state),
        date: new Date(electionDate),
        type: getElectionType(firstSeat.office),
        description: `${state} ${firstSeat.office} elections`,
      }
    });

    // Create races for this election
    for (const seat of seats) {
      // Skip if it's not a real district/position
      if (seat.district === 'Total' || seat.district === 'Office' || seat.district === 'Salary') {
        continue;
      }

      const isOpenSeat = !seat.incumbent || 
                        seat.incumbent.trim() === '' || 
                        seat.incumbent === 'null' ||
                        seat.incumbent === 'Primary results pending';

      if (isOpenSeat) {
        await prisma.race.create({
          data: {
            electionId: election.id,
            position: seat.office,
            district: seat.district,
            isOpenSeat: true,
            filingDeadline: getFilingDeadline(electionDate),
            salary: getSalary(seat.office),
            termLength: getTermLength(seat.office),
            requirements: getRequirements(seat.office, seat.state),
            candidates: {
              create: generateSampleCandidates(seat.office, seat.state)
            }
          }
        });
        totalOpenSeats++;
      }
      totalRaces++;
    }
  }

  console.log('✅ Ballotpedia data imported successfully!');
  console.log(`📊 Created ${electionGroups.size} elections`);
  console.log(`🏃 Created ${totalRaces} total races`);
  console.log(`🎯 Created ${totalOpenSeats} open seats`);
}

function getFullStateName(stateCode: string): string {
  const stateMap: { [key: string]: string } = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };
  return stateMap[stateCode] || stateCode;
}

function getElectionType(office: string): string {
  if (office.includes('State Senate') || office.includes('State House') || office.includes('State Assembly')) {
    return 'state_legislative';
  } else if (office.includes('City') || office.includes('Mayor') || office.includes('Council')) {
    return 'municipal';
  } else if (office.includes('County') || office.includes('Commissioner')) {
    return 'county';
  } else {
    return 'special';
  }
}

function getFilingDeadline(electionDate: string): Date {
  const election = new Date(electionDate);
  // Filing deadline is typically 60-90 days before election
  const deadline = new Date(election);
  deadline.setDate(deadline.getDate() - 75);
  return deadline;
}

function getSalary(office: string): string {
  if (office.includes('State Senate') || office.includes('State House')) {
    return '$50,000-$150,000/year';
  } else if (office.includes('City Council') || office.includes('Mayor')) {
    return '$30,000-$200,000/year';
  } else if (office.includes('County Commissioner')) {
    return '$40,000-$120,000/year';
  } else {
    return 'Varies';
  }
}

function getTermLength(office: string): string {
  if (office.includes('State Senate')) {
    return '4 years';
  } else if (office.includes('State House') || office.includes('State Assembly')) {
    return '2 years';
  } else if (office.includes('City Council')) {
    return '4 years';
  } else if (office.includes('Mayor')) {
    return '4 years';
  } else {
    return '2-4 years';
  }
}

function getRequirements(office: string, state: string): string {
  const baseRequirements = `Must be a registered voter in the district`;
  
  if (office.includes('State Senate') || office.includes('State House')) {
    return `${baseRequirements}. Must be at least 25 years old for Senate, 21 for House.`;
  } else if (office.includes('City Council')) {
    return `${baseRequirements}. Must be a resident of the city.`;
  } else if (office.includes('Mayor')) {
    return `${baseRequirements}. Must be a resident of the city for at least 1 year.`;
  } else {
    return baseRequirements;
  }
}

function generateSampleCandidates(office: string, state: string): any[] {
  const candidates = [];
  const numCandidates = Math.floor(Math.random() * 3) + 1; // 1-3 candidates
  
  for (let i = 0; i < numCandidates; i++) {
    const firstNames = ['Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Avery', 'Quinn'];
    const lastNames = ['Johnson', 'Smith', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
    
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    const parties = ['Democratic', 'Republican', 'Independent', 'Non-partisan'];
    const party = parties[Math.floor(Math.random() * parties.length)];
    
    candidates.push({
      name: `${firstName} ${lastName}`,
      party: party,
      isIncumbent: false,
      website: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.com`
    });
  }
  
  return candidates;
}

importBallotpediaData()
  .catch((e) => {
    console.error('❌ Error importing Ballotpedia data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

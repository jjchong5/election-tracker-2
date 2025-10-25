import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.candidate.deleteMany();
  await prisma.race.deleteMany();
  await prisma.election.deleteMany();

  // Create elections with open seats
  const election1 = await prisma.election.create({
    data: {
      name: 'Seattle Municipal Elections 2025',
      state: 'Washington',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'City council and mayoral elections',
      races: {
        create: [
          {
            position: 'City Council Member - District 3',
            district: 'District 3',
            isOpenSeat: true,
            filingDeadline: new Date('2025-05-15'),
            salary: '$135,000/year',
            termLength: '4 years',
            requirements: 'Must be a registered voter in District 3',
            candidates: {
              create: [
                { name: 'Sarah Martinez', party: 'Democratic', isIncumbent: false, website: 'https://sarahmartinez.com' },
                { name: 'James Chen', party: 'Independent', isIncumbent: false, website: 'https://jameschen.com' }
              ]
            }
          }
        ]
      }
    }
  });

  const election2 = await prisma.election.create({
    data: {
      name: 'Boston City Council Elections 2025',
      state: 'Massachusetts',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'City council elections',
      races: {
        create: [
          {
            position: 'City Councilor - District 5',
            district: 'District 5',
            isOpenSeat: true,
            filingDeadline: new Date('2025-06-01'),
            salary: '$103,500/year',
            termLength: '2 years',
            requirements: 'Must reside in District 5',
            candidates: {
              create: [
                { name: 'Emily Rodriguez', party: 'Democratic', isIncumbent: false },
                { name: 'Michael O\'Brien', party: 'Independent', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election3 = await prisma.election.create({
    data: {
      name: 'Atlanta Municipal Elections 2025',
      state: 'Georgia',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'City council races',
      races: {
        create: [
          {
            position: 'City Council Member - District 1',
            district: 'District 1',
            isOpenSeat: true,
            filingDeadline: new Date('2025-08-15'),
            salary: '$60,000/year',
            termLength: '4 years',
            requirements: 'Must live in District 1 for at least 1 year',
            candidates: {
              create: [
                { name: 'Marcus Johnson', party: 'Democratic', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election4 = await prisma.election.create({
    data: {
      name: 'Austin City Council Elections 2025',
      state: 'Texas',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'City council elections',
      races: {
        create: [
          {
            position: 'City Council Member - District 4',
            district: 'District 4',
            isOpenSeat: true,
            filingDeadline: new Date('2025-08-01'),
            salary: '$95,000/year',
            termLength: '4 years',
            requirements: 'Must be a resident of District 4',
            candidates: {
              create: [
                { name: 'Lisa Thompson', party: 'Non-partisan', isIncumbent: false },
                { name: 'David Garcia', party: 'Non-partisan', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election5 = await prisma.election.create({
    data: {
      name: 'Denver City Council Elections 2025',
      state: 'Colorado',
      date: new Date('2025-05-06'),
      type: 'municipal',
      description: 'City council races',
      races: {
        create: [
          {
            position: 'City Council Member - District 7',
            district: 'District 7',
            isOpenSeat: true,
            filingDeadline: new Date('2025-01-15'),
            salary: '$90,000/year',
            termLength: '4 years',
            requirements: 'Must be a Denver resident',
            candidates: {
              create: [
                { name: 'Amanda Wilson', party: 'Non-partisan', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election6 = await prisma.election.create({
    data: {
      name: 'Portland City Council Elections 2025',
      state: 'Oregon',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'City council elections',
      races: {
        create: [
          {
            position: 'City Commissioner - Position 2',
            district: 'At-Large',
            isOpenSeat: true,
            filingDeadline: new Date('2025-08-20'),
            salary: '$125,000/year',
            termLength: '4 years',
            requirements: 'Must be a Portland resident',
            candidates: {
              create: [
                { name: 'Robert Kim', party: 'Non-partisan', isIncumbent: false },
                { name: 'Jennifer Lee', party: 'Non-partisan', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election7 = await prisma.election.create({
    data: {
      name: 'Philadelphia City Council Elections 2025',
      state: 'Pennsylvania',
      date: new Date('2025-05-20'),
      type: 'municipal',
      description: 'City council elections',
      races: {
        create: [
          {
            position: 'City Council Member - District 2',
            district: 'District 2',
            isOpenSeat: true,
            filingDeadline: new Date('2025-03-11'),
            salary: '$140,000/year',
            termLength: '4 years',
            requirements: 'Must live in District 2',
            candidates: {
              create: [
                { name: 'Anthony Brown', party: 'Democratic', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election8 = await prisma.election.create({
    data: {
      name: 'Phoenix City Council Elections 2025',
      state: 'Arizona',
      date: new Date('2025-08-05'),
      type: 'municipal',
      description: 'City council races',
      races: {
        create: [
          {
            position: 'City Council Member - District 6',
            district: 'District 6',
            isOpenSeat: true,
            filingDeadline: new Date('2025-05-30'),
            salary: '$61,000/year',
            termLength: '4 years',
            requirements: 'Must be a District 6 resident',
            candidates: {
              create: [
                { name: 'Maria Gonzalez', party: 'Non-partisan', isIncumbent: false },
                { name: 'John Anderson', party: 'Non-partisan', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election9 = await prisma.election.create({
    data: {
      name: 'Minneapolis City Council Elections 2025',
      state: 'Minnesota',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'City council elections',
      races: {
        create: [
          {
            position: 'City Council Member - Ward 8',
            district: 'Ward 8',
            isOpenSeat: true,
            filingDeadline: new Date('2025-06-15'),
            salary: '$95,000/year',
            termLength: '4 years',
            requirements: 'Must reside in Ward 8',
            candidates: {
              create: [
                { name: 'Daniel Peterson', party: 'DFL', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  const election10 = await prisma.election.create({
    data: {
      name: 'Albuquerque City Council Elections 2025',
      state: 'New Mexico',
      date: new Date('2025-10-07'),
      type: 'municipal',
      description: 'City council races',
      races: {
        create: [
          {
            position: 'City Councilor - District 3',
            district: 'District 3',
            isOpenSeat: true,
            filingDeadline: new Date('2025-06-01'),
            salary: '$52,000/year',
            termLength: '4 years',
            requirements: 'Must live in District 3 for at least 1 year',
            candidates: {
              create: [
                { name: 'Patricia Sanchez', party: 'Democratic', isIncumbent: false },
                { name: 'Richard Lopez', party: 'Republican', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  // Add some non-open seat races for comparison
  const election11 = await prisma.election.create({
    data: {
      name: 'Seattle Municipal Elections 2025',
      state: 'Washington',
      date: new Date('2025-11-04'),
      type: 'municipal',
      description: 'Additional races',
      races: {
        create: [
          {
            position: 'City Council Member - District 1',
            district: 'District 1',
            isOpenSeat: false,
            incumbentName: 'Teresa Mosqueda',
            filingDeadline: new Date('2025-05-15'),
            salary: '$135,000/year',
            termLength: '4 years',
            requirements: 'Must be a registered voter in District 1',
            candidates: {
              create: [
                { name: 'Teresa Mosqueda', party: 'Democratic', isIncumbent: true },
                { name: 'Challenger Name', party: 'Republican', isIncumbent: false }
              ]
            }
          }
        ]
      }
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created 10 open seats across 10 states`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

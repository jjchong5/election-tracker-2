import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabaseDates() {
  console.log('🔍 Checking dates in database...');
  
  // Get a few elections from the database
  const elections = await prisma.election.findMany({
    take: 5,
    orderBy: { date: 'asc' }
  });
  
  console.log('📊 Sample elections from database:');
  elections.forEach(election => {
    console.log(`\n🏛️ ${election.name}`);
    console.log(`   📍 State: ${election.state}`);
    console.log(`   📅 Date: ${election.date}`);
    console.log(`   📆 ISO: ${election.date.toISOString()}`);
    console.log(`   🗓️ Year: ${election.date.getFullYear()}`);
    console.log(`   📅 Month: ${election.date.getMonth() + 1}`);
    console.log(`   📅 Day: ${election.date.getDate()}`);
  });
  
  // Check date distribution
  const allElections = await prisma.election.findMany({
    select: { date: true }
  });
  
  const dateCounts = new Map<string, number>();
  allElections.forEach(election => {
    const dateStr = election.date.toISOString().split('T')[0];
    dateCounts.set(dateStr, (dateCounts.get(dateStr) || 0) + 1);
  });
  
  console.log(`\n📈 Date distribution in database:`);
  Array.from(dateCounts.entries()).sort().forEach(([date, count]) => {
    console.log(`   📅 ${date}: ${count} elections`);
  });
}

checkDatabaseDates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

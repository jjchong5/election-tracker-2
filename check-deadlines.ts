import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFilingDeadlines() {
  console.log('🔍 Checking filing deadlines...');
  
  const races = await prisma.race.findMany({
    take: 5,
    include: {
      election: true
    }
  });
  
  console.log('📊 Sample races with filing deadlines:');
  races.forEach(race => {
    console.log(`\n🏛️ ${race.position} - ${race.district}`);
    console.log(`   📅 Election Date: ${race.election.date}`);
    console.log(`   ⏰ Filing Deadline: ${race.filingDeadline}`);
    console.log(`   📍 State: ${race.election.state}`);
  });
  
  // Check filing deadline distribution
  const now = new Date();
  const passedDeadlines = await prisma.race.count({
    where: {
      filingDeadline: {
        lt: now
      }
    }
  });
  
  const futureDeadlines = await prisma.race.count({
    where: {
      filingDeadline: {
        gte: now
      }
    }
  });
  
  console.log(`\n📈 Filing Deadline Statistics:`);
  console.log(`   ✅ Deadlines that have passed: ${passedDeadlines}`);
  console.log(`   ⏳ Deadlines in the future: ${futureDeadlines}`);
  console.log(`   📊 Total races: ${passedDeadlines + futureDeadlines}`);
}

checkFilingDeadlines()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

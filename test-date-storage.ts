import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testDateStorage() {
  console.log('🔍 Testing date storage...');
  
  // Test creating a simple election with a known date
  const testDate = new Date('2026-11-05');
  console.log(`📅 Test date: ${testDate}`);
  console.log(`📆 ISO: ${testDate.toISOString()}`);
  
  // Create a test election
  const testElection = await prisma.election.create({
    data: {
      name: 'Test Election',
      state: 'Test State',
      date: testDate,
      type: 'test',
      description: 'Test election for date debugging'
    }
  });
  
  console.log(`\n✅ Created test election with ID: ${testElection.id}`);
  console.log(`📅 Stored date: ${testElection.date}`);
  console.log(`📆 Stored ISO: ${testElection.date.toISOString()}`);
  
  // Clean up
  await prisma.election.delete({
    where: { id: testElection.id }
  });
  
  console.log('🧹 Cleaned up test election');
}

testDateStorage()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

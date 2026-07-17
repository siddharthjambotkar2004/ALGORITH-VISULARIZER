import prisma from './db.js';

async function checkDB() {
  console.log('Checking database...');
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  
  const algorithms = await prisma.algorithm.findMany();
  console.log('Algorithms count:', algorithms.length);
  
  await prisma.$disconnect();
}

checkDB();

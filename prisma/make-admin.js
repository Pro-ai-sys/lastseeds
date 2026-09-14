const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.log('Gebruik: node prisma/make-admin.js peter@lastseeds.nl');
    return;
  }
  const user = await prisma.user.update({
    where: { email },
    data: { role: 'admin' },
  });
  console.log(`${user.username} is nu admin`);
}

main().finally(() => prisma.$disconnect());
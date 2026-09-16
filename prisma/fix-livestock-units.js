const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.seedListing.updateMany({
    where: { species: { category: { name: "Heritage Vee" } } },
    data: { quantityUnit: "stuks" },
  });
  console.log(`${result.count} Heritage Vee-listings bijgewerkt naar 'stuks'.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

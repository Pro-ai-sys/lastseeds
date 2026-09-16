const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const partners = [
    {
      name: "Rare Breeds Survival Trust",
      logoUrl: "https://placehold.co/200x80/4a9eff/ffffff?text=RBST",
      websiteUrl: "https://www.rbst.org.uk",
      order: 0,
    },
    {
      name: "The Livestock Conservancy",
      logoUrl:
        "https://placehold.co/200x80/22c55e/ffffff?text=Livestock+Conservancy",
      websiteUrl: "https://livestockconservancy.org",
      order: 1,
    },
  ];

  for (const partner of partners) {
    await prisma.partner.create({ data: partner });
  }

  console.log("2 testpartners toegevoegd!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

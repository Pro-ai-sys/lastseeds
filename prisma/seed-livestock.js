const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: "Heritage Vee" },
    update: {
      description:
        "Traditionele, natuurlijk resistente veerassen. Koper haalt zelf op bij de boer — geen verzending.",
    },
    create: {
      name: "Heritage Vee",
      description:
        "Traditionele, natuurlijk resistente veerassen. Koper haalt zelf op bij de boer — geen verzending.",
    },
  });

  const soorten = [
    { name: "Brahma (kip)", latinName: "Gallus gallus domesticus" },
    { name: "Wyandotte (kip)", latinName: "Gallus gallus domesticus" },
    {
      name: "Nederlandse Sabelpoot (kip)",
      latinName: "Gallus gallus domesticus",
    },
    { name: "Barnevelder (kip)", latinName: "Gallus gallus domesticus" },
    { name: "Drents Heideschaap", latinName: "Ovis aries" },
    { name: "Kempisch Heideschaap", latinName: "Ovis aries" },
    { name: "Nederlandse Landgeit", latinName: "Capra aegagrus hircus" },
    { name: "Fries Roodbont (rund)", latinName: "Bos taurus" },
    { name: "Lakenvelder (rund)", latinName: "Bos taurus" },
  ];

  for (const { name, latinName } of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name, categoryId: categorie.id } },
      update: { latinName },
      create: { name, categoryId: categorie.id, latinName },
    });
  }

  console.log('Categorie "Heritage Vee" met soorten toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

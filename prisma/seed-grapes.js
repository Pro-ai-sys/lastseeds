const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const categorie = await prisma.seedCategory.upsert({
    where: { name: "Druiven" },
    update: { description: "Wijndruiven en oude, traditionele druivenrassen" },
    create: {
      name: "Druiven",
      description: "Wijndruiven en oude, traditionele druivenrassen",
    },
  });

  const soorten = [
    { name: "Riesling", latinName: "Vitis vinifera" },
    { name: "Pinot Noir", latinName: "Vitis vinifera" },
    { name: "Chardonnay", latinName: "Vitis vinifera" },
    { name: "Auxerrois", latinName: "Vitis vinifera" },
    { name: "Muscat", latinName: "Vitis vinifera" },
    { name: "Frankenthaler", latinName: "Vitis vinifera" }, // oud klassiek Nederlands druivenhuisras
    { name: "Boskoop Glory", latinName: "Vitis vinifera" }, // oud Nederlands buitenteelt-ras
    { name: "Rondo", latinName: "Vitis vinifera x Vitis labrusca" }, // schimmelresistente kruising
    { name: "Regent", latinName: "Vitis vinifera x Vitis labrusca" },
    { name: "Phoenix", latinName: "Vitis vinifera x Vitis labrusca" },
    { name: "Solaris", latinName: "Vitis vinifera x Vitis labrusca" },
  ];

  for (const { name, latinName } of soorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name, categoryId: categorie.id } },
      update: { latinName },
      create: { name, categoryId: categorie.id, latinName },
    });
  }

  console.log('Categorie "Druiven" met soorten en Latijnse namen toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

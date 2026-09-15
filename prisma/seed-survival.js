const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Groenbemesters / Bodemverbeteraars
  const groenbemesters = await prisma.seedCategory.upsert({
    where: { name: "Groenbemesters" },
    update: {
      description:
        "Planten die de bodem verbeteren en voeden tussen teelten door",
    },
    create: {
      name: "Groenbemesters",
      description:
        "Planten die de bodem verbeteren en voeden tussen teelten door",
    },
  });

  const groenbemesterSoorten = [
    { name: "Rode Klaver", latinName: "Trifolium pratense" },
    { name: "Witte Klaver", latinName: "Trifolium repens" },
    { name: "Facelia", latinName: "Phacelia tanacetifolia" },
    { name: "Winterrogge", latinName: "Secale cereale" },
    { name: "Bladrammenas", latinName: "Raphanus sativus var. oleiformis" },
    { name: "Gele Mosterd", latinName: "Sinapis alba" },
    { name: "Wikke", latinName: "Vicia sativa" },
    { name: "Luzerne", latinName: "Medicago sativa" },
  ];

  for (const { name, latinName } of groenbemesterSoorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name, categoryId: groenbemesters.id } },
      update: { latinName },
      create: { name, categoryId: groenbemesters.id, latinName },
    });
  }

  // Vezelgewassen
  const vezelgewassen = await prisma.seedCategory.upsert({
    where: { name: "Vezelgewassen" },
    update: {
      description:
        "Planten waarvan de vezels gebruikt kunnen worden voor textiel, touw of papier",
    },
    create: {
      name: "Vezelgewassen",
      description:
        "Planten waarvan de vezels gebruikt kunnen worden voor textiel, touw of papier",
    },
  });

  const vezelSoorten = [
    { name: "Vlas", latinName: "Linum usitatissimum" },
    { name: "Vezelhennep", latinName: "Cannabis sativa" },
    { name: "Jute", latinName: "Corchorus olitorius" },
    { name: "Katoen", latinName: "Gossypium herbaceum" },
  ];

  for (const { name, latinName } of vezelSoorten) {
    await prisma.seedSpecies.upsert({
      where: { name_categoryId: { name, categoryId: vezelgewassen.id } },
      update: { latinName },
      create: { name, categoryId: vezelgewassen.id, latinName },
    });
  }

  console.log('Categorieën "Groenbemesters" en "Vezelgewassen" toegevoegd!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

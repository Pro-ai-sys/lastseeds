const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const data = {
  'Vruchtgewassen': ['Tomaat', 'Courgette', 'Pompoen', 'Paprika', 'Mais', 'Aubergine', 'Augurk', 'Komkommer', 'Peper', 'Physalis', 'Watermeloen'],
  'Bladgewassen': ['Andijvie', 'Bosui', 'Bladmosterd', 'Groenlof', 'Kardoen', 'Mesclun', 'Paksoi', 'Postelein', 'Prei', 'Raapsteel', 'Radicchio', 'Rucola', 'Selderij', 'Sla', 'Snijbiet', 'Spinazie', 'Tuinkers', 'Tuinmelde', 'Veldsla'],
  'Peulvruchten': ['Doperwt', 'Droogboon', 'Kapucijner', 'Peul', 'Pronkboon', 'Sojaboon', 'Spekboon', 'Slaboon', 'Snijboon', 'Sugar snap', 'Tuinboon'],
  'Koolgewassen': ['Bloemkool', 'Boerenkool', 'Broccoli', 'Chinese kool', 'Koolrabi', 'Palmkool', 'Rode kool', 'Romanesco', 'Savooiekool', 'Spitskool', 'Spruitkool', 'Witte kool'],
  'Wortel & Knolgewassen': ['Biet', 'Knolselderij', 'Knolvenkel', 'Koolraap', 'Meiraap', 'Pastinaak', 'Radijs', 'Rammenas', 'Schorseneer', 'Ui', 'Witlof', 'Wortel', 'Wortelpeterselie'],
  'Kruiden': ['Anijs', 'Basilicum', 'Bieslook', 'Bonenkruid', 'Citroenmelisse', 'Dille', 'Fenegriek', 'Hyssop', 'Karwij', 'Kervel', 'Komkommerkruid', 'Koriander', 'Lavas', 'Lavendel', 'Lepelblad', 'Peterselie', 'Salie', 'Tijm', 'Marjolein', 'Winterkers', 'Zuring'],
  'Fruit': ['Aardbei', 'Framboos', 'Meloen'],
  'Overig': [],
};

async function main() {
  for (const [categoryName, speciesList] of Object.entries(data)) {
    const category = await prisma.seedCategory.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });

    for (const speciesName of speciesList) {
      await prisma.seedSpecies.upsert({
        where: { name_categoryId: { name: speciesName, categoryId: category.id } },
        update: {},
        create: { name: speciesName, categoryId: category.id },
      });
    }
  }
  console.log('Categorieën en soorten toegevoegd');
}

main().finally(() => prisma.$disconnect());
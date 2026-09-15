const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const latinNames = {
  // Bloemen
  Afrikaantjes: "Tagetes patula",
  Cosmos: "Cosmos bipinnatus",
  Geranium: "Pelargonium x hortorum",
  Klaproos: "Papaver rhoeas",
  Korenbloem: "Centaurea cyanus",
  Leeuwenbek: "Antirrhinum majus",
  Lathyrus: "Lathyrus odoratus",
  "Oost-Indische kers": "Tropaeolum majus",
  Petunia: "Petunia x hybrida",
  Schildzaad: "Alyssum saxatile",
  Zinnia: "Zinnia elegans",
  Chrysant: "Chrysanthemum x morifolium",
  Judaspenning: "Lunaria annua",
  Lupine: "Lupinus polyphyllus",
  Madelief: "Bellis perennis",
  Margriet: "Leucanthemum vulgare",
  Muurbloem: "Erysimum cheiri",
  Stokroos: "Alcea rosea",
  "Vergeet-mij-niet": "Myosotis sylvatica",
  Vingerhoedskruid: "Digitalis purpurea",
  Violen: "Viola tricolor",
  Akelei: "Aquilegia vulgaris",
  Dahlia: "Dahlia pinnata",
  Gerbera: "Gerbera jamesonii",
  Gipskruid: "Gypsophila paniculata",
  Kogeldistel: "Echinops ritro",
  Phlox: "Phlox paniculata",
  Ridderspoor: "Delphinium ajacis",
  Echinacea: "Echinacea purpurea",
  Zonnebloem: "Helianthus annuus",
  Aster: "Callistephus chinensis",
  Anjer: "Dianthus caryophyllus",
  Calendula: "Calendula officinalis",
  Verbena: "Verbena x hybrida",

  // Fruit
  Aardbei: "Fragaria x ananassa",
  Framboos: "Rubus idaeus",
  Meloen: "Cucumis melo",

  // Fruitbomen
  Appel: "Malus domestica",
  Peer: "Pyrus communis",
  Kers: "Prunus avium",
  Pruim: "Prunus domestica",
  Perzik: "Prunus persica",
  Abrikoos: "Prunus armeniaca",
  Vijg: "Ficus carica",
  Walnoot: "Juglans regia",
  Hazelnoot: "Corylus avellana",
  Kastanje: "Castanea sativa",
  Mispel: "Mespilus germanica",
  Kweepeer: "Cydonia oblonga",

  // Granen
  Quinoa: "Chenopodium quinoa",
  Boekweit: "Fagopyrum esculentum",
  Amarant: "Amaranthus",
  Haver: "Avena sativa",
  Gerst: "Hordeum vulgare",
  Spelt: "Triticum spelta",

  // Kamerplanten
  "Vlijtig Liesje": "Impatiens walleriana",
  "Aloë Vera": "Aloe vera",
  Monstera: "Monstera deliciosa",

  // Exotische groenten
  Okra: "Abelmoschus esculentus",
  Bittermeloen: "Momordica charantia",
  Chayote: "Sechium edule",
  Taro: "Colocasia esculenta",
  "Yuca (Cassave)": "Manihot esculenta",
  Malanga: "Xanthosoma sagittifolium",
  Boniato: "Ipomoea batatas",
  "Thaise basilicum": "Ocimum basilicum var. thyrsiflora",
  "Vietnamese koriander": "Persicaria odorata",
  Callaloo: "Amaranthus viridis",
  "Scotch Bonnet peper": "Capsicum chinense",
  "Habanero peper": "Capsicum chinense",
  "Rocoto peper": "Capsicum pubescens",
  "Ají Amarillo peper": "Capsicum baccatum",

  // Paddenstoelen
  Champignon: "Agaricus bisporus",
  Oesterzwam: "Pleurotus ostreatus",
  Shiitake: "Lentinula edodes",
  Portobello: "Agaricus bisporus",
  Kastanjechampignon: "Agaricus bisporus",

  // Cannabis
  Sativa: "Cannabis sativa",
  Indica: "Cannabis indica",
};

async function main() {
  let updated = 0;
  for (const [name, latinName] of Object.entries(latinNames)) {
    const result = await prisma.seedSpecies.updateMany({
      where: { name },
      data: { latinName },
    });
    updated += result.count;
  }
  console.log(`${updated} soorten bijgewerkt met Latijnse naam.`);
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());

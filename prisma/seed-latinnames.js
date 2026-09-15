const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const latinNames = {
  // Vruchtgewassen
  Tomaat: "Solanum lycopersicum",
  Courgette: "Cucurbita pepo",
  Pompoen: "Cucurbita maxima",
  Paprika: "Capsicum annuum",
  Mais: "Zea mays",
  Aubergine: "Solanum melongena",
  Augurk: "Cucumis sativus",
  Komkommer: "Cucumis sativus",
  Peper: "Capsicum annuum",
  Physalis: "Physalis peruviana",
  Watermeloen: "Citrullus lanatus",

  // Bladgewassen
  Andijvie: "Cichorium endivia",
  Sla: "Lactuca sativa",
  Bindsla: "Lactuca sativa",
  Spinazie: "Spinacia oleracea",
  Postelein: "Portulaca oleracea",
  Rucola: "Eruca sativa",
  Bleekselderij: "Apium graveolens var. dulce",
  Selderij: "Apium graveolens",
  "Chinese kool": "Brassica rapa subsp. pekinensis",
  IJskruid: "Mesembryanthemum crystallinum",
  Kardoen: "Cynara cardunculus",
  Paksoi: "Brassica rapa subsp. chinensis",
  Prei: "Allium porrum",
  Raapsteel: "Brassica rapa",
  Radicchio: "Cichorium intybus",
  Snijbiet: "Beta vulgaris subsp. cicla",
  Tuinkers: "Lepidium sativum",
  Tuinmelde: "Atriplex hortensis",
  Veldsla: "Valerianella locusta",
  Groenlof: "Cichorium intybus var. foliosum",
  Bosui: "Allium fistulosum",
  Bladmosterd: "Brassica juncea",

  // Peulvruchten
  Doperwt: "Pisum sativum",
  Droogboon: "Phaseolus vulgaris",
  Kapucijner: "Pisum sativum var. arvense",
  Peul: "Pisum sativum",
  Pronkboon: "Phaseolus coccineus",
  Sojaboon: "Glycine max",
  Spekboon: "Vigna unguiculata",
  Slaboon: "Phaseolus vulgaris",
  Snijboon: "Phaseolus vulgaris",
  "Sugar snap": "Pisum sativum var. macrocarpon",
  Tuinboon: "Vicia faba",
  Kouseband: "Vigna unguiculata subsp. sesquipedalis",

  // Koolgewassen
  Bloemkool: "Brassica oleracea var. botrytis",
  Boerenkool: "Brassica oleracea var. sabellica",
  Broccoli: "Brassica oleracea var. italica",
  Koolrabi: "Brassica oleracea var. gongylodes",
  Palmkool: "Brassica oleracea var. palmifolia",
  "Rode kool": "Brassica oleracea var. capitata f. rubra",
  Romanesco: "Brassica oleracea var. botrytis",
  Savooiekool: "Brassica oleracea var. sabauda",
  Spitskool: "Brassica oleracea var. capitata",
  Spruitkool: "Brassica oleracea var. gemmifera",
  "Witte kool": "Brassica oleracea var. capitata f. alba",
  Kalettes: "Brassica oleracea",

  // Wortel & Knolgewassen
  Biet: "Beta vulgaris",
  Knolselderij: "Apium graveolens var. rapaceum",
  Knolvenkel: "Foeniculum vulgare var. azoricum",
  Koolraap: "Brassica napus var. napobrassica",
  Meiraap: "Brassica rapa subsp. rapa",
  Pastinaak: "Pastinaca sativa",
  Radijs: "Raphanus sativus",
  Rammenas: "Raphanus sativus var. niger",
  Schorseneer: "Scorzonera hispanica",
  Ui: "Allium cepa",
  Witlof: "Cichorium intybus var. foliosum",
  Wortel: "Daucus carota subsp. sativus",
  Wortelpeterselie: "Petroselinum crispum var. tuberosum",
  Asperges: "Asparagus officinalis",
  Rabarber: "Rheum rhabarbarum",
  Artisjok: "Cynara cardunculus var. scolymus",

  // Kruiden
  Anijs: "Pimpinella anisum",
  Basilicum: "Ocimum basilicum",
  Bieslook: "Allium schoenoprasum",
  Bonenkruid: "Satureja hortensis",
  Citroenmelisse: "Melissa officinalis",
  Dille: "Anethum graveolens",
  Fenegriek: "Trigonella foenum-graecum",
  Karwij: "Carum carvi",
  Kervel: "Anthriscus cerefolium",
  Komkommerkruid: "Borago officinalis",
  Koriander: "Coriandrum sativum",
  Lavas: "Levisticum officinale",
  Lavendel: "Lavandula angustifolia",
  Peterselie: "Petroselinum crispum",
  Salie: "Salvia officinalis",
  Tijm: "Thymus vulgaris",
  Marjolein: "Origanum majorana",
  Zuring: "Rumex acetosa",
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

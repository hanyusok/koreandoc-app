import { prisma } from "../lib/prisma";

async function main() {
  const allSubstances = await prisma.deaControlledSubstance.findMany({
    select: { drug: true, id: true }
  });

  const nameCounts: Record<string, number> = {};
  for (const s of allSubstances) {
    nameCounts[s.drug] = (nameCounts[s.drug] || 0) + 1;
  }

  const duplicates = Object.keys(nameCounts).filter(name => nameCounts[name] > 1);

  if (duplicates.length === 0) {
    console.log("No duplicate drugs found in DeaControlledSubstance table.");
  } else {
    console.log(`Found ${duplicates.length} duplicate drug names:`);
    for (const d of duplicates) {
      console.log(`- ${d} (Count: ${nameCounts[d]})`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { prisma } from "../lib/prisma";

async function main() {
  const count = await prisma.deaControlledSubstance.count();
  console.log(`Total DEA Controlled Substances in DB: ${count}`);

  const sample = await prisma.deaControlledSubstance.findFirst({
    where: { narcotic: "Y" }
  });
  console.log("Sample Narcotic record:", JSON.stringify(sample, null, 2));

  const sample2 = await prisma.deaControlledSubstance.findFirst({
    where: {
      csaSchedule: "II"
    }
  });
  console.log("Sample Schedule II record:", JSON.stringify(sample2, null, 2));

  // Search by drug string containing "Fentanyl"
  const search = await prisma.deaControlledSubstance.findMany({
    where: {
      drug: {
        contains: "Fentanyl",
        mode: "insensitive"
      }
    },
    take: 3
  });
  console.log("Search 'Fentanyl' matches:", search.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

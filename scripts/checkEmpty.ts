import { prisma } from "../lib/prisma";

async function main() {
  const count = await prisma.controlledSubstance.count();
  console.log(`Total records in ControlledSubstance: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

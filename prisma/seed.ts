import { prisma } from "../lib/prisma";

const controlledSubstances = [
  {
    name: "Fentanyl",
    riskLevel: 5,
    category: "Schedule II Opioid",
    description: "Highly addictive and dangerous. Strictly controlled.",
  },
  {
    name: "Oxycodone",
    riskLevel: 5,
    category: "Schedule II Opioid",
    description: "Highly addictive and dangerous. Strictly controlled.",
  },
  {
    name: "Zolpidem",
    riskLevel: 4,
    category: "Schedule IV Sedative",
    description: "Ambien. Strictly controlled for sleep disorders.",
  },
  {
    name: "Diazepam",
    riskLevel: 4,
    category: "Schedule IV Benzodiazepine",
    description: "Valium. Strictly controlled for anxiety.",
  },
  {
    name: "Amoxicillin",
    riskLevel: 2,
    category: "Antibiotic",
    description: "Not FDA unapproved but often restricted in mail orders.",
  },
  {
    name: "Phentermine",
    riskLevel: 4,
    category: "Schedule IV Stimulant",
    description: "Diet pill. Strictly controlled.",
  },
  {
    name: "Sildenafil",
    riskLevel: 3,
    category: "ED Medication",
    description: "Viagra. Often flaggable in certain quantities or contexts.",
  },
];

async function main() {
  console.log("Seeding controlled substances...");
  for (const substance of controlledSubstances) {
    await prisma.controlledSubstance.upsert({
      where: { name: substance.name },
      update: substance,
      create: substance,
    });
  }
  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

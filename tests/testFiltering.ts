import "dotenv/config";
import { calculateRisk } from "../lib/filteringEngine";
import { prisma } from "../lib/prisma";

async function runTests() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Defined" : "Undefined");
  const testCases = [
    { name: "Fentanyl", expected: 5 },
    { name: "Oxycodone hydrochloride", expected: 5 },
    { name: "Zolpidem tartrate", expected: 4 },
    { name: "Amoxicillin 500mg", expected: 2 },
    { name: "Aspirin", expected: 1 },
    { name: "Propecia (Finasteride)", expected: 1 }, // Note: Finasteride isn't in my seed list as controlled
  ];

  console.log("Running Ingredient Filtering Engine Tests...\n");

  for (const test of testCases) {
    const risk = await calculateRisk(test.name);
    const result = risk === test.expected ? "✅ PASS" : `❌ FAIL (Got ${risk}, Expected ${test.expected})`;
    console.log(`${test.name.padEnd(25)}: Risk Level ${risk} ${result}`);
  }
}

runTests()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { prisma } from "./prisma";

/**
 * Calculates the risk level (1-5) of a drug by comparing its name
 * against the ControlledSubstance database.
 * 
 * @param drugName The name of the drug to check
 * @returns The risk level (default 1)
 */
export async function calculateRisk(drugName: string): Promise<number> {
  if (!drugName) return 1;

  const normalized = drugName.trim().toLowerCase();
  
  // Fetch all controlled substances
  // In a real high-traffic app, we might want to cache this or use a more sophisticated search
  const substances = await prisma.controlledSubstance.findMany();

  let maxRisk = 1;

  for (const substance of substances) {
    const substanceName = substance.name.toLowerCase();
    
    // Simple substring matching for now
    if (normalized.includes(substanceName) || substanceName.includes(normalized)) {
      if (substance.riskLevel > maxRisk) {
        maxRisk = substance.riskLevel;
      }
    }
  }

  return maxRisk;
}

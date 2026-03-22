import { readFileSync } from "fs";
import "dotenv/config";
import { parse } from "csv-parse/sync";
import path from "path";
import { prisma } from "../lib/prisma";

async function main() {
  const csvFilePath = path.join(process.cwd(), "app/deaBook/dea-controlled-substances.csv");
  console.log(`Reading CSV from ${csvFilePath}`);

  const fileContent = readFileSync(csvFilePath, "utf-8");
  
  // Parse CSV
  // The CSV has a header row: "CSCN","Drug","Class","CSA Schedule","Narcotic","Other Names"
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  console.log(`Parsed ${records.length} records. Inserting into database...`);

  // Map to matching schema types
  const deaSubstances = records.map((record: any) => {
    return {
      cscn: record["CSCN"] ? record["CSCN"].trim() : null,
      drug: record["Drug"] ? record["Drug"].trim() : "",
      drugClass: record["Class"] ? record["Class"].trim() : null,
      csaSchedule: record["CSA Schedule"] ? record["CSA Schedule"].trim() : null,
      narcotic: record["Narcotic"] ? record["Narcotic"].trim() : null,
      otherNames: record["Other Names"] ? record["Other Names"].trim() : null,
    };
  });
  
  const validSubstances = deaSubstances.filter((s: any) => s.drug && s.drug.length > 0);

  console.log("Clearing existing DeaControlledSubstance records...");
  await prisma.deaControlledSubstance.deleteMany({});
  
  console.log(`Inserting ${validSubstances.length} valid records...`);
  const result = await prisma.deaControlledSubstance.createMany({
    data: validSubstances,
  });

  console.log(`Successfully inserted ${result.count} records.`);
}

main()
  .catch((e) => {
    console.error("Error during import:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

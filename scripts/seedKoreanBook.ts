// @ts-nocheck
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import { parse } from 'csv-parse';

const BATCH_SIZE = 5000;

const cleanStr = (s) => (s || '').trim();

function extractMappingKeys(ingredientStr) {
  if (!ingredientStr) return { mappedIngredient: null, mappedStrength: null };
  const str = cleanStr(ingredientStr);
  
  // They use 3 spaces to split ingredient vs dose, e.g. "zolpidem tartrate   10mg"
  const separatorIndex = str.lastIndexOf('   ');
  if (separatorIndex !== -1) {
    let ing = str.substring(0, separatorIndex).trim().toUpperCase();
    let strn = str.substring(separatorIndex + 3).trim().toUpperCase();
    
    // Convert "DOXEPIN HYDROCHLORIDE (AS DOXEPIN" -> "DOXEPIN HYDROCHLORIDE"
    if (ing.includes('(AS ')) {
      ing = ing.replace(/\(AS .*/, '').trim();
    }
    
    // Normalize basic dosage strings if necessary, though direct mapping might differ
    return { mappedIngredient: ing, mappedStrength: strn };
  }
  
  // As a fallback for different formats
  return { mappedIngredient: str.toUpperCase(), mappedStrength: null };
}

async function main() {
  console.log("Starting KoreanBook sync...");
  console.log("Clearing existing data...");
  await prisma.koreanBookProduct.deleteMany();
  
  const csvFilePath = 'app/koreanBook/koreanProducts.csv';
  const columns = [
    'seqNo', 'adminRoute', 'classification', 'kfdaClass',
    'mainIngredientCode_same', 'ingredientCode', 'ingredientCount',
    'ingredientName', 'productCode', 'productName', 'companyName',
    'standard', 'unit', 'price', 'type', 'note'
  ];

  let records = [];
  let count = 0;
  
  const parser = fs.createReadStream(csvFilePath).pipe(parse({ 
    columns: columns,
    from_line: 2, 
    skip_empty_lines: true,
    relax_quotes: true
  }));

  parser.on('readable', async function() {
    let r;
    while ((r = parser.read()) !== null) {
      if (!r.productName) continue; // Skip bad row
      const { mappedIngredient, mappedStrength } = extractMappingKeys(r.ingredientName);
      
      records.push({
        seqNo: cleanStr(r.seqNo),
        adminRoute: cleanStr(r.adminRoute),
        classification: cleanStr(r.classification),
        kfdaClass: cleanStr(r.kfdaClass),
        ingredientCode: cleanStr(r.ingredientCode),
        ingredientCount: cleanStr(r.ingredientCount),
        ingredientName: cleanStr(r.ingredientName),
        productCode: cleanStr(r.productCode),
        productName: cleanStr(r.productName),
        companyName: cleanStr(r.companyName),
        standard: cleanStr(r.standard),
        unit: cleanStr(r.unit),
        price: cleanStr(r.price),
        type: cleanStr(r.type),
        note: cleanStr(r.note),
        mappedIngredient,
        mappedStrength
      });
      
      if (records.length >= BATCH_SIZE) {
        parser.pause();
        try {
          await prisma.koreanBookProduct.createMany({ data: records });
          count += records.length;
          console.log(`Processed ${count} records...`);
          records = [];
          parser.resume();
        } catch (e) {
          console.error("Error inserting batch", e);
          process.exit(1);
        }
      }
    }
  });

  parser.on('end', async function() {
    if (records.length > 0) {
      try {
        await prisma.koreanBookProduct.createMany({ data: records });
        count += records.length;
        console.log(`Processed ${count} records from ${csvFilePath}`);
      } catch (e) {
        console.error("Error inserting batch", e);
      }
    }
    console.log("Sync complete!");
    prisma.$disconnect();
  });
  
  parser.on('error', function(err) {
    console.error("Error parsing CSV: ", err);
    prisma.$disconnect();
    process.exit(1);
  });
}

main();

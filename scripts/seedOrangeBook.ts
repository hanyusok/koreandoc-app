// @ts-nocheck
import 'dotenv/config';
import { prisma } from '../lib/prisma';
import fs from 'fs';
import { parse } from 'csv-parse';

const BATCH_SIZE = 5000;

function parseOrangeBookDate(dateStr) {
  if (!dateStr || dateStr.trim() === '') return null;
  const months = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
  const parts = dateStr.split('-');
  if (parts.length === 3) {
     let year = parseInt(parts[2], 10);
     year = year < 50 ? 2000 + year : 1900 + year;
     const month = months[parts[1]];
     const day = parts[0].padStart(2, '0');
     if (month && !isNaN(year)) {
       return new Date(`${year}-${month}-${day}T00:00:00Z`);
     }
  }
  return null;
}

async function processCSV(filePath, onBatch) {
  return new Promise((resolve, reject) => {
    let records = [];
    let count = 0;
    const parser = fs.createReadStream(filePath).pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));
    
    parser.on('readable', async function() {
      let record;
      while ((record = parser.read()) !== null) {
        records.push(record);
        if (records.length >= BATCH_SIZE) {
          parser.pause();
          try {
            await onBatch(records);
            count += records.length;
            console.log(`Processed ${count} records from ${filePath}`);
            records = [];
            parser.resume();
          } catch (e) {
            reject(e);
          }
        }
      }
    });

    parser.on('error', function(err) {
      reject(err);
    });

    parser.on('end', async function() {
      if (records.length > 0) {
        try {
          await onBatch(records);
          count += records.length;
          console.log(`Processed ${count} records from ${filePath}`);
        } catch (e) {
          reject(e);
        }
      }
      resolve(null);
    });
  });
}

async function main() {
  console.log("Starting OrangeBook sync...");
  
  console.log("Clearing existing data...");
  await prisma.orangeBookExclusivity.deleteMany();
  await prisma.orangeBookPatent.deleteMany();
  await prisma.orangeBookProduct.deleteMany();
  
  await processCSV('app/orangeBook/products.csv', async (records) => {
    const data = records.map(r => ({
      ingredient: r['Ingredient'] || '',
      dfRoute: r['DF;Route'] || r['DF_Route'] || null,
      tradeName: r['Trade_Name'] || '',
      applicant: r['Applicant'] || '',
      strength: r['Strength'] || '',
      applType: r['Appl_Type'] || '',
      applNo: r['Appl_No'] || '',
      productNo: r['Product_No'] || '',
      teCode: r['TE_Code'] || null,
      approvalDate: r['Approval_Date'] || null,
      rld: r['RLD'] || null,
      rs: r['RS'] || null,
      type: r['Type'] || null,
      applicantFullName: r['Applicant_Full_Name'] || null,
    }));
    await prisma.orangeBookProduct.createMany({ data });
  });

  await processCSV('app/orangeBook/patent.csv', async (records) => {
    const data = records.map(r => ({
      applType: r['Appl_Type'] || '',
      applNo: r['Appl_No'] || '',
      productNo: r['Product_No'] || '',
      patentNo: r['Patent_No'] || '',
      patentExpireDate: parseOrangeBookDate(r['Patent_Expire_Date_Text']),
      drugSubstanceFlag: r['Drug_Substance_Flag'] || null,
      drugProductFlag: r['Drug_Product_Flag'] || null,
      patentUseCode: r['Patent_Use_Code'] || null,
      delistFlag: r['Delist_Flag'] || null,
      submissionDate: r['Submission_Date'] || null,
    }));
    await prisma.orangeBookPatent.createMany({ data });
  });

  await processCSV('app/orangeBook/exclusivity.csv', async (records) => {
    const data = records.map(r => ({
      applType: r['Appl_Type'] || '',
      applNo: r['Appl_No'] || '',
      productNo: r['Product_No'] || '',
      exclusivityCode: r['Exclusivity_Code'] || '',
      exclusivityDate: parseOrangeBookDate(r['Exclusivity_Date']),
    }));
    await prisma.orangeBookExclusivity.createMany({ data });
  });
  
  console.log("Sync complete!");
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});

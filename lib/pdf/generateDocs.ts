/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateCommercialInvoice(order: {
  orderNo: string;
  patientName: string;
  usAddress: string;
  drugName: string;
  pillDays: number;
  createdAt: Date;
}): Uint8Array {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("COMMERCIAL INVOICE", 105, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("FOR CUSTOMS PURPOSES ONLY", 105, 32, { align: "center" });

  // Sender Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("SHIPPER / EXPORTER:", 15, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("KoreanDoc Pharmacy Services", 15, 57);
  doc.text("Seoul, Republic of Korea", 15, 63);

  // Recipient Info
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("CONSIGNEE / RECIPIENT:", 110, 50);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(order.patientName, 110, 57);
  const addressLines = doc.splitTextToSize(order.usAddress, 85);
  doc.text(addressLines, 110, 63);

  // Invoice Details
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE DETAILS:", 15, 90);

  autoTable(doc, {
    startY: 95,
    head: [["Invoice No.", "Date", "Purpose"]],
    body: [[order.orderNo, order.createdAt.toISOString().slice(0, 10), "Personal Use Only"]],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [40, 40, 80] },
  });

  // Item Table
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 10,
    head: [["Description", "Qty / Days", "Country of Origin", "Unit Value (USD)", "Total Value (USD)"]],
    body: [
      [
        `Prescription Medication: ${order.drugName}`,
        `${order.pillDays} days supply`,
        "Republic of Korea",
        "N/A",
        "N/A",
      ],
    ],
    styles: { fontSize: 9 },
    headStyles: { fillColor: [40, 40, 80] },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  // Important notices
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("DECLARATION:", 15, finalY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const note =
    "This shipment contains prescription medication for PERSONAL USE ONLY and is NOT FOR RESALE. " +
    "The quantity does not exceed a 90-day supply as permitted under FDA personal importation policy. " +
    "A valid prescription from a licensed Korean physician is attached.";
  const noteLines = doc.splitTextToSize(note, 180);
  doc.text(noteLines, 15, finalY + 8);

  doc.setFontSize(9);
  doc.text("Shipper Signature: ________________________", 15, finalY + 35);
  doc.text(`Date: ${new Date().toISOString().slice(0, 10)}`, 15, finalY + 43);

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

export function generatePhysiciansNote(order: {
  orderNo: string;
  patientName: string;
  drugName: string;
  drugCategory: string | null;
  pillDays: number;
  createdAt: Date;
}): Uint8Array {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("PHYSICIAN'S LETTER / MEDICAL NECESSITY STATEMENT", 105, 25, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Date: ${new Date().toISOString().slice(0, 10)}`, 15, 45);
  doc.text("To Whom It May Concern (U.S. Customs and Border Protection):", 15, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const body1 = `This letter is to certify that ${order.patientName} is under my medical care and has been prescribed ${order.drugName} for ongoing treatment of a diagnosed medical condition. The enclosed medication is intended solely for the personal use of the named patient.`;
  doc.text(doc.splitTextToSize(body1, 180), 15, 70);

  const body2 = `The quantity shipped represents a ${order.pillDays}-day supply, which does not exceed the 90-day limit permitted under the FDA's personal importation policy. This medication is not available in equivalent form locally or is significantly more cost-effective when obtained through the patient's home country pharmacist.`;
  doc.text(doc.splitTextToSize(body2, 180), 15, 100);

  const body3 = `We respectfully request that U.S. Customs authorities permit the importation of this medication for the patient's continued treatment and wellbeing.`;
  doc.text(doc.splitTextToSize(body3, 180), 15, 130);

  doc.text("Sincerely,", 15, 160);
  doc.text("_________________________", 15, 175);
  doc.text("Licensed Physician, M.D.", 15, 183);
  doc.text("Medical License No.: _________________", 15, 191);
  doc.text("Clinic Name: KoreanDoc Affiliated Clinic", 15, 199);
  doc.text("Seoul, Republic of Korea", 15, 207);

  doc.setFontSize(9);
  doc.text(`Reference Order: ${order.orderNo}`, 15, 230);

  return doc.output("arraybuffer") as unknown as Uint8Array;
}

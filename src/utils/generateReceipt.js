import jsPDF from "jspdf";

const formatINR = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function generateReceiptPDF(studentData = {}, paymentData = {}, settingsData = {}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const instituteName =
    settingsData?.instituteName || settingsData?.name || "GuruPay Institute";
  const instituteAddress = settingsData?.address || "";
  const institutePhone = settingsData?.phone || "";

  const receiptNo = paymentData?.id || `R-${Date.now()}`;
  const paymentAmount = Number(paymentData?.amount) || 0;
  const dueAmount = Number(studentData?.dueAmount) || 0;
  const paymentDate = paymentData?.paidOn || paymentData?.date;
  const paymentMode = paymentData?.mode || "—";

  const filenameSafeStudent = (studentData?.name || "student")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, "");
  const fileName = `Receipt_${receiptNo}_${filenameSafeStudent}.pdf`;

  const left = 50;
  let y = 60;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(instituteName, left, y);

  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  if (instituteAddress) {
    doc.text(instituteAddress, left, y);
    y += 14;
  }
  if (institutePhone) {
    doc.text(`Phone: ${institutePhone}`, left, y);
    y += 14;
  }

  doc.setDrawColor(210, 210, 210);
  doc.line(left, y + 8, 545, y + 8);

  y += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("FEE RECEIPT", left, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y += 24;
  doc.text(`Receipt No: ${receiptNo}`, left, y);
  doc.text(`Date: ${formatDate(paymentDate)}`, 360, y);

  y += 28;
  doc.setFont("helvetica", "bold");
  doc.text("Student Details", left, y);
  doc.setFont("helvetica", "normal");

  y += 18;
  doc.text(`Name: ${studentData?.name || "—"}`, left, y);
  y += 16;
  doc.text(`Batch: ${studentData?.batchName || "—"}`, left, y);
  y += 16;
  doc.text(`Phone: ${studentData?.phone || "—"}`, left, y);

  y += 26;
  doc.setFont("helvetica", "bold");
  doc.text("Payment Details", left, y);
  doc.setFont("helvetica", "normal");

  y += 18;
  doc.text(`Amount Paid: ${formatINR(paymentAmount)}`, left, y);
  y += 16;
  doc.text(`Payment Mode: ${paymentMode}`, left, y);
  y += 16;
  doc.text(`Due Amount: ${formatINR(dueAmount)}`, left, y);

  y += 30;
  doc.setDrawColor(210, 210, 210);
  doc.line(left, y, 545, y);

  y += 24;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Thank you for your payment!", left, y);

  y += 16;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("This is a system-generated receipt from GuruPay Pro.", left, y);

  doc.save(fileName);

  return { receiptNo, fileName };
}

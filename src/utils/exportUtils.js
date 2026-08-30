import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

export function exportToPdf(filename = "report.pdf", columns = [], rows = [], options = {}) {
  const doc = new jsPDF("p", "pt");
  const title = options.title || "ZNBTS Medical Operational Report";
  const facility = options.facility || "ZNBTS Copperbelt Provincial Blood Transfusion Network";
  const generatedAt = options.generatedAt || new Date().toLocaleString();
  const summaryText = options.summary || "Official Blood Transfusion & Clinical Activity Report";

  // Official ZNBTS Header Styling
  doc.setFillColor(122, 14, 20); // ZNBTS Primary Crimson
  doc.rect(0, 0, 612, 60, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("ZAMBIA NATIONAL BLOOD TRANSFUSION SERVICE", 40, 35);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("UMULOPA SAFE TRANSFER — COPPERBELT PROVINCE NETWORK", 40, 48);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 40, 85);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Facility / Scope: ${facility}`, 40, 100);
  doc.text(`Report Summary: ${summaryText}`, 40, 112);
  doc.text(`Generated Date: ${generatedAt}`, 40, 124);

  autoTable(doc, {
    startY: 135,
    head: [columns.map((c) => c.label || c.key)],
    body: rows.map((r) => columns.map((c) => (c.render ? stripHtml(String(c.render(r))) : stripHtml(String(r[c.key] ?? "-"))))),
    styles: { fontSize: 9, cellPadding: 6 },
    headStyles: { fillColor: [122, 14, 20], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 40, right: 40 },
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${pageCount} — Confidential Medical Record`, 40, 820);
  }

  doc.save(filename);
}

export function exportToExcel(filename = "report.xlsx", columns = [], rows = [], options = {}) {
  const generatedAt = options.generatedAt || new Date().toLocaleString();
  const facility = options.facility || "ZNBTS Copperbelt Provincial Blood Transfusion Network";

  const header = columns.map((c) => c.label || c.key);
  const data = rows.map((r) => columns.map((c) => (c.render ? stripHtml(String(c.render(r))) : String(r[c.key] ?? "-"))));

  const sheetData = [
    ["ZAMBIA NATIONAL BLOOD TRANSFUSION SERVICE (ZNBTS)"],
    [options.title || "Medical & Operational Activity Report"],
    [`Facility Scope: ${facility}`],
    [`Generated Date: ${generatedAt}`],
    [],
    header,
    ...data,
  ];

  const ws = XLSX.utils.aoa_to_sheet(sheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, options.sheetName || "Operational Report");
  XLSX.writeFile(wb, filename);
}

export function exportToCsv(filename = "report.csv", columns = [], rows = []) {
  const header = columns.map((c) => c.label || c.key).join(",");
  const body = rows.map((r) => columns.map((c) => (c.render ? stripHtml(String(c.render(r))) : String(r[c.key] ?? ""))).join(",") ).join("\n");
  const csv = [header, body].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}

function stripHtml(value) {
  if (typeof value !== "string") return value;
  return value.replace(/<[^>]*>/g, "");
}

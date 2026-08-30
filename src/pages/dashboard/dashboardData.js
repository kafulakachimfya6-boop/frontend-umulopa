export const stockData = [
  { group: "A+", units: 80 },
  { group: "A-", units: 45 },
  { group: "B+", units: 68 },
  { group: "B-", units: 30 },
  { group: "AB+", units: 24 },
  { group: "AB-", units: 18 },
  { group: "O+", units: 92 },
  { group: "O-", units: 40 },
];

export const pieData = [
  { name: "A+", value: 12 },
  { name: "O-", value: 8 },
  { name: "B+", value: 6 },
  { name: "AB+", value: 8 },
];

export const pieColors = ["#A31621", "#6B0F1A", "#D9534F", "#F8BBD0"];

export const alerts = [
  { type: "AB-", remaining: 18, severity: "Low" },
  { type: "AB+", remaining: 24, severity: "Low" },
  { type: "B-", remaining: 30, severity: "Low" },
  { type: "O-", remaining: 40, severity: "Moderate" },
];

export const requestRows = [
  { id: 1, patient: "Chileshe Mulenga", bloodType: "A+", units: 2, date: "30 May 2026", status: "Pending" },
  { id: 2, patient: "Daniel Phiri", bloodType: "O-", units: 1, date: "30 May 2026", status: "Approved" },
  { id: 3, patient: "Grace Banda", bloodType: "B+", units: 2, date: "29 May 2026", status: "Pending" },
  { id: 4, patient: "Jacob Mwanza", bloodType: "AB+", units: 1, date: "29 May 2026", status: "Approved" },
];

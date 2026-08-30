export const patients = [
  { id: 1, name: "Amina Mwansa", age: 29, gender: "Female", bloodType: "A+", contact: "+260 97 123 4567" },
  { id: 2, name: "Joseph Banda", age: 42, gender: "Male", bloodType: "O-", contact: "+260 97 987 6543" },
];

export const donors = [
  { id: 1, name: "Grace Phiri", bloodType: "A+" },
  { id: 2, name: "Tina Chanda", bloodType: "O-" },
  { id: 3, name: "Moses Kamanga", bloodType: "B+" },
];

export const bloodRequests = [
  { id: 1, patient: "Amina Mwansa", bloodType: "A+", units: 2, urgency: "High", status: "Pending" },
  { id: 2, patient: "Joseph Banda", bloodType: "O-", units: 1, urgency: "Medium", status: "Approved" },
];

export const historyData = [
  { id: 1, patient: "Amina Mwansa", bloodType: "A+", units: 2, date: "2026-07-28", status: "Delivered" },
  { id: 2, patient: "Joseph Banda", bloodType: "O-", units: 1, date: "2026-07-26", status: "Canceled" },
  { id: 3, patient: "Mary Chanda", bloodType: "B+", units: 3, date: "2026-07-24", status: "Delivered" },
];

export const transfusions = [
  { id: 1, patient: "Esther Kunda", bloodType: "AB+", units: 2, date: "2026-07-20", outcome: "Successful" },
  { id: 2, patient: "Patrick Mwale", bloodType: "O+", units: 1, date: "2026-07-18", outcome: "Successful" },
  { id: 3, patient: "Nancy Phiri", bloodType: "A-", units: 2, date: "2026-07-15", outcome: "Follow-up" },
];

export const weeklyActivity = [
  { metric: "New Patients", value: 24 },
  { metric: "Blood Requests", value: 18 },
  { metric: "Transfusions", value: 13 },
  { metric: "Donations", value: 9 },
];

export const weeklyReportRows = [
  { id: 1, category: "A+ Units Received", value: "34" },
  { id: 2, category: "O- Units Used", value: "18" },
  { id: 3, category: "Pending Requests", value: "10" },
  { id: 4, category: "Completed Transfusions", value: "13" },
];

export const usageMetrics = [
  { metric: "A+ Units Used", value: 21 },
  { metric: "O- Units Used", value: 14 },
  { metric: "B+ Units Used", value: 11 },
];

export const usageRows = [
  { id: 1, type: "A+", used: 21, available: 11 },
  { id: 2, type: "O-", used: 14, available: 6 },
  { id: 3, type: "B+", used: 11, available: 9 },
  { id: 4, type: "AB+", used: 5, available: 4 },
];

export const initialStock = [
  { id: 1, type: "A+", quantity: 8, threshold: 10 },
  { id: 2, type: "O-", quantity: 4, threshold: 8 },
  { id: 3, type: "B+", quantity: 12, threshold: 10 },
  { id: 4, type: "AB-", quantity: 3, threshold: 6 },
];

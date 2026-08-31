export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const number = (value) => Number.isFinite(Number(value)) ? Number(value) : 0;

export function uniqueRecords(records = []) {
  if (!Array.isArray(records)) return [];
  const seen = new Set();
  return records.filter((record, index) => {
    if (record === null || record === undefined) return false;
    if (typeof record !== "object") {
      const primitiveKey = `${typeof record}:${String(record)}`;
      if (seen.has(primitiveKey)) return false;
      seen.add(primitiveKey);
      return true;
    }
    const stable = { ...record };
    delete stable.id;
    delete stable.createdAt;
    delete stable.updatedAt;
    delete stable.registeredAt;
    delete stable.respondedAt;
    delete stable.reviewedAt;
    delete stable.escalatedAt;
    const fingerprint = JSON.stringify(stable);
    const key = record.id != null ? `id:${record.id}` : `content:${fingerprint || index}`;
    if (seen.has(key) || seen.has(`content:${fingerprint}`)) return false;
    seen.add(key);
    seen.add(`content:${fingerprint}`);
    return true;
  });
}

export function stockTotals(stock = []) {
  const unique = uniqueRecords(stock);
  const totalUnits = unique.reduce((sum, item) => sum + number(item.quantity ?? item.units), 0);
  const lowStock = unique.filter((item) => number(item.quantity ?? item.units) <= number(item.threshold)).length;
  const byGroup = BLOOD_GROUPS.map((group) => ({
    name: group,
    value: unique.filter((item) => item.type === group).reduce((sum, item) => sum + number(item.quantity ?? item.units), 0),
  })).filter((item) => item.value > 0);
  return { unique, totalUnits, lowStock, byGroup };
}

export function requestTotals(requests = []) {
  const unique = uniqueRecords(requests);
  return {
    unique,
    total: unique.length,
    pending: unique.filter((r) => ["Pending", "Escalated"].includes(r.status)).length,
    approved: unique.filter((r) => r.status === "Approved").length,
    completed: unique.filter((r) => ["Delivered", "Completed", "Fulfilled"].includes(r.status)).length,
    critical: unique.filter((r) => ["High", "Critical", "Emergency"].includes(r.urgency) && !["Completed", "Delivered", "Fulfilled", "Cancelled"].includes(r.status)).length,
    unitsRequested: unique.reduce((sum, r) => sum + number(r.units), 0),
  };
}

export function patientTotals(patients = []) {
  const unique = uniqueRecords(patients);
  const male = unique.filter((p) => p.gender === "Male").length;
  const female = unique.filter((p) => p.gender === "Female").length;
  const other = unique.length - male - female;
  return { unique, total: unique.length, male, female, other };
}

export function operationalSummary({ patients = [], bloodRequests = [], transfusions = [], donors = [], stock = [], hospitals = [], transfers = [] } = {}) {
  const p = patientTotals(patients);
  const r = requestTotals(bloodRequests);
  const s = stockTotals(stock);
  return {
    patients: p,
    requests: r,
    transfusions: uniqueRecords(transfusions),
    donors: uniqueRecords(donors),
    stock: s,
    hospitals: uniqueRecords(hospitals),
    transfers: uniqueRecords(transfers),
    totalTransfusions: uniqueRecords(transfusions).length,
    activeTransfers: uniqueRecords(transfers).filter((t) => !["Completed", "Cancelled"].includes(t.status)).length,
  };
}

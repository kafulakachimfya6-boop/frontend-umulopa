export const DONATION_INTERVAL_DAYS = 56;

const COMPLETED_STATUSES = new Set(["completed", "verified"]);

function normalizeStatus(status) {
  return String(status ?? "").trim().toLowerCase();
}

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getActualDonations(donations = []) {
  if (!Array.isArray(donations)) return [];
  return donations
    .filter((d) => d?.date && COMPLETED_STATUSES.has(normalizeStatus(d.status)))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function getDonorEligibility(donations = [], today = new Date()) {
  const verified = getActualDonations(donations);
  const lastDonation = verified[0] || null;
  if (!lastDonation) return { eligible: true, lastDonation: null, nextEligibleDate: null, label: "Eligible to request screening" };
  const next = new Date(`${lastDonation.date}T00:00:00`);
  next.setDate(next.getDate() + DONATION_INTERVAL_DAYS);
  const todayDate = new Date(today);
  todayDate.setHours(0, 0, 0, 0);
  const eligible = todayDate >= next;
  return { eligible, lastDonation, nextEligibleDate: formatLocalDate(next), label: eligible ? "Eligible for screening" : "Not yet eligible" };
}

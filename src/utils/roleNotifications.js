import { normaliseRole, ROLES } from "./roles";
import { getDonorEligibility } from "./donorEligibility";
import { uniqueRecords } from "./analytics";

const URGENT = ["High", "Critical", "Emergency"];
const CLOSED = ["Completed", "Delivered", "Fulfilled", "Cancelled", "Rejected"];
const isOpenUrgent = (r) => URGENT.includes(r?.urgency) && !CLOSED.includes(r?.status);

export function getScopedOperationalData({ user, bloodRequests = [], inventoryLots = [], donorAppointments = [], donorDonations = [], donorEmergencyRequests = [] } = {}) {
  const role = normaliseRole(user?.role);
  if (role !== ROLES.HOSPITAL_STAFF) return { bloodRequests, inventoryLots, donorAppointments, donorDonations, donorEmergencyRequests };
  const hospitalId = user?.hospitalId;
  return {
    bloodRequests: bloodRequests.filter((r) => String(r.hospitalId ?? r.requestingHospitalId ?? "") === String(hospitalId ?? "")),
    inventoryLots: inventoryLots.filter((l) => String(l.facilityId || "") === `HOSP-${hospitalId}`),
    donorAppointments,
    donorDonations,
    donorEmergencyRequests,
  };
}

export function getRoleNotifications({ user, donors = [], bloodRequests = [], inventoryLots = [], hospitals = [], donorAppointments = [], donorDonations = [], donorEmergencyRequests = [] } = {}) {
  const role = normaliseRole(user?.role);
  const today = new Date().toISOString().slice(0, 10);
  const list = [];

  if (role === ROLES.DONOR) {
    const donorId = user?.donorId;
    const donor = donors.find((d) => d.id === donorId || d.email?.toLowerCase() === user?.email?.toLowerCase());
    const bloodType = donor?.bloodType || user?.bloodType;
    const appointments = donorAppointments.filter((a) => a.donorId === donorId && ["Pending", "Confirmed"].includes(a.status));
    const emergency = [
      ...bloodRequests.filter((r) => isOpenUrgent(r) && (!bloodType || r.bloodType === bloodType)),
      ...donorEmergencyRequests.filter((r) => r.status === "Open" && (!bloodType || !r.bloodType || r.bloodType === bloodType)),
    ];
    const eligibility = getDonorEligibility(donorDonations.filter((d) => d.donorId === donorId));
    if (emergency.length) list.push(`${emergency.length} urgent ${bloodType || "blood"} donation request${emergency.length === 1 ? "" : "s"} match your donor profile.`);
    if (appointments.length) list.push(`You have ${appointments.length} upcoming donation appointment${appointments.length === 1 ? "" : "s"}.`);
    if (!eligibility.eligible) list.push(`Donation eligibility is currently unavailable until ${eligibility.nextEligibleDate}.`);
    if (!list.length) list.push("No donor actions require your attention right now.");
    return list;
  }

  if (role === ROLES.HOSPITAL_STAFF) {
    const scoped = getScopedOperationalData({ user, bloodRequests, inventoryLots });
    const urgent = scoped.bloodRequests.filter(isOpenUrgent);
    const expiring = scoped.inventoryLots.filter((l) => l.status === "Available" && Number(l.remaining || 0) > 0 && l.expiryDate && l.expiryDate <= today);
    const escalated = scoped.bloodRequests.filter((r) => r.status === "Escalated" || r.escalationStatus === "Escalated");
    if (urgent.length) list.push(`${urgent.length} urgent blood request${urgent.length === 1 ? "" : "s"} require${urgent.length === 1 ? "s" : ""} review at your hospital.`);
    if (escalated.length) list.push(`${escalated.length} request${escalated.length === 1 ? " has" : "s have"} been escalated for ZNBTS action.`);
    if (expiring.length) list.push(`${expiring.length} hospital blood lot${expiring.length === 1 ? " is" : "s are"} at or past its expiry date.`);
    if (!list.length) list.push("No hospital operational alerts require your attention right now.");
    return list;
  }

  if (role === ROLES.REGIONAL_CENTRE) {
    const urgent = bloodRequests.filter(isOpenUrgent);
    const pendingHospitals = hospitals.filter((h) => h.status === "Pending");
    const expiring = inventoryLots.filter((l) => l.status === "Available" && Number(l.remaining || 0) > 0 && l.expiryDate && l.expiryDate <= today);
    if (urgent.length) list.push(`${urgent.length} urgent request${urgent.length === 1 ? " is" : "s are"} awaiting regional coordination.`);
    if (pendingHospitals.length) list.push(`${pendingHospitals.length} hospital registration${pendingHospitals.length === 1 ? " is" : "s are"} pending administrative review.`);
    if (expiring.length) list.push(`${expiring.length} blood lot${expiring.length === 1 ? " is" : "s are"} due for expiry review.`);
    if (!list.length) list.push("Regional operations are clear; no immediate action is pending.");
    return list;
  }

  const urgent = bloodRequests.filter(isOpenUrgent);
  const pendingHospitals = hospitals.filter((h) => h.status === "Pending");
  const expiring = inventoryLots.filter((l) => l.status === "Available" && Number(l.remaining || 0) > 0 && l.expiryDate && l.expiryDate <= today);
  if (pendingHospitals.length) list.push(`${pendingHospitals.length} hospital registration${pendingHospitals.length === 1 ? " is" : "s are"} awaiting approval.`);
  if (urgent.length) list.push(`${urgent.length} urgent blood request${urgent.length === 1 ? " is" : "s are"} active across the network.`);
  if (expiring.length) list.push(`${expiring.length} blood lot${expiring.length === 1 ? " has" : "s have"} reached its expiry review date.`);
  if (!list.length) list.push("Platform operations are healthy; no administrative alerts require attention.");
  return list;
}

export function getRoleMessages({ user, donors = [], auditLogs = [], bloodRequests = [], hospitals = [], donorAppointments = [], donorDonations = [] } = {}) {
  const role = normaliseRole(user?.role);
  const messages = [];
  const donorProfile = donors.find((d) => d.id === user?.donorId || d.email?.toLowerCase() === user?.email?.toLowerCase());
  const donorBloodType = donorProfile?.bloodType || user?.bloodType;

  // An audit log is "targeted" at the current user if it carries an explicit
  // hospitalId/donorId that matches them, regardless of whether it also has a
  // `role` field. Only fall back to role-matching for logs that don't carry
  // an entity id at all (e.g. platform-wide admin events). Requiring
  // `log.role` up front was rejecting perfectly-targeted logs that only ever
  // set `hospitalId`/`donorId`.
  const targeted = auditLogs.filter((log) => {
    if (role === ROLES.HOSPITAL_STAFF && log?.hospitalId != null) {
      return String(log.hospitalId) === String(user?.hospitalId);
    }
    if (role === ROLES.DONOR && log?.donorId != null) {
      return String(log.donorId) === String(user?.donorId);
    }
    return !!log?.role && normaliseRole(log.role) === role;
  });
  targeted.slice(0, 4).forEach((log) => messages.push(`${log.event}: ${log.detail || log.time}`));

  if (role === ROLES.DONOR) {
    const mineAppointments = donorAppointments.filter((a) => a.donorId === user?.donorId);
    const mineDonations = donorDonations.filter((d) => d.donorId === user?.donorId);
    if (mineAppointments.some((a) => a.status === "Confirmed")) messages.push("A donation appointment has been confirmed.");
    if (mineDonations.length) messages.push(`${uniqueRecords(mineDonations).length} donation record${mineDonations.length === 1 ? "" : "s"} are available in your history.`);
    if (bloodRequests.some((r) => isOpenUrgent(r) && (!donorBloodType || r.bloodType === donorBloodType))) messages.push("An urgent blood requirement matches your registered blood group.");
  } else if (role === ROLES.HOSPITAL_STAFF) {
    const ownRequests = bloodRequests.filter((r) => String(r.hospitalId ?? r.requestingHospitalId ?? "") === String(user?.hospitalId ?? ""));
    if (ownRequests.some((r) => r.status === "Approved")) messages.push("An approved blood request is ready for the next hospital workflow step.");
    if (ownRequests.some((r) => r.status === "Delivered" || r.status === "Completed")) messages.push("A hospital blood request has reached a completed delivery state.");
  } else if (role === ROLES.REGIONAL_CENTRE) {
    if (bloodRequests.some(isOpenUrgent)) messages.push("Regional emergency queue contains requests requiring coordination.");
    if (hospitals.some((h) => h.status === "Pending")) messages.push("A hospital registration is waiting for regional awareness/administrative processing.");
  } else {
    if (hospitals.some((h) => h.status === "Pending")) messages.push("A new hospital registration requires administrator review.");
    if (auditLogs.some((l) => l.event === "Hospital approved")) messages.push("Hospital network administration activity is available in the audit trail.");
  }

  if (!messages.length) messages.push(role === ROLES.DONOR ? "No new donor messages." : role === ROLES.HOSPITAL_STAFF ? "No new hospital messages." : role === ROLES.REGIONAL_CENTRE ? "No new regional coordination messages." : "No new administrative messages.");
  return [...new Set(messages)].slice(0, 6);
}
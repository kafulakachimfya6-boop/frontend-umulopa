export const HOSPITAL_CAPABILITIES = Object.freeze({
  COLLECTION: "collection",
  TESTING: "testing",
  STORAGE: "storage",
  PROCESSING: "processing",
  CROSSMATCHING: "crossmatching",
  ISSUE: "issue",
});
export const CAPABILITY_LABELS = Object.freeze({
  collection: "Blood collection",
  testing: "Blood testing / screening",
  storage: "Blood storage",
  processing: "Component processing",
  crossmatching: "Crossmatching",
  issue: "Blood issue / release",
});
export const defaultCapabilities = () => Object.fromEntries(Object.values(HOSPITAL_CAPABILITIES).map((key) => [key, false]));
export function getHospitalCapabilities(hospital) { return { ...defaultCapabilities(), ...(hospital?.bloodServiceCapabilities || {}) }; }
export function hasCapability(hospital, capability) { return Boolean(getHospitalCapabilities(hospital)[capability]); }
export function capabilitySummary(hospital) { const capabilities=getHospitalCapabilities(hospital); return Object.entries(capabilities).filter(([,granted])=>granted).map(([key])=>CAPABILITY_LABELS[key]); }

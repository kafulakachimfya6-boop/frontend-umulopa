export function isHospitalUser(user) {
  return user?.role === "staff";
}

export function hasHospitalScope(user) {
  return !isHospitalUser(user) || user?.hospitalId !== null && user?.hospitalId !== undefined && user?.hospitalId !== "";
}

export function sameHospital(record, user) {
  if (!isHospitalUser(user)) return true;
  if (!hasHospitalScope(user)) return false;
  return String(record?.hospitalId ?? "") === String(user.hospitalId);
}

export function scopeToHospital(records = [], user) {
  return records.filter((record) => sameHospital(record, user));
}

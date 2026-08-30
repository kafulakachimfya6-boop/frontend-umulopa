// UMULOPA Safe Transfer — deterministic frontend test dataset.
// All identities below are fictional test records for local QA only.

export const DEMO_PASSWORD = "ZNBTS@2026!";
export const DEMO_PASSWORD_HASH = "f5aef09322ac9005b79523c575ebb5bb3e572a58314b767a4ac6325ac800877e";
export const DEMO_SEED_VERSION = "2026-08-27.02";

export const demoHospitals = [
  { id: 1, name: "Ndola Teaching Hospital", type: "Teaching Hospital", province: "Copperbelt", district: "Ndola", address: "Kansenshi, Ndola", nearbyHospitalIds: [2,3,7], bloodServiceCapabilities: { collection: true, testing: true, storage: true, processing: true, crossmatching: true, issue: true }, phone: "+260 212 610001", email: "info.ndola@demo.zm", status: "Active", units: 64, registeredAt: "2026-07-03T08:00:00Z" },
  { id: 2, name: "Kitwe Teaching Hospital", type: "Teaching Hospital", province: "Copperbelt", district: "Kitwe", address: "Parklands, Kitwe", nearbyHospitalIds: [1,3,4,6], bloodServiceCapabilities: { collection: true, testing: true, storage: true, processing: true, crossmatching: true, issue: true }, phone: "+260 212 221001", email: "info.kitwe@demo.zm", status: "Active", units: 51, registeredAt: "2026-07-04T08:30:00Z" },
  { id: 3, name: "Mufulira District Hospital", type: "District Hospital", province: "Copperbelt", district: "Mufulira", address: "Mufulira Central", nearbyHospitalIds: [2,1], bloodServiceCapabilities: { collection: true, testing: false, storage: true, processing: false, crossmatching: false, issue: true }, phone: "+260 212 451001", email: "info.mufulira@demo.zm", status: "Active", units: 35, registeredAt: "2026-07-05T09:00:00Z" },
  { id: 4, name: "Chingola District Hospital", type: "District Hospital", province: "Copperbelt", district: "Chingola", address: "Nchanga, Chingola", nearbyHospitalIds: [6,2], bloodServiceCapabilities: { collection: true, testing: false, storage: true, processing: false, crossmatching: false, issue: true }, phone: "+260 212 311001", email: "info.chingola@demo.zm", status: "Active", units: 42, registeredAt: "2026-07-06T09:30:00Z" },
  { id: 5, name: "Luanshya District Hospital", type: "District Hospital", province: "Copperbelt", district: "Luanshya", address: "Roan Township, Luanshya", nearbyHospitalIds: [1,2], bloodServiceCapabilities: { collection: true, testing: false, storage: true, processing: false, crossmatching: false, issue: true }, phone: "+260 212 511001", email: "info.luanshya@demo.zm", status: "Active", units: 27, registeredAt: "2026-07-07T10:00:00Z" },
  { id: 6, name: "Chililabombwe District Hospital", type: "District Hospital", province: "Copperbelt", district: "Chililabombwe", address: "Town Centre, Chililabombwe", nearbyHospitalIds: [4,2], bloodServiceCapabilities: { collection: false, testing: false, storage: true, processing: false, crossmatching: false, issue: true }, phone: "+260 212 331001", email: "info.chililabombwe@demo.zm", status: "Active", units: 19, registeredAt: "2026-07-08T10:30:00Z" },
  { id: 7, name: "Copperbelt Mission Hospital", type: "Mission Hospital", province: "Copperbelt", district: "Ndola", address: "Kawama Road, Ndola", nearbyHospitalIds: [1,9,5], bloodServiceCapabilities: { collection: true, testing: false, storage: true, processing: false, crossmatching: false, issue: true }, phone: "+260 212 701001", email: "info.mission@demo.zm", status: "Active", units: 23, registeredAt: "2026-07-09T11:00:00Z" },
  { id: 8, name: "Kafue Riverside Hospital", type: "General Hospital", province: "Copperbelt", district: "Kitwe", address: "Riverside, Kitwe", phone: "+260 212 281001", email: "info.riverside@demo.zm", status: "Pending", bloodServiceCapabilities: { collection: false, testing: false, storage: false, processing: false, crossmatching: false, issue: false }, units: 0, registeredAt: "2026-08-25T14:20:00Z" },
  { id: 9, name: "Arthur Davison Children's Hospital", type: "Specialized Children's Hospital", province: "Copperbelt", district: "Ndola", address: "Ndola, Copperbelt Province", nearbyHospitalIds: [1,7,2], bloodServiceCapabilities: { collection: true, testing: false, storage: true, processing: false, crossmatching: false, issue: true }, phone: "+260 212 610000", email: "info.adch@demo.zm", status: "Active", units: 18, registeredAt: "2026-07-10T08:00:00Z" },
];

const staff = (id, name, email, subRole, hospitalId, hospitalName) => ({
  id, name, email, employeeNumber: `TEST-${String(id).padStart(3, "0")}`, role: "staff", subRole,
  hospitalId, hospitalName, hospital: hospitalName, status: "Active", passwordSet: true,
  passwordHash: DEMO_PASSWORD_HASH, createdAt: "2026-08-01T08:00:00Z"
});

export const demoAdminUsers = [
  { id: 100, name: "ZNBTS System Administrator", email: "admin@znbts.co.zm", role: "admin", hospital: "Zambia National Blood Transfusion Service", status: "Active", passwordHash: DEMO_PASSWORD_HASH },
  { id: 101, name: "Mwansa Tembo", email: "mwansa@centre.zm", role: "regional", subRole: "Regional Blood Centre Officer", hospital: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", status: "Active", passwordHash: DEMO_PASSWORD_HASH },
  staff(102, "Chola Banda", "chola@ndola.org", "Medical Officer", 1, "Ndola Teaching Hospital"),
  staff(103, "Mary Phiri", "mary.phiri@ndola.org", "Hospital Administrator", 1, "Ndola Teaching Hospital"),
  staff(104, "Peter Mwansa", "peter.mwansa@ndola.org", "Blood Bank Officer", 1, "Ndola Teaching Hospital"),
  staff(105, "Ruth Chanda", "ruth.chanda@ndola.org", "Nurse", 1, "Ndola Teaching Hospital"),
  staff(106, "David Mulenga", "david.mulenga@ndola.org", "Records Officer", 1, "Ndola Teaching Hospital"),
  staff(107, "Agnes Kunda", "agnes.kunda@kitwe.org", "Hospital Manager", 2, "Kitwe Teaching Hospital"),
  staff(108, "Brian Zulu", "brian.zulu@kitwe.org", "Blood Bank Officer", 2, "Kitwe Teaching Hospital"),
  staff(109, "Lydia Bwalya", "lydia.bwalya@mufulira.org", "Nurse", 3, "Mufulira District Hospital"),
  staff(110, "Naomi Chanda", "naomi.chanda@chingola.org", "Hospital Administrator", 4, "Chingola District Hospital"),
  staff(111, "Thomas Mwila", "thomas.mwila@luanshya.org", "Blood Bank Officer", 5, "Luanshya District Hospital"),
  staff(112, "Esther Mulenga", "esther.mulenga@chililabombwe.org", "Hospital Administrator", 6, "Chililabombwe District Hospital"),
  staff(113, "Kelvin Bwalya", "kelvin.bwalya@mission.org", "Hospital Manager", 7, "Copperbelt Mission Hospital"),
  staff(114, "Dr. Alice Musonda", "alice.musonda@adch.test.zm", "Medical Officer", 9, "Arthur Davison Children's Hospital"),
  staff(115, "Daniel Chisenga", "daniel.chisenga@adch.test.zm", "Blood Bank Officer", 9, "Arthur Davison Children's Hospital"),
  staff(116, "Martha Kabaso", "martha.kabaso@adch.test.zm", "Hospital Administrator", 9, "Arthur Davison Children's Hospital"),
];

export const demoHospitalAccounts = demoAdminUsers.filter(a => a.role === "staff").map(a => ({
  id: `HA-${a.hospitalId}-${a.id}`, hospitalId: a.hospitalId, hospitalName: a.hospitalName, adminName: a.name,
  email: a.email, role: "staff", subRole: a.subRole, passwordHash: a.passwordHash, passwordSet: true,
  status: a.status, createdAt: a.createdAt || "2026-08-01T08:00:00Z"
}));

export const demoStaffAccounts = demoAdminUsers.filter(a => a.role === "staff");

export const demoPatients = [
  { id: "P-001", name: "Amina Mwansa", age: 29, gender: "Female", bloodType: "A+", contact: "+260 97 100 1001", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", diagnosis: "Postpartum haemorrhage", status: "Active" },
  { id: "P-002", name: "Joseph Banda", age: 42, gender: "Male", bloodType: "O-", contact: "+260 97 100 1002", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", diagnosis: "Road traffic injury", status: "Active" },
  { id: "P-003", name: "Mary Chanda", age: 36, gender: "Female", bloodType: "B+", contact: "+260 97 100 1003", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", diagnosis: "Severe anaemia", status: "Active" },
  { id: "P-004", name: "Esther Kunda", age: 51, gender: "Female", bloodType: "AB+", contact: "+260 97 100 1004", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", diagnosis: "Surgical blood loss", status: "Active" },
  { id: "P-005", name: "Patrick Mwale", age: 24, gender: "Male", bloodType: "O+", contact: "+260 97 100 1005", hospitalId: 3, hospitalName: "Mufulira District Hospital", diagnosis: "Trauma", status: "Active" },
  { id: "P-006", name: "Nancy Phiri", age: 31, gender: "Female", bloodType: "A-", contact: "+260 97 100 1006", hospitalId: 4, hospitalName: "Chingola District Hospital", diagnosis: "Obstetric emergency", status: "Active" },
  { id: "P-007", name: "Felix Mulenga", age: 67, gender: "Male", bloodType: "B-", contact: "+260 97 100 1007", hospitalId: 5, hospitalName: "Luanshya District Hospital", diagnosis: "Gastrointestinal bleed", status: "Active" },
  { id: "P-008", name: "Chipo Sakala", age: 19, gender: "Female", bloodType: "O+", contact: "+260 97 100 1008", hospitalId: 6, hospitalName: "Chililabombwe District Hospital", diagnosis: "Severe anaemia", status: "Active" },
  { id: "P-009", name: "Kelvin Tembo", age: 45, gender: "Male", bloodType: "AB-", contact: "+260 97 100 1009", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", diagnosis: "Emergency surgery", status: "Active" },
  { id: "P-010", name: "Martha Zulu", age: 28, gender: "Female", bloodType: "A+", contact: "+260 97 100 1010", hospitalId: 7, hospitalName: "Copperbelt Mission Hospital", diagnosis: "Obstetric haemorrhage", status: "Active" },
  { id: "P-011", name: "Simon Bwalya", age: 58, gender: "Male", bloodType: "O+", contact: "+260 97 100 1011", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", diagnosis: "Chronic anaemia", status: "Active" },
  { id: "P-012", name: "Grace Chileshe", age: 40, gender: "Female", bloodType: "A+", contact: "+260 97 100 1012", hospitalId: 3, hospitalName: "Mufulira District Hospital", diagnosis: "Operative blood loss", status: "Active" },
  { id: "P-013", name: "Chanda Mulenga", age: 8, gender: "Female", bloodType: "O+", contact: "+260 97 100 1013", hospitalId: 9, hospitalName: "Arthur Davison Children's Hospital", diagnosis: "Severe anaemia", status: "Active" },
  { id: "P-014", name: "Brian Kunda", age: 12, gender: "Male", bloodType: "A+", contact: "+260 97 100 1014", hospitalId: 9, hospitalName: "Arthur Davison Children's Hospital", diagnosis: "Paediatric surgical blood loss", status: "Active" },
  { id: "P-015", name: "Natasha Bwalya", age: 5, gender: "Female", bloodType: "B+", contact: "+260 97 100 1015", hospitalId: 9, hospitalName: "Arthur Davison Children's Hospital", diagnosis: "Thrombocytopenia", status: "Active" },
];

export const demoDonors = [
  { id: "DON-001", name: "Grace Phiri", firstName: "Grace", lastName: "Phiri", gender: "Female", dateOfBirth: "1996-03-14", bloodType: "A+", phone: "+260 97 200 1001", email: "grace.phiri@test.zm", address: "Ndola", nearestHospitalId: 1, status: "Active", verified: true, registeredAt: "2026-06-02T08:00:00Z" },
  { id: "DON-002", name: "Tina Chanda", firstName: "Tina", lastName: "Chanda", gender: "Female", dateOfBirth: "1992-11-22", bloodType: "O-", phone: "+260 97 200 1002", email: "tina.chanda@test.zm", address: "Kitwe", nearestHospitalId: 2, status: "Active", verified: true, registeredAt: "2026-06-05T09:00:00Z" },
  { id: "DON-003", name: "Moses Kamanga", firstName: "Moses", lastName: "Kamanga", gender: "Male", dateOfBirth: "1989-07-08", bloodType: "B+", phone: "+260 97 200 1003", email: "moses.kamanga@test.zm", address: "Mufulira", nearestHospitalId: 3, status: "Active", verified: true, registeredAt: "2026-06-10T09:00:00Z" },
  { id: "DON-004", name: "Lillian Mwila", firstName: "Lillian", lastName: "Mwila", gender: "Female", dateOfBirth: "1998-01-17", bloodType: "O+", phone: "+260 97 200 1004", email: "lillian.mwila@test.zm", address: "Chingola", nearestHospitalId: 4, status: "Active", verified: true, registeredAt: "2026-06-12T10:00:00Z" },
  { id: "DON-005", name: "Andrew Zulu", firstName: "Andrew", lastName: "Zulu", gender: "Male", dateOfBirth: "1987-05-30", bloodType: "A-", phone: "+260 97 200 1005", email: "andrew.zulu@test.zm", address: "Luanshya", nearestHospitalId: 5, status: "Active", verified: true, registeredAt: "2026-06-15T11:00:00Z" },
  { id: "DON-006", name: "Ruth Phiri", firstName: "Ruth", lastName: "Phiri", gender: "Female", dateOfBirth: "1995-09-19", bloodType: "AB+", phone: "+260 97 200 1006", email: "ruth.phiri@mail.com", address: "Ndola", nearestHospitalId: 1, status: "Active", verified: true, registeredAt: "2026-06-18T12:00:00Z" },
  { id: "DON-007", name: "Kelvin Chanda", firstName: "Kelvin", lastName: "Chanda", gender: "Male", dateOfBirth: "1991-12-04", bloodType: "O-", phone: "+260 97 200 1007", email: "kelvin.chanda@test.zm", address: "Kitwe", nearestHospitalId: 2, status: "Active", verified: false, registeredAt: "2026-08-01T12:00:00Z" },
  { id: "DON-008", name: "Beatrice Kunda", firstName: "Beatrice", lastName: "Kunda", gender: "Female", dateOfBirth: "1994-06-25", bloodType: "B-", phone: "+260 97 200 1008", email: "beatrice.kunda@test.zm", address: "Chililabombwe", nearestHospitalId: 6, status: "Active", verified: true, registeredAt: "2026-07-20T12:00:00Z" },
];

export const demoDonorAccounts = demoDonors.map((d) => ({ id: `DA-${d.id}`, donorId: d.id, name: d.name, email: d.email, role: "donor", hospital: "—", status: "Active", passwordHash: DEMO_PASSWORD_HASH, createdAt: d.registeredAt }));

export const demoBloodRequests = [
  { id: "REQ-001", patient: "Amina Mwansa", patientId: "P-001", bloodType: "A+", units: 2, urgency: "High", status: "Pending", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", requestedBy: "Dr. Chola Banda", createdAt: "2026-08-25T07:30:00Z" },
  { id: "REQ-002", patient: "Joseph Banda", patientId: "P-002", bloodType: "O-", units: 1, urgency: "Critical", status: "Approved", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", requestedBy: "Dr. Chola Banda", createdAt: "2026-08-25T08:10:00Z" },
  { id: "REQ-003", patient: "Mary Chanda", patientId: "P-003", bloodType: "B+", units: 3, urgency: "Medium", status: "Delivered", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", requestedBy: "Agnes Kunda", createdAt: "2026-08-23T10:00:00Z" },
  { id: "REQ-004", patient: "Esther Kunda", patientId: "P-004", bloodType: "AB+", units: 2, urgency: "High", status: "In Progress", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", requestedBy: "Brian Zulu", createdAt: "2026-08-24T11:20:00Z" },
  { id: "REQ-005", patient: "Patrick Mwale", patientId: "P-005", bloodType: "O+", units: 1, urgency: "Low", status: "Completed", hospitalId: 3, hospitalName: "Mufulira District Hospital", requestedBy: "Lydia Bwalya", createdAt: "2026-08-20T13:00:00Z" },
  { id: "REQ-006", patient: "Nancy Phiri", patientId: "P-006", bloodType: "A-", units: 2, urgency: "Emergency", status: "Pending", hospitalId: 4, hospitalName: "Chingola District Hospital", requestedBy: "Chingola Blood Bank", createdAt: "2026-08-26T05:50:00Z" },
  { id: "REQ-007", patient: "Felix Mulenga", patientId: "P-007", bloodType: "B-", units: 1, urgency: "High", status: "Rejected", hospitalId: 5, hospitalName: "Luanshya District Hospital", requestedBy: "Luanshya Blood Bank", createdAt: "2026-08-21T15:00:00Z", rejectionReason: "Request duplicated; existing approved request found." },
  { id: "REQ-008", patient: "Kelvin Tembo", patientId: "P-009", bloodType: "AB-", units: 1, urgency: "Critical", status: "Pending", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", requestedBy: "Dr. Chola Banda", createdAt: "2026-08-26T06:15:00Z" },
  { id: "REQ-011", patient: "Chanda Mulenga", patientId: "P-013", bloodType: "O+", units: 2, urgency: "High", status: "Approved", hospitalId: 9, hospitalName: "Arthur Davison Children's Hospital", requestedBy: "Dr. Alice Musonda", createdAt: "2026-08-26T07:10:00Z" },
  { id: "REQ-012", patient: "Brian Kunda", patientId: "P-014", bloodType: "A+", units: 1, urgency: "Emergency", status: "Pending", hospitalId: 9, hospitalName: "Arthur Davison Children's Hospital", requestedBy: "Dr. Alice Musonda", createdAt: "2026-08-26T07:25:00Z" },
  { id: "REQ-009", requestType: "NEARBY_HOSPITAL", patient: "Demo Emergency Patient", bloodType: "O+", units: 2, urgency: "Emergency", status: "Pending Nearby", reason: "Emergency theatre shortage", requestingHospitalId: 1, requestingHospitalName: "Ndola Teaching Hospital", sourceHospitalId: 2, sourceHospitalName: "Kitwe Teaching Hospital", requestedBy: "peter.mwansa@ndola.org", createdAt: "2026-08-26T06:30:00Z", escalationStatus: "Nearby First" },
  { id: "REQ-010", requestType: "NEARBY_HOSPITAL", patient: "Demo Trauma Patient", bloodType: "B+", units: 1, urgency: "Critical", status: "Pending Nearby", reason: "Critical trauma stock shortage", requestingHospitalId: 3, requestingHospitalName: "Mufulira District Hospital", sourceHospitalId: 2, sourceHospitalName: "Kitwe Teaching Hospital", requestedBy: "lydia.bwalya@mufulira.org", createdAt: "2026-08-26T06:45:00Z", escalationStatus: "Nearby First" },
];

export const demoHistory = [
  { id: "H-001", patient: "Mary Chanda", bloodType: "B+", units: 3, date: "2026-08-23", status: "Delivered", hospitalName: "Kitwe Teaching Hospital", hospitalId: 2 },
  { id: "H-002", patient: "Patrick Mwale", bloodType: "O+", units: 1, date: "2026-08-20", status: "Delivered", hospitalName: "Mufulira District Hospital", hospitalId: 3 },
  { id: "H-003", patient: "Joseph Banda", bloodType: "O-", units: 1, date: "2026-08-19", status: "Canceled", hospitalName: "Ndola Teaching Hospital", hospitalId: 1 },
  { id: "H-004", patient: "Martha Zulu", bloodType: "A+", units: 2, date: "2026-08-16", status: "Delivered", hospitalName: "Copperbelt Mission Hospital", hospitalId: 7 },
  { id: "H-005", patient: "Chanda Mulenga", bloodType: "O+", units: 2, date: "2026-08-26", status: "Delivered", hospitalName: "Arthur Davison Children's Hospital", hospitalId: 9 },
];

export const demoTransfusions = [
  { id: "TR-001", patient: "Esther Kunda", bloodType: "AB+", units: 2, date: "2026-08-24", outcome: "Successful", hospitalName: "Kitwe Teaching Hospital", hospitalId: 2 },
  { id: "TR-002", patient: "Patrick Mwale", bloodType: "O+", units: 1, date: "2026-08-20", outcome: "Successful", hospitalName: "Mufulira District Hospital", hospitalId: 3 },
  { id: "TR-003", patient: "Nancy Phiri", bloodType: "A-", units: 2, date: "2026-08-18", outcome: "Follow-up", hospitalName: "Chingola District Hospital", hospitalId: 4 },
  { id: "TR-004", patient: "Amina Mwansa", bloodType: "A+", units: 1, date: "2026-08-12", outcome: "Successful", hospitalName: "Ndola Teaching Hospital", hospitalId: 1 },
  { id: "TR-005", patient: "Chanda Mulenga", bloodType: "O+", units: 2, date: "2026-08-26", outcome: "Successful", hospitalName: "Arthur Davison Children's Hospital", hospitalId: 9 },
];

export const demoStock = [
  { id: "S-A+", type: "A+", quantity: 24, threshold: 10 }, { id: "S-A-", type: "A-", quantity: 6, threshold: 5 },
  { id: "S-B+", type: "B+", quantity: 19, threshold: 10 }, { id: "S-B-", type: "B-", quantity: 5, threshold: 5 },
  { id: "S-AB+", type: "AB+", quantity: 8, threshold: 5 }, { id: "S-AB-", type: "AB-", quantity: 3, threshold: 3 },
  { id: "S-O+", type: "O+", quantity: 31, threshold: 10 }, { id: "S-O-", type: "O-", quantity: 7, threshold: 5 },
];

export const demoAppointments = [
  { id: "APT-001", donorId: "DON-001", donor: "Grace Phiri", bloodType: "A+", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", date: "2026-08-28", time: "09:00", status: "Confirmed" },
  { id: "APT-002", donorId: "DON-002", donor: "Tina Chanda", bloodType: "O-", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", date: "2026-08-29", time: "10:30", status: "Pending" },
  { id: "APT-003", donorId: "DON-003", donor: "Moses Kamanga", bloodType: "B+", hospitalId: 3, hospitalName: "Mufulira District Hospital", date: "2026-08-18", time: "11:00", status: "Completed" },
  { id: "APT-004", donorId: "DON-006", donor: "Ruth Phiri", bloodType: "AB+", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", date: "2026-08-12", time: "14:00", status: "Completed" },
];

export const demoDonations = [
  { id: "DONATION-001", donorId: "DON-001", donor: "Grace Phiri", bloodType: "A+", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", date: "2026-06-10", units: 1, status: "Verified", component: "Whole Blood" },
  { id: "DONATION-002", donorId: "DON-001", donor: "Grace Phiri", bloodType: "A+", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", date: "2026-08-01", units: 1, status: "Verified", component: "Whole Blood" },
  { id: "DONATION-003", donorId: "DON-002", donor: "Tina Chanda", bloodType: "O-", hospitalId: 2, hospitalName: "Kitwe Teaching Hospital", date: "2026-07-12", units: 1, status: "Verified", component: "Whole Blood" },
  { id: "DONATION-004", donorId: "DON-003", donor: "Moses Kamanga", bloodType: "B+", hospitalId: 3, hospitalName: "Mufulira District Hospital", date: "2026-08-18", units: 1, status: "Verified", component: "Whole Blood" },
  { id: "DONATION-005", donorId: "DON-006", donor: "Ruth Phiri", bloodType: "AB+", hospitalId: 1, hospitalName: "Ndola Teaching Hospital", date: "2026-08-12", units: 1, status: "Verified", component: "Whole Blood" },
];

export const demoDonorEmergencyRequests = [
  { id: "EM-001", bloodType: "O-", hospitalName: "Ndola Teaching Hospital", unitsRequired: 4, message: "Urgent O- blood required for emergency trauma care.", status: "Open", responses: [], requestId: "REQ-002" },
  { id: "EM-002", bloodType: "A-", hospitalName: "Chingola District Hospital", unitsRequired: 3, message: "Emergency A- blood required for obstetric care.", status: "Open", responses: [], requestId: "REQ-006" },
];

export const demoTransfers = [
  { id: "TRF-001", fromFacilityId: "ZNBTS-CB-KITWE-KTH", fromFacility: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", toFacilityId: "HOSP-1", toFacility: "Ndola Teaching Hospital", bloodGroup: "O-", units: 5, status: "Completed", requestedBy: "Mwansa Tembo", date: "2026-08-24" },
  { id: "TRF-002", fromFacilityId: "HOSP-2", fromFacility: "Kitwe Teaching Hospital", toFacilityId: "ZNBTS-CB-KITWE-KTH", toFacility: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "B+", units: 4, status: "Completed", requestedBy: "Brian Zulu", date: "2026-08-22" },
  { id: "TRF-003", fromFacilityId: "ZNBTS-CB-KITWE-KTH", fromFacility: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", toFacilityId: "HOSP-4", toFacility: "Chingola District Hospital", bloodGroup: "A-", units: 2, status: "In Transit", requestedBy: "Mwansa Tembo", date: "2026-08-26" },
];

export const demoAuditLogs = [
  { id: "AUD-001", event: "System initialised", detail: "UMULOPA Safe Transfer demo environment loaded", time: "26/08/2026, 06:00:00" },
  { id: "AUD-002", event: "Hospital approved", detail: "Kitwe Teaching Hospital approved for Copperbelt network", time: "25/08/2026, 09:30:00" },
  { id: "AUD-003", event: "Blood transfer completed", detail: "5 O- units transferred from ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital) to Ndola Teaching Hospital", time: "24/08/2026, 14:10:00" },
  { id: "AUD-004", event: "Emergency escalation", detail: "A- emergency request escalated by Chingola District Hospital", time: "26/08/2026, 05:55:00" },
  { id: "AUD-005", event: "Donor appointment confirmed", detail: "Grace Phiri appointment confirmed at Ndola Teaching Hospital", time: "25/08/2026, 16:20:00" },
];

export const demoNotifications = [
  "Critical O- blood request pending for Ndola Teaching Hospital.",
  "A- emergency request is open for Chingola District Hospital.",
  "3 blood units across the network are nearing expiry.",
  "Kafue Riverside Hospital registration is awaiting ZNBTS approval.",
  "Nightly Copperbelt inventory reconciliation is available.",
];

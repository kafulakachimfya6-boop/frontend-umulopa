import { useEffect, useMemo, useState } from "react";
import { AppStateContext } from "./AppStateContext";
import {
  DEMO_SEED_VERSION, demoAdminUsers, demoAppointments, demoAuditLogs, demoBloodRequests, demoDonations, demoDonorAccounts, demoDonorEmergencyRequests, demoDonors, demoHospitals, demoHistory, demoNotifications, demoPatients, demoStaffAccounts, demoStock, demoTransfers, demoTransfusions, demoHospitalAccounts,
} from "../data/demoSeedData";
import { clearAuthentication } from "../utils/authStorage";
import { uniqueRecords } from "../utils/analytics";
import { seedNetworkInventory, applyInventoryChange, ZNBTS_FACILITY_ID } from "../utils/networkInventory";


function prepareDemoStorage() {
  try {
    const current = localStorage.getItem("znbts_demoSeedVersion");
    if (current !== DEMO_SEED_VERSION) {
      const prefixes = ["znbts_", "umulopa_"];
      const authKeys = new Set(["znbts_user", "umulopa_user", "isAuthenticated", "userEmail"]);
      Object.keys(localStorage).filter((key) => prefixes.some((prefix) => key.startsWith(prefix)) && !authKeys.has(key)).forEach((key) => localStorage.removeItem(key));
      localStorage.setItem("znbts_demoSeedVersion", DEMO_SEED_VERSION);
    }
  } catch { /* storage is optional */ }
}

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(`znbts_${key}`) || localStorage.getItem(`umulopa_${key}`);
      return stored ? uniqueRecords(JSON.parse(stored)) : uniqueRecords(initialValue);
    } catch {
      return uniqueRecords(initialValue);
    }
  });

  useEffect(() => {
    try { localStorage.setItem(`znbts_${key}`, JSON.stringify(value)); } catch { /* storage is optional */ }
  }, [key, value]);

  useEffect(() => {
    let channel;
    const onStorage = (event) => {
      if (event.key !== `znbts_${key}` && event.key !== `umulopa_${key}`) return;
      if (!event.newValue) return;
      try { setValue(uniqueRecords(JSON.parse(event.newValue))); } catch { /* ignore malformed state */ }
    };
    window.addEventListener("storage", onStorage);
    try {
      if (typeof BroadcastChannel !== "undefined") {
        channel = new BroadcastChannel(`znbts:${key}`);
        channel.onmessage = (event) => {
          if (event.data?.key === key) setValue(uniqueRecords(event.data.value));
        };
      }
    } catch { /* optional */ }
    return () => {
      window.removeEventListener("storage", onStorage);
      channel?.close();
    };
  }, [key]);

  return [value, setValue];
}

export function AppStateProvider({ children }) {
  prepareDemoStorage();
  const [patients, setPatients] = useStoredState("patients", demoPatients);
  const [bloodRequests, setBloodRequests] = useStoredState("bloodRequests", demoBloodRequests);
  const [history, setHistory] = useStoredState("history", demoHistory);
  const [transfusions, setTransfusions] = useStoredState("transfusions", demoTransfusions);
  const [donors, setDonors] = useStoredState("donors", demoDonors);
  const [stock, setStock] = useStoredState("stock", demoStock);
  const [adminUsers, setAdminUsers] = useStoredState("adminUsers", demoAdminUsers);
  useEffect(() => {
    const seedAdmin = demoAdminUsers[0];
    setAdminUsers((current) => current.some((account) => account.email?.toLowerCase() === seedAdmin.email) ? current : [...current, seedAdmin]);
  }, [setAdminUsers]);
  const [hospitals, setHospitals] = useStoredState("hospitals", demoHospitals);
  const [transfers, setTransfers] = useStoredState("transfers", demoTransfers);
  const [networkInventory, setNetworkInventory] = useStoredState("networkInventory", seedNetworkInventory(hospitals));
  useEffect(() => {
    setNetworkInventory((current) => {
      const seeded = seedNetworkInventory(hospitals);
      const byKey = new Map(current.map((row) => [`${row.facilityId}::${row.bloodGroup}`, row]));
      return seeded.map((row) => byKey.get(`${row.facilityId}::${row.bloodGroup}`) || row);
    });
  }, [hospitals.length, setNetworkInventory]);
  const [inventoryLots, setInventoryLots] = useStoredState("inventoryLots", [
    { id: "LOT-001", facilityId: "ZNBTS-CB-KITWE-KTH", facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "O+", quantity: 6, remaining: 6, collectionDate: "2026-08-20", expiryDate: "2026-09-03", status: "Available" },
    { id: "LOT-002", facilityId: "ZNBTS-CB-KITWE-KTH", facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "A+", quantity: 4, remaining: 4, collectionDate: "2026-08-01", expiryDate: "2026-08-26", status: "Available" },
    { id: "LOT-003", facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O-", quantity: 2, remaining: 2, collectionDate: "2026-08-22", expiryDate: "2026-09-05", status: "Available" },
    { id: "LOT-H1-A", facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "A+", quantity: 6, remaining: 6, collectionDate: "2026-08-23", expiryDate: "2026-09-06", status: "Testing" },
    { id: "LOT-H2-B", facilityId: "HOSP-2", facilityName: "Kitwe Teaching Hospital", bloodGroup: "B+", quantity: 5, remaining: 5, collectionDate: "2026-08-21", expiryDate: "2026-09-04", status: "Available" },
    { id: "LOT-H2-O", facilityId: "HOSP-2", facilityName: "Kitwe Teaching Hospital", bloodGroup: "O+", quantity: 7, remaining: 7, collectionDate: "2026-08-19", expiryDate: "2026-09-02", status: "Available" },
    { id: "LOT-H3-O", facilityId: "HOSP-3", facilityName: "Mufulira District Hospital", bloodGroup: "O+", quantity: 4, remaining: 4, collectionDate: "2026-08-20", expiryDate: "2026-09-03", status: "Available" },
    { id: "LOT-H4-A", facilityId: "HOSP-4", facilityName: "Chingola District Hospital", bloodGroup: "A-", quantity: 2, remaining: 2, collectionDate: "2026-08-24", expiryDate: "2026-09-01", status: "Available" },
    { id: "LOT-H5-B", facilityId: "HOSP-5", facilityName: "Luanshya District Hospital", bloodGroup: "B-", quantity: 2, remaining: 2, collectionDate: "2026-08-18", expiryDate: "2026-08-30", status: "Available" },
    { id: "LOT-H6-O", facilityId: "HOSP-6", facilityName: "Chililabombwe District Hospital", bloodGroup: "O+", quantity: 3, remaining: 3, collectionDate: "2026-08-22", expiryDate: "2026-09-07", status: "Available" },
    { id: "LOT-H7-A", facilityId: "HOSP-7", facilityName: "Copperbelt Mission Hospital", bloodGroup: "A+", quantity: 3, remaining: 3, collectionDate: "2026-08-20", expiryDate: "2026-09-05", status: "Available" },
    { id: "LOT-H9-O", facilityId: "HOSP-9", facilityName: "Arthur Davison Children's Hospital", bloodGroup: "O+", quantity: 5, remaining: 5, collectionDate: "2026-08-22", expiryDate: "2026-09-06", status: "Available" },
    { id: "LOT-H9-A", facilityId: "HOSP-9", facilityName: "Arthur Davison Children's Hospital", bloodGroup: "A+", quantity: 3, remaining: 3, collectionDate: "2026-08-24", expiryDate: "2026-09-08", status: "Available" },
    { id: "LOT-H9-B", facilityId: "HOSP-9", facilityName: "Arthur Davison Children's Hospital", bloodGroup: "B+", quantity: 2, remaining: 2, collectionDate: "2026-08-23", expiryDate: "2026-09-07", status: "Available" },
  ]);
  const [inventoryTransactions, setInventoryTransactions] = useStoredState("inventoryTransactions", [
    { id: "TX-001", facilityId: "ZNBTS-CB-KITWE-KTH", facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "O-", quantity: 5, transactionType: "TRANSFER_OUT", referenceId: "TRF-001", performedBy: "Mwansa Tembo", timestamp: "2026-08-24T14:10:00Z" },
    { id: "TX-002", facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O-", quantity: 5, transactionType: "TRANSFER_IN", referenceId: "TRF-001", performedBy: "Mwansa Tembo", timestamp: "2026-08-24T14:10:00Z" },
    { id: "TX-003", facilityId: "HOSP-2", facilityName: "Kitwe Teaching Hospital", bloodGroup: "B+", quantity: 4, transactionType: "TRANSFER_OUT", referenceId: "TRF-002", performedBy: "Brian Zulu", timestamp: "2026-08-22T11:20:00Z" },
    { id: "TX-004", facilityId: "ZNBTS-CB-KITWE-KTH", facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "B+", quantity: 4, transactionType: "TRANSFER_IN", referenceId: "TRF-002", performedBy: "Mwansa Tembo", timestamp: "2026-08-22T11:20:00Z" },
  ]);
  const [auditLogs, setAuditLogs] = useStoredState("auditLogs", demoAuditLogs);
  const [notifications, setNotifications] = useStoredState("notifications", demoNotifications);
  const [hospitalAccounts, setHospitalAccounts] = useStoredState("hospitalAccounts", demoHospitalAccounts);
  const [staffAccounts, setStaffAccounts] = useStoredState("staffAccounts", demoStaffAccounts);
  const [donorAppointments, setDonorAppointments] = useStoredState("donorAppointments", demoAppointments);
  const [donorDonations, setDonorDonations] = useStoredState("donorDonations", demoDonations);
  const [donorEmergencyRequests, setDonorEmergencyRequests] = useStoredState("donorEmergencyRequests", demoDonorEmergencyRequests);
  const [donorAccounts, setDonorAccounts] = useStoredState("donorAccounts", demoDonorAccounts);
  const [newsletterSubscribers, setNewsletterSubscribers] = useStoredState("newsletterSubscribers", []);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const expired = inventoryLots.filter((lot) => lot.status === "Available" && lot.remaining > 0 && lot.expiryDate && lot.expiryDate <= today);
    if (!expired.length) return;
    let rows = networkInventory;
    const tx = [];
    const nextLots = inventoryLots.map((lot) => {
      if (!expired.some((x) => x.id === lot.id)) return lot;
      const qty = Number(lot.remaining) || 0;
      const result = applyInventoryChange(rows, { facilityId: lot.facilityId, facilityName: lot.facilityName, facilityType: lot.facilityId === ZNBTS_FACILITY_ID ? "ZNBTS" : "Hospital", province: "Copperbelt", bloodGroup: lot.bloodGroup, quantity: qty, deltaAvailable: -qty, deltaExpired: qty, transactionType: "EXPIRED", referenceId: lot.id, performedBy: "System expiry reconciliation" });
      rows = result.rows; tx.push(result.transaction);
      return { ...lot, remaining: 0, status: "Expired" };
    });
    setNetworkInventory(rows);
    setInventoryLots(nextLots);
    if (tx.length) setInventoryTransactions((current) => [...tx, ...current]);
  }, [inventoryLots, networkInventory, setNetworkInventory, setInventoryLots, setInventoryTransactions]);

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('znbts_user') || localStorage.getItem('umulopa_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('znbts_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('znbts_user');
    localStorage.removeItem('umulopa_user');
    clearAuthentication();
  };

  useEffect(() => {
    const sync = (event) => {
      if (event.key === "znbts_networkInventory" && event.newValue) { try { setNetworkInventory(uniqueRecords(JSON.parse(event.newValue))); } catch { /* ignore malformed external state */ } }
      if (event.key === "znbts_inventoryTransactions" && event.newValue) { try { setInventoryTransactions(uniqueRecords(JSON.parse(event.newValue))); } catch { /* ignore malformed external state */ } }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [setNetworkInventory, setInventoryTransactions]);

  const value = useMemo(
    () => ({
      patients,
      setPatients,
      bloodRequests,
      setBloodRequests,
      history,
      setHistory,
      transfusions,
      setTransfusions,
      donors,
      setDonors,
      stock,
      setStock,
      adminUsers,
      setAdminUsers,
      hospitals,
      setHospitals,
      transfers,
      setTransfers,
      networkInventory,
      setNetworkInventory,
      inventoryTransactions,
      setInventoryTransactions,
      inventoryLots,
      setInventoryLots,
      auditLogs,
      setAuditLogs,
      notifications,
      setNotifications,
      hospitalAccounts,
      setHospitalAccounts,
      staffAccounts,
      setStaffAccounts,
      donorAppointments,
      setDonorAppointments,
      donorDonations,
      setDonorDonations,
      donorEmergencyRequests,
      setDonorEmergencyRequests,
      donorAccounts,
      setDonorAccounts,
      newsletterSubscribers,
      setNewsletterSubscribers,
      user,
      login,
      logout,
    }),
    [
      patients,
      setPatients,
      bloodRequests,
      setBloodRequests,
      history,
      setHistory,
      transfusions,
      setTransfusions,
      donors,
      setDonors,
      stock,
      setStock,
      adminUsers,
      setAdminUsers,
      hospitals,
      setHospitals,
      transfers,
      setTransfers,
      networkInventory,
      setNetworkInventory,
      inventoryTransactions,
      setInventoryTransactions,
      inventoryLots,
      setInventoryLots,
      auditLogs,
      setAuditLogs,
      notifications,
      setNotifications,
      hospitalAccounts,
      setHospitalAccounts,
      staffAccounts,
      setStaffAccounts,
      donorAppointments,
      setDonorAppointments,
      donorDonations,
      setDonorDonations,
      donorEmergencyRequests,
      setDonorEmergencyRequests,
      donorAccounts,
      setDonorAccounts,
      newsletterSubscribers,
      setNewsletterSubscribers,
      user,
    ]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

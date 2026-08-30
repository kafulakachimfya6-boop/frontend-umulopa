import { describe, expect, it } from "vitest";
import { aggregateByGroup, applyInventoryChange, facilityTotals, seedNetworkInventory, ZNBTS_FACILITY_ID } from "./networkInventory";

describe("UMULOPA Safe Transfer network inventory", () => {
  const hospitals = [
    { id: 1, name: "Ndola Teaching Hospital", province: "Copperbelt", district: "Ndola" },
    { id: 2, name: "Kitwe Teaching Hospital", province: "Copperbelt", district: "Kitwe" },
    { id: 3, name: "Mufulira District Hospital", province: "Copperbelt", district: "Mufulira" },
    { id: 4, name: "Chingola District Hospital", province: "Copperbelt", district: "Chingola" },
  ];
  it("reconciles all eight blood groups", () => expect(aggregateByGroup(seedNetworkInventory(hospitals))).toHaveLength(8));
  it("keeps provincial stock constant during a completed transfer", () => {
    let rows = seedNetworkInventory(hospitals);
    const total = () => facilityTotals(rows).reduce((sum, facility) => sum + facility.available, 0);
    const before = total();
    rows = applyInventoryChange(rows, { facilityId: ZNBTS_FACILITY_ID, facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", facilityType: "ZNBTS", bloodGroup: "O+", deltaAvailable: -3, quantity: 3, transactionType: "TRANSFER_OUT" }).rows;
    rows = applyInventoryChange(rows, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", facilityType: "Hospital", bloodGroup: "O+", deltaAvailable: 3, quantity: 3, transactionType: "TRANSFER_IN" }).rows;
    expect(total()).toBe(before);
  });
  it("rejects negative inventory", () => {
    const rows = seedNetworkInventory(hospitals);
    expect(() => applyInventoryChange(rows, { facilityId: ZNBTS_FACILITY_ID, facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", facilityType: "ZNBTS", bloodGroup: "AB-", deltaAvailable: -999, quantity: 999, transactionType: "ISSUE" })).toThrow();
  });
  it("records hospital collections as testing stock", () => {
    const rows = seedNetworkInventory(hospitals);
    const next = applyInventoryChange(rows, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", facilityType: "Hospital", bloodGroup: "O-", deltaTesting: 5, quantity: 5, transactionType: "DONATION_COLLECTED" }).rows;
    expect(next.find((row) => row.facilityId === "HOSP-1" && row.bloodGroup === "O-").testing).toBe(5);
  });
});

describe("ZNBTS pending-testing inventory flow", () => {
  it("tracks collections awaiting ZNBTS testing separately from usable stock", () => {
    const rows = [{ facilityId: "HOSP-99", facilityName: "Test Hospital", bloodGroup: "O-", available: 2, testing: 0, pendingTesting: 0, reserved: 0, issued: 0, expired: 0, discarded: 0, threshold: 3 }];
    const result = applyInventoryChange(rows, { facilityId: "HOSP-99", facilityName: "Test Hospital", bloodGroup: "O-", quantity: 3, deltaPendingTesting: 3, transactionType: "DONATION_COLLECTED_AWAITING_ZNBTS_TESTING" });
    expect(result.rows.find(r => r.facilityId === "HOSP-99").available).toBe(2);
    expect(result.rows.find(r => r.facilityId === "HOSP-99").pendingTesting).toBe(3);
  });
});

import { describe, expect, it } from "vitest";
import { applyInventoryChange } from "./networkInventory";

const base = [{ facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", facilityType: "Hospital", province: "Copperbelt", district: "Ndola", bloodGroup: "O+", available: 5, testing: 2, reserved: 0, issued: 0, expired: 0, discarded: 0, threshold: 3 }];

describe("hospital blood bank inventory operations", () => {
  it("records collection as testing stock", () => {
    const result = applyInventoryChange(base, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "A+", quantity: 4, deltaTesting: 4, transactionType: "DONATION_COLLECTED" });
    const row = result.rows.find(r => r.bloodGroup === "A+");
    expect(row.testing).toBe(4);
    expect(row.available).toBe(0);
  });

  it("moves tested units to available stock", () => {
    const result = applyInventoryChange(base, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O+", quantity: 2, deltaTesting: -2, deltaAvailable: 2, transactionType: "TESTING_CLEARED" });
    const row = result.rows.find(r => r.bloodGroup === "O+");
    expect(row.testing).toBe(0);
    expect(row.available).toBe(7);
  });

  it("records usage and prevents negative stock", () => {
    const result = applyInventoryChange(base, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O+", quantity: 3, deltaAvailable: -3, deltaIssued: 3, transactionType: "ISSUED" });
    const row = result.rows.find(r => r.bloodGroup === "O+");
    expect(row.available).toBe(2);
    expect(row.issued).toBe(3);
    expect(() => applyInventoryChange(result.rows, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O+", quantity: 3, deltaAvailable: -3, deltaIssued: 3, transactionType: "ISSUED" })).toThrow("Inventory cannot become negative.");
  });

  it("moves expired stock out of available inventory", () => {
    const result = applyInventoryChange(base, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O+", quantity: 2, deltaAvailable: -2, deltaExpired: 2, transactionType: "EXPIRED" });
    const row = result.rows.find(r => r.bloodGroup === "O+");
    expect(row.available).toBe(3);
    expect(row.expired).toBe(2);
  });

  it("supports a hospital-to-hospital transfer as two inventory transactions", () => {
    const source = applyInventoryChange(base, { facilityId: "HOSP-1", facilityName: "Ndola Teaching Hospital", bloodGroup: "O+", quantity: 2, deltaAvailable: -2, deltaIssued: 2, transactionType: "TRANSFER_OUT", referenceId: "NHR-1" });
    const destination = applyInventoryChange(source.rows, { facilityId: "HOSP-2", facilityName: "Kitwe Teaching Hospital", bloodGroup: "O+", quantity: 2, deltaAvailable: 2, transactionType: "TRANSFER_IN", referenceId: "NHR-1" });
    expect(destination.rows.find(r => r.facilityId === "HOSP-1" && r.bloodGroup === "O+").available).toBe(3);
    expect(destination.rows.find(r => r.facilityId === "HOSP-2" && r.bloodGroup === "O+").available).toBe(2);
  });
});

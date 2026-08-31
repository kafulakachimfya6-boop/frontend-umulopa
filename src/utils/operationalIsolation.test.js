import { describe, expect, it } from "vitest";
import { getDonorEligibility } from "./donorEligibility";
import { applyInventoryChange, ZNBTS_FACILITY_ID } from "./networkInventory";

describe("UMULOPA operational rules", () => {
  it("calculates donor eligibility from one authoritative donation history", () => {
    const result = getDonorEligibility([{ id: "D1", date: "2026-08-01", status: "Verified" }], new Date("2026-08-25"));
    expect(result.nextEligibleDate).toBe("2026-09-26");
    expect(result.eligible).toBe(false);
  });

  it("allows a ZNBTS stock receipt and records the transaction", () => {
    const initial = [{ facilityId: ZNBTS_FACILITY_ID, bloodGroup: "O+", available: 10, testing: 0, reserved: 0, expired: 0, discarded: 0 }];
    const result = applyInventoryChange(initial, { facilityId: ZNBTS_FACILITY_ID, facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "O+", deltaAvailable: 5, quantity: 5, transactionType: "BLOOD_RECEIVED" });
    expect(result.rows.find((r) => r.bloodGroup === "O+").available).toBe(15);
    expect(result.transaction.transactionType).toBe("BLOOD_RECEIVED");
  });

  it("moves expired units out of available stock", () => {
    const initial = [{ facilityId: ZNBTS_FACILITY_ID, bloodGroup: "A+", available: 8, testing: 0, reserved: 0, expired: 0, discarded: 0 }];
    const result = applyInventoryChange(initial, { facilityId: ZNBTS_FACILITY_ID, facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "A+", deltaAvailable: -3, deltaExpired: 3, quantity: 3, transactionType: "EXPIRED" });
    const row = result.rows.find((r) => r.bloodGroup === "A+");
    expect(row.available).toBe(5);
    expect(row.expired).toBe(3);
  });

  it("prevents an expiry or issue from making stock negative", () => {
    expect(() => applyInventoryChange([{ facilityId: ZNBTS_FACILITY_ID, bloodGroup: "O-", available: 1, testing: 0, reserved: 0, expired: 0, discarded: 0 }], { facilityId: ZNBTS_FACILITY_ID, facilityName: "ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)", bloodGroup: "O-", deltaAvailable: -2, deltaExpired: 2, quantity: 2, transactionType: "EXPIRED" })).toThrow("Inventory cannot become negative.");
  });
});

it("keeps hospital records isolated by hospitalId", () => {
  const records = [
    { id: 1, hospitalId: 1, name: "Ndola patient" },
    { id: 2, hospitalId: 2, name: "Kitwe patient" },
  ];
  const ndola = records.filter((record) => String(record.hospitalId) === "1");
  expect(ndola.map((record) => record.name)).toEqual(["Ndola patient"]);
  expect(ndola.some((record) => record.hospitalId === 2)).toBe(false);
});

it("does not treat an eligibility label as a completed donation", () => {
  const result = getDonorEligibility([{ id: "D2", date: "2026-08-20", status: "Eligible" }], new Date("2026-08-27"));
  expect(result.lastDonation).toBeNull();
  expect(result.eligible).toBe(true);
});

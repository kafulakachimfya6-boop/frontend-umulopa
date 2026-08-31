import { describe, expect, it } from "vitest";
import { patientTotals, requestTotals, stockTotals, uniqueRecords } from "./analytics";
import { canAccessRoute, ROLES } from "./roles";
import { hashPassword, verifyPassword } from "./password";

describe("ZNBTS data integrity", () => {
  it("removes duplicate records without changing legitimate records", () => {
    const records = [{ id: 1, name: "A" }, { id: 1, name: "A" }, { id: 2, name: "B" }];
    expect(uniqueRecords(records)).toHaveLength(2);
  });

  it("reconciles patient gender totals with total patients", () => {
    const result = patientTotals([{ id: 1, gender: "Male" }, { id: 2, gender: "Female" }, { id: 3, gender: "Other" }]);
    expect(result.male + result.female + result.other).toBe(result.total);
  });

  it("calculates request units from the same unique request set", () => {
    const result = requestTotals([{ id: 1, units: 2, status: "Pending", urgency: "High" }, { id: 1, units: 2, status: "Pending", urgency: "High" }, { id: 2, units: 1, status: "Approved", urgency: "Medium" }]);
    expect(result.total).toBe(2);
    expect(result.unitsRequested).toBe(3);
  });

  it("reconciles inventory total and blood-group totals", () => {
    const result = stockTotals([{ id: 1, type: "O+", quantity: 10, threshold: 5 }, { id: 2, type: "A+", quantity: 4, threshold: 5 }]);
    expect(result.totalUnits).toBe(14);
    expect(result.byGroup.reduce((sum, item) => sum + item.value, 0)).toBe(result.totalUnits);
  });
});

describe("ZNBTS access control", () => {
  it("restricts hospital staff by staff sub-role", () => {
    expect(canAccessRoute(ROLES.HOSPITAL_STAFF, "/inventory", "Blood Bank Officer")).toBe(true);
    expect(canAccessRoute(ROLES.HOSPITAL_STAFF, "/inventory", "Nurse")).toBe(false);
    expect(canAccessRoute(ROLES.HOSPITAL_STAFF, "/patients", "Nurse")).toBe(true);
  });

  it("routes emergency escalation to the hospital staff workspace", () => {
    expect(canAccessRoute(ROLES.HOSPITAL_STAFF, "/staff/emergency", "Medical Officer")).toBe(true);
  });
});

describe("ZNBTS credential flow", () => {
  it("hashes and verifies credentials without storing plaintext", async () => {
    const hash = await hashPassword("ZNBTS-test-password");
    expect(hash).not.toBe("ZNBTS-test-password");
    expect(await verifyPassword("ZNBTS-test-password", hash)).toBe(true);
    expect(await verifyPassword("wrong-password", hash)).toBe(false);
  });
});

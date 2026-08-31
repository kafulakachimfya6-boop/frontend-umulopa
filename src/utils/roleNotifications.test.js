import { describe, expect, it } from "vitest";
import { getRoleMessages, getRoleNotifications } from "./roleNotifications";
import { ROLES } from "./roles";

describe("role-scoped notifications and messages", () => {
  const requests = [
    { id: "R1", hospitalId: 1, bloodType: "O+", urgency: "Emergency", status: "Pending" },
    { id: "R2", hospitalId: 2, bloodType: "A+", urgency: "Emergency", status: "Pending" },
  ];

  it("shows a hospital only its own urgent requests", () => {
    const notices = getRoleNotifications({ user: { role: ROLES.HOSPITAL_STAFF, hospitalId: 1 }, bloodRequests: requests });
    expect(notices[0]).toContain("1 urgent");
    expect(notices[0]).not.toContain("2 urgent");
  });

  it("shows the regional centre network-wide urgent queue", () => {
    const notices = getRoleNotifications({ user: { role: ROLES.REGIONAL_CENTRE }, bloodRequests: requests });
    expect(notices[0]).toContain("2 urgent");
  });

  it("does not use global audit events as hospital messages unless they are targeted", () => {
    const messages = getRoleMessages({
      user: { role: ROLES.HOSPITAL_STAFF, hospitalId: 1 },
      auditLogs: [
        { id: 1, event: "Hospital B private event", hospitalId: 2 },
        { id: 2, event: "Hospital A event", hospitalId: 1 },
      ],
      bloodRequests: [],
      hospitals: [],
    });
    expect(messages.some((m) => m.includes("Hospital B private event"))).toBe(false);
    expect(messages.some((m) => m.includes("Hospital A event"))).toBe(true);
  });
});

import { describe, expect, it } from "vitest";

import { isCampaignNameValid, responseRate } from "@/features/campaigns/domain/campaign";

describe("campaign domain", () => {
  it("computes response rate", () => {
    expect(responseRate({ sent: 100, responses: 25 })).toBe(0.25);
  });

  it("returns 0 when nothing has been sent", () => {
    expect(responseRate({ sent: 0, responses: 0 })).toBe(0);
  });

  it("validates campaign names", () => {
    expect(isCampaignNameValid("A")).toBe(false);
    expect(isCampaignNameValid("Launch")).toBe(true);
  });
});

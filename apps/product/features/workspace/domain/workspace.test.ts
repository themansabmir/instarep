import { describe, expect, it } from "vitest";

import { slugifyWorkspaceName } from "@/features/workspace/domain/workspace";

describe("slugifyWorkspaceName", () => {
  it("slugifies names", () => {
    expect(slugifyWorkspaceName("My Brand Name")).toBe("my-brand-name");
  });

  it("handles empty names", () => {
    expect(slugifyWorkspaceName("!!!")).toBe("workspace");
  });
});

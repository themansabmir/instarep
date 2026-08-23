import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@/features/marketing/components/hero";

describe("Hero", () => {
  it("renders the primary heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { name: /turn customer feedback/i }),
    ).toBeInTheDocument();
  });

  it("links to the product sign-up", () => {
    render(<Hero />);
    expect(screen.getByRole("link", { name: /start for free/i })).toBeInTheDocument();
  });
});

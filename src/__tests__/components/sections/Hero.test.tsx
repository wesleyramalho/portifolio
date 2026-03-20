import React from "react";
import { screen } from "@testing-library/react";
import Hero from "@/components/sections/Hero";
import { renderWithProviders } from "../../test-utils";

describe("Hero", () => {
  it("renders without crashing", () => {
    renderWithProviders(<Hero />);
  });

  it("renders the name characters", () => {
    renderWithProviders(<Hero />);
    // Name is split into individual char spans; check via the aria-label on h1
    expect(screen.getByRole("heading", { level: 1 })).toHaveAttribute(
      "aria-label",
      "wesley ramalho",
    );
  });

  it("renders the job title", () => {
    const { container } = renderWithProviders(<Hero />);
    // Title text lives in an sr-only span for accessibility
    expect(
      container.querySelector(".sr-only"),
    ).toHaveTextContent("Senior Software Engineer");
  });

  it("renders EN and PT language switcher", () => {
    renderWithProviders(<Hero />);
    expect(screen.getByRole("button", { name: "EN" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PT" })).toBeInTheDocument();
  });
});

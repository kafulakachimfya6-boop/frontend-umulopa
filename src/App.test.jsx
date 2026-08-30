import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AppRoutes } from "./App";
import { AppStateProvider } from "./context/AppStateProvider";

function renderRoute(path) {
  return render(<AppStateProvider><MemoryRouter initialEntries={[path]}><AppRoutes /></MemoryRouter></AppStateProvider>);
}

beforeEach(() => {
  localStorage.clear();
});

describe("public authentication routes", () => {
  it("renders the shared login page", () => {
    renderRoute("/login");
    expect(screen.getByRole("heading", { name: /welcome back/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register your hospital/i })).toBeInTheDocument();
  });

  it("renders donor signup", () => {
    renderRoute("/signup");
    expect(screen.getByRole("heading", { name: /create your donor account/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
  });

  it("renders hospital registration", () => {
    renderRoute("/signup/hospital");
    expect(screen.getByRole("heading", { name: /register your hospital/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /register hospital/i })).toBeInTheDocument();
  });
});

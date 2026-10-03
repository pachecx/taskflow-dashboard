import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProtectedLayout } from "../../layouts/ProtectedLayout";
import { LoginPage } from "./index";
import { renderWithProviders } from "../../test/renderWithProviders";

function LoginRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedLayout />}>
        <Route
          path="/dashboard"
          element={
            <main>
              <h1>Dashboard</h1>
              <p>Workspace overview</p>
            </main>
          }
        />
      </Route>
    </Routes>
  );
}

describe("login flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("reports required email and password when submitting empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginRoutes />, { route: "/login" });

    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid email address.",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "alex@example.com",
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Password must be at least 6 characters.",
    );
  });

  it("rejects an invalid email address", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginRoutes />, { route: "/login" });

    await user.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "not-an-email",
    );
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid email address.",
    );
    expect(
      screen.queryByRole("heading", { name: "Dashboard" }),
    ).not.toBeInTheDocument();
  });

  it("shows loading, starts a session, and navigates to the dashboard", async () => {
    let completeLogin: (() => void) | undefined;
    const scheduleTimeout = window.setTimeout.bind(window);
    vi.spyOn(window, "setTimeout").mockImplementation((handler, timeout) => {
      if (timeout === 650 && typeof handler === "function") {
        completeLogin = handler as () => void;
        return 0;
      }
      return scheduleTimeout(handler, timeout);
    });
    const user = userEvent.setup();
    renderWithProviders(<LoginRoutes />, { route: "/login" });

    await user.type(
      screen.getByRole("textbox", { name: "Email address" }),
      "alex@example.com",
    );
    await user.type(
      screen.getByLabelText("Password", { selector: "input" }),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    expect(
      screen.getByRole("button", { name: "Signing in..." }),
    ).toBeDisabled();
    expect(completeLogin).toBeDefined();
    act(() => completeLogin?.());

    expect(
      screen.getByRole("heading", { name: "Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Workspace overview")).toBeInTheDocument();
    expect(window.localStorage.getItem("taskflow-session")).toBe("active");
    expect(window.localStorage.getItem("taskflow-user")).toBe(
      "alex@example.com",
    );
  });
});

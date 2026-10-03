import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProfilePage } from "./index";
import { renderWithProviders } from "../../test/renderWithProviders";

describe("profile editing", () => {
  it("saves profile edits to localStorage and reloads the saved values", async () => {
    const user = userEvent.setup();
    const view = renderWithProviders(<ProfilePage />);
    await screen.findByRole("heading", { name: "Alex Morgan" });

    expect(
      screen.getByRole("heading", { name: "Alex Morgan" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Edit Profile" }));
    expect(screen.getByRole("textbox", { name: "Full Name" })).toBeEnabled();

    await user.clear(screen.getByRole("textbox", { name: "Full Name" }));
    await user.type(
      screen.getByRole("textbox", { name: "Full Name" }),
      "Jordan Lee",
    );
    await user.clear(screen.getByRole("textbox", { name: "Job Title" }));
    await user.type(
      screen.getByRole("textbox", { name: "Job Title" }),
      "Staff Engineer",
    );
    await user.clear(screen.getByRole("textbox", { name: "Location" }));
    await user.type(
      screen.getByRole("textbox", { name: "Location" }),
      "Portland, OR",
    );
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    await screen.findByText("Profile updated successfully.");
    expect(
      screen.getByRole("heading", { name: "Jordan Lee" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Profile updated successfully."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("textbox", { name: "Full Name" }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByText("Staff Engineer")).toHaveLength(2);
    expect(screen.getAllByText("Portland, OR")).toHaveLength(1);

    const savedProfile = window.localStorage.getItem("taskflow-user-profile");
    expect(savedProfile).not.toBeNull();
    expect(JSON.parse(savedProfile ?? "null")).toMatchObject({
      fullName: "Jordan Lee",
      jobTitle: "Staff Engineer",
      location: "Portland, OR",
    });

    view.unmount();
    renderWithProviders(<ProfilePage />);
    await screen.findByRole("heading", { name: "Jordan Lee" });

    expect(
      screen.getByRole("heading", { name: "Jordan Lee" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Staff Engineer")).toHaveLength(2);
    expect(screen.getByText("Portland, OR")).toBeInTheDocument();
  });

  it("discards unsaved edits when cancelling", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);
    await screen.findByRole("heading", { name: "Alex Morgan" });

    await user.click(screen.getByRole("button", { name: "Edit Profile" }));
    await user.clear(screen.getByRole("textbox", { name: "Full Name" }));
    await user.type(
      screen.getByRole("textbox", { name: "Full Name" }),
      "Unsaved Name",
    );
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(
      screen.getByRole("heading", { name: "Alex Morgan" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Unsaved Name")).not.toBeInTheDocument();
    expect(window.localStorage.getItem("taskflow-user-profile")).toBeNull();
  });
});

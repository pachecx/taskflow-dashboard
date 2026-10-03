import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TasksPage } from "./index";
import { renderWithProviders } from "../../test/renderWithProviders";
import { api } from "../../services/api";
import type { Task } from "../../types";

const sampleTasks: Task[] = [
  {
    id: "task-a",
    title: "Task A",
    projectId: "p1",
    assigneeId: "member-1",
    priority: "High",
    status: "To Do",
    deadline: "2026-10-10",
  },
  {
    id: "task-b",
    title: "Task B",
    projectId: "p1",
    assigneeId: "member-2",
    priority: "Medium",
    status: "In Progress",
    deadline: "2026-10-11",
  },
  {
    id: "task-c",
    title: "Task C",
    projectId: "p1",
    assigneeId: "member-3",
    priority: "Low",
    status: "Completed",
    deadline: "2026-10-12",
  },
];

async function selectFilter(
  user: ReturnType<typeof userEvent.setup>,
  label: string,
  option: string,
) {
  await user.click(screen.getByRole("button", { name: label }));
  await user.click(screen.getByRole("option", { name: option }));
}

describe("Tasks search and filters", () => {
  beforeEach(() => {
    vi.spyOn(api, "getTasks").mockResolvedValue(sampleTasks);
  });

  it("keeps matching tasks and hides the rest during search", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(await screen.findByText("Task A")).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Search tasks" }),
      "Task B",
    );

    expect(screen.getByText("Task B")).toBeInTheDocument();
    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
    expect(screen.queryByText("Task C")).not.toBeInTheDocument();
  });

  it("filters tasks by status", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(await screen.findByText("Task A")).toBeInTheDocument();
    await selectFilter(user, "Filter tasks by status", "Completed");

    expect(screen.getByText("Task C")).toBeInTheDocument();
    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
    expect(screen.queryByText("Task B")).not.toBeInTheDocument();
  });

  it("filters tasks by priority", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(await screen.findByText("Task A")).toBeInTheDocument();
    await selectFilter(user, "Filter tasks by priority", "High");

    expect(screen.getByText("Task A")).toBeInTheDocument();
    expect(screen.queryByText("Task B")).not.toBeInTheDocument();
    expect(screen.queryByText("Task C")).not.toBeInTheDocument();
  });

  it("combines search and status filters", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(await screen.findByText("Task A")).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Search tasks" }),
      "Task",
    );
    await selectFilter(user, "Filter tasks by status", "Completed");

    expect(screen.getByText("Task C")).toBeInTheDocument();
    expect(screen.queryByText("Task A")).not.toBeInTheDocument();
    expect(screen.queryByText("Task B")).not.toBeInTheDocument();
  });

  it("shows the empty state when no task matches", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TasksPage />);

    expect(await screen.findByText("Task A")).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Search tasks" }),
      "No matching task",
    );

    expect(screen.getByText("No tasks match")).toBeInTheDocument();
    expect(
      screen.getByText("Adjust the search or filters to see more tasks."),
    ).toBeInTheDocument();
  });
});

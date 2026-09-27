import { dashboard, members, projects, tasks } from "../data";
import type { Project, TaskStatus } from "../types";

const pause = (duration = 320) =>
  new Promise((resolve) => window.setTimeout(resolve, duration));
let currentProjects = [...projects];
let currentTasks = [...tasks];

export const api = {
  async getDashboard() {
    await pause();
    return dashboard;
  },
  async getProjects() {
    await pause();
    return currentProjects;
  },
  async getProject(id: string) {
    await pause(180);
    return currentProjects.find((project) => project.id === id) ?? null;
  },
  async createProject(
    input: Pick<Project, "name" | "client" | "deadline" | "description">,
  ) {
    await pause(450);
    const project: Project = {
      ...input,
      id: `p${Date.now()}`,
      status: "Planning",
      progress: 0,
      memberIds: ["member-1", "member-2"],
      taskIds: [],
      color: "mint",
    };
    currentProjects = [project, ...currentProjects];
    return project;
  },
  async getTasks() {
    await pause();
    return currentTasks;
  },
  async updateTaskStatus(id: string, status: TaskStatus) {
    await pause(250);
    currentTasks = currentTasks.map((task) =>
      task.id === id ? { ...task, status } : task,
    );
    return currentTasks.find((task) => task.id === id);
  },
  async getMembers() {
    await pause(260);
    return members;
  },
};

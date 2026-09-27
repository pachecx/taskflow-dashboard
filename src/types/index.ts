export type ProjectStatus =
  | "Planning"
  | "In Progress"
  | "Completed"
  | "On Hold";
export type TaskStatus = "To Do" | "In Progress" | "Completed";
export type Priority = "Low" | "Medium" | "High";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  jobTitle: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

export interface Member {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  tasks: number;
  projects: string[];
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  assigneeId: string;
  priority: Priority;
  status: TaskStatus;
  deadline: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  status: ProjectStatus;
  progress: number;
  deadline: string;
  memberIds: string[];
  taskIds: string[];
  color: string;
}

export interface DashboardData {
  stats: {
    label: string;
    value: string;
    delta: string;
    icon: string;
    color: string;
  }[];
  overview: {
    name: string;
    completed: number;
    inProgress: number;
    pending: number;
  }[];
  productivity: { month: string; tasks: number }[];
}

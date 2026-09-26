import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  CirclePlus,
  Filter,
  Mail,
  Search,
  SlidersHorizontal,
  UsersRound,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Avatar,
  AvatarStack,
  Badge,
  Button,
  EmptyState,
  Modal,
  PageHeading,
  Pagination,
  ProgressBar,
  Skeleton,
} from "../../components/ui";
import { members as localMembers } from "../../data";
import { api } from "../../services/api";
import type { Project, Task, TaskStatus } from "../../types";
import { formatDate } from "../../utils/formatDate";

const pageSize = 5;

function SearchField({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="search-field">
      <Search size={16} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}

function LoadError({ retry }: { retry: () => void }) {
  return (
    <div className="error-state">
      <strong>Something didn't load</strong>
      <p>Check your connection and try again.</p>
      <Button variant="secondary" onClick={retry}>
        Try again
      </Button>
    </div>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const client = useQueryClient();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    client: "",
    deadline: "",
    description: "",
  });
  const createProject = useMutation({
    mutationFn: api.createProject,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    },
  });
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.client.trim() || !form.deadline) {
      setError("Complete all required fields to continue.");
      return;
    }
    setError("");
    createProject.mutate(form);
  }
  return (
    <Modal title="Create a project" onClose={onClose}>
      <form className="form-stack" onSubmit={submit} noValidate>
        <label>
          Project name
          <input
            autoFocus
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="e.g. Website redesign"
          />
        </label>
        <label>
          Client
          <input
            value={form.client}
            onChange={(event) =>
              setForm({ ...form, client: event.target.value })
            }
            placeholder="Company or team"
          />
        </label>
        <label>
          Deadline
          <input
            type="date"
            value={form.deadline}
            onChange={(event) =>
              setForm({ ...form, deadline: event.target.value })
            }
          />
        </label>
        <label>
          Description <span className="optional-label">Optional</span>
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="What are you working on?"
            rows={3}
          />
        </label>
        {error && (
          <p className="field-error" role="alert">
            {error}
          </p>
        )}
        {createProject.isError && (
          <p className="field-error" role="alert">
            Couldn't create the project. Please try again.
          </p>
        )}
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={createProject.isPending}>
            {createProject.isPending ? "Creating..." : "Create project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function ProjectsPage() {
  const query = useQuery({ queryKey: ["projects"], queryFn: api.getProjects });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sort, setSort] = useState("deadline");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const list = (query.data ?? [])
    .filter(
      (project) =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.client.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((project) => status === "All statuses" || project.status === status)
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : a.deadline.localeCompare(b.deadline),
    );
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const visible = list.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE"
        title="Projects"
        description="Keep every project moving in the right direction."
        action={
          <Button onClick={() => setShowModal(true)}>
            <CirclePlus size={17} /> New project
          </Button>
        }
      />
      <section className="panel page-panel">
        <div className="toolbar">
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search projects or clients"
          />
          <label className="select-control">
            <Filter size={15} />
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter projects by status"
            >
              <option>All statuses</option>
              <option>Planning</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>On Hold</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <label className="select-control sort-control">
            <SlidersHorizontal size={15} />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort projects"
            >
              <option value="deadline">Deadline</option>
              <option value="name">Name</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <span className="result-count">{list.length} projects</span>
        </div>
        {query.isPending ? (
          <div className="loading-list">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="skeleton-row" />
            ))}
          </div>
        ) : query.isError ? (
          <LoadError retry={() => query.refetch()} />
        ) : list.length === 0 ? (
          <EmptyState
            title="No projects found"
            message="Try a different search or clear your filters."
          />
        ) : (
          <div className="table-scroll">
            <table className="data-table project-list-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Client</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Team</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((project) => (
                  <ProjectRow project={project} key={project.id} />
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!query.isPending && !query.isError && list.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} />}
    </>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <tr>
      <td>
        <Link className="project-name-link" to={`/projects/${project.id}`}>
          <span className={`project-symbol symbol-${project.color}`}>
            {project.name.slice(0, 1)}
          </span>
          <strong>{project.name}</strong>
        </Link>
      </td>
      <td>{project.client}</td>
      <td>
        <Badge>{project.status}</Badge>
      </td>
      <td>
        <div className="table-progress">
          <ProgressBar value={project.progress} />
          <span>{project.progress}%</span>
        </div>
      </td>
      <td>
        {formatDate(project.deadline, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </td>
      <td>
        <AvatarStack
          people={project.memberIds
            .map((id) => localMembers.find((member) => member.id === id)!)
            .filter(Boolean)}
        />
      </td>
      <td>
        <Link
          to={`/projects/${project.id}`}
          className="row-arrow"
          aria-label={`Open ${project.name}`}
        >
          <ArrowUpRight size={16} />
        </Link>
      </td>
    </tr>
  );
}

export function ProjectDetailPage() {
  const { id = "" } = useParams();
  const projectQuery = useQuery({
    queryKey: ["project", id],
    queryFn: () => api.getProject(id),
  });
  const taskQuery = useQuery({ queryKey: ["tasks"], queryFn: api.getTasks });
  const project = projectQuery.data;
  if (projectQuery.isPending)
    return (
      <div className="detail-loading">
        <Skeleton className="skeleton-line" />
        <Skeleton className="skeleton-number" />
        <Skeleton className="skeleton-row" />
      </div>
    );
  if (!project)
    return (
      <>
        <PageHeading title="Project not found" />
        <Link to="/projects" className="text-link">
          <ArrowLeft size={16} /> Back to projects
        </Link>
      </>
    );
  const projectTasks = (taskQuery.data ?? []).filter(
    (task) =>
      project.taskIds.includes(task.id) || task.projectId === project.id,
  );
  return (
    <>
      <Link to="/projects" className="back-link">
        <ArrowLeft size={16} /> All projects
      </Link>
      <PageHeading
        eyebrow={project.client}
        title={project.name}
        description={project.description}
        action={<Badge>{project.status}</Badge>}
      />
      <section className="detail-summary panel">
        <div>
          <span className="detail-label">Project progress</span>
          <div className="detail-progress">
            <ProgressBar value={project.progress} />
            <strong>{project.progress}%</strong>
          </div>
        </div>
        <div>
          <span className="detail-label">Deadline</span>
          <strong>
            {formatDate(project.deadline, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </strong>
        </div>
        <div>
          <span className="detail-label">Team</span>
          <AvatarStack
            people={project.memberIds
              .map(
                (memberId) =>
                  localMembers.find((member) => member.id === memberId)!,
              )
              .filter(Boolean)}
          />
        </div>
      </section>
      <section className="panel page-panel">
        <div className="panel-heading">
          <div>
            <h2>Project tasks</h2>
            <p>{projectTasks.length} tasks in this project</p>
          </div>
          <Link to="/tasks" className="text-link">
            All tasks <ArrowUpRight size={15} />
          </Link>
        </div>
        {taskQuery.isError ? (
          <LoadError retry={() => taskQuery.refetch()} />
        ) : (
          <TaskTable tasks={projectTasks} />
        )}
      </section>
    </>
  );
}

export function TasksPage() {
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["tasks"], queryFn: api.getTasks });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [priority, setPriority] = useState("All priorities");
  const [page, setPage] = useState(1);
  const update = useMutation({
    mutationFn: ({ id, value }: { id: string; value: TaskStatus }) =>
      api.updateTaskStatus(id, value),
    onSuccess: () => client.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const filtered = (query.data ?? [])
    .filter((task) => task.title.toLowerCase().includes(search.toLowerCase()))
    .filter((task) => status === "All statuses" || task.status === status)
    .filter(
      (task) => priority === "All priorities" || task.priority === priority,
    );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE"
        title="Tasks"
        description="A clear view of the work that moves your projects forward."
        action={
          <span className="tasks-total">
            <Check size={15} />{" "}
            {query.data?.filter((task) => task.status === "Completed").length ??
              "—"}{" "}
            completed
          </span>
        }
      />
      <section className="panel page-panel">
        <div className="toolbar">
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value);
              setPage(1);
            }}
            placeholder="Search tasks"
          />
          <label className="select-control">
            <Filter size={15} />
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
              aria-label="Filter tasks by status"
            >
              <option>All statuses</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <label className="select-control">
            <span className="priority-symbol">!</span>
            <select
              value={priority}
              onChange={(event) => {
                setPriority(event.target.value);
                setPage(1);
              }}
              aria-label="Filter tasks by priority"
            >
              <option>All priorities</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <ChevronDown size={14} />
          </label>
          <span className="result-count">{filtered.length} tasks</span>
        </div>
        {query.isPending ? (
          <div className="loading-list">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="skeleton-row" />
            ))}
          </div>
        ) : query.isError ? (
          <LoadError retry={() => query.refetch()} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No tasks match"
            message="Adjust the search or filters to see more tasks."
          />
        ) : (
          <TaskTable
            tasks={filtered.slice((page - 1) * pageSize, page * pageSize)}
            onStatusChange={(id, value) => update.mutate({ id, value })}
          />
        )}
        {!query.isPending && filtered.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        )}
      </section>
      {update.isSuccess && (
        <div className="toast" role="status">
          <Check size={16} /> Task status updated
        </div>
      )}
    </>
  );
}

function TaskTable({
  tasks,
  onStatusChange,
}: {
  tasks: Task[];
  onStatusChange?: (id: string, status: TaskStatus) => void;
}) {
  return (
    <div className="table-scroll">
      <table className="data-table task-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>Project</th>
            <th>Assignee</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const project = localProject(task.projectId);
            const member = localMembers.find(
              (person) => person.id === task.assigneeId,
            )!;
            return (
              <tr key={task.id}>
                <td>
                  <strong className="task-title">{task.title}</strong>
                </td>
                <td>
                  {project ? (
                    <Link
                      className="subtle-link"
                      to={`/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span className="assignee-cell">
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="small"
                    />
                    {member.name.split(" ")[0]}
                  </span>
                </td>
                <td>
                  <Badge tone={`priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </Badge>
                </td>
                <td>
                  {onStatusChange ? (
                    <label className="status-select">
                      <select
                        value={task.status}
                        onChange={(event) =>
                          onStatusChange(
                            task.id,
                            event.target.value as TaskStatus,
                          )
                        }
                        aria-label={`Change status for ${task.title}`}
                      >
                        <option>To Do</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                      </select>
                      <ChevronDown size={12} />
                    </label>
                  ) : (
                    <Badge>{task.status}</Badge>
                  )}
                </td>
                <td>{formatDate(task.deadline)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function localProject(id: string) {
  return projectCache.find((project) => project.id === id);
}
import { projects as projectCache } from "../../data";

export function TeamPage() {
  const query = useQuery({ queryKey: ["members"], queryFn: api.getMembers });
  return (
    <>
      <PageHeading
        eyebrow="YOUR PEOPLE"
        title="Team"
        description="The people making good work happen."
        action={
          <Button variant="secondary">
            <Mail size={16} /> Invite member
          </Button>
        }
      />
      {query.isError ? (
        <LoadError retry={() => query.refetch()} />
      ) : (
        <section className="team-grid">
          {query.isPending
            ? Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="team-skeleton" />
              ))
            : query.data?.map((member, index) => (
                <article className="team-card" key={member.id}>
                  <div className={`team-card-accent accent-${index % 4}`} />
                  <div className="team-card-main">
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="large"
                    />
                    <h2>{member.name}</h2>
                    <p className="team-role">{member.role}</p>
                    <a className="team-email" href={`mailto:${member.email}`}>
                      <Mail size={14} />
                      {member.email}
                    </a>
                    <div className="team-meta">
                      <span>
                        <Check size={14} />
                        {member.tasks} tasks
                      </span>
                      <span>
                        <UsersRound size={14} />
                        {member.projects.length} projects
                      </span>
                    </div>
                    <div className="team-projects">
                      {member.projects.slice(0, 2).map((project) => (
                        <Badge key={project} tone="neutral">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
        </section>
      )}
    </>
  );
}

export function CalendarPage() {
  const query = useQuery({ queryKey: ["tasks"], queryFn: api.getTasks });
  const upcoming = [...(query.data ?? [])]
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 8);
  return (
    <>
      <PageHeading
        eyebrow="YOUR SCHEDULE"
        title="Calendar"
        description="Upcoming deadlines across your projects."
        action={
          <button className="date-button">
            <CalendarDays size={15} /> October 2026 <ChevronDown size={14} />
          </button>
        }
      />
      <section className="calendar-layout">
        <div className="panel calendar-panel">
          <div className="calendar-month">
            <button className="icon-button" aria-label="Previous month">
              ‹
            </button>
            <strong>October 2026</strong>
            <button className="icon-button" aria-label="Next month">
              ›
            </button>
          </div>
          <div className="calendar-grid">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span className="calendar-weekday" key={day}>
                {day}
              </span>
            ))}
            {Array.from({ length: 35 }, (_, index) => {
              const day = index - 2;
              const active = day > 0 && day <= 31;
              const markers = upcoming.filter(
                (task) =>
                  new Date(`${task.deadline}T12:00:00`).getDate() === day,
              );
              return (
                <div
                  key={index}
                  className={`calendar-day ${active ? "" : "muted-day"} ${day === 28 ? "today" : ""}`}
                >
                  <span>{active ? day : day < 1 ? 28 + day : day - 31}</span>
                  {markers.slice(0, 2).map((task) => (
                    <i
                      key={task.id}
                      title={task.title}
                      className={`calendar-dot dot-${task.priority.toLowerCase()}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span>
              <i className="calendar-dot dot-high" />
              High priority
            </span>
            <span>
              <i className="calendar-dot dot-medium" />
              Medium
            </span>
            <span>
              <i className="calendar-dot dot-low" />
              Low
            </span>
          </div>
        </div>
        <aside className="panel upcoming-panel">
          <div className="panel-heading">
            <div>
              <h2>Upcoming</h2>
              <p>Next deadlines</p>
            </div>
          </div>
          {query.isPending
            ? Array.from({ length: 4 }, (_, i) => (
                <Skeleton className="skeleton-row" key={i} />
              ))
            : upcoming.map((task) => (
                <div className="upcoming-item" key={task.id}>
                  <span
                    className={`upcoming-date date-${task.priority.toLowerCase()}`}
                  >
                    {formatDate(task.deadline, {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <div>
                    <strong>{task.title}</strong>
                    <span>
                      {
                        projectCache.find(
                          (project) => project.id === task.projectId,
                        )?.name
                      }
                    </span>
                  </div>
                </div>
              ))}
        </aside>
      </section>
    </>
  );
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [weekly, setWeekly] = useState(false);
  return (
    <>
      <PageHeading
        eyebrow="WORKSPACE"
        title="Settings"
        description="Manage your personal preferences."
      />
      <section className="settings-panel panel">
        <div className="settings-section">
          <div>
            <h2>Notifications</h2>
            <p>Choose what you'd like to hear about.</p>
          </div>
          <label className="toggle-row">
            <span>
              <strong>Task updates</strong>
              <small>Get notified when tasks change.</small>
            </span>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />
            <i />
          </label>
          <label className="toggle-row">
            <span>
              <strong>Weekly summary</strong>
              <small>A Friday recap of your team's progress.</small>
            </span>
            <input
              type="checkbox"
              checked={weekly}
              onChange={(event) => setWeekly(event.target.checked)}
            />
            <i />
          </label>
        </div>
        <div className="settings-section profile-settings">
          <div>
            <h2>Profile</h2>
            <p>Your account details.</p>
          </div>
          <div className="profile-row">
            <Avatar
              name="Alex Morgan"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <div>
              <strong>Alex Morgan</strong>
              <span>alex@taskflow.team</span>
            </div>
            <Button variant="secondary">Edit profile</Button>
          </div>
        </div>
        <div className="settings-save">
          <span>Changes save automatically</span>
          <Check size={15} />
        </div>
      </section>
    </>
  );
}

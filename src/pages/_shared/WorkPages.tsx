import { useState, type FormEvent, type ReactNode } from "react";
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
  FilterSelect,
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
const tableClasses =
  "w-full min-w-172.5 border-collapse text-left whitespace-nowrap [&_th]:border-b [&_th]:border-(--line) [&_th]:px-3 [&_th]:py-2.75 [&_th]:text-[9px] [&_th]:font-semibold [&_th]:text-(--muted) [&_td]:h-13.75 [&_td]:border-b [&_td]:border-(--line) [&_td]:px-3 [&_td]:py-2.25 [&_td]:text-[10px] [&_td]:text-(--muted-dark) [&_tbody_tr:last-child_td]:border-0 [&_tbody_tr:hover]:bg-(--surface-hover) [&_th:first-child]:pl-0.75 [&_td:first-child]:pl-0.75 max-[650px]:[&_th]:px-2.25 max-[650px]:[&_td]:px-2.25";
const projectSymbolColors = {
  mint: "bg-[#e9f4eb] text-[#478264] dark:bg-[#2c4133] dark:text-[#a1d0ae]",
  lilac: "bg-[#f0eef8] text-[#766d9b] dark:bg-[#3a3548] dark:text-[#c1b5df]",
  peach: "bg-[#fcf0e9] text-[#bd7958] dark:bg-[#493830] dark:text-[#e0b49b]",
  blue: "bg-[#eaf2f7] text-[#587f9e] dark:bg-[#2d3e49] dark:text-[#a9c9dc]",
  yellow: "bg-[#f7f3e6] text-[#9a8247] dark:bg-[#453f2f] dark:text-[#dcc88d]",
};

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
    <label className="flex h-8.5 w-[min(280px,35%)] items-center gap-2 rounded-[5px] border border-(--line) px-2.5 text-(--muted) focus-within:border-[#91b99c] max-[650px]:w-full">
      <Search size={16} className="shrink-0" />
      <input
        className="w-full min-w-0 border-0 bg-transparent text-[10px] text-(--text) outline-none placeholder:text-[#a0aaa3]"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </label>
  );
}

type WorkFilter = {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  label: string;
  icon?: ReactNode;
};

function WorkFilterBar({
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  resultCount,
  resultLabel,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  filters: WorkFilter[];
  resultCount: number;
  resultLabel: string;
}) {
  return (
    <div className="flex min-h-16.75 items-center gap-2.25 border-b border-(--line) max-[650px]:min-h-0 max-[650px]:flex-wrap max-[650px]:gap-1.75 max-[650px]:py-3">
      <SearchField
        value={search}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
      {filters.map((filter) => (
        <FilterSelect
          key={filter.label}
          {...filter}
          className="max-[650px]:flex-1 max-[650px]:justify-center"
        />
      ))}
      <span className="ml-auto text-[10px] text-(--muted) max-[650px]:m-0 max-[650px]:w-full">
        {resultCount} {resultLabel}
      </span>
    </div>
  );
}

function LoadError({ retry }: { retry: () => void }) {
  return (
    <div className="flex min-h-55 flex-col items-center justify-center gap-2.5">
      <strong className="text-[13px]">Something didn't load</strong>
      <p className="m-0 text-[10px] text-(--muted)">
        Check your connection and try again.
      </p>
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
      <form className="grid gap-3" onSubmit={submit} noValidate>
        <label className="grid gap-1.5 text-[10px] font-semibold text-(--muted-dark)">
          Project name
          <input
            className="min-h-9 w-full rounded-[5px] border border-(--line) bg-(--surface) px-2.5 py-2 text-[10px] font-normal text-(--text) outline-none focus:border-[#85b493]"
            autoFocus
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="e.g. Website redesign"
          />
        </label>
        <label className="grid gap-1.5 text-[10px] font-semibold text-(--muted-dark)">
          Client
          <input
            className="min-h-9 w-full rounded-[5px] border border-(--line) bg-(--surface) px-2.5 py-2 text-[10px] font-normal text-(--text) outline-none focus:border-[#85b493]"
            value={form.client}
            onChange={(event) =>
              setForm({ ...form, client: event.target.value })
            }
            placeholder="Company or team"
          />
        </label>
        <label className="grid gap-1.5 text-[10px] font-semibold text-(--muted-dark)">
          Deadline
          <input
            className="min-h-9 w-full rounded-[5px] border border-(--line) bg-(--surface) px-2.5 py-2 text-[10px] font-normal text-(--text) outline-none focus:border-[#85b493]"
            type="date"
            value={form.deadline}
            onChange={(event) =>
              setForm({ ...form, deadline: event.target.value })
            }
          />
        </label>
        <label className="grid gap-1.5 text-[10px] font-semibold text-(--muted-dark)">
          Description{" "}
          <span className="text-[9px] font-normal text-(--muted)">
            Optional
          </span>
          <textarea
            className="min-h-9 w-full resize-y rounded-[5px] border border-(--line) bg-(--surface) px-2.5 py-2 text-[10px] font-normal text-(--text) outline-none focus:border-[#85b493]"
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="What are you working on?"
            rows={3}
          />
        </label>
        {error && (
          <p
            className="m-0 text-[10px] text-[#b45f4d] dark:text-[#e5a08e]"
            role="alert"
          >
            {error}
          </p>
        )}
        {createProject.isError && (
          <p
            className="m-0 text-[10px] text-[#b45f4d] dark:text-[#e5a08e]"
            role="alert"
          >
            Couldn't create the project. Please try again.
          </p>
        )}
        <div className="flex justify-end gap-1.75 pt-1">
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
      <section className="rounded-lg border border-(--line) bg-(--surface) px-5 pb-0.5">
        <WorkFilterBar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search projects or clients"
          filters={[
            {
              value: status,
              options: [
                { value: "All statuses", label: "All statuses" },
                { value: "Planning", label: "Planning" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
                { value: "On Hold", label: "On Hold" },
              ],
              onChange: (value) => {
                setStatus(value);
                setPage(1);
              },
              label: "Filter projects by status",
              icon: <Filter size={15} />,
            },
            {
              value: sort,
              options: [
                { value: "deadline", label: "Deadline" },
                { value: "name", label: "Name" },
              ],
              onChange: setSort,
              label: "Sort projects",
              icon: <SlidersHorizontal size={15} />,
            },
          ]}
          resultCount={list.length}
          resultLabel="projects"
        />
        {query.isPending ? (
          <div className="py-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="my-2.5 h-10.75 w-full" />
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
          <div className="w-full overflow-x-auto">
            <table className={`${tableClasses} [&_td]:h-16.25`}>
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
        <Link
          className="inline-flex items-center gap-2.25 text-(--text)"
          to={`/projects/${project.id}`}
        >
          <span
            className={`grid h-6.75 w-6.75 shrink-0 place-items-center rounded-md font-['Manrope',sans-serif] text-xs font-bold ${projectSymbolColors[project.color as keyof typeof projectSymbolColors]}`}
          >
            {project.name.slice(0, 1)}
          </span>
          <strong className="text-[10px] font-semibold">{project.name}</strong>
        </Link>
      </td>
      <td>{project.client}</td>
      <td>
        <Badge>{project.status}</Badge>
      </td>
      <td>
        <div className="flex w-32.5 items-center gap-2 max-[1150px]:w-27.5">
          <ProgressBar value={project.progress} />
          <span className="w-6.5 text-right text-[9px] text-(--muted)">
            {project.progress}%
          </span>
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
          className="inline-grid h-6.75 w-6.75 place-items-center rounded-[5px] text-(--muted) hover:bg-(--accent-soft) hover:text-(--accent-strong)"
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
      <div className="grid max-w-137.5 gap-3">
        <Skeleton className="my-1.25 h-2.5 w-3/4" />
        <Skeleton className="my-1.25 h-6 w-[45%]" />
        <Skeleton className="my-2.5 h-37.5 w-full" />
      </div>
    );
  if (!project)
    return (
      <>
        <PageHeading title="Project not found" />
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.25 text-[10px] font-semibold text-(--accent-strong) hover:underline"
        >
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
      <Link
        to="/projects"
        className="mb-5 inline-flex items-center gap-1.5 text-[10px] text-(--muted) hover:text-(--accent-strong)"
      >
        <ArrowLeft size={16} /> All projects
      </Link>
      <PageHeading
        eyebrow={project.client}
        title={project.name}
        description={project.description}
        action={<Badge>{project.status}</Badge>}
      />
      <section className="mb-4 grid grid-cols-[1.4fr_1fr_1fr] gap-5 rounded-lg border border-(--line) bg-(--surface) p-[18px_20px] max-[650px]:grid-cols-2 max-[650px]:gap-x-2.5 max-[650px]:gap-y-4.25 max-[650px]:p-3.75 [&>div]:flex [&>div]:flex-col [&>div]:gap-2.25 [&>div:first-child]:max-[650px]:col-span-full">
        <div>
          <span className="text-[9px] text-(--muted)">Project progress</span>
          <div className="flex items-center gap-3">
            <ProgressBar value={project.progress} />
            <strong className="text-[11px] text-(--text)">
              {project.progress}%
            </strong>
          </div>
        </div>
        <div>
          <span className="text-[9px] text-(--muted)">Deadline</span>
          <strong className="text-[11px] text-(--text)">
            {formatDate(project.deadline, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </strong>
        </div>
        <div>
          <span className="text-[9px] text-(--muted)">Team</span>
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
      <section className="rounded-lg border border-(--line) bg-(--surface) px-5 pb-0.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] leading-normal font-bold text-(--text)">
              Project tasks
            </h2>
            <p className="mt-0.5 mb-0 text-[10px] text-(--muted)">
              {projectTasks.length} tasks in this project
            </p>
          </div>
          <Link
            to="/tasks"
            className="inline-flex items-center gap-1.25 text-[10px] font-semibold text-(--accent-strong) hover:underline"
          >
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
          <span className="inline-flex items-center gap-1.5 text-[10px] text-(--muted)">
            <Check size={15} />{" "}
            {query.data?.filter((task) => task.status === "Completed").length ??
              "—"}{" "}
            completed
          </span>
        }
      />
      <section className="rounded-lg border border-(--line) bg-(--surface) px-5 pb-0.5">
        <WorkFilterBar
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          searchPlaceholder="Search tasks"
          filters={[
            {
              value: status,
              options: [
                { value: "All statuses", label: "All statuses" },
                { value: "To Do", label: "To Do" },
                { value: "In Progress", label: "In Progress" },
                { value: "Completed", label: "Completed" },
              ],
              onChange: (value) => {
                setStatus(value);
                setPage(1);
              },
              label: "Filter tasks by status",
              icon: <Filter size={15} />,
            },
            {
              value: priority,
              options: [
                { value: "All priorities", label: "All priorities" },
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ],
              onChange: (value) => {
                setPriority(value);
                setPage(1);
              },
              label: "Filter tasks by priority",
              icon: (
                <span className="grid h-3.5 w-3.5 place-items-center rounded-full bg-[#f7f3e9] text-[10px] font-bold text-[#9b7a49]">
                  !
                </span>
              ),
            },
          ]}
          resultCount={filtered.length}
          resultLabel="tasks"
        />
        {query.isPending ? (
          <div className="py-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="my-2.5 h-10.75 w-full" />
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
        <div
          className="fixed right-6.25 bottom-6 z-50 flex items-center gap-2 rounded-md border border-[#d5e8da] bg-[#f0f8f1] px-3.75 py-2.75 text-[11px] text-[#397950] shadow-[0_8px_24px_#1d38251a] animate-[enter_0.2s_ease]"
          role="status"
        >
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
    <div className="w-full overflow-x-auto">
      <table className={`${tableClasses} [&_td]:h-14.25`}>
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
                  <strong className="text-[10px] font-semibold text-(--text)">
                    {task.title}
                  </strong>
                </td>
                <td>
                  {project ? (
                    <Link
                      className="text-(--muted-dark) hover:text-(--accent-strong)"
                      to={`/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td>
                  <span className="inline-flex items-center gap-1.75">
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
                    <FilterSelect
                      value={task.status}
                      options={[
                        { value: "To Do", label: "To Do" },
                        { value: "In Progress", label: "In Progress" },
                        { value: "Completed", label: "Completed" },
                      ]}
                      onChange={(value) =>
                        onStatusChange(task.id, value as TaskStatus)
                      }
                      label={`Change status for ${task.title}`}
                    />
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
        <section className="grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-2 max-[650px]:grid-cols-1 max-[650px]:gap-2.5">
          {query.isPending
            ? Array.from({ length: 6 }, (_, index) => (
                <Skeleton key={index} className="h-51.25 rounded-lg" />
              ))
            : query.data?.map((member, index) => (
                <article
                  className="relative overflow-hidden rounded-lg border border-(--line) bg-(--surface)"
                  key={member.id}
                >
                  <div
                    className={`h-13.5 max-[650px]:h-10.75 ${["bg-[#e8f0e8]", "bg-[#e9edf3]", "bg-[#f4ece3]", "bg-[#ece9f2]"][index % 4]}`}
                  />
                  <div className="relative px-4.25 pb-4.25 max-[650px]:px-3.75">
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size="large"
                      className="-mt-7 border-[3px] border-(--surface) max-[650px]:-mt-6.25 max-[650px]:h-14! max-[650px]:w-14!"
                    />
                    <h2 className="mt-2.5 mb-0.5 font-['Manrope',sans-serif] text-[13px] font-bold text-(--text)">
                      {member.name}
                    </h2>
                    <p className="m-0 text-[10px] text-(--muted)">
                      {member.role}
                    </p>
                    <a
                      className="mt-3.25 flex items-center gap-1.5 text-[10px] text-(--muted-dark) hover:text-(--accent-strong)"
                      href={`mailto:${member.email}`}
                    >
                      <Mail size={14} />
                      {member.email}
                    </a>
                    <div className="mt-4 mb-3 flex gap-3.5 border-t border-(--line) pt-3 text-[9px] text-(--muted-dark)">
                      <span className="inline-flex items-center gap-1.25">
                        <Check size={14} className="text-[#619375]" />
                        {member.tasks} tasks
                      </span>
                      <span className="inline-flex items-center gap-1.25">
                        <UsersRound size={14} className="text-[#619375]" />
                        {member.projects.length} projects
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.25">
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
          <button className="inline-flex h-8.75 items-center gap-2 rounded-md border border-(--line) bg-(--surface) px-2.75 text-[10px] text-(--muted-dark) hover:border-[#a4c1ad]">
            <CalendarDays size={15} /> October 2026 <ChevronDown size={14} />
          </button>
        }
      />
      <section className="grid grid-cols-[minmax(0,1.5fr)_minmax(260px,0.8fr)] gap-3.75 max-[900px]:grid-cols-1">
        <div className="rounded-lg border border-(--line) bg-(--surface) px-5 pt-4.25 pb-3.25 max-[650px]:px-2.5 max-[650px]:py-3.25">
          <div className="mb-3.25 flex items-center justify-between">
            <button
              className="grid h-8.5 w-8.5 place-items-center rounded-md border-0 bg-transparent text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text)"
              aria-label="Previous month"
            >
              ‹
            </button>
            <strong className="font-['Manrope',sans-serif] text-[13px]">
              October 2026
            </strong>
            <button
              className="grid h-8.5 w-8.5 place-items-center rounded-md border-0 bg-transparent text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text)"
              aria-label="Next month"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span
                className="py-2 text-center text-[9px] text-(--muted)"
                key={day}
              >
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
                  className={`relative flex min-h-15 flex-col items-center gap-1 border-t border-(--line) px-0.75 py-1.75 text-[10px] text-(--text) max-[650px]:min-h-12.25 max-[380px]:min-h-10.75 ${active ? "" : "text-[#b8c0ba]"}`}
                >
                  <span
                    className={`grid h-5.5 w-5.5 place-items-center rounded-full ${day === 28 ? "bg-[#488660] text-white" : ""}`}
                  >
                    {active ? day : day < 1 ? 28 + day : day - 31}
                  </span>
                  {markers.slice(0, 2).map((task) => (
                    <i
                      key={task.id}
                      title={task.title}
                      className={`inline-block h-1.25 w-1.25 rounded-full ${task.priority === "High" ? "bg-[#d98772]" : task.priority === "Medium" ? "bg-[#d3ad5f]" : "bg-[#83a28b]"}`}
                    />
                  ))}
                </div>
              );
            })}
          </div>
          <div className="flex gap-3.5 pt-2.75 text-[9px] text-(--muted) max-[650px]:justify-center max-[650px]:gap-2.25 max-[650px]:text-[8px] max-[380px]:gap-1.5">
            <span className="inline-flex items-center gap-1.5 max-[380px]:gap-1">
              <i className="inline-block h-1.25 w-1.25 rounded-full bg-[#d98772]" />
              High priority
            </span>
            <span className="inline-flex items-center gap-1.5 max-[380px]:gap-1">
              <i className="inline-block h-1.25 w-1.25 rounded-full bg-[#d3ad5f]" />
              Medium
            </span>
            <span className="inline-flex items-center gap-1.5 max-[380px]:gap-1">
              <i className="inline-block h-1.25 w-1.25 rounded-full bg-[#83a28b]" />
              Low
            </span>
          </div>
        </div>
        <aside className="grid grid-cols-1 rounded-lg border border-(--line) bg-(--surface) p-4.25 max-[900px]:grid-cols-2 max-[900px]:gap-x-4.5 max-[650px]:block">
          <div className="col-span-full mb-2.25 flex items-start justify-between gap-3">
            <div>
              <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] leading-normal font-bold text-(--text)">
                Upcoming
              </h2>
              <p className="mt-0.5 mb-0 text-[10px] text-(--muted)">
                Next deadlines
              </p>
            </div>
          </div>
          {query.isPending
            ? Array.from({ length: 4 }, (_, i) => (
                <Skeleton className="my-2.5 h-10.75 w-full" key={i} />
              ))
            : upcoming.map((task) => (
                <div
                  className="flex items-center gap-2.5 border-t border-(--line) py-2.75"
                  key={task.id}
                >
                  <span
                    className={`grid min-h-8.5 w-9.5 shrink-0 place-items-center rounded-[5px] text-[9px] font-semibold ${task.priority === "High" ? "bg-[#fbefeb] text-[#a55e4b] dark:bg-[#47342f] dark:text-[#e0a995]" : task.priority === "Medium" ? "bg-[#f8f3e7] text-[#94743f] dark:bg-[#403b2e] dark:text-[#dfcb99]" : "bg-[#eff4ef] text-[#577861] dark:bg-[#303b33] dark:text-[#b6cabc]"}`}
                  >
                    {formatDate(task.deadline, {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                  <div className="grid min-w-0 gap-1">
                    <strong className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold text-(--text)">
                      {task.title}
                    </strong>
                    <span className="text-[9px] text-(--muted)">
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
      <section className="max-w-180 rounded-lg border border-(--line) bg-(--surface) px-5.5 max-[650px]:px-3.5">
        <div className="border-b border-(--line) pt-5 pb-3">
          <div>
            <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] text-(--text)">
              Notifications
            </h2>
            <p className="mt-1 mb-3.75 text-[10px] text-(--muted)">
              Choose what you'd like to hear about.
            </p>
          </div>
          <label className="flex min-h-14 items-center justify-between gap-3 border-t border-(--line)">
            <span className="grid gap-0.75">
              <strong className="text-[10px] font-semibold text-(--text)">
                Task updates
              </strong>
              <small className="text-[9px] text-(--muted)">
                Get notified when tasks change.
              </small>
            </span>
            <input
              className="peer sr-only"
              type="checkbox"
              checked={notifications}
              onChange={(event) => setNotifications(event.target.checked)}
            />
            <i className="relative h-4.75 w-8.25 shrink-0 rounded-[20px] bg-[#dce3dd] transition-colors duration-200 after:absolute after:top-0.75 after:left-0.75 after:h-3.25 after:w-3.25 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-[#4d9368] peer-checked:after:translate-x-3.5 peer-focus-visible:outline-[3px] peer-focus-visible:outline-[#91c4a9] peer-focus-visible:outline-offset-2" />
          </label>
          <label className="flex min-h-14 items-center justify-between gap-3 border-t border-(--line)">
            <span className="grid gap-0.75">
              <strong className="text-[10px] font-semibold text-(--text)">
                Weekly summary
              </strong>
              <small className="text-[9px] text-(--muted)">
                A Friday recap of your team's progress.
              </small>
            </span>
            <input
              className="peer sr-only"
              type="checkbox"
              checked={weekly}
              onChange={(event) => setWeekly(event.target.checked)}
            />
            <i className="relative h-4.75 w-8.25 shrink-0 rounded-[20px] bg-[#dce3dd] transition-colors duration-200 after:absolute after:top-0.75 after:left-0.75 after:h-3.25 after:w-3.25 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-[#4d9368] peer-checked:after:translate-x-3.5 peer-focus-visible:outline-[3px] peer-focus-visible:outline-[#91c4a9] peer-focus-visible:outline-offset-2" />
          </label>
        </div>
        <div className="border-b-0 pt-5 pb-3">
          <div>
            <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] text-(--text)">
              Profile
            </h2>
            <p className="mt-1 mb-3.75 text-[10px] text-(--muted)">
              Your account details.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Avatar
              name="Alex Morgan"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <div className="grid flex-1 gap-0.75">
              <strong className="text-[10px]">Alex Morgan</strong>
              <span className="text-[9px] text-(--muted)">
                alex@taskflow.team
              </span>
            </div>
            <Button variant="secondary" className="ml-auto">
              Edit profile
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-1.25 pb-4.25 text-[9px] text-(--muted)">
          <span>Changes save automatically</span>
          <Check size={14} className="text-[#55916c]" />
        </div>
      </section>
    </>
  );
}

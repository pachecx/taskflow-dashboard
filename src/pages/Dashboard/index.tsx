import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  AvatarStack,
  Badge,
  PageHeading,
  ProgressBar,
  Skeleton,
} from "../../components/ui";
import { members, projects } from "../../data";
import { StatCard } from "../../components/dashboard/StatCard";
import { formatDate } from "../../utils/formatDate";

export function DashboardPage() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
  });
  const loading = query.isPending;

  return (
    <>
      <PageHeading
        eyebrow="FRIDAY, SEPTEMBER 25, 2026"
        title="Good morning, Alex"
        description="Here's what's happening across your workspace."
        action={
          <button className="date-button">
            Last 6 months <span>⌄</span>
          </button>
        }
      />
      {query.isError && (
        <div className="error-banner" role="alert">
          We couldn't load your dashboard.{" "}
          <button onClick={() => query.refetch()}>Try again</button>
        </div>
      )}
      <section className="stats-grid" aria-label="Workspace summary">
        {(query.data?.stats ?? []).map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
        {loading &&
          Array.from({ length: 4 }, (_, index) => (
            <article className="stat-card" key={index}>
              <Skeleton className="skeleton-icon" />
              <Skeleton className="skeleton-line" />
              <Skeleton className="skeleton-number" />
              <Skeleton className="skeleton-line short" />
            </article>
          ))}
      </section>

      <section className="chart-grid" aria-label="Analytics">
        <article className="panel chart-panel">
          <div className="panel-heading">
            <div>
              <h2>Tasks overview</h2>
              <p>How work is moving this month</p>
            </div>
            <button
              className="more-button"
              aria-label="More task overview options"
            >
              ···
            </button>
          </div>
          <div className="chart-legend">
            <span>
              <i className="legend-dot green-dot" />
              Completed
            </span>
            <span>
              <i className="legend-dot blue-dot" />
              In progress
            </span>
            <span>
              <i className="legend-dot gray-dot" />
              Pending
            </span>
          </div>
          <div className="chart-area bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={query.data?.overview ?? []}
                barGap={5}
                barCategoryGap="26%"
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--line)"
                  strokeDasharray="3 4"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  dy={9}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  width={28}
                />
                <Tooltip
                  cursor={{ fill: "var(--surface-hover)" }}
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#67a98b"
                  radius={[3, 3, 0, 0]}
                />
                <Bar dataKey="inProgress" stackId="a" fill="#89a9c1" />
                <Bar dataKey="pending" stackId="a" fill="#dfe5e0" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
        <article className="panel chart-panel productivity-panel">
          <div className="panel-heading">
            <div>
              <h2>Productivity</h2>
              <p>Tasks completed over time</p>
            </div>
            <button
              className="more-button"
              aria-label="More productivity options"
            >
              ···
            </button>
          </div>
          <div className="productivity-total">
            284 <span>tasks</span>
          </div>
          <div className="chart-area line-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={query.data?.productivity ?? []}
                margin={{ top: 10, right: 8, bottom: 0, left: -18 }}
              >
                <CartesianGrid
                  vertical={false}
                  stroke="var(--line)"
                  strokeDasharray="3 4"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                  dy={9}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#559675"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#559675", strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="panel projects-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent projects</h2>
            <p>A quick look at what's moving</p>
          </div>
          <Link to="/projects" className="text-link">
            View all projects <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Deadline</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {projects.slice(0, 4).map((project) => (
                <tr key={project.id}>
                  <td>
                    <Link
                      className="project-name-link"
                      to={`/projects/${project.id}`}
                    >
                      <span
                        className={`project-symbol symbol-${project.color}`}
                      >
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
                  <td>{formatDate(project.deadline)}</td>
                  <td>
                    <AvatarStack
                      people={project.memberIds
                        .map(
                          (id) => members.find((member) => member.id === id)!,
                        )
                        .filter(Boolean)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

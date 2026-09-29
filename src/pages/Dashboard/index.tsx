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

const projectSymbolColors = {
  mint: "bg-[#e9f4eb] text-[#478264] dark:bg-[#2c4133] dark:text-[#a1d0ae]",
  lilac: "bg-[#f0eef8] text-[#766d9b] dark:bg-[#3a3548] dark:text-[#c1b5df]",
  peach: "bg-[#fcf0e9] text-[#bd7958] dark:bg-[#493830] dark:text-[#e0b49b]",
  blue: "bg-[#eaf2f7] text-[#587f9e] dark:bg-[#2d3e49] dark:text-[#a9c9dc]",
  yellow: "bg-[#f7f3e6] text-[#9a8247] dark:bg-[#453f2f] dark:text-[#dcc88d]",
};

export function DashboardPage() {
  const query = useQuery({
    queryKey: ["dashboard"],
    queryFn: api.getDashboard,
  });
  const loading = query.isPending;

  const getData = new Date();

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const toDay = new Date();
const dayWeek = daysOfWeek[toDay.getDay()];

const dataAtual = new Date();
const mes = dataAtual.toLocaleDateString('ENG', { month: 'long' });



  return (
    <>
      <PageHeading
        eyebrow={`${dayWeek}, ${mes} ${getData.getDate()}, ${getData.getFullYear()}`}
        title="Good morning, Alex"
        description="Here's what's happening across your workspace."
        action={
          <button className="inline-flex h-8.75 items-center gap-2 rounded-md border border-(--line) bg-(--surface) px-2.75 text-[10px] text-(--muted-dark) hover:border-[#a4c1ad]">
            Last 6 months <span>⌄</span>
          </button>
        }
      />
      {query.isError && (
        <div
          className="-mt-2.5 mb-3.75 rounded-[5px] border border-[#efd7ce] bg-[#fff7f4] px-3 py-2.25 text-[11px] text-[#9a5945] dark:border-[#583c34] dark:bg-[#352720] dark:text-[#e3a995]"
          role="alert"
        >
          We couldn't load your dashboard.{" "}
          <button
            className="ml-1.75 border-0 bg-transparent text-[#8d513e] underline dark:text-[#e3a995]"
            onClick={() => query.refetch()}
          >
            Try again
          </button>
        </div>
      )}
      <section
        className="grid grid-cols-4 gap-3.5 max-[1150px]:gap-2.5 max-[900px]:grid-cols-2 max-[650px]:gap-2.25"
        aria-label="Workspace summary"
      >
        {(query.data?.stats ?? []).map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
        {loading &&
          Array.from({ length: 4 }, (_, index) => (
            <article
              className="flex min-h-37 flex-col items-start rounded-lg border border-(--line) bg-(--surface) px-4.5 pt-4.25 pb-3.75 max-[1150px]:px-3.5 max-[900px]:min-h-33.75 max-[650px]:min-h-32.25 max-[650px]:p-3.25 max-[380px]:p-2.75"
              key={index}
            >
              <Skeleton className="mb-3 h-8.25 w-8.25 max-[650px]:mb-2 max-[650px]:h-7.25 max-[650px]:w-7.25" />
              <Skeleton className="my-1.25 h-2.5 w-3/4" />
              <Skeleton className="my-1.25 h-6 w-[45%]" />
              <Skeleton className="mt-auto my-1.25 h-2.5 w-1/2" />
            </article>
          ))}
      </section>

      <section
        className="mt-3.75 grid grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] gap-3.5 max-[1150px]:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] max-[900px]:grid-cols-1 max-[650px]:mt-2.5 max-[650px]:gap-2.5"
        aria-label="Analytics"
      >
        <article className="min-w-0 rounded-lg border border-(--line) bg-(--surface) px-5 pt-4.5 pb-3.5 max-[650px]:px-3 max-[650px]:pt-3.75 max-[650px]:pb-2.75">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] leading-normal font-bold text-(--text)">
                Tasks overview
              </h2>
              <p className="mt-0.5 mb-0 text-[10px] text-(--muted)">
                How work is moving this month
              </p>
            </div>
            <button
              className="grid h-6.75 w-6.75 place-items-center rounded-[5px] border-0 bg-transparent text-[19px] leading-none text-(--muted) hover:bg-(--surface-hover)"
              aria-label="More task overview options"
            >
              ···
            </button>
          </div>
          <div className="mt-4.25 flex gap-3.5 text-[9px] text-(--muted-dark) max-[650px]:gap-2.25 max-[650px]:text-[8px]">
            <span>
              <i className="h-1.75 w-1.75 rounded-full bg-[#67a98b]" />
              Completed
            </span>
            <span>
              <i className="h-1.75 w-1.75 rounded-full bg-[#89a9c1]" />
              In progress
            </span>
            <span>
              <i className="h-1.75 w-1.75 rounded-full bg-[#dfe5e0]" />
              Pending
            </span>
          </div>
          <div className="mt-2 h-47 w-full max-[900px]:h-52.5 max-[650px]:h-46.25">
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
        <article className="min-w-0 rounded-lg border border-(--line) bg-(--surface) px-5 pt-4.5 pb-3.5 max-[650px]:px-3 max-[650px]:pt-3.75 max-[650px]:pb-2.75">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] leading-normal font-bold text-(--text)">
                Productivity
              </h2>
              <p className="mt-0.5 mb-0 text-[10px] text-(--muted)">
                Tasks completed over time
              </p>
            </div>
            <button
              className="grid h-6.75 w-6.75 place-items-center rounded-[5px] border-0 bg-transparent text-[19px] leading-none text-(--muted) hover:bg-(--surface-hover)"
              aria-label="More productivity options"
            >
              ···
            </button>
          </div>
          <div className="mt-4.25 font-['Manrope',sans-serif] text-[26px] leading-[1.2] font-bold">
            284{" "}
            <span className="font-['DM_Sans',sans-serif] text-[10px] font-normal text-(--muted)">
              tasks
            </span>
          </div>
          <div className="h-51.75 w-full max-[900px]:h-52.5 max-[650px]:h-48">
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

      <section className="mt-3.75 rounded-lg border border-(--line) bg-(--surface) px-5 pt-4.5 pb-0.75 max-[650px]:mt-2.5 max-[650px]:px-3 max-[650px]:pt-3.75 max-[650px]:pb-0.5">
        <div className="mb-3 flex items-start justify-between gap-3 max-[650px]:items-center">
          <div>
            <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] leading-normal font-bold text-(--text)">
              Recent projects
            </h2>
            <p className="mt-0.5 mb-0 text-[10px] text-(--muted)">
              A quick look at what's moving
            </p>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.25 text-[10px] font-semibold text-(--accent-strong) hover:underline"
          >
            View all projects <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-left whitespace-nowrap max-[650px]:min-w-172.5 [&_th]:border-b [&_th]:border-(--line) [&_th]:px-3 [&_th]:py-2.75 [&_th]:text-[9px] [&_th]:font-semibold [&_th]:text-(--muted) [&_td]:h-13.75 [&_td]:border-b [&_td]:border-(--line) [&_td]:px-3 [&_td]:py-2.25 [&_td]:text-[10px] [&_td]:text-(--muted-dark) [&_tbody_tr:last-child_td]:border-0 [&_tbody_tr:hover]:bg-(--surface-hover) [&_th:first-child]:pl-0.75 [&_td:first-child]:pl-0.75 max-[650px]:[&_th]:px-2.25 max-[650px]:[&_td]:px-2.25">
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
                      className="inline-flex items-center gap-2.25 text-(--text)"
                      to={`/projects/${project.id}`}
                    >
                      <span
                        className={`grid h-6.75 w-6.75 shrink-0 place-items-center rounded-md font-['Manrope',sans-serif] text-xs font-bold max-[650px]:[&+strong]:text-[9px] ${projectSymbolColors[project.color as keyof typeof projectSymbolColors]}`}
                      >
                        {project.name.slice(0, 1)}
                      </span>
                      <strong className="text-[10px] font-semibold max-[650px]:text-[9px]">
                        {project.name}
                      </strong>
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

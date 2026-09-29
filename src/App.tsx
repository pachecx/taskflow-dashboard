import { lazy, Suspense, useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Link,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  Menu,
  Moon,
  Search,
  Settings,
  Sun,
  UsersRound,
  X,
} from "lucide-react";
import { UserMenu } from "./components/layout/UserMenu";
import { isAuthenticated, useSession } from "./hooks/useSession";
import { ProtectedLayout } from "./layouts/ProtectedLayout";
import { BrandMark } from "./components/layout/BrandMark";
import { defaultUserProfile, profileService } from "./services/profileService";

const LoginPage = lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.LoginPage })),
);

const DashboardPage = lazy(() =>
  import("./pages/Dashboard").then((module) => ({
    default: module.DashboardPage,
  })),
);
const ProjectsPage = lazy(() =>
  import("./pages/Projects").then((module) => ({
    default: module.ProjectsPage,
  })),
);
const ProjectDetailPage = lazy(() =>
  import("./pages/Projects").then((module) => ({
    default: module.ProjectDetailPage,
  })),
);
const TasksPage = lazy(() =>
  import("./pages/Tasks").then((module) => ({ default: module.TasksPage })),
);
const TeamPage = lazy(() =>
  import("./pages/Team").then((module) => ({ default: module.TeamPage })),
);
const CalendarPage = lazy(() =>
  import("./pages/Calendar").then((module) => ({
    default: module.CalendarPage,
  })),
);
const SettingsPage = lazy(() =>
  import("./pages/Settings").then((module) => ({
    default: module.SettingsPage,
  })),
);
const ProfilePage = lazy(() =>
  import("./pages/Profile").then((module) => ({
    default: module.ProfilePage,
  })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 45_000, retry: 1, refetchOnWindowFocus: false },
  },
});
const navigation = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Tasks", to: "/tasks", icon: ListTodo },
  { label: "Team", to: "/team", icon: UsersRound },
  { label: "Calendar", to: "/calendar", icon: CalendarDays },
];

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useSession();
  const profileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: profileService.getProfile,
  });
  const userProfile = profileQuery.data ?? defaultUserProfile;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("taskflow-theme") === "dark",
  );
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const pageTitle = location.pathname.startsWith("/projects/")
    ? "Project details"
    : location.pathname.startsWith("/profile")
      ? "My Profile"
      : (navigation.find((item) => location.pathname.startsWith(item.to))
          ?.label ?? "Settings");
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("taskflow-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "light";
  }
  function logout() {
    signOut();
    navigate("/login", { replace: true });
  }
  return (
    <div
      className={`relative flex min-h-screen bg-(--page) text-(--text) dark:scheme-dark max-[650px]:min-h-dvh ${dark ? "theme-dark" : ""}`}
    >
      {mobileOpen && (
        <button
          className="fixed inset-0 z-19 block border-0 bg-[#101a15a8] min-[651px]:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`z-20 flex min-h-screen w-62 shrink-0 flex-col bg-(--side) px-3.75 pt-5.75 pb-3.5 text-[#e3ebe5] max-[1150px]:w-55.5 max-[900px]:w-51.25 max-[900px]:px-2.75 max-[650px]:fixed max-[650px]:inset-y-0 max-[650px]:left-0 max-[650px]:min-h-dvh max-[650px]:w-[min(285px,84vw)] max-[650px]:translate-x-[-102%] max-[650px]:px-3.75 max-[650px]:shadow-[15px_0_40px_#14251e30] max-[650px]:transition-transform max-[650px]:duration-220 ${mobileOpen ? "max-[650px]:translate-x-0" : ""}`}
      >
        <div className="flex h-8.5 items-center px-2">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 font-['Manrope',sans-serif] text-[19px] leading-none font-extrabold text-[#f2f8f4]"
          >
            <BrandMark />
            <span>taskflow</span>
          </Link>
          <button
            className="ml-auto hidden h-8.5 w-8.5 place-items-center rounded-md border-0 bg-transparent text-[#d1ddd4] hover:bg-(--surface-hover) hover:text-(--text) max-[650px]:inline-grid"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="my-7.75 mb-7 flex min-h-13.25 items-center gap-2.5 rounded-[7px] border border-[#ffffff18] bg-[#ffffff08] p-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[#cfe1c7] font-['Manrope',sans-serif] font-extrabold text-[#284332]">
            S
          </span>
          <span className="grid min-w-0 flex-1 gap-0.75">
            <strong className="text-xs font-semibold">Studio North</strong>
            <small className="text-[10px] text-[#a8b7ac]">Free workspace</small>
          </span>
          <ChevronDown size={15} className="text-[#aab8ad]" />
        </div>
        <nav className="flex flex-col gap-0.75" aria-label="Main navigation">
          <span className="px-2.75 pb-2.25 text-[9px] font-bold tracking-[1.2px] text-[#84968a]">
            WORKSPACE
          </span>
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex min-h-10.25 items-center gap-3 rounded-md px-2.75 text-xs font-medium text-[#afbeb3] transition-[background,color] duration-180 hover:bg-[#ffffff0b] hover:text-white ${isActive ? "bg-[#ffffff15] text-white shadow-[inset_2px_0_#91c7a4] [&>svg]:text-[#a6d7b6]" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Tasks" && (
                <span className="ml-auto min-w-5 rounded-[10px] bg-[#ffffff17] px-1.25 py-0.5 text-center text-[10px] text-[#ced9d0]">
                  8
                </span>
              )}
            </NavLink>
          ))}
          <span className="mt-7.75 px-2.75 pb-2.25 text-[9px] font-bold tracking-[1.2px] text-[#84968a]">
            PREFERENCES
          </span>
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex min-h-10.25 items-center gap-3 rounded-md px-2.75 text-xs font-medium text-[#afbeb3] transition-[background,color] duration-180 hover:bg-[#ffffff0b] hover:text-white ${isActive ? "bg-[#ffffff15] text-white shadow-[inset_2px_0_#91c7a4] [&>svg]:text-[#a6d7b6]" : ""}`
            }
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>Settings</span>
          </NavLink>
        </nav>
        <div className="mt-auto">
          <a
            className="flex items-center gap-2.75 border-b border-[#ffffff17] px-2.75 pt-3 pb-4 text-[11px] text-[#b0beb4] hover:text-white"
            href="mailto:support@taskflow.team"
          >
            <CircleHelp size={17} />
            <span>Help & support</span>
            <ArrowIcon />
          </a>
          <UserMenu profile={userProfile} onLogout={logout} />
        </div>
      </aside>
      <div className="flex min-h-screen w-[calc(100%-248px)] min-w-0 flex-col max-[1150px]:w-[calc(100%-222px)] max-[900px]:w-[calc(100%-205px)] max-[650px]:w-full">
        <header className="flex h-17 flex-[0_0_68px] items-center justify-between border-b border-(--line) bg-(--surface) px-10.5 max-[1150px]:px-7 max-[900px]:px-5 max-[650px]:h-14.75 max-[650px]:flex-[0_0_59px] max-[650px]:gap-1.75 max-[650px]:px-3.25">
          <button
            className="hidden h-8.5 w-8.5 shrink-0 place-items-center rounded-md border-0 bg-transparent text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text) max-[650px]:inline-grid"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="text-[13px] font-semibold max-[650px]:flex-1">
            {pageTitle}
          </span>
          <div className="flex items-center gap-4.25 max-[900px]:gap-2.5 max-[650px]:gap-1.25">
            <div className="relative max-[650px]:hidden">
              <label className="flex h-8.75 w-57 items-center gap-2 rounded-md border border-(--line) bg-(--page) px-2.25 text-(--muted) focus-within:border-[#9dbca7] focus-within:bg-(--surface) max-[900px]:w-47.5">
                <Search size={16} className="shrink-0" />
                <input
                  className="w-full border-0 bg-transparent p-0 text-[11px] text-(--text) outline-none placeholder:text-[#a1aaa4]"
                  placeholder="Search anything..."
                  value={search}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search anything"
                />
                <kbd className="whitespace-nowrap rounded-[3px] border border-(--line) bg-(--surface) px-1 py-0.5 font-sans text-[9px]">
                  ⌘ K
                </kbd>
              </label>
              {searchOpen && (
                <>
                  <button
                    className="fixed inset-0 z-35 border-0 bg-transparent"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search results"
                  />
                  <div className="absolute top-[calc(100%+9px)] right-0 z-40 w-63.75 rounded-[7px] border border-(--line) bg-(--surface) p-2 shadow-[0_14px_34px_#17281d20]">
                    <span className="block px-2 py-1.75 text-[8px] font-bold tracking-[0.8px] text-(--muted)">
                      QUICK LINKS
                    </span>
                    {[
                      ["Dashboard", "/dashboard"],
                      ["Projects", "/projects"],
                      ["Tasks", "/tasks"],
                      ["Team", "/team"],
                    ]
                      .filter(
                        ([label]) =>
                          !search ||
                          label.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map(([label, path]) => (
                        <Link
                          className="flex items-center gap-2.25 rounded p-2 text-[10px] text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text)"
                          key={path}
                          to={path}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearch("");
                          }}
                        >
                          <Search size={14} />
                          {label}
                          <span className="ml-auto text-(--muted)">↵</span>
                        </Link>
                      ))}
                    {search &&
                      !["dashboard", "projects", "tasks", "team"].some((item) =>
                        item.includes(search.toLowerCase()),
                      ) && (
                        <p className="px-2 py-1.5 text-[10px] text-(--muted)">
                          No quick links found for “{search}”
                        </p>
                      )}
                  </div>
                </>
              )}
            </div>
            <button
              className="grid h-8.5 w-8.5 place-items-center rounded-md border-0 bg-transparent text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text) max-[650px]:w-7.5"
              onClick={toggleTheme}
              aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button
                className="relative grid h-8.5 w-8.5 place-items-center rounded-md border-0 bg-transparent text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text) max-[650px]:w-7.5"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <i className="absolute top-1.5 right-1.75 h-1.5 w-1.5 rounded-full border-[1.5px] border-(--surface) bg-[#df876c]" />
              </button>
              {notificationsOpen && (
                <div className="absolute top-[calc(100%+9px)] right-0 z-40 w-75 rounded-[7px] border border-(--line) bg-(--surface) p-3.25 shadow-[0_14px_34px_#17281d20] max-[650px]:fixed max-[650px]:top-14.25 max-[650px]:right-2.5 max-[650px]:w-[min(300px,calc(100vw-20px))]">
                  <div className="flex items-center justify-between border-b border-(--line) pb-2.5">
                    <strong className="text-[11px]">Notifications</strong>
                    <span className="text-[9px] text-(--accent-strong)">
                      2 new
                    </span>
                  </div>
                  <div className="flex gap-2.25 border-b border-(--line) px-px py-3">
                    <span className="grid h-6.75 w-6.75 shrink-0 place-items-center rounded-md bg-(--accent-soft) text-[#49815e]">
                      <Check size={15} />
                    </span>
                    <div className="grid gap-1">
                      <strong className="text-[9px] font-semibold">
                        Homepage wireframes approved
                      </strong>
                      <span className="text-[9px] text-(--muted)">
                        Maya Chen · 18 min ago
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2.25 border-b border-(--line) px-px py-3">
                    <span className="grid h-6.75 w-6.75 shrink-0 place-items-center rounded-md bg-[#edf3f7] text-[#5d829d]">
                      <CalendarDays size={15} />
                    </span>
                    <div className="grid gap-1">
                      <strong className="text-[9px] font-semibold">
                        3 deadlines coming up
                      </strong>
                      <span className="text-[9px] text-(--muted)">
                        Across 2 projects · Today
                      </span>
                    </div>
                  </div>
                  <button
                    className="w-full border-0 bg-transparent pt-2.25 pb-0.5 text-[9px] font-semibold text-(--accent-strong)"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>
            <UserMenu compact profile={userProfile} onLogout={logout} />
          </div>
        </header>
        <main className="mx-auto w-full max-w-372.5 flex-1 animate-[enter_0.28s_ease_both] px-10.5 pt-9.25 pb-12 max-[1150px]:px-7 max-[900px]:px-5 max-[900px]:pt-7.25 max-[900px]:pb-10 max-[650px]:px-3.5 max-[650px]:pt-6.25 max-[650px]:pb-8.75 max-[380px]:px-2.75">
          <Outlet />
        </main>
        <footer className="flex justify-between border-t border-(--line) px-10.5 pt-3.75 pb-4.5 text-[10px] text-(--muted) max-[1150px]:px-7 max-[900px]:px-5 max-[650px]:px-3.5 max-[650px]:py-3.25 max-[650px]:text-[8px] max-[650px]:[&>span:last-child]:text-right">
          <span>© 2026 TaskFlow</span>
          <span>Made for teams who care about the details.</span>
        </footer>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <span className="ml-auto text-sm">↗</span>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated() ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route element={<ProtectedLayout />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense
          fallback={
            <div
              className="grid min-h-screen place-items-center bg-[#f5f7f5] text-xs text-[#6d7b70]"
              role="status"
            >
              Loading workspace...
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

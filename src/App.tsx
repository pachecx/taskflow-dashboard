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
    <div className={`app-shell ${dark ? "theme-dark" : ""}`}>
      {mobileOpen && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Link to="/dashboard" className="brand-lockup">
            <BrandMark />
            <span>taskflow</span>
          </Link>
          <button
            className="mobile-close icon-button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-switch">
          <span className="workspace-avatar">S</span>
          <span>
            <strong>Studio North</strong>
            <small>Free workspace</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          <span className="nav-caption">WORKSPACE</span>
          {navigation.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-active" : ""}`
              }
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {label === "Tasks" && <span className="nav-count">8</span>}
            </NavLink>
          ))}
          <span className="nav-caption nav-caption-bottom">PREFERENCES</span>
          <NavLink
            to="/settings"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `nav-link ${isActive ? "nav-active" : ""}`
            }
          >
            <Settings size={18} strokeWidth={1.8} />
            <span>Settings</span>
          </NavLink>
        </nav>
        <div className="sidebar-bottom">
          <a className="help-link" href="mailto:support@taskflow.team">
            <CircleHelp size={17} />
            <span>Help & support</span>
            <ArrowIcon />
          </a>
          <UserMenu profile={userProfile} onLogout={logout} />
        </div>
      </aside>
      <div className="main-column">
        <header className="topbar">
          <button
            className="mobile-menu icon-button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="topbar-title">{pageTitle}</span>
          <div className="topbar-actions">
            <div className="global-search-wrap">
              <label className="global-search">
                <Search size={16} />
                <input
                  placeholder="Search anything..."
                  value={search}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search anything"
                />
                <kbd>⌘ K</kbd>
              </label>
              {searchOpen && (
                <>
                  <button
                    className="popover-dismiss"
                    onClick={() => setSearchOpen(false)}
                    aria-label="Close search results"
                  />
                  <div className="search-popover">
                    <span className="popover-label">QUICK LINKS</span>
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
                          key={path}
                          to={path}
                          onClick={() => {
                            setSearchOpen(false);
                            setSearch("");
                          }}
                        >
                          <Search size={14} />
                          {label}
                          <span>↵</span>
                        </Link>
                      ))}
                    {search &&
                      !["dashboard", "projects", "tasks", "team"].some((item) =>
                        item.includes(search.toLowerCase()),
                      ) && <p>No quick links found for “{search}”</p>}
                  </div>
                </>
              )}
            </div>
            <button
              className="icon-button theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="Notifications"
              >
                <Bell size={18} />
                <i />
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <div className="popover-heading">
                    <strong>Notifications</strong>
                    <span>2 new</span>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon">
                      <Check size={15} />
                    </span>
                    <div>
                      <strong>Homepage wireframes approved</strong>
                      <span>Maya Chen · 18 min ago</span>
                    </div>
                  </div>
                  <div className="notification-item">
                    <span className="notification-icon notification-blue">
                      <CalendarDays size={15} />
                    </span>
                    <div>
                      <strong>3 deadlines coming up</strong>
                      <span>Across 2 projects · Today</span>
                    </div>
                  </div>
                  <button
                    className="notification-all"
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
        <main className="page-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          <span>© 2026 TaskFlow</span>
          <span>Made for teams who care about the details.</span>
        </footer>
      </div>
    </div>
  );
}

function ArrowIcon() {
  return <span className="help-arrow">↗</span>;
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
            <div className="route-loading" role="status">
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

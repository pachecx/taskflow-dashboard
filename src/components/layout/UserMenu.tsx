import { useEffect, useRef, useState } from "react";
import { CircleUserRound, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar } from "../ui";
import type { UserProfile } from "../../types";

export function UserMenu({
  profile,
  onLogout,
  compact = false,
}: {
  profile: UserProfile;
  onLogout: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function dismiss(event: MouseEvent | KeyboardEvent) {
      if (event instanceof KeyboardEvent && event.key === "Escape") {
        setOpen(false);
      }
      if (
        event instanceof MouseEvent &&
        event.target instanceof Node &&
        !rootRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", dismiss);
    document.addEventListener("keydown", dismiss);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("keydown", dismiss);
    };
  }, []);

  return (
    <div
      className={`user-menu-wrap ${compact ? "header-user-menu" : "sidebar-user-menu"}`}
      ref={rootRef}
    >
      <button
        className={`user-menu-trigger ${compact ? "user-menu-compact" : ""}`}
        type="button"
        aria-label={`Open user menu for ${profile.fullName}`}
        aria-expanded={open}
        aria-controls={`user-menu-${compact ? "header" : "sidebar"}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={profile.fullName} src={profile.avatar} />
        {!compact && (
          <span className="user-details">
            <strong>{profile.fullName}</strong>
            <span>{profile.email}</span>
          </span>
        )}
      </button>
      {open && (
        <nav
          className="user-menu-popover"
          id={`user-menu-${compact ? "header" : "sidebar"}`}
          aria-label="User menu"
        >
          <Link to="/profile" onClick={() => setOpen(false)}>
            <CircleUserRound size={16} /> My Profile
          </Link>
          <Link to="/settings" onClick={() => setOpen(false)}>
            <Settings size={16} /> Settings
          </Link>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onLogout();
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </nav>
      )}
    </div>
  );
}

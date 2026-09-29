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
      className={`relative ${compact ? "" : "mt-3.5 w-full"}`}
      ref={rootRef}
    >
      <button
        className={`flex min-w-0 items-center gap-2.25 rounded-md border-0 p-0 text-left text-[#e3ebe5] ${compact ? "w-auto justify-center rounded-full" : "w-full hover:bg-[#ffffff0b]"} ${compact ? "max-[650px]:w-7.25 max-[650px]:h-7.25" : ""}`}
        type="button"
        aria-label={`Open user menu for ${profile.fullName}`}
        aria-expanded={open}
        aria-controls={`user-menu-${compact ? "header" : "sidebar"}`}
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar name={profile.fullName} src={profile.avatar} />
        {!compact && (
          <span className="grid min-w-0 flex-1 gap-0.75">
            <strong className="text-[11px] font-semibold">
              {profile.fullName}
            </strong>
            <span className="max-w-40 overflow-hidden text-ellipsis whitespace-nowrap text-[9px] text-[#9eaea2]">
              {profile.email}
            </span>
          </span>
        )}
      </button>
      {open && (
        <nav
          className={`absolute right-0 top-[calc(100%+9px)] z-[70] w-47.5 rounded-[7px] border border-(--line) bg-(--surface) p-1.25 shadow-[0_12px_30px_#17281d24] max-[650px]:w-46.25 ${compact ? "max-[650px]:right-[-5px]" : "bottom-[calc(100%+7px)] left-0 top-auto w-full right-auto"}`}
          id={`user-menu-${compact ? "header" : "sidebar"}`}
          aria-label="User menu"
        >
          <Link
            className="flex min-h-9 w-full items-center gap-2.25 rounded-[4px] px-2.25 text-[10px] text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text)"
            to="/profile"
            onClick={() => setOpen(false)}
          >
            <CircleUserRound size={16} /> My Profile
          </Link>
          <Link
            className="flex min-h-9 w-full items-center gap-2.25 rounded-[4px] px-2.25 text-[10px] text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text)"
            to="/settings"
            onClick={() => setOpen(false)}
          >
            <Settings size={16} /> Settings
          </Link>
          <button
            className="flex min-h-9 w-full items-center gap-2.25 rounded-t-none rounded-b-[4px] border-0 border-t border-(--line) px-2.25 text-left text-[10px] text-[#b46b58] hover:bg-(--surface-hover) hover:text-(--text)"
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

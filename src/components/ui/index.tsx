import { X } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  const variants = {
    primary: "border-transparent bg-[#397b58] text-white hover:bg-[#2d6949]",
    secondary:
      "border-(--line) bg-(--surface) text-(--muted-dark) hover:border-[#bdcfc2] hover:bg-(--surface-hover)",
    ghost: "border-transparent bg-transparent text-(--muted-dark)",
  };
  return (
    <button
      className={`inline-flex min-h-8.75 items-center justify-center gap-2 rounded-md border px-3.25 text-[11px] font-semibold transition-[background,border-color,transform] duration-[160ms] active:translate-y-px disabled:cursor-not-allowed disabled:opacity-[0.58] ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Avatar({
  src,
  name,
  size = "normal",
  className = "",
}: {
  src?: string;
  name: string;
  size?: "small" | "normal" | "large";
  className?: string;
}) {
  return (
    <img
      className={`block shrink-0 rounded-full bg-[#e7eee8] object-cover ${
        size === "small"
          ? "h-6.25 w-6.25 border-2 border-(--surface)"
          : size === "large"
            ? "h-16 w-16"
            : "h-7.75 w-7.75"
      } ${className}`}
      src={
        src ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e8eee8&color=30443a`
      }
      alt={name}
    />
  );
}

export function AvatarStack({
  people,
}: {
  people: { name: string; avatar: string }[];
}) {
  return (
    <div
      className="flex items-center pl-0.75 [&>img]:-ml-1.25"
      aria-label={people.map((person) => person.name).join(", ")}
    >
      {people.slice(0, 4).map((person) => (
        <Avatar
          key={person.name}
          src={person.avatar}
          name={person.name}
          size="small"
        />
      ))}
      {people.length > 4 && (
        <span className="-ml-1.25 grid h-6.25 w-6.25 place-items-center rounded-full border-2 border-(--surface) bg-(--surface-hover) text-[8px] text-(--muted-dark)">
          +{people.length - 4}
        </span>
      )}
    </div>
  );
}

export function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone?: string;
}) {
  const status = String(children).toLowerCase().replaceAll(" ", "-");
  const tones: Record<string, string> = {
    "in-progress":
      "bg-[#eef4f7] text-[#547d98] dark:bg-[#2b3c46] dark:text-[#a9c9dc]",
    planning:
      "bg-[#f7f3e9] text-[#8e794c] dark:bg-[#413b2d] dark:text-[#ddca96]",
    "to-do":
      "bg-[#f7f3e9] text-[#8e794c] dark:bg-[#413b2d] dark:text-[#ddca96]",
    completed:
      "bg-[#edf6ef] text-[#4b8a62] dark:bg-[#2d4033] dark:text-[#a6d7b1]",
    "on-hold":
      "bg-[#fbf1ed] text-[#aa765f] dark:bg-[#45362f] dark:text-[#ddb19c]",
    neutral: "bg-(--surface-hover) font-medium text-(--muted-dark)",
    "priority-high":
      "bg-[#fbefeb] text-[#b36955] dark:bg-[#47342f] dark:text-[#e3aa99]",
    "priority-medium":
      "bg-[#f8f3e7] text-[#a17d3e] dark:bg-[#403b2e] dark:text-[#dfcb99]",
    "priority-low":
      "bg-[#eff4ef] text-[#718578] dark:bg-[#303b33] dark:text-[#b6cabc]",
  };
  return (
    <span
      className={`inline-flex min-h-5.25 items-center rounded px-2 py-0.5 text-[9px] font-semibold ${tones[tone ?? status] ?? "bg-[#f0f3f0] text-[#68776c] dark:bg-[#313b34] dark:text-[#bbc7bd]"}`}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="h-1.25 flex-1 overflow-hidden rounded-[5px] bg-(--line)"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% complete`}
    >
      <span
        className="block h-full rounded-[inherit] bg-[#69a586] transition-[width] duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[5px] bg-(--line) after:absolute after:inset-0 after:animate-[shimmer_1.4s_infinite] after:bg-[linear-gradient(90deg,transparent,#ffffff80,transparent)] after:content-[''] dark:after:bg-[linear-gradient(90deg,transparent,#ffffff0c,transparent)] ${className}`}
      aria-hidden="true"
    />
  );
}

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex min-h-13.5 items-center justify-between text-[10px] text-(--muted)">
      <span>
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-1.5">
        <Button
          variant="secondary"
          className="!min-h-7.25 !min-w-7.75 !px-2 !text-[17px]"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </Button>
        <Button
          variant="secondary"
          className="!min-h-7.25 !min-w-7.75 !px-2 !text-[17px]"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          ›
        </Button>
      </div>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] grid animate-[enter_0.15s_ease] place-items-center bg-[#15251db0] p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="w-full max-w-110 rounded-lg border border-(--line) bg-(--surface) p-5 shadow-[0_18px_55px_#10201830]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="mb-4.25 flex items-center justify-between">
          <h2
            className="m-0 font-['Manrope',sans-serif] text-base"
            id="modal-title"
          >
            {title}
          </h2>
          <button
            className="grid h-8.5 w-8.5 place-items-center rounded-md border-0 bg-transparent text-(--muted-dark) hover:bg-(--surface-hover) hover:text-(--text)"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6.5 flex items-end justify-between gap-5 max-[650px]:mb-4.75 max-[650px]:items-start">
      <div>
        {eyebrow && (
          <p className="mt-0 mb-2.25 text-[9px] font-bold tracking-[1.15px] text-[#84988a] max-[650px]:mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="m-0 font-['Manrope',sans-serif] text-[25px] leading-[1.3] font-bold text-(--text) max-[650px]:text-[22px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.25 mb-0 max-w-75 text-xs leading-normal text-(--muted) max-[650px]:text-[11px]">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="max-[650px]:flex-none max-[650px]:self-center max-[650px]:[&>button]:px-2.25 max-[650px]:[&>button]:text-[10px]">
          {action}
        </div>
      )}
    </div>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex min-h-50 flex-col items-center justify-center gap-1.75 text-center">
      <span className="mb-0.75 grid h-8.5 w-8.5 place-items-center rounded-full bg-(--surface-hover) text-xl text-(--muted)">
        —
      </span>
      <strong className="text-xs text-(--text)">{title}</strong>
      <p className="m-0 text-[10px] text-(--muted)">{message}</p>
    </div>
  );
}

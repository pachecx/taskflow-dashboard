import { X } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button className={`button button-${variant} ${className}`} {...props} />
  );
}

export function Avatar({
  src,
  name,
  size = "normal",
}: {
  src?: string;
  name: string;
  size?: "small" | "normal" | "large";
}) {
  return (
    <img
      className={`avatar avatar-${size}`}
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
      className="avatar-stack"
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
        <span className="avatar-more">+{people.length - 4}</span>
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
  return <span className={`badge badge-${tone ?? status}`}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${value}% complete`}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />;
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
    <div className="pagination">
      <span>
        Page {page} of {totalPages}
      </span>
      <div>
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          ‹
        </Button>
        <Button
          variant="secondary"
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
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header>
          <h2 id="modal-title">{title}</h2>
          <button
            className="icon-button"
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
    <div className="page-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </div>
      {action}
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
    <div className="empty-state">
      <span className="empty-mark">—</span>
      <strong>{title}</strong>
      <p>{message}</p>
    </div>
  );
}

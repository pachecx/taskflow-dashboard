import { BriefcaseBusiness, MapPin, Phone, UserRound } from "lucide-react";
import type { UserProfile } from "../../types";

const fields = [
  { key: "fullName", label: "Full Name", icon: UserRound },
  { key: "email", label: "Email Address", icon: null },
  { key: "jobTitle", label: "Job Title", icon: BriefcaseBusiness },
  { key: "phone", label: "Phone", icon: Phone },
  { key: "location", label: "Location", icon: MapPin },
] as const;

export function ProfileInfo({ profile }: { profile: UserProfile }) {
  return (
    <section
      className="min-w-0 rounded-lg border border-(--line) bg-(--surface) px-5.75 py-5 max-[650px]:px-3.25 max-[650px]:py-4"
      aria-labelledby="profile-info-title"
    >
      <div className="mb-4.25 flex items-start justify-between">
        <div>
          <h2
            id="profile-info-title"
            className="m-0 font-['Manrope',sans-serif] text-[13px] font-bold text-(--text)"
          >
            Personal information
          </h2>
          <p className="mt-1 mb-0 text-[10px] text-(--muted)">
            Your details are only visible to people in your workspace.
          </p>
        </div>
      </div>
      <dl className="m-0 grid grid-cols-2 border-t border-(--line) max-[650px]:grid-cols-1">
        {fields.map(({ key, label, icon: Icon }) => (
          <div
            className="min-w-0 border-b border-(--line) py-3.75 pr-3 pb-3.5 last:border-b-0 nth-last-2:border-b-0 max-[650px]:[&:nth-last-child(2)]:border-b"
            key={key}
          >
            <dt className="flex items-center gap-1.5 text-[9px] text-(--muted)">
              {Icon && (
                <Icon size={14} className="text-[#78917f]" aria-hidden="true" />
              )}
              {label}
            </dt>
            <dd className="mt-1.5 mb-0 [overflow-wrap:anywhere] text-[11px] font-medium text-(--text)">
              {profile[key] || (
                <span className="font-normal text-(--muted)">
                  Not added
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

import { BriefcaseBusiness, Mail, PencilLine } from "lucide-react";
import type { UserProfile } from "../../types";
import { Avatar, Button } from "../ui";

export function ProfileHeader({
  profile,
  onEdit,
}: {
  profile: UserProfile;
  onEdit: () => void;
}) {
  return (
    <section className="flex min-h-34.25 items-center gap-4.5 rounded-lg border border-(--line) bg-(--surface) px-6 py-5.5 max-[650px]:min-h-0 max-[650px]:flex-wrap max-[650px]:gap-3 max-[650px]:p-4">
      <Avatar
        src={profile.avatar}
        name={profile.fullName}
        size="large"
        className="!h-19 !w-19 border-[3px] border-(--surface-hover) max-[650px]:!h-14.5 max-[650px]:!w-14.5"
      />
      <div className="grid min-w-0 flex-1 justify-items-start gap-1.25 max-[650px]:max-w-[calc(100%-75px)]">
        <h2 className="m-0 font-['Manrope',sans-serif] text-[18px] font-bold text-(--text) max-[650px]:text-[15px]">
          {profile.fullName}
        </h2>
        <span className="inline-flex items-center gap-1.5 text-[10px] text-(--muted) max-[650px]:max-w-full max-[650px]:[overflow-wrap:anywhere] max-[650px]:text-[9px]">
          <BriefcaseBusiness size={14} />{" "}
          {profile.jobTitle || "Add a job title"}
        </span>
        <a
          className="inline-flex items-center gap-1.5 text-[10px] text-(--muted) hover:text-(--accent-strong) max-[650px]:max-w-full max-[650px]:[overflow-wrap:anywhere] max-[650px]:text-[9px]"
          href={`mailto:${profile.email}`}
        >
          <Mail size={14} /> {profile.email}
        </a>
      </div>
      <Button
        variant="secondary"
        className="shrink-0 max-[650px]:w-full"
        onClick={onEdit}
      >
        <PencilLine size={15} /> Edit Profile
      </Button>
    </section>
  );
}

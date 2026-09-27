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
    <section className="panel profile-hero">
      <Avatar src={profile.avatar} name={profile.fullName} size="large" />
      <div className="profile-hero-copy">
        <h2>{profile.fullName}</h2>
        <span className="profile-role">
          <BriefcaseBusiness size={14} />{" "}
          {profile.jobTitle || "Add a job title"}
        </span>
        <a className="profile-email" href={`mailto:${profile.email}`}>
          <Mail size={14} /> {profile.email}
        </a>
      </div>
      <Button
        variant="secondary"
        className="profile-edit-button"
        onClick={onEdit}
      >
        <PencilLine size={15} /> Edit Profile
      </Button>
    </section>
  );
}

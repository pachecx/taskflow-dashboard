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
      className="panel profile-info-panel"
      aria-labelledby="profile-info-title"
    >
      <div className="profile-section-heading">
        <div>
          <h2 id="profile-info-title">Personal information</h2>
          <p>Your details are only visible to people in your workspace.</p>
        </div>
      </div>
      <dl className="profile-info-grid">
        {fields.map(({ key, label, icon: Icon }) => (
          <div className="profile-info-item" key={key}>
            <dt>
              {Icon && <Icon size={14} aria-hidden="true" />}
              {label}
            </dt>
            <dd>
              {profile[key] || (
                <span className="profile-empty-value">Not added</span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

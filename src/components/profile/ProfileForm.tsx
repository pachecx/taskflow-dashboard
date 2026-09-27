import { useState, type FormEvent } from "react";
import { Button } from "../ui";
import type { UserProfile } from "../../types";
import { AvatarUpload } from "./AvatarUpload";

type ProfileField = "fullName" | "email" | "jobTitle" | "phone" | "location";
type FieldErrors = Partial<Record<ProfileField, string>>;

export function ProfileForm({
  profile,
  isSaving,
  onCancel,
  onSave,
}: {
  profile: UserProfile;
  isSaving: boolean;
  onCancel: () => void;
  onSave: (profile: UserProfile) => Promise<void>;
}) {
  const [draft, setDraft] = useState<UserProfile>({ ...profile });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [saveError, setSaveError] = useState("");

  function updateField(field: ProfileField, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate() {
    const nextErrors: FieldErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneDigits = (draft.phone ?? "").replace(/\D/g, "");
    if (draft.fullName.trim().length < 2) {
      nextErrors.fullName = "Enter your full name (at least 2 characters).";
    }
    if (!draft.email.trim()) nextErrors.email = "Email address is required.";
    else if (!emailPattern.test(draft.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (draft.jobTitle.length > 60) {
      nextErrors.jobTitle = "Job title must be 60 characters or fewer.";
    }
    if (
      draft.phone?.trim() &&
      (!/^[+\d\s().-]+$/.test(draft.phone) || phoneDigits.length < 7)
    ) {
      nextErrors.phone = "Enter a valid phone number.";
    }
    if ((draft.location?.length ?? 0) > 100) {
      nextErrors.location = "Location must be 100 characters or fewer.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaveError("");
    if (!validate()) return;
    try {
      await onSave({
        ...draft,
        fullName: draft.fullName.trim(),
        email: draft.email.trim(),
        jobTitle: draft.jobTitle.trim(),
        phone: draft.phone?.trim() ?? "",
        location: draft.location?.trim() ?? "",
      });
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Profile could not be saved.",
      );
    }
  }

  function renderField(field: ProfileField, label: string, type = "text") {
    const value = draft[field] ?? "";
    const error = errors[field];
    const maxLength =
      field === "jobTitle" ? 60 : field === "location" ? 100 : undefined;
    return (
      <div className="profile-form-field" key={field}>
        <label htmlFor={`profile-${field}`}>{label}</label>
        <input
          id={`profile-${field}`}
          name={field}
          type={type}
          value={value}
          maxLength={maxLength}
          autoComplete={
            field === "fullName"
              ? "name"
              : field === "email"
                ? "email"
                : field === "phone"
                  ? "tel"
                  : "off"
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `profile-${field}-error` : undefined}
          onChange={(event) => updateField(field, event.currentTarget.value)}
        />
        {error && (
          <span
            className="profile-field-error"
            id={`profile-${field}-error`}
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    );
  }

  return (
    <form className="panel profile-form-panel" onSubmit={submit} noValidate>
      <div className="profile-section-heading">
        <div>
          <h2>Edit personal information</h2>
          <p>Update your profile details and photo.</p>
        </div>
      </div>
      <AvatarUpload
        name={draft.fullName}
        avatar={draft.avatar}
        onChange={(avatar) => {
          setDraft((current) => ({ ...current, avatar }));
        }}
      />
      <div className="profile-form-grid">
        {renderField("fullName", "Full Name")}
        {renderField("email", "Email Address", "email")}
        {renderField("jobTitle", "Job Title")}
        {renderField("phone", "Phone", "tel")}
        {renderField("location", "Location")}
      </div>
      {saveError && (
        <p className="profile-save-error" role="alert">
          {saveError}
        </p>
      )}
      <div className="profile-form-actions">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <span className="button-spinner" /> Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

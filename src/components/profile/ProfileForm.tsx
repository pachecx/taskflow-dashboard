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
      <div className="grid min-w-0 content-start gap-1.5" key={field}>
        <label
          className="text-[10px] font-semibold text-(--muted-dark)"
          htmlFor={`profile-${field}`}
        >
          {label}
        </label>
        <input
          className="min-h-9.25 w-full rounded-[5px] border border-(--line) bg-(--surface) px-2.5 text-[10px] text-(--text) outline-none focus:border-[#85b493] aria-invalid:border-[#cb7a68]"
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
            className="text-[9px] text-[#b45f4d] dark:text-[#e5a08e]"
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
    <form
      className="grid min-w-0 gap-4.25 rounded-lg border border-(--line) bg-(--surface) px-5.75 py-5 max-[650px]:px-3.25 max-[650px]:py-4"
      onSubmit={submit}
      noValidate
    >
      <div className="flex items-start justify-between">
        <div>
          <h2 className="m-0 font-['Manrope',sans-serif] text-[13px] font-bold text-(--text)">
            Edit personal information
          </h2>
          <p className="mt-1 mb-0 text-[10px] text-(--muted)">
            Update your profile details and photo.
          </p>
        </div>
      </div>
      <AvatarUpload
        name={draft.fullName}
        avatar={draft.avatar}
        onChange={(avatar) => {
          setDraft((current) => ({ ...current, avatar }));
        }}
      />
      <div className="grid grid-cols-2 gap-x-4.5 gap-y-3.5 max-[650px]:grid-cols-1 max-[650px]:gap-y-3">
        {renderField("fullName", "Full Name")}
        {renderField("email", "Email Address", "email")}
        {renderField("jobTitle", "Job Title")}
        {renderField("phone", "Phone", "tel")}
        {renderField("location", "Location")}
      </div>
      {saveError && (
        <p
          className="m-0 text-[10px] text-[#b45f4d] dark:text-[#e5a08e]"
          role="alert"
        >
          {saveError}
        </p>
      )}
      <div className="flex justify-end gap-2 border-t border-(--line) pt-3.5 max-[650px]:[&>button]:min-w-0 max-[650px]:[&>button]:flex-1">
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
              <span className="h-3.25 w-3.25 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-[#ffffff75] border-t-white" />{" "}
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  );
}

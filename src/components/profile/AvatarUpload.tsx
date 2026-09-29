import { useState, type ChangeEvent } from "react";
import { ImagePlus } from "lucide-react";
import { Avatar } from "../ui";

export function AvatarUpload({
  name,
  avatar,
  onChange,
}: {
  name: string;
  avatar?: string;
  onChange: (image: string) => void;
}) {
  const [error, setError] = useState("");

  function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;
    setError("");
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 1_500_000) {
      setError("Choose an image smaller than 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") onChange(reader.result);
    });
    reader.addEventListener("error", () => {
      setError("This image could not be previewed. Try another file.");
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex items-center gap-3.75 rounded-md border border-(--line) bg-(--page) p-3.5 max-[650px]:items-start max-[650px]:p-2.75">
      <Avatar
        src={avatar}
        name={name || "Profile photo"}
        size="large"
        className="!h-16 !w-16 max-[650px]:!h-13.5 max-[650px]:!w-13.5"
      />
      <div className="grid justify-items-start gap-1.25">
        <strong className="text-[10px] text-(--text)">
          Profile photo
        </strong>
        <span className="text-[9px] text-(--muted)">
          JPG, PNG, or GIF. Maximum size 1.5 MB.
        </span>
        <label className="relative mt-0.5 inline-flex min-h-7.25 cursor-pointer items-center gap-1.5 rounded-[5px] border border-(--line) bg-(--surface) px-2.25 text-[9px] font-semibold text-(--muted-dark) hover:border-[#bdcfc2] focus-within:outline-[3px] focus-within:outline-[#91c4a9] focus-within:outline-offset-2">
          <ImagePlus size={14} /> Change photo
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            aria-label="Choose a profile photo"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "profile-avatar-error" : undefined}
            onChange={selectImage}
          />
        </label>
        {error && (
          <span
            className="text-[9px] text-[#b45f4d] dark:text-[#e5a08e]"
            id="profile-avatar-error"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

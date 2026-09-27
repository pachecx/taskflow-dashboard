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
    <div className="avatar-upload-row">
      <Avatar src={avatar} name={name || "Profile photo"} size="large" />
      <div className="avatar-upload-copy">
        <strong>Profile photo</strong>
        <span>JPG, PNG, or GIF. Maximum size 1.5 MB.</span>
        <label className="avatar-upload-button">
          <ImagePlus size={14} /> Change photo
          <input
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
            className="profile-field-error"
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

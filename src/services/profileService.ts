import type { UserProfile } from "../types";

const profileStorageKey = "taskflow-user-profile";
export const defaultUserProfile: UserProfile = {
  id: "user-alex-morgan",
  fullName: "Alex Morgan",
  email: "alex.morgan@taskflow.com",
  jobTitle: "Product Designer",
  phone: "+1 (415) 555-0138",
  location: "San Francisco, CA",
  avatar:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85",
};

const pause = () => new Promise((resolve) => window.setTimeout(resolve, 180));

export const profileService = {
  async getProfile(): Promise<UserProfile> {
    await pause();
    try {
      const saved = localStorage.getItem(profileStorageKey);
      if (!saved) return { ...defaultUserProfile };
      const parsed: unknown = JSON.parse(saved);
      if (isUserProfile(parsed)) return parsed;
    } catch {
      return { ...defaultUserProfile };
    }
    return { ...defaultUserProfile };
  },

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    await pause();
    try {
      localStorage.setItem(profileStorageKey, JSON.stringify(profile));
      return profile;
    } catch {
      throw new Error("Could not save the profile on this device.");
    }
  },
};

function isUserProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object") return false;
  const profile = value as Partial<UserProfile>;
  return (
    typeof profile.id === "string" &&
    typeof profile.fullName === "string" &&
    typeof profile.email === "string" &&
    typeof profile.jobTitle === "string"
  );
}

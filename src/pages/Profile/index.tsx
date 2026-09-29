import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, RotateCw } from "lucide-react";
import { EmptyState, PageHeading, Skeleton } from "../../components/ui";
import { ProfileForm } from "../../components/profile/ProfileForm";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { profileService } from "../../services/profileService";
import type { UserProfile } from "../../types";

const profileQueryKey = ["user-profile"];

export function ProfilePage() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const profileQuery = useQuery({
    queryKey: profileQueryKey,
    queryFn: profileService.getProfile,
  });
  const saveMutation = useMutation({
    mutationFn: profileService.saveProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(profileQueryKey, profile);
    },
  });

  async function saveProfile(profile: UserProfile) {
    await saveMutation.mutateAsync(profile);
    setEditing(false);
    setSuccess(true);
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR ACCOUNT"
        title="My Profile"
        description="Manage your personal information and account details."
      />
      {success && (
        <div
          className="my-[-10px] mb-3.5 flex items-center gap-2 rounded-[5px] border border-[#d5e8da] bg-[#f0f8f1] px-3 py-2.5 text-[10px] text-[#397950] dark:border-[#355441] dark:bg-[#24372a] dark:text-[#a6d7b1]"
          role="status"
        >
          <Check size={16} /> Profile updated successfully.
          <button
            className="ml-auto border-0 bg-transparent text-[17px] text-inherit"
            type="button"
            onClick={() => setSuccess(false)}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}
      {profileQuery.isPending && (
        <div className="grid gap-3.75" aria-label="Loading profile">
          <Skeleton className="h-34.25 max-[650px]:h-30" />
          <Skeleton className="h-55" />
        </div>
      )}
      {profileQuery.isError && (
        <section
          className="grid min-h-55 content-center justify-items-center rounded-lg border border-(--line) bg-(--surface)"
          role="alert"
        >
          <EmptyState
            title="Profile could not be loaded"
            message="Please try again. Your saved details have not been changed."
          />
          <button
            className="-mt-8.75 mb-7 inline-flex items-center gap-1.5 rounded-[5px] border border-(--line) bg-(--surface) px-2.5 py-1.75 text-[10px] text-(--muted-dark) hover:bg-(--surface-hover)"
            onClick={() => profileQuery.refetch()}
          >
            <RotateCw size={14} /> Try again
          </button>
        </section>
      )}
      {profileQuery.data && (
        <div className="grid gap-3.75 max-[650px]:gap-2.5">
          <ProfileHeader
            profile={profileQuery.data}
            onEdit={() => {
              setSuccess(false);
              setEditing(true);
            }}
          />
          {editing ? (
            <ProfileForm
              key={
                profileQuery.data.id +
                profileQuery.data.email +
                profileQuery.data.fullName
              }
              profile={profileQuery.data}
              isSaving={saveMutation.isPending}
              onCancel={() => setEditing(false)}
              onSave={saveProfile}
            />
          ) : (
            <ProfileInfo profile={profileQuery.data} />
          )}
        </div>
      )}
    </>
  );
}

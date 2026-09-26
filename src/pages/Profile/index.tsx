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
        <div className="profile-success" role="status">
          <Check size={16} /> Profile updated successfully.
          <button
            type="button"
            onClick={() => setSuccess(false)}
            aria-label="Dismiss success message"
          >
            ×
          </button>
        </div>
      )}
      {profileQuery.isPending && (
        <div className="profile-loading" aria-label="Loading profile">
          <Skeleton className="profile-loading-hero" />
          <Skeleton className="profile-loading-panel" />
        </div>
      )}
      {profileQuery.isError && (
        <section className="panel profile-error-state" role="alert">
          <EmptyState
            title="Profile could not be loaded"
            message="Please try again. Your saved details have not been changed."
          />
          <button
            className="profile-retry-button"
            onClick={() => profileQuery.refetch()}
          >
            <RotateCw size={14} /> Try again
          </button>
        </section>
      )}
      {profileQuery.data && (
        <div className="profile-page-content">
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

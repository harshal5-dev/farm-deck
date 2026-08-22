import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  IconArrowLeft,
  IconUser,
  IconBuildingWarehouse,
} from "@tabler/icons-react";
import { selectUser } from "@/features/auth";
import { Reveal } from "@/components/effects";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUpdateProfileMutation, useUpdateTenantMutation } from "../profileApi";
import ProfileForm from "../components/ProfileForm";
import TenantForm from "../components/TenantForm";
import Hero from "../components/Hero";
import { checkIsOwner } from "@/lib/utils";

const Profile = () => {
  const user = useSelector(selectUser);

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [updateTenant, { isLoading: isSavingTenant }] =
    useUpdateTenantMutation();

  const isOwner = checkIsOwner(user?.role);

  const onProfileSubmit = async (values) => {
    try {
      const payload = {
        fullName: values.fullName,
        profilePicture: values.avatarId,
      };
      await updateProfile(payload).unwrap();
      toast.success("Profile updated", {
        description: "Your changes have been saved.",
      });
    } catch (err) {
      toast.error("Could not save profile", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  const onTenantSubmit = async (values) => {
    try {
      const payload = {
        name: values.name?.trim(),
        description: values.description?.trim() || null,
      };
      await updateTenant(payload).unwrap();
      toast.success("Workspace updated", {
        description: "Your workspace details have been saved.",
      });
    } catch (err) {
      toast.error("Could not save workspace", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* ===== Compact back link ===== */}
      <Reveal duration={350}>
        <Link
          to="/app"
          className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <IconArrowLeft
            className="size-3.5 transition-transform group-hover:-translate-x-0.5"
            strokeWidth={1.85}
          />
          Back to Dashboard
        </Link>
      </Reveal>

      {/* ===== Hero ===== */}
      <Hero user={user} isOwner={isOwner} />

      {/* ===== Tabs ===== */}
      <Reveal delay={140} duration={500}>
        <Tabs defaultValue="profile">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TabsList>
              <TabsTrigger value="profile" icon={IconUser}>
                Personal info
              </TabsTrigger>
              {isOwner && (
                <TabsTrigger value="workspace" icon={IconBuildingWarehouse}>
                  Workspace
                </TabsTrigger>
              )}
            </TabsList>
            <p className="text-xs text-muted-foreground sm:text-end">
              Changes save when you press the Save button.
            </p>
          </div>

          {/* §1 — Personal info */}
          <TabsContent value="profile">
            <ProfileForm
              onProfileSubmit={onProfileSubmit}
              isSaving={isSaving}
              user={user}
            />
          </TabsContent>

          {/* §2 — Workspace (tenant) */}
          {isOwner && (
            <TabsContent value="workspace">
              <TenantForm
                onTenantSubmit={onTenantSubmit}
                isSavingTenant={isSavingTenant}
                tenantDetails={user.tenantDetails}
              />
            </TabsContent>
          )}
        </Tabs>
      </Reveal>
    </div>
  );
};

export default Profile;

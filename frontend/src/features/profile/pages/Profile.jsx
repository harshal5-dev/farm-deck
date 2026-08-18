import { Link } from "react-router-dom";
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
import { useSelector } from "react-redux";



/* ============================================================ */

const Profile = () => {
  const user = useSelector(selectUser);

  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();
  const [updateTenant, { isLoading: isSavingTenant }] =
    useUpdateTenantMutation();

  // if (!user) {
  //   return (
  //     <div className="flex min-h-[50vh] items-center justify-center">
  //       <div className="flex flex-col items-center gap-3">
  //         <IconLoader2
  //           className="size-6 animate-spin text-muted-foreground"
  //           strokeWidth={1.75}
  //         />
  //         <p className="text-sm text-muted-foreground">Loading profile…</p>
  //       </div>
  //     </div>
  //   );
  // }

  const isOwner = checkIsOwner(user.role);

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
      toast.success("Company updated", {
        description: "Your company details have been saved.",
      });
    } catch (err) {
      toast.error("Could not save company", {
        description: err?.data?.error?.message || "Please try again.",
      });
    }
  };


  return (
      <div className="mx-auto space-y-5">
        {/* Back link */}
        <Reveal duration={400}>
          <Link
            to="/app"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <IconArrowLeft
              className="size-4 transition-transform group-hover:-translate-x-0.5"
              strokeWidth={1.75}
            />
            Back to Dashboard
          </Link>
        </Reveal>

        {/* ---------------- Hero ---------------- */}
        <Hero user={user} isOwner={isOwner} />

        {/* ---------------- Tabs ---------------- */}
        <Reveal delay={180} duration={500}>
          <Tabs defaultValue="profile" className="mx-auto">
            <div className="flex items-center justify-between gap-3">
              <TabsList>
                <TabsTrigger value="profile" icon={IconUser}>
                  Personal info
                </TabsTrigger>
                {isOwner && (<TabsTrigger value="company" icon={IconBuildingWarehouse}>
                  Company
                </TabsTrigger>)}
              </TabsList>
              <p className="hidden text-xs text-muted-foreground sm:block">
                Changes save when you press the Save button.
              </p>
            </div>

            {/* §1 — Personal info (always-on form, popover avatar) */}
            <TabsContent value="profile">
              <ProfileForm onProfileSubmit={onProfileSubmit} isSaving={isSaving} user={user} />
            </TabsContent>

          {/* §2 — Company (tenant) */}
          { isOwner && (<TabsContent value="company">
              <TenantForm onTenantSubmit={onTenantSubmit} isSavingTenant={isSavingTenant} tenantDetails={user.tenantDetails} />
            </TabsContent>
          )}
          </Tabs>
        </Reveal>
      </div>

  );
}

export default Profile;

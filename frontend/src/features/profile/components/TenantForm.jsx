import { useForm, useWatch } from "react-hook-form";
import {
  IconBuildingWarehouse,
  IconCheck,
  IconCircleCheckFilled,
  IconFingerprint,
  IconLoader2,
  IconNote,
} from "@tabler/icons-react";
import { Reveal } from "@/components/effects";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FieldWrapper from "@/components/ui/field-wrapper";
import LockedField from "@/components/ui/locked-field";
import WorkspaceIdentityPreview from "./WorkspaceIdentityPreview";

const fieldLabel =
  "text-xs font-semibold tracking-wide text-muted-foreground uppercase";

const TenantForm = ({ onTenantSubmit, isSavingTenant, tenantDetails = {} }) => {
  const tenantName = tenantDetails?.name || "";
  const tenantDescription = tenantDetails?.description || "";
  const tenantSubdomain = tenantDetails?.subdomain || "";

  const tenantForm = useForm({
    defaultValues: {
      name: tenantName,
      description: tenantDescription,
    },
  });

  const watchedNameReal = useWatch({ control: tenantForm.control, name: "name" });
  const watchedDescription = useWatch({
    control: tenantForm.control,
    name: "description",
  });
  const tenantIsDirty =
    (watchedNameReal ?? "") !== tenantName ||
    (watchedDescription ?? "") !== tenantDescription;

  const onTenantReset = () =>
    tenantForm.reset({ name: tenantName, description: tenantDescription });

  return (
    <Reveal delay={60} duration={500}>
      <div className="glass-card texture-paper highlight-edge min-w-0 overflow-hidden rounded-2xl p-4 sm:p-5">
        <Form {...tenantForm}>
          <form onSubmit={tenantForm.handleSubmit(onTenantSubmit)} noValidate>
            <div className="grid w-full min-w-0 items-stretch gap-5 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] lg:gap-5">
              {/* ===== Left — workspace preview ===== */}
              <div className="min-w-0">
                <WorkspaceIdentityPreview
                  name={watchedNameReal}
                  subdomain={tenantSubdomain}
                  description={watchedDescription}
                />
              </div>

              {/* ===== Right — form fields ===== */}
              <div className="flex min-w-0 flex-col gap-3.5">
                <FormField
                  control={tenantForm.control}
                  name="name"
                  rules={{
                    required: "Company name is required",
                    minLength: {
                      value: 2,
                      message: "At least 2 characters",
                    },
                    maxLength: {
                      value: 100,
                      message: "Too long",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem className="gap-1.5">
                      <FormLabel className={fieldLabel}>
                        Company name
                      </FormLabel>
                      <FormControl>
                        <FieldWrapper
                          icon={IconBuildingWarehouse}
                          hasError={fieldState.invalid}
                        >
                          <Input
                            placeholder="Your farm organization name"
                            autoComplete="organization"
                            className="border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                          />
                        </FieldWrapper>
                      </FormControl>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />

                <LockedField
                  icon={IconFingerprint}
                  label="Subdomain"
                  value={tenantSubdomain ? `${tenantSubdomain}.farmdeck.app` : "—"}
                  hint="Subdomain is set when the workspace is created and can't be changed here."
                />

                <FormField
                  control={tenantForm.control}
                  name="description"
                  rules={{
                    maxLength: {
                      value: 500,
                      message: "Description is too long",
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <FormItem className="gap-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <FormLabel className={fieldLabel}>
                          Description
                        </FormLabel>
                        <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                          {field.value?.length ?? 0}/500
                        </span>
                      </div>
                      <FormControl>
                        <FieldWrapper
                          icon={IconNote}
                          align="start"
                          hasError={fieldState.invalid}
                        >
                          <Textarea
                            placeholder="Tell members what this workspace is for…"
                            className="min-h-24 resize-y border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FieldWrapper>
                      </FormControl>
                      <p className="text-[11px] text-muted-foreground">
                        A short blurb about your farm organization. Members
                        see this in their workspace switcher.
                      </p>
                      <FormMessage className="text-[11px]" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* ===== Footer ===== */}
            <div className="mt-4 flex flex-col gap-3 border-t border-border/40 pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
              <p className="text-[11px] text-muted-foreground sm:order-1">
                {tenantIsDirty ? (
                  <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <span className="size-1.5 rounded-full bg-amber-500" />
                    Unsaved changes
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-muted-foreground/70">
                    <IconCircleCheckFilled className="size-3 text-leaf" />
                    All changes saved
                  </span>
                )}
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-2 sm:order-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onTenantReset}
                  disabled={!tenantIsDirty || isSavingTenant}
                  className="w-full sm:w-auto"
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  disabled={!tenantIsDirty || isSavingTenant}
                  className="w-full gap-2 shadow-md shadow-leaf/20 sm:w-auto"
                >
                  {isSavingTenant ? (
                    <IconLoader2
                      className="size-4 animate-spin"
                      strokeWidth={2}
                    />
                  ) : (
                    <IconCheck className="size-4" strokeWidth={2} />
                  )}
                  {isSavingTenant ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </Reveal>
  );
};

export default TenantForm;

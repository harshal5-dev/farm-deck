
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { IconBuilding, IconBuildingWarehouse, IconCheck, IconLoader2, IconNote } from "@tabler/icons-react";
import { useForm, useWatch } from "react-hook-form";

const TenantForm = ({ onTenantSubmit, isSavingTenant, tenantDetails = {} }) => {

  const tenantName = tenantDetails?.name || "";
  const tenantDescription = tenantDetails?.description || "";
  const tenantInitial =
    (tenantName || "F").trim().charAt(0).toUpperCase() || "F";

  const tenantForm = useForm({
    defaultValues: {
      name: tenantName,
      description: tenantDescription,
    },
  });

  const watchedName = useWatch({ control: tenantForm.control, name: "name" });
  const watchedDescription = useWatch({ control: tenantForm.control, name: "description" });
  const tenantIsDirty =
    (watchedName ?? "") !== tenantName ||
    (watchedDescription ?? "") !== tenantDescription;

  const onTenantReset = () =>
    tenantForm.reset({ name: tenantName, description: tenantDescription });

  return (
    <Form {...tenantForm}>
      <form
        onSubmit={tenantForm.handleSubmit(onTenantSubmit)}
        noValidate
      >
        <Card className="glass-card texture-paper">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-sky-warm/25 to-sky-warm/5 text-sky-warm ring-1 ring-white/10 ring-inset dark:ring-white/5">
                <IconBuildingWarehouse
                  className="size-4.5"
                  strokeWidth={1.75}
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-heading text-base font-semibold tracking-tight">
                  Company
                </h3>
                <p className="text-xs text-muted-foreground">
                  Your farm organization and workspace details
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <FieldGroup>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-start sm:gap-7">
                {/* Left column — Workspace identity card */}
                <div className="flex flex-col items-center">
                  <FieldLabel className="flex items-center gap-1.5">
                    <IconBuilding
                      className="size-3.5 text-muted-foreground"
                      strokeWidth={1.75}
                    />
                    Workspace
                  </FieldLabel>
                  <div className="relative w-full max-w-48">
                    <div className="absolute -inset-1 rounded-3xl bg-linear-to-br from-sky-warm/30 via-leaf/20 to-clay/30 opacity-70 blur-md" />
                    <div className="relative overflow-hidden rounded-2xl border border-foreground/5 bg-card/40 p-4 shadow-md">
                      <div className="absolute inset-0 bg-linear-to-br from-sky-warm/15 via-transparent to-leaf/10" />
                      <div className="pattern-contour absolute inset-0 opacity-50 mix-blend-soft-light" />
                      <div className="relative flex flex-col items-center gap-3 text-center">
                        <div className="relative shrink-0">
                          <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-sky-warm/40 to-leaf/40 opacity-70 blur-md" />
                          <div className="relative flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-sky-warm via-leaf to-sage-deep text-3xl font-bold text-white shadow-md ring-2 ring-background">
                            {tenantInitial}
                          </div>
                        </div>
                        <div className="w-full min-w-0">
                          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
                            {tenantName || "Your company"}
                          </p>
                          {tenantDetails?.subdomain && (
                            <p className="mt-0.5 truncate rounded-md bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                              {tenantDetails.subdomain}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column — Editable form + locked fields */}
                <div className="flex flex-col gap-4">
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5">
                          <IconBuildingWarehouse
                            className="size-3.5 text-muted-foreground"
                            strokeWidth={1.75}
                          />
                          Company name
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <IconBuildingWarehouse
                              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                              strokeWidth={1.75}
                            />
                            <Input
                              placeholder="Your farm organization name"
                              autoComplete="organization"
                              className="pl-9"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
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
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between gap-2">
                          <FormLabel className="flex items-center gap-1.5">
                            <IconNote
                              className="size-3.5 text-muted-foreground"
                              strokeWidth={1.75}
                            />
                            Description
                          </FormLabel>
                          <span className="text-[10px] text-muted-foreground/70 tabular-nums">
                            {field.value?.length ?? 0}/500
                          </span>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <IconNote
                              className="pointer-events-none absolute top-3 left-3 size-4 text-muted-foreground"
                              strokeWidth={1.75}
                            />
                            <Textarea
                              placeholder="Tell members what this workspace is for…"
                              className="resize-y pl-9"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          A short blurb about your farm organization.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </FieldGroup>
          </CardContent>

          <Separator />

          <div className="flex flex-wrap items-center justify-end gap-2 px-6 py-3 sm:px-8">
            <Button
              type="button"
              variant="ghost"
              onClick={onTenantReset}
              disabled={!tenantIsDirty || isSavingTenant}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={!tenantIsDirty || isSavingTenant}
              className="gap-2"
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
        </Card>
      </form>
    </Form>
  );
};

export default TenantForm;

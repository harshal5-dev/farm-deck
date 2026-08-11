import { IconLoader2 } from "@tabler/icons-react";


const FullPageLoader = () => {
  return (
    <div className="flex min-h-svh items-center justify-center bg-background">
      <div className="relative flex flex-col items-center gap-4">
        <div
          className="absolute -inset-8 rounded-full bg-leaf/10 blur-2xl"
          aria-hidden="true"
        />
        <div className="relative flex size-14 items-center justify-center rounded-2xl bg-leaf/10 ring-1 ring-leaf/20">
          <IconLoader2
            className="size-7 animate-spin text-leaf"
            strokeWidth={1.75}
          />
        </div>
        <p className="text-sm font-medium text-muted-foreground">
          Loading your farm…
        </p>
      </div>
    </div>
  );
};

export default FullPageLoader;

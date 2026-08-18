
const Greeting = ({ user }) => {
  const hour = new Date().getHours();
  let greeting = "Good evening";
  let emoji = "🌙";
  if (hour < 12) {
    greeting = "Good morning";
    emoji = "🌅";
  } else if (hour < 17) {
    greeting = "Good afternoon";
    emoji = "☀️";
  }

  const fullName = user?.fullName || "";
  const firstName = (fullName || "there").split(" ")[0];

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span
        aria-hidden
        className="flex shrink-0 items-center justify-center text-lg sm:text-xl"
      >
        {emoji}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-sm font-semibold tracking-tight">
          {greeting},{" "}
          <span className="bg-linear-to-r from-leaf to-sage-deep bg-clip-text text-transparent">
            {firstName}
          </span>
        </p>
        <p className="hidden truncate text-[11px] text-muted-foreground sm:block">
          Here's what's growing today 🌱
        </p>
      </div>
    </div>
  );
}

export default Greeting;

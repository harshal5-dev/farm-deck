
const BackgroundDecor = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Soft sage glow — top right (sunlight on a field) */}
      <div className="absolute -top-48 -right-40 size-150 animate-glow-pulse rounded-full bg-sage/10 blur-[100px] dark:bg-sage/12" />
      {/* Clay/warm tint — bottom left */}
      <div className="absolute -bottom-48 -left-44 size-140 animate-glow-pulse rounded-full bg-clay/8 blur-[100px] [animation-delay:1.2s] dark:bg-clay-deep/10" />
      {/* Sky tint near center */}
      <div className="absolute right-1/4 bottom-1/4 size-95 rounded-full bg-sky-warm/8 blur-[90px] dark:bg-sky-warm/6" />
    </div>
  );
}

export default BackgroundDecor;

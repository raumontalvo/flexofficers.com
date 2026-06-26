export function FlowArrow() {
  return (
    <div
      className="flex flex-col items-center justify-center py-3 sm:py-4"
      aria-hidden="true"
    >
      <div className="h-8 w-px bg-gradient-to-b from-fo-primary/40 to-fo-primary/10" />
      <svg
        viewBox="0 0 24 24"
        className="mt-1 h-4 w-4 text-fo-primary-hover/70"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14M7 14l5 5 5-5" />
      </svg>
    </div>
  );
}

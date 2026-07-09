const STEPS = ["Submitted", "Review", "Interview", "Offer"];

// Map an application status to how far along the pipeline it is (0-3), or "closed".
export function statusStep(status: string): number {
  switch (status) {
    case "new":
      return 0;
    case "reviewed":
      return 1;
    case "interview":
      return 2;
    case "hire":
      return 3;
    default:
      return 0;
  }
}

export default function Stepper({ status }: { status: string }) {
  const rejected = status === "reject";
  const step = statusStep(status);
  const pct = rejected ? 100 : ((step + 1) / STEPS.length) * 100;
  const color = rejected ? "bg-[#ba1a1a]" : "bg-primary";

  return (
    <div className="pt-2">
      <div className="relative h-1 w-full bg-surface-container rounded-full">
        <div className={`absolute top-0 left-0 h-1 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-tight text-on-surface-variant mt-2">
        {rejected ? (
          <span className="text-[#ba1a1a] font-bold">Not selected</span>
        ) : (
          STEPS.map((s, i) => (
            <span key={s} className={i <= step ? "text-primary font-bold" : ""}>
              {s}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

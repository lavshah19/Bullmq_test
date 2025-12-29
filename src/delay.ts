import { differenceInMilliseconds, parseISO } from "date-fns";

interface TimingInput {
  timing: string;
  timingDuration?: "minutes" | "hours";
  createdAt: string;
}

export function calculateDelay({
  timing,
  timingDuration,
  createdAt,
}: TimingInput): number {
  const now = new Date();

  // Case 1: minutes / hours
  if (timingDuration) {
    const value = Number(timing);

    if (timingDuration === "minutes") return value * 60 * 1000;
    if (timingDuration === "hours") return value * 60 * 60 * 1000;
  }

  // Case 2: specific time like "10:00"
  if (timing.includes(":")) {
    const [hours, minutes] = timing.split(":").map(Number);

    const baseDate = parseISO(createdAt);
    const target = new Date(baseDate);
    target.setHours(hours, minutes, 0, 0);

    // if time already passed → next day
    if (target < now) {
      target.setDate(target.getDate() + 1);
    }

    return differenceInMilliseconds(target, now);
  }

  return 0;
}

import { addDays, addHours, addMinutes, setHours, setMinutes } from "date-fns";

export function calculateDelay(
  timing: string,
  baseTime: Date,
  timingDuration?: string,
  day?: string | null
): number {
  let target = new Date(baseTime);

  if (day !== undefined && day !== null) {
    target = addDays(target, parseInt(day, 10));
  }

  if (timing.includes(":")) {
    // Clock time: "10:00", "11:32"
    const [h, m] = timing.split(":").map(Number);
    target = setHours(target, h);
    target = setMinutes(target, m);
    target.setSeconds(0);
    target.setMilliseconds(0);

    if (target <= baseTime) {
      target = addDays(target, 1);
    }
  } else {
    // Relative: "0", "15", "24"
    const amount = parseInt(timing, 10);
    if (timingDuration === "minutes") {
      target = addMinutes(target, amount);
    } else if (timingDuration === "hours") {
      target = addHours(target, amount);
    }
  }

  const delay = target.getTime() - baseTime.getTime();
  return delay > 0 ? delay : 0;
}
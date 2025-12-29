import { calculateDelay } from "../utils/delayCalculator";
import { JobChainBuilder } from "../utils/jobBuilder";

export function scheduleBookingConfirmations(
  builder: JobChainBuilder,
  confirmations: any[],
  baseTime: Date
): void {
  if (!confirmations?.length) return;

  confirmations.forEach((conf: any) => {
    const delay = calculateDelay(conf.timing, baseTime, conf.timingDuration);
    builder.addJob({
      name: `confirmation-${conf._id}`,
      data: { type: "bookingConfirmation", item: conf },
      queueName: "bookingQueue",
      opts: {},
    }, delay);
  });
}

export function scheduleFirstFollowUp(
  builder: JobChainBuilder,
  followUp: any,
  baseTime: Date
): void {
  const delay = calculateDelay(followUp.timing, baseTime, followUp.timingDuration);
  builder.addJob({
    name: "firstFollowUp",
    data: { type: "firstFollowUp", item: followUp },
    queueName: "bookingQueue",
    opts: {},
  }, delay);
}

export function scheduleFinalFollowUp(
  builder: JobChainBuilder,
  followUp: any,
  baseTime: Date
): void {
  const delay = calculateDelay(followUp.timing, baseTime, followUp.timingDuration);
  builder.addJob({
    name: "finalFollowUp",
    data: { type: "finalFollowUp", item: followUp },
    queueName: "bookingQueue",
    opts: {},
  }, delay);
}

export function scheduleFeedbackRequest(
  builder: JobChainBuilder,
  feedback: any,
  baseTime: Date,
  isActive: boolean
): void {
  if (!isActive) return;

  const delay = calculateDelay(feedback.timing, baseTime, feedback.timingDuration);
  builder.addJob({
    name: "feedbackRequest",
    data: { type: "feedbackRequest", item: feedback },
    queueName: "bookingQueue",
    opts: {},
  }, delay);
}

export function scheduleFollowUps(
  builder: JobChainBuilder,
  followUps: any[],
  baseTime: Date
): void {
  if (!followUps?.length) return;

  followUps.forEach((fu: any) => {
    const day = fu.day ?? null;
    const delay = calculateDelay(fu.timing, baseTime, fu.timingDuration, day);
    builder.addJob({
      name: `followUp-${fu._id}`,
      data: { type: "followUp", item: fu },
      queueName: "bookingQueue",
      opts: {},
    }, delay);
  });
}
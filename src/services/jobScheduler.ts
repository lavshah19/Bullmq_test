import { JobType } from "../const";
import { calculateDelay } from "../utils/delayCalculator";
import { JobChainBuilder } from "../utils/jobBuilder";

export async function scheduleBookingConfirmations(
  builder: JobChainBuilder,
  confirmations: any[],
  baseTime: Date
): Promise<void> {
  if (!confirmations?.length) return;

  for (const conf of confirmations) {
    const delay = calculateDelay(conf.timing, baseTime, conf.timingDuration);
    await builder.addJob({
      jobName: `confirmation-${conf._id}`,
      type: JobType.BookingConfirmation,
      item: conf
    }, delay);
  }
}

export async function scheduleFirstFollowUp(
  builder: JobChainBuilder,
  followUp: any,
  baseTime: Date
): Promise<void> {
  if (!followUp) return;

  const delay = calculateDelay(followUp.timing, baseTime, followUp.timingDuration);
  await builder.addJob({
    jobName: JobType.FirstFollowUp,
    type: JobType.FirstFollowUp,
    item: followUp
  }, delay);
}

export async function scheduleFinalFollowUp(
  builder: JobChainBuilder,
  followUp: any,
  baseTime: Date
): Promise<void> {
  if (!followUp) return;

  const delay = calculateDelay(followUp.timing, baseTime, followUp.timingDuration);
  await builder.addJob({
    jobName: 'finalFollowUp',
    type: JobType.FinalFollowUp,
    item: followUp
  }, delay);
}

export async function scheduleFeedbackRequest(
  builder: JobChainBuilder,
  feedback: any,
  baseTime: Date,
  isActive: boolean
): Promise<void> {
  if (!isActive || !feedback) return;
  
  const delay = calculateDelay(feedback.timing, baseTime, feedback.timingDuration);
  await builder.addJob({
    jobName: 'feedbackRequest',
    type: JobType.FeedbackRequest,
    item: feedback
  }, delay);
}

export async function scheduleFollowUps(
  builder: JobChainBuilder,
  followUps: any[],
  baseTime: Date
): Promise<void> {
  if (!followUps?.length) return;

  for (const fu of followUps) {
    const day = fu.day ?? null;
    const delay = calculateDelay(fu.timing, baseTime, fu.timingDuration, day);
    await builder.addJob({
      jobName: `followUp-${fu._id}`,
      type: JobType.FollowUp,
      item: fu
    }, delay);
  }
}
import dotenv from "dotenv";
dotenv.config();

import { FlowProducer } from "bullmq";
import { redisConnection } from "./config/redis";
import { JobChainBuilder } from "./utils/jobBuilder";
import {
  scheduleBookingConfirmations,
  scheduleFirstFollowUp,
  scheduleFinalFollowUp,
  scheduleFeedbackRequest,
  scheduleFollowUps,
} from "./services/jobScheduler";

const flowProducer = new FlowProducer({ connection: redisConnection });

export async function addBookingFlow(data: any): Promise<void> {
  const now = new Date();
  console.log("Scheduling booking flow at:", now.toISOString());

  const builder = new JobChainBuilder();

  // Build job chain
  scheduleBookingConfirmations(builder, data.bookingConfirmation, now);
  scheduleFirstFollowUp(builder, data.firstFollowUp, now);
  scheduleFinalFollowUp(builder, data.finalFollowUp, now);
  scheduleFeedbackRequest(builder, data.feedbackRequest, now, data.feedbackRequestActive);
  scheduleFollowUps(builder, data.followUp, now);

  const jobs = builder.getJobs();
  
  if (jobs.length === 0) {
    console.log("No jobs to add.");
    return;
  }

  await flowProducer.add({
    name: "bookingRoot",
    queueName: "bookingQueue",
    data: { startedAt: now.toISOString() },
    children: jobs,
  });

  console.log(`Booking flow scheduled with ${jobs.length} jobs in strict sequence`);
}



import mongoose from "mongoose";
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

export async function addBookingFlow(
  data: any, 
  bookingId?: string
): Promise<{ jobCount: number; bookingId: string }> {
  const now = new Date();
  const generatedBookingId = bookingId || new mongoose.Types.ObjectId().toString();
  
  console.log("Scheduling booking flow at:", now.toISOString());
  console.log("Booking ID:", generatedBookingId);

  const builder = new JobChainBuilder(now, generatedBookingId);

  await scheduleBookingConfirmations(builder, data.bookingConfirmation, now);
  await scheduleFirstFollowUp(builder, data.firstFollowUp, now);
  await scheduleFinalFollowUp(builder, data.finalFollowUp, now);
  await scheduleFeedbackRequest(builder, data.feedbackRequest, now, data.feedbackRequestActive);
  await scheduleFollowUps(builder, data.followUp, now);

  const jobs = builder.getJobs();
  
  if (builder.getJobCount() === 0) {
    console.log("No jobs to add.");
    return { jobCount: 0, bookingId: generatedBookingId };
  }

  await flowProducer.add({
    name: "bookingRoot",
    queueName: "bookingQueue",
    data: { 
      startedAt: now.toISOString(),
      bookingId: generatedBookingId
    },
    children: jobs,
  });

  console.log(`Booking flow scheduled with ${jobs.length} jobs in strict sequence`);
  
  return { 
    jobCount: jobs.length, 
    bookingId: generatedBookingId 
  };
}
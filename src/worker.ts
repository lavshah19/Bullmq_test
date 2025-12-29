import { Worker, Job } from "bullmq";
import { redisConnection } from "./config/redis";

export const startWorker = () => {
  const worker = new Worker(
    "bookingQueue",
    async (job: Job) => {
      console.log("Processing booking data:", job.data);
      // Add email/WhatsApp sending logic here
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });
};

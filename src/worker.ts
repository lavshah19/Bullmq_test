import { Worker, Job } from "bullmq";
import { redisConnection } from "./config/redis";
import { JobDataService } from "./services/jobDataService";
import { processJob } from "./services/processJobService";

export const startWorker = () => {
  const worker = new Worker(
    "bookingQueue",
    async (job: Job) => {
      // console.log("Processing job:", job);
      const { jobDataId } = job.data;
      // console.log("Job data ID:", jobDataId);
      if (!jobDataId) {
        console.error("No jobDataId provided for job:", job.name);
        return;
      }
      const jobData = await JobDataService.markProcessing(jobDataId);

      if (!jobData) {
        throw new Error(`Job data not found: ${jobDataId}`);
      }
      try {
        await processJob(jobData);
        await JobDataService.markCompleted(jobDataId);
        console.log(`Job ${job.name} completed successfully`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        await JobDataService.markFailed(jobDataId, errorMessage);
        throw error; 
      }
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on("completed", (job) => {
    console.log(` Job ${job.id} (${job.name}) completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} (${job?.name}) failed:`, err.message);
  });

  console.log("Worker started and listening for jobs...");
};





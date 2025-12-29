import { Worker, Job } from "bullmq";
import { redisConnection } from "./config/redis";

export const startWorker = () => {
  const worker = new Worker(
    "bookingQueue",
    async (job: Job) => {
      const { type, item} = job.data;

      console.log(`Processing job: ${job.name} - Type: ${type}`);

      switch (type) {
        case "bookingConfirmation":
          console.log("Sending Booking Confirmation:", item.channel[0], item.template);
          // here you can send the booking confirmation email
          break;
        case "firstFollowUp":
          console.log("Sending First FollowUp:", item.channel[0], item.template);
          break;
          // yesma pani same 
        case "finalFollowUp":
          console.log("Sending Final FollowUp:", item.channel[0], item.template);
          break;
        
        case "feedbackRequest":
          console.log("Sending Feedback Request:", item.channel[0], item.template);
          break;
        case "followUp":
          console.log("Sending FollowUp message:", item.channel[0], item.timing, item.template);
          break;
        default:
          console.log("Unknown job type:", job.data);
      }
    },
    { connection: redisConnection }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} (${job.name}) completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} (${job?.name}) failed:`, err);
  });
};
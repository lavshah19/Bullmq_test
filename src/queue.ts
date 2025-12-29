import { Queue } from "bullmq";
import { redisConnection } from "./config/redis";

export const bookingQueue = new Queue("bookingQueue", { connection: redisConnection });

export const addBookingJob = async (data: any) => {
  await bookingQueue.add("sendBooking", data,{
    delay: 5000 
  });
};

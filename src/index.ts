import dotEnv from "dotenv"
dotEnv.config();
import { bookingData } from "./dummy_data/data";
import { addBookingJob } from "./queue";
import { startWorker } from "./worker";
startWorker(); 
addBookingJob(bookingData);

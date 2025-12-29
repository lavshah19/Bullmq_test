import dotEnv from "dotenv"
dotEnv.config();
import { bookingData } from "./dummy_data/data";

import { startWorker } from "./worker";
import { addBookingFlow } from "./queue";
startWorker(); 
addBookingFlow(bookingData);


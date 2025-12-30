import dotenv from 'dotenv';
dotenv.config();
import { connectToDB } from './config/db';
import { startWorker } from './worker';
import { addBookingFlow } from './queue';
import { bookingData } from './dummy_data/data';

async function main() {
  await connectToDB();
  startWorker();
    const result = await addBookingFlow(bookingData);}

main().catch(console.error);
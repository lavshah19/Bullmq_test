import { IJobData } from "../models/BookingJob.model";
import { emailService } from "../services/emailService";

export async function processJob(jobData: IJobData): Promise<void> {
  const { type, channel, template, payload } = jobData;

  switch (type) {
    case "bookingConfirmation":
    case "firstFollowUp":
    case "finalFollowUp":
    case "feedbackRequest":
    case "followUp":
      await sendMail(channel, template, payload);
      break;

    default:
      console.log("Unknown job type:", type);
  }
}

export async function sendMail(
  channels: string[],
  template: string,
  data: Record<string, any>
): Promise<void> {
  for (const ch of channels) {
    switch (ch.toLowerCase()) {
      case "mail":
        await emailService.send(template, data);
        break;

      case "whatsapp":
        await emailService.send(template, data); // for now i used same service for whatsapp and sms later will be different
        break;

      case "sms":
        await emailService.send(template, data);
        break;
    }
  }
}

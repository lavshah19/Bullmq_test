import { JobStatus, JobType } from '../const';
import { JobData, IJobData,} from '../models/BookingJob.model';

export interface CreateJobDataInput {
  jobName: string;
  type: JobType;
  item: Record<string, any>;
  scheduledAt: Date;
  bookingId?: string;
}

export class JobDataService {
  
// Create job data
  static async createJobData(input: CreateJobDataInput): Promise<string> {
    const jobData = new JobData({
      jobName: input.jobName,
      type: input.type,
      status: JobStatus.Pending,
      payload: input.item,
      channel: input.item.channel || [],
      template: input.item.template || '',
      timing: input.item.timing || '',
      timingDuration: input.item.timingDuration || '',
      day: input.item.day,
      bookingId: input.bookingId,
      scheduledAt: input.scheduledAt,
      attempts: 0
    });

    const saved = await jobData.save();
    return saved._id.toString();
  }

  // check if jobAlreayExists
  static async jobAlreadyExists(bookingId: string | undefined ): Promise<boolean> {
    const isExists=await JobData.findOne({ bookingId });
    return isExists ? true : false;
  }

 // Mark job as processing
  static async markProcessing(id: string): Promise<IJobData | null> {
    return JobData.findByIdAndUpdate(
      id,
      { 
        $set: { status: 'processing' },
        $inc: { attempts: 1 }
      },
      { new: true }
    );
  }

/// Mark job as completed
  static async markCompleted(id: string): Promise<void> {
    await JobData.findByIdAndUpdate(id, {
      $set: { 
        status: 'completed',
        processedAt: new Date()
      }
    });
  }

/// Mark job as failed
  static async markFailed(id: string, error: string): Promise<void> {
    await JobData.findByIdAndUpdate(id, {
      $set: { 
        status: 'failed',
        processedAt: new Date(),
        error
      }
    });
  }

}
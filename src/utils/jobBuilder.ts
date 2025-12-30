import { JobType } from "../const";
import { JobDataService, CreateJobDataInput } from "../services/jobDataService";

interface JobConfig {
  name: string;
  data: { jobDataId: string };
  queueName: string;
  opts?: any;
}

interface AddJobInput {
  jobName: string;
  type: JobType;
  item: Record<string, any>;
  bookingId?: string;
}

export class JobChainBuilder {
  private children: JobConfig[] = [];
  private previous: JobConfig | null = null;
  private cumulativeDelay = 0;
  private baseTime: Date;
  private bookingId?: string;

  constructor(baseTime: Date, bookingId?: string) {
    this.baseTime = baseTime;
    this.bookingId = bookingId;
  }
  async addJob(input: AddJobInput, itemDelay: number): Promise<void> {
    this.cumulativeDelay += itemDelay;

    // Calculate scheduled time
    const scheduledAt = new Date(
      this.baseTime.getTime() + this.cumulativeDelay
    );

    // Save to MongoDB first
    // check if jobAlreayExists
    // const jobAlreadyExists = await JobDataService.jobAlreadyExists(this.bookingId || input.bookingId);
    // if (jobAlreadyExists) {
    //   console.log(`Job already exists for bookingId: ${this.bookingId || input.bookingId}`);
    //   return;
    // }

    const jobDataId = await JobDataService.createJobData({
      jobName: input.jobName,
      type: input.type,
      item: input.item,
      scheduledAt,
      bookingId: this.bookingId || input.bookingId,
    });

    // Create job config with only the MongoDB ID
    const config: JobConfig = {
      name: input.jobName,
      data: { jobDataId },
      queueName: "bookingQueue",
      opts: {
        delay: this.cumulativeDelay,
      },
    };

    if (this.previous) {
      config.opts.parent = {
        id: this.previous.name,
        queueName: "bookingQueue",
      };
    }

    this.children.push(config);
    this.previous = config;

    // console.log(`Job saved to MongoDB: ${jobDataId} (${input.type})`);
  }

  getJobs(): JobConfig[] {
    return this.children;
  }

  getJobCount(): number {
    return this.children.length;
  }
}

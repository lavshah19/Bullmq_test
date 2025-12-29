interface JobConfig {
  name: string;
  data: any;
  queueName: string;
  opts?: any;
}

export class JobChainBuilder {
  private children: JobConfig[] = [];
  private previous: JobConfig | null = null;
  private cumulativeDelay = 0;

  addJob(config: JobConfig, itemDelay: number): void {
    this.cumulativeDelay += itemDelay;

    config.opts = {
      ...config.opts,
      delay: this.cumulativeDelay,
    };

    if (this.previous) {
      config.opts.parent = { 
        id: this.previous.name, 
        queueName: "bookingQueue" 
      };
    }

    this.children.push(config);
    this.previous = config;
  }

  getJobs(): JobConfig[] {
    return this.children;
  }

  getJobCount(): number {
    return this.children.length;
  }
}
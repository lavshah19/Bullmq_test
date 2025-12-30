import mongoose, { Schema, Document, Types } from "mongoose";
import { JobStatus, JobType } from "../const";

export interface IJobData extends Document {
  _id: Types.ObjectId;
  jobName: string;
  type: JobType;
  status: JobStatus;
  payload: Record<string, any>;

  channel: string[];
  template: string;
  timing: string;
  timingDuration: string;
  day?: string;

  bookingId?: string;
  scheduledAt: Date;
  processedAt?: Date;
  attempts: number;
  error?: string;

  createdAt: Date;
  updatedAt: Date;
}

const JobDataSchema = new Schema<IJobData>(
  {
    jobName: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: JobType,
      index: true,
    },
    status: {
      type: String,
      enum: JobStatus,
      default: JobStatus.Pending,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },

    
    channel: [{ type: String }],
    template: { type: String },
    timing: { type: String },
    timingDuration: { type: String },
    day: { type: String },

    bookingId: {
      type: String,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    processedAt: { type: Date },
    attempts: {
      type: Number,
      default: 0,
    },
    error: { type: String },
  },
  {
    timestamps: true,
    collection: "job_data",
  }
);

JobDataSchema.index({ status: 1, scheduledAt: 1 });
JobDataSchema.index({ bookingId: 1, type: 1 });

export const JobData = mongoose.model<IJobData>("JobData", JobDataSchema);

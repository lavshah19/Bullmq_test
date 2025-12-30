export enum JobType {
  BookingConfirmation = "bookingConfirmation",
  FirstFollowUp = "firstFollowUp",
  FinalFollowUp = "finalFollowUp",
  FeedbackRequest = "feedbackRequest",
  FollowUp = "followUp",
}

export enum JobStatus {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
  Failed = "failed",
}

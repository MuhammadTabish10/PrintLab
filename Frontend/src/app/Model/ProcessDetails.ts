export interface JobProcessedDetails {
  jobProcessed: boolean | undefined | null;
  description: string | undefined | null;
  processName: string | undefined | null;
  payment: string | undefined | null;
  timeStamp: Date | undefined | null;
  status: boolean | undefined | null;
  vendor: string | undefined | null;
  amount: number | undefined | null;
  id: number | undefined | null;
}
